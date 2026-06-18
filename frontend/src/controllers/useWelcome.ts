import { router } from 'expo-router';
import { AuthService } from '@/src/services/AuthService';

export const useWelcome = () => {

  const handleNavigateToLogin = () => {
    router.push('/login' as any);
  };

  const handleContinueAsGuest = async () => {
    if (process.env.EXPO_PUBLIC_TEST_MODE === 'true') {
      router.replace('/home' as any);
      return;
    }

    const response = await AuthService.loginAnonymously();
    if (response.success) {
      router.replace('/home' as any);
    } else {
      console.error("Failed to login as guest:", response.error);
      // Optionally handle error here via a modal or alert
    }
  };

  return {
    handleNavigateToLogin,
    handleContinueAsGuest,
  };
};
