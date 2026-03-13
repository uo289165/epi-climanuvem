import { router } from 'expo-router';
import { AuthService } from '@/src/services/AuthService';

export const useHome = () => {

  const handleLogout = async () => {
    await AuthService.logout();
    router.replace('/');
  };

  const handleNavigateToCapture = () => {
    router.push('/capture' as any);
  };

  return {
    handleLogout,
    handleNavigateToCapture,
  };
};
