import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { AuthButton } from '@/components/ui/AuthButton';

interface WelcomeViewProps {
  readonly controller: {
    readonly handleNavigateToLogin: () => void;
    readonly handleContinueAsGuest: () => void;
  };
}

export function WelcomeView({ controller }: WelcomeViewProps) {
  const { 
    handleNavigateToLogin, 
    handleContinueAsGuest,
  } = controller;

  return (
    <View style={styles.container}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoEmoji}>☁️</Text>
            <ThemedText style={styles.logoText}>ClimaNuvem</ThemedText>
          </View>
          
          <ThemedText type="title" style={styles.title}>Meteorólogo de bolsillo</ThemedText>
          <ThemedText style={styles.subtitle}>
            Analiza el tiempo y las nubes con tu móvil.
          </ThemedText>

          <View style={styles.buttonContainer}>
            <AuthButton 
              title="Iniciar Sesión" 
              onPress={handleNavigateToLogin} 
              variant="primary"
              icon="log-in-outline"
            />

            <AuthButton 
              title="Continuar como invitado" 
              onPress={handleContinueAsGuest} 
              variant="google"
              icon="person-outline"
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#007AFF', // Solid primary for a bold look
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
    lineHeight: 44,
    paddingVertical: 4,
  },
  title: {
    fontSize: 32,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#1A1A1A',
    lineHeight: 40,
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
});
