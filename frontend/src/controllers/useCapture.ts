import { useState } from 'react';
import { DeviceEventEmitter } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { router } from 'expo-router';
import { AnalysisService } from '@/src/services/AnalysisService';
import { NotificationService } from '@/src/services/NotificationService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';

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
      processImage(result.assets[0].uri);
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
      processImage(result.assets[0].uri);
    }
  };

  const processImage = async (uri: string) => {
    if (!validateIsJpg(uri)) {
      showModal('error', t('auth.invalidFormat'), t('auth.invalidJpg'));
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

  const continueProcessing = async (uri: string) => {
    showModal('loading', t('capture.obtainingLocation'), t('common.wait'));
    let locationStr = t('capture.unknownLocation');
    let latitude: number | undefined;
    let longitude: number | undefined;
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        latitude = loc.coords.latitude;
        longitude = loc.coords.longitude;
        
        try {
          // Reverse geocoding para obtener la ciudad y país
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
          console.log("Error en reverse geocoding:", geoError);
          locationStr = `${loc.coords.latitude.toFixed(4)}, ${loc.coords.longitude.toFixed(4)}`;
        }
        
      } else {
        console.log("Permiso de ubicación denegado, se usará 'Ubicación desconocida'");
      }
    } catch (e) {
      console.log("Error obteniendo ubicación:", e);
    }

    showModal('loading', t('capture.preparingUpload'), t('capture.obtainingNotifications'));
    let fcmToken: string | undefined;
    try {
      fcmToken = await NotificationService.getPushTokenAsync();
    } catch (e) {
      console.log('Error obtaining FCM token', e);
    }

    showModal('loading', t('capture.preparingImage'), t('capture.optimizingFormat'));
    let processedUri = uri;
    try {
      // @ts-ignore - Using deprecated API because the new contextual API causes a native crash in the current Expo SDK version
      const manipResult = await manipulateAsync(
        uri,
        [], // Empty actions will just bake the EXIF rotation into the image
        { compress: 0.9, format: SaveFormat.JPEG }
      );
      processedUri = manipResult.uri;
    } catch (e) {
      console.log('Error manipulando imagen (EXIF)', e);
    }

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
      showModal('error', t('common.error'), t('capture.uploadError'));
      console.error(error);
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

