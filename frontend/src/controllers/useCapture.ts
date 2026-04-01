import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { AnalysisService } from '@/src/services/AnalysisService';

export const useCapture = () => {

  // Estado para el modal de estado
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    type: 'loading' | 'success' | 'error' | 'info';
    title: string;
    message: string;
    onClose?: () => void;
  }>({
    type: 'loading',
    title: '',
    message: '',
  });

  const showModal = (type: 'loading' | 'success' | 'error' | 'info', title: string, message: string, onClose?: () => void) => {
    setModalConfig({ type, title, message, onClose });
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

    showModal('loading', 'Obteniendo ubicación...', 'Por favor espera...');
    let locationStr = "Ubicación desconocida";
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        
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

    showModal('loading', 'Subiendo imagen...', 'Esto puede tardar unos segundos');
    try {
      await AnalysisService.uploadImage(uri, locationStr);
      showModal(
        'success',
        'Imagen enviada',
        'La imagen está siendo analizada. Te redirigiremos a la pantalla principal.',
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
