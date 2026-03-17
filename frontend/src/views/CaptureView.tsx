import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ScrollView } from 'react-native';
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
      type: 'loading' | 'success' | 'error' | 'info';
      title: string;
      message: string;
      onClose?: () => void;
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

  return (
    <View style={styles.container}>
      <AppHeader title="Analizar Imagen" />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.illustrationContainer}>
          <View style={styles.illustrationCircle}>
            <Ionicons name="cloud-upload-outline" size={80} color="#007AFF" />
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
            <View style={[styles.iconCircle, { backgroundColor: '#E3F2FD' }]}>
              <Ionicons name="camera" size={32} color="#007AFF" />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>Tomar Foto</Text>
              <Text style={styles.optionDescription}>Usa la cámara en tiempo real</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#007AFF" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.optionCard} 
            onPress={handleGallerySelection} 
          >
            <View style={[styles.iconCircle, { backgroundColor: '#F3E5F5' }]}>
              <Ionicons name="image" size={32} color="#9C27B0" />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>Galería</Text>
              <Text style={styles.optionDescription}>Elige una imagen existente</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9C27B0" />
          </TouchableOpacity>
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={20} color="#666" style={{marginRight: 8}} />
          <Text style={styles.infoText}>Formatos soportados: Solo JPG.</Text>
        </View>
      </ScrollView>

      <StatusModal 
        visible={modalVisible}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
        onClose={modalConfig.onClose || hideModal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    padding: 24,
    alignItems: 'center',
  },
  illustrationContainer: {
    marginVertical: 30,
  },
  illustrationCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  optionsContainer: {
    width: '100%',
    gap: 16,
  },
  optionCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  disabledCard: {
    opacity: 0.6,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
    color: '#212529',
  },
  optionDescription: {
    fontSize: 14,
    color: '#6C757D',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    backgroundColor: '#E9ECEF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  infoText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  loadingCard: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 24,
    alignItems: 'center',
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    color: '#007AFF',
    fontWeight: '700',
  },
  loadingSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
});
