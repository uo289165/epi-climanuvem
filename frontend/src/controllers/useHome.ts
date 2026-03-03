import { router } from 'expo-router';

export const useHome = () => {
    
  const handleLogout = () => {
    // Navigate back to the login screen and clear history
    router.replace('/');
  };

  return {
    handleLogout
  };
};
