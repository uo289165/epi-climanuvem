import { useState } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { AnalysisService } from '@/src/services/AnalysisService';

export const useCapture = () => {
  const [loading, setLoading] = useState(false);

  const validateIsJpg = (uri: string) => {
    const extension = uri.split('.').pop()?.toLowerCase();
    return extension === 'jpg' || extension === 'jpeg';
  };

  const handleCameraCapture = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Permiso denegado',
        'El permiso de cámara es necesario para utilizar esta funcionalidad.',
        [{ text: 'OK', onPress: () => router.replace('/' as any) }]
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
      Alert.alert(
        'Permiso denegado',
        'El permiso de galería es necesario para utilizar esta funcionalidad.',
        [{ text: 'OK', onPress: () => router.replace('/' as any) }]
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
      Alert.alert('Formato no válido', 'El sistema únicamente acepta imágenes en formato JPG.');
      return;
    }

    setLoading(true);
    try {
      await AnalysisService.uploadImage(uri);
      Alert.alert(
        'Imagen enviada',
        'La imagen está siendo analizada. Te redirigiremos a la pantalla principal.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al enviar la imagen al servidor.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleCameraCapture,
    handleGallerySelection,
  };
};
