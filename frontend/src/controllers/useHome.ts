import { useState, useCallback } from 'react';
import { router, useFocusEffect } from 'expo-router';
import { AuthService } from '@/src/services/AuthService';
import { useAnalysisHistory } from '@/hooks/useAnalysisHistory';
import { auth } from '@/src/config/firebaseConfig';
import { useTranslation } from 'react-i18next';

export const useHome = () => {
  const historyHook = useAnalysisHistory();
  const { t } = useTranslation();
  const [userName, setUserName] = useState<string>('');
  const [isGuest, setIsGuest] = useState<boolean>(true);

  useFocusEffect(
    useCallback(() => {
      const user = auth.currentUser;
      if (user) {
        setUserName(user.isAnonymous ? t('common.guest') : (user.displayName || user.email || t('common.user')));
        setIsGuest(user.isAnonymous);
      } else {
        setUserName(t('common.guest'));
        setIsGuest(true);
      }
    }, [t])
  );


  const handleLogout = async () => {
    await AuthService.logout();
    router.replace('/');
  };

  const handleNavigateToCapture = () => {
    router.push('/capture' as any);
  };

  const handleNavigateToProfile = () => {
    router.push('/profile' as any);
  };

  return {
    handleLogout,
    handleNavigateToCapture,
    handleNavigateToProfile,
    userName,
    isGuest,
    ...historyHook,
  };
};
