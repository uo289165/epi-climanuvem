import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { auth } from '@/src/config/firebaseConfig';
import { AuthService } from '@/src/services/AuthService';
import { BackendService } from '@/src/services/BackendService';
import { onAuthStateChanged } from 'firebase/auth';

export const useProfile = () => {
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [newName, setNewName] = useState<string>('');
  
  const [saving, setSaving] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'loading' | 'success' | 'error' | 'info'>('info');
  const [modalTitle, setModalTitle] = useState<string>('');
  const [modalMessage, setModalMessage] = useState<string>('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && !user.isAnonymous) {
        setUserName(user.displayName || '');
        setNewName(user.displayName || '');
        setUserEmail(user.email || '');
      } else {
        router.replace('/home' as any);
      }
    });
    return unsubscribe;
  }, []);

  const handleUpdateName = async () => {
    if (!newName.trim() || newName.trim() === userName) return;
    
    setSaving(true);
    const result = await AuthService.updateUserName(newName.trim());
    setSaving(false);
    
    if (result.success) {
      setUserName(newName.trim());
      setModalType('success');
      setModalTitle('Perfil actualizado');
      setModalMessage('Tu nombre de usuario ha sido actualizado correctamente.');
      setModalVisible(true);
    } else {
      setModalType('error');
      setModalTitle('Error');
      setModalMessage('No se pudo actualizar el nombre. ' + (result.error || ''));
      setModalVisible(true);
    }
  };

  const confirmDeleteAccount = () => {
    setShowDeleteConfirm(true);
  };

  const cancelDeleteAccount = () => {
    setShowDeleteConfirm(false);
  };

  const proceedWithDelete = async () => {
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
        setModalTitle('Fallo de seguridad');
        setModalMessage('Para borrar tu cuenta debes haber iniciado sesión recientemente por motivos de seguridad. Por favor cierra sesión, vuelve a entrar e inténtalo de nuevo.');
        setModalVisible(true);
      }
    } catch (error) {
      console.error('Error al eliminar datos:', error);
      setDeleting(false);
      setModalType('error');
      setModalTitle('Error al eliminar datos');
      setModalMessage('Algo salió mal al borrar tus archivos u operaciones asociadas. Intenta de nuevo.');
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
