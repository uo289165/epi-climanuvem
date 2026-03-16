import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { AuthService } from '@/src/services/AuthService';
import { useAnalysisHistory } from '@/hooks/useAnalysisHistory';
import { auth } from '@/src/config/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

export const useHome = () => {
  const historyHook = useAnalysisHistory();
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName || user.email || 'Usuario');
      } else {
        setUserName('Invitado');
      }
    });
    return unsubscribe;
  }, []);

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
    userName,
    ...historyHook,
  };
};
