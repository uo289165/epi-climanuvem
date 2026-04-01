import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useColorScheme } from '@/hooks/use-color-scheme';

import * as SystemUI from 'expo-system-ui';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    // Hide splash screen immediately since we have no fonts to wait for
    SplashScreen.hideAsync();
    
    // Configurar el color de fondo a nivel de sistema para evitar parpadeos negros/vacíos
    SystemUI.setBackgroundColorAsync('#f8f9fa');
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
              animationTypeForReplace: 'push',
              contentStyle: { backgroundColor: '#f8f9fa' },
              // @ts-ignore
              detachPreviousScreen: false,
            } as any}>
            <Stack.Screen name="index" />
            <Stack.Screen name="login" />
            <Stack.Screen name="register" />
            <Stack.Screen name="capture" />
            <Stack.Screen name="home" options={{ gestureEnabled: false }} />
            <Stack.Screen name="profile" />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
