import { useState, useCallback } from 'react';
import { router, useFocusEffect } from 'expo-router';
import { AuthService } from '@/src/services/AuthService';
import { useAnalysisHistory } from '@/hooks/useAnalysisHistory';
import { auth } from '@/src/config/firebaseConfig';
import { BackendService } from '@/src/services/BackendService';
import { useTranslation } from 'react-i18next';

export const useHome = () => {
  const historyHook = useAnalysisHistory();
  const { t } = useTranslation();
  const [userName, setUserName] = useState<string>('');
  const [isGuest, setIsGuest] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'loading' | 'success' | 'error' | 'info'>('info');
  const [modalTitle, setModalTitle] = useState<string>('');
  const [modalMessage, setModalMessage] = useState<string>('');

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

  const handleTestBackend = async () => {
    setModalType('loading');
    setModalTitle(t('common.connecting'));
    setModalMessage(t('home.testDesc'));
    setModalVisible(true);

    try {
      const response = await BackendService.testEndpoint();
      setModalType('success');
      setModalTitle(t('common.successExclamation'));
      setModalMessage(JSON.stringify(response, null, 2));
    } catch (error: any) {
      setModalType('error');
      setModalTitle(t('common.connectionError'));
      setModalMessage(error.message || t('common.serverError'));
    }
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return {
    handleLogout,
    handleNavigateToCapture,
    handleNavigateToProfile,
    handleTestBackend,
    closeModal,
    userName,
    isGuest,
    modalVisible,
    modalType,
    modalTitle,
    modalMessage,
    ...historyHook,
  };
};
