import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { AuthButton } from '@/components/ui/AuthButton';

interface WelcomeViewProps {
  readonly controller: {
    readonly handleNavigateToLogin: () => void;
    readonly handleNavigateToCapture: () => void;
  };
}

export function WelcomeView({ controller }: WelcomeViewProps) {
  const { handleNavigateToLogin, handleNavigateToCapture } = controller;

  return (
    <View style={styles.container}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoEmoji}>☁️</Text>
            <ThemedText style={styles.logoText}>ClimaNuvem</ThemedText>
          </View>
          
          <ThemedText type="title" style={styles.title}>Centro de Observación</ThemedText>
          <ThemedText style={styles.subtitle}>
            Monitorización climática avanzada y gestión inteligente de datos meteorológicos.
          </ThemedText>

          <View style={styles.buttonContainer}>
            <AuthButton 
              title="Iniciar Sesión" 
              onPress={handleNavigateToLogin} 
              variant="primary"
              icon="log-in-outline"
            />

            <AuthButton 
              title="Análisis Rápido" 
              onPress={handleNavigateToCapture} 
              variant="google"
              icon="camera-outline"
            />
          </View>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>Desarrollado para el Observatorio EPI</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#007AFF', // Solid primary for a bold look or we could use an image
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(248, 249, 250, 0.95)',
    padding: 24,
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  logoContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  logoEmoji: {
    fontSize: 64,
    marginBottom: 10,
  },
  logoText: {
    fontSize: 36,
    fontWeight: '900',
    color: '#007AFF',
    letterSpacing: -1,
  },
  title: {
    fontSize: 32,
    marginBottom: 12,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  subtitle: {
    fontSize: 17,
    marginBottom: 50,
    textAlign: 'center',
    color: '#555',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 320,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  footerText: {
    color: '#888',
    fontSize: 14,
    fontWeight: '500',
  },
});
