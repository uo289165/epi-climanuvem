import { router } from 'expo-router';

export const useWelcome = () => {
  const handleNavigateToLogin = () => {
    router.push('/login' as any);
  };

  const handleNavigateToCapture = () => {
    router.push('/capture' as any);
  };

  return {
    handleNavigateToLogin,
    handleNavigateToCapture,
  };
};
