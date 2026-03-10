import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

import { View } from 'react-native';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    // Hide splash screen immediately since we have no fonts to wait for
    SplashScreen.hideAsync();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: colorScheme === 'dark' ? '#151718' : '#ffffff' }}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade', // Hace que la transición sea un fundido suave
          animationDuration: 150, // Hace la animación mucho más rápida (150ms frente a los ~350ms base)
          contentStyle: { backgroundColor: 'transparent' }, // El fondo principal ahora lo pone la View padre de arriba
        }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="home" options={{ gestureEnabled: false }} />
      </Stack>
      <StatusBar style="auto" />
    </View>
  );
}
