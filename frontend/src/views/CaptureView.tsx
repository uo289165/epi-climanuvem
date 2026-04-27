import React from 'react';
import { View, TouchableOpacity, Text, ScrollView } from 'react-native';
import { useTheme } from '@/src/contexts/ThemeContext';
import { getCaptureViewStyles } from '@/src/styles/globalStyles';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { AppHeader } from '@/components/ui/AppHeader';
import { StatusModal } from '@/components/ui/StatusModal';

interface CaptureViewProps {
  readonly controller: {
    readonly handleCameraCapture: () => void;
    readonly handleGallerySelection: () => void;
    readonly modalVisible: boolean;
    readonly modalConfig: {
      type: 'loading' | 'success' | 'error' | 'info' | 'confirm';
      title: string;
      message: string;
      onClose?: () => void;
      onCancel?: () => void;
    };
    readonly hideModal: () => void;
  };
}

export function CaptureView({ controller }: CaptureViewProps) {
  const { 
    handleCameraCapture, 
    handleGallerySelection,
    modalVisible,
    modalConfig,
    hideModal
  } = controller;

  const { theme } = useTheme();
  const styles = getCaptureViewStyles(theme);

  return (
    <View style={styles.container}>
      <AppHeader title="Analizar Imagen" />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.illustrationContainer}>
          <View style={styles.illustrationCircle}>
            <Ionicons name="cloud-upload-outline" size={80} color={theme.colors.primary} />
          </View>
        </View>

        <ThemedText style={styles.subtitle}>
          Selecciona una de las siguientes opciones para subir una fotografía y analizarla. El sistema identificará automáticamente las nubes encontradas.
        </ThemedText>

        <View style={styles.optionsContainer}>
          <TouchableOpacity 
            style={styles.optionCard} 
            onPress={handleCameraCapture} 
          >
            <View style={[styles.iconCircle, { backgroundColor: theme.mode === 'dark' ? 'rgba(33, 150, 243, 0.1)' : '#E3F2FD' }]}>
              <Ionicons name="camera" size={32} color={theme.colors.primary} />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>Tomar Foto</Text>
              <Text style={styles.optionDescription}>Usa la cámara en tiempo real</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.primary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.optionCard} 
            onPress={handleGallerySelection} 
          >
            <View style={[styles.iconCircle, { backgroundColor: theme.mode === 'dark' ? 'rgba(156, 39, 176, 0.1)' : '#F3E5F5' }]}>
              <Ionicons name="image" size={32} color={theme.mode === 'dark' ? '#CE93D8' : '#9C27B0'} />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>Galería</Text>
              <Text style={styles.optionDescription}>Elige una imagen existente</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.mode === 'dark' ? '#CE93D8' : '#9C27B0'} />
          </TouchableOpacity>
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={20} color={theme.colors.textSecondary} style={{marginRight: 8}} />
          <Text style={styles.infoText}>Formatos soportados: Solo JPG.</Text>
        </View>
      </ScrollView>

      <StatusModal 
        visible={modalVisible}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
        onClose={modalConfig.onClose || hideModal}
        onCancel={modalConfig.onCancel || hideModal}
      />
    </View>
  );
}


