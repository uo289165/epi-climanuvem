import { router } from 'expo-router';
import { AuthService } from '@/src/services/AuthService';

export const useHome = () => {

  const handleLogout = async () => {
    await AuthService.logout();
    router.replace('/');
  };

  return {
    handleLogout,
  };
};
