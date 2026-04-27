import { useState } from 'react';
import { DeviceEventEmitter } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { AnalysisService } from '@/src/services/AnalysisService';
import { NotificationService } from '@/src/services/NotificationService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useCapture = () => {

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
        'Permiso denegado', 
        'El permiso de cámara es necesario para utilizar esta funcionalidad.',
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
        'Permiso denegado', 
        'El permiso de galería es necesario para utilizar esta funcionalidad.',
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
      showModal('error', 'Formato no válido', 'El sistema únicamente acepta imágenes en formato JPG.');
      return;
    }

    const hasSeenPrompt = await AsyncStorage.getItem('hasSeenPermissionPrompt');
    if (hasSeenPrompt) {
      await continueProcessing(uri);
    } else {
      showModal(
        'confirm',
        'Mejor experiencia',
        'Para el correcto funcionamiento de ClimaNuvem, necesitamos permiso de Ubicación (para saber dónde avistaste la nube) y Notificaciones (para avisarte cuando el análisis esté listo). ¿Deseas continuar?',
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
    showModal('loading', 'Obteniendo ubicación...', 'Por favor espera...');
    let locationStr = "Ubicación desconocida";
    let latitude: number | undefined;
    let longitude: number | undefined;
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
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
            const city = address.city || address.subregion || address.region || 'Ciudad desconocida';
            const country = address.country || 'País desconocido';
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

    showModal('loading', 'Preparando envío...', 'Obteniendo notificaciones de la sesión...');
    let fcmToken: string | undefined;
    try {
      fcmToken = await NotificationService.getPushTokenAsync();
    } catch (e) {
      console.log('Error obtaining FCM token', e);
    }

    showModal('loading', 'Subiendo imagen...', 'Esto puede tardar unos segundos');
    try {
      await AnalysisService.uploadImage(uri, locationStr, latitude, longitude, fcmToken);
      DeviceEventEmitter.emit('refresh_history');
      showModal(
        'success',
        'Imagen enviada',
        'Te notificaremos automáticamente cuando se termine el análisis y será guardado en tu historial.',
        () => {
          hideModal();
          router.back();
        }
      );
    } catch (error) {
      showModal('error', 'Error', 'Hubo un problema al enviar la imagen al servidor.');
      console.error(error);
    }
  };

  return {
    handleCameraCapture,
    handleGallerySelection,
    modalVisible,
    modalConfig,
    hideModal,
  };
};
