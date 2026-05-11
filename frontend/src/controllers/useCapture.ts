import { useState } from 'react';
import { DeviceEventEmitter } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { File } from 'expo-file-system';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { router } from 'expo-router';
import { AnalysisService } from '@/src/services/AnalysisService';
import { NotificationService } from '@/src/services/NotificationService';
import { Logger } from '@/src/services/LoggerService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const IMAGE_TOO_LARGE_CODE = 'IMAGE_TOO_LARGE_MAX_5MB';

export const useCapture = () => {
  const { t } = useTranslation();
  
  // Estado para explicabilidad
  const [includeExplainability, setIncludeExplainability] = useState(false);

  // Estado para el modal de estado
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    type: 'loading' | 'success' | 'error' | 'info' | 'confirm';
    title: string;
    message: string;
    onClose?: () => void;
    onCancel?: () => void;
  }>({
    type: 'loading',
    title: '',
    message: '',
  });

  const showModal = (type: 'loading' | 'success' | 'error' | 'info' | 'confirm', title: string, message: string, onClose?: () => void, onCancel?: () => void) => {
    setModalConfig({ type, title, message, onClose, onCancel });
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
  };

  const validateIsJpg = (uri: string) => {
    const extension = uri.split('.').pop()?.toLowerCase();
    return extension === 'jpg' || extension === 'jpeg';
  };

  const handleCameraCapture = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      showModal(
        'error', 
        t('auth.permissionDenied'), 
        t('auth.cameraPermissionRequired'),
        () => router.replace('/' as any)
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      void processImage(result.assets[0].uri);
    }
  };

  const handleGallerySelection = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      showModal(
        'error', 
        t('auth.permissionDenied'), 
        t('auth.galleryPermissionRequired'),
        () => router.replace('/' as any)
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      void processImage(result.assets[0].uri);
    }
  };

  const validateImageSize = (uri: string) => {
    try {
      const file = new File(uri);
      if (!file.exists) {
        showModal('error', t('common.error'), t('capture.uploadError'));
        return false;
      }

      const metadata = file.info();
      const fileSize = metadata.size ?? 0;
      if (fileSize > MAX_IMAGE_SIZE_BYTES) {
        showModal('error', t('common.error'), t('capture.imageTooLarge'));
        return false;
      }
    } catch (error) {
      Logger.warn('No se pudo validar el tamaño de la imagen antes de subirla', error);
    }
    return true;
  };

  const processImage = async (uri: string) => {
    if (!validateIsJpg(uri)) {
      showModal('error', t('auth.invalidFormat'), t('auth.invalidJpg'));
      return;
    }

    const isSizeValid = validateImageSize(uri);
    if (!isSizeValid) {
      return;
    }

    const hasSeenPrompt = await AsyncStorage.getItem('hasSeenPermissionPrompt');
    if (hasSeenPrompt) {
      await continueProcessing(uri);
    } else {
      showModal(
        'confirm',
        t('auth.betterExperience'),
        t('auth.permissionPrompt'),
        async () => {
          await AsyncStorage.setItem('hasSeenPermissionPrompt', 'true');
          await continueProcessing(uri);
        },
        () => {
          hideModal();
        }
      );
    }
  };

  const getLocationData = async () => {
    let locationStr = t('capture.unknownLocation');
    let latitude: number | undefined;
    let longitude: number | undefined;

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Logger.info("Permiso de ubicación denegado; se usará 'Ubicación desconocida'");
        return { locationStr, latitude, longitude };
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      latitude = loc.coords.latitude;
      longitude = loc.coords.longitude;

      try {
        const geocode = await Location.reverseGeocodeAsync({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude
        });

        if (geocode && geocode.length > 0) {
          const address = geocode[0];
          const city = address.city || address.subregion || address.region || t('capture.unknownCity');
          const country = address.country || t('capture.unknownCountry');
          locationStr = `${city}, ${country}`;
        } else {
          locationStr = `${loc.coords.latitude.toFixed(4)}, ${loc.coords.longitude.toFixed(4)}`;
        }
      } catch (geoError) {
        Logger.warn('Error en reverse geocoding', geoError);
        locationStr = `${loc.coords.latitude.toFixed(4)}, ${loc.coords.longitude.toFixed(4)}`;
      }
    } catch (e) {
      Logger.warn('Error obteniendo ubicación', e);
    }

    return { locationStr, latitude, longitude };
  };

  const getFCMToken = async () => {
    try {
      return await NotificationService.getPushTokenAsync();
    } catch (e) {
      Logger.warn('Error obtaining FCM token', e);
      return undefined;
    }
  };

  const optimizeImage = async (uri: string) => {
    try {
      // @ts-ignore - Using deprecated API because the new contextual API causes a native crash in the current Expo SDK version
      const manipResult = await manipulateAsync(
        uri,
        [], // Empty actions will just bake the EXIF rotation into the image
        { compress: 0.9, format: SaveFormat.JPEG }
      );
      return manipResult.uri;
    } catch (e) {
      Logger.warn('Error manipulando imagen (EXIF)', e);
      return uri;
    }
  };

  const continueProcessing = async (uri: string) => {
    showModal('loading', t('capture.obtainingLocation'), t('common.wait'));
    const { locationStr, latitude, longitude } = await getLocationData();

    showModal('loading', t('capture.preparingUpload'), t('capture.obtainingNotifications'));
    const fcmToken = await getFCMToken();

    showModal('loading', t('capture.preparingImage'), t('capture.optimizingFormat'));
    const processedUri = await optimizeImage(uri);

    showModal('loading', t('capture.uploadingImage'), t('capture.secondsWait'));
    try {
      await AnalysisService.uploadImage(processedUri, locationStr, latitude, longitude, fcmToken, includeExplainability);
      DeviceEventEmitter.emit('refresh_history');
      showModal(
        'success',
        t('capture.imageSent'),
        t('capture.imageSentDesc'),
        () => {
          hideModal();
          router.back();
        }
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : '';
      if (message === IMAGE_TOO_LARGE_CODE) {
        showModal('error', t('common.error'), t('capture.imageTooLarge'));
      } else {
        showModal('error', t('common.error'), t('capture.uploadError'));
      }
      Logger.error('Error al subir imagen para análisis', error);
    }
  };

  return {
    handleCameraCapture,
    handleGallerySelection,
    modalVisible,
    modalConfig,
    hideModal,
    includeExplainability,
    setIncludeExplainability,
  };
};
