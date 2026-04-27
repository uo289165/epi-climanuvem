import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@/src/contexts/ThemeContext';
import { getWelcomeViewStyles } from '@/src/styles/globalStyles';
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

  const { theme } = useTheme();
  const styles = getWelcomeViewStyles(theme);

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


