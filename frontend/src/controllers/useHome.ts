import { useState, useCallback } from 'react';
import { router, useFocusEffect } from 'expo-router';
import { AuthService } from '@/src/services/AuthService';
import { useAnalysisHistory } from '@/hooks/useAnalysisHistory';
import { auth } from '@/src/config/firebaseConfig';
import { BackendService } from '@/src/services/BackendService';

export const useHome = () => {
  const historyHook = useAnalysisHistory();
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
        setUserName(user.isAnonymous ? 'Invitado' : (user.displayName || user.email || 'Usuario'));
        setIsGuest(user.isAnonymous);
      } else {
        setUserName('Invitado');
        setIsGuest(true);
      }
    }, [])
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
    setModalTitle('Conectando...');
    setModalMessage('Estamos verificando la conexión con el backend.');
    setModalVisible(true);

    try {
      const response = await BackendService.testEndpoint();
      setModalType('success');
      setModalTitle('¡Éxito!');
      setModalMessage(JSON.stringify(response, null, 2));
    } catch (error: any) {
      setModalType('error');
      setModalTitle('Fallo de conexión');
      setModalMessage(error.message || 'Error al conectar con el servidor.');
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
