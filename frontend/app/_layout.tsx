import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemeProvider as CustomThemeProvider } from '@/src/contexts/ThemeContext';

import * as SystemUI from 'expo-system-ui';

import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/src/config/firebaseConfig';


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    // Configurar el color de fondo a nivel de sistema para evitar parpadeos negros/vacíos
    SystemUI.setBackgroundColorAsync('#f8f9fa');

    // Esperar a la resolución del estado de autenticación (AsyncStorage) antes de esconder el Splash Screen
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Redirigir y en el frame siguiente ocultar el splash screen
        setTimeout(() => {
          router.replace('/home' as any);
          SplashScreen.hideAsync();
        }, 0);
      } else {
        SplashScreen.hideAsync();
      }
    });

    return unsubscribe;
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <CustomThemeProvider>
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
        </CustomThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
