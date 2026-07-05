import { router } from 'expo-router';
import { AuthService } from '@/src/services/AuthService';
import { Logger } from '@/src/services/LoggerService';
import { ModalType } from '@/components/ui/StatusModal';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

export const useWelcome = () => {
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    type: ModalType;
    title: string;
    message: string;
  }>({
    type: 'error',
    title: '',
    message: '',
  });

  const hideModal = () => {
    setModalVisible(false);
  };

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
      Logger.error('Failed to login as guest', response.error);
      setModalConfig({
        type: 'error',
        title: t('common.error'),
        message: response.error ?? t('auth.googleErrorDesc'),
      });
      setModalVisible(true);
    }
  };

  return {
    handleNavigateToLogin,
    handleContinueAsGuest,
    modalVisible,
    modalConfig,
    hideModal,
  };
};
