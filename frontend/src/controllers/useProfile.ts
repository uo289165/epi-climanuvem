import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { auth } from '@/src/config/firebaseConfig';
import { AuthService } from '@/src/services/AuthService';
import { BackendService } from '@/src/services/BackendService';
import { onAuthStateChanged } from 'firebase/auth';
import { useTranslation } from 'react-i18next';
import { Logger } from '@/src/services/LoggerService';

export const useProfile = () => {
  const { t } = useTranslation();
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [newName, setNewName] = useState<string>('');
  const [isGuest, setIsGuest] = useState<boolean>(false);
  
  const [saving, setSaving] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'loading' | 'success' | 'error' | 'info'>('info');
  const [modalTitle, setModalTitle] = useState<string>('');
  const [modalMessage, setModalMessage] = useState<string>('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace('/home' as any);
        return;
      }

      if (user.isAnonymous) {
        setIsGuest(true);
        setUserName(t('common.guest'));
        setNewName('');
        setUserEmail('');
        return;
      }

      setIsGuest(false);
      setUserName(user.displayName || '');
      setNewName(user.displayName || '');
      setUserEmail(user.email || '');
    });
    return unsubscribe;
  }, [t]);

  const handleUpdateName = async () => {
    const trimmedName = newName.trim();

    if (isGuest || !trimmedName || trimmedName === userName) return;

    if (trimmedName.length < 3 || trimmedName.length > 20) {
      setModalType('error');
      setModalTitle(t('common.error'));
      setModalMessage(t('auth.usernameLength'));
      setModalVisible(true);
      return;
    }
    
    setSaving(true);
    const result = await AuthService.updateUserName(trimmedName);
    setSaving(false);
    
    if (result.success) {
      setUserName(trimmedName);
      setModalType('success');
      setModalTitle(t('profile.updated'));
      setModalMessage(t('profile.updatedDesc'));
      setModalVisible(true);
    } else {
      setModalType('error');
      setModalTitle(t('common.error'));
      setModalMessage(t('profile.updatedDesc') + ' ' + (result.error || ''));
      setModalVisible(true);
    }
  };

  const confirmDeleteAccount = () => {
    if (isGuest) return;
    setShowDeleteConfirm(true);
  };

  const cancelDeleteAccount = () => {
    setShowDeleteConfirm(false);
  };

  const proceedWithDelete = async () => {
    if (isGuest) return;

    setShowDeleteConfirm(false);
    setDeleting(true);
    
    try {
      await BackendService.deleteUserData();
      
      const result = await AuthService.deleteAccount();
      setDeleting(false);
      
      if (result.success) {
        await AuthService.logout();
        router.replace('/' as any);
      } else {
        setModalType('error');
        setModalTitle(t('profile.securityFail'));
        setModalMessage(t('profile.reauthRequired'));
        setModalVisible(true);
      }
    } catch (error) {
      Logger.error('Error al eliminar datos del usuario', error);
      setDeleting(false);
      setModalType('error');
      setModalTitle(t('profile.deleteDataError'));
      setModalMessage(t('profile.deleteDataErrorDesc'));
      setModalVisible(true);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return {
    userName,
    userEmail,
    newName,
    isGuest,
    setNewName,
    saving,
    deleting,
    showDeleteConfirm,
    handleUpdateName,
    confirmDeleteAccount,
    cancelDeleteAccount,
    proceedWithDelete,
    handleGoBack,
    modalVisible,
    modalType,
    modalTitle,
    modalMessage,
    closeModal,
  };
};
