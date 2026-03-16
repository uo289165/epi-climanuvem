import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
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

    showModal('loading', 'Procesando imagen...', 'Esto puede tardar unos segundos');
    try {
      await AnalysisService.uploadImage(uri);
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
