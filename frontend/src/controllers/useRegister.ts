import { useState, useRef } from 'react';
import { router } from 'expo-router';
import { TextInput } from 'react-native';
import { AuthService } from '@/src/services/AuthService';

import { EMAIL_REGEX, getAuthErrorMessage } from '@/src/utils/authUtils';

export const useRegister = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Estado para el modal de estado
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    type: 'loading' | 'success' | 'error' | 'info';
    title: string;
    message: string;
    onClose?: () => void;
  }>({
    type: 'loading',
    title: '',
    message: '',
  });

  const showModal = (type: 'loading' | 'success' | 'error' | 'info', title: string, message: string, onClose?: () => void) => {
    setModalConfig({ type, title, message, onClose });
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
  };

  // Referencias para el foco de los inputs
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleRegister = async () => {
    // Validaciones
    if (username.length < 3 || username.length > 20) {
      showModal('error', 'Error', 'El nombre de usuario debe tener entre 3 y 20 caracteres.');
      return;
    }

    if (!EMAIL_REGEX.test(email)) {
      showModal('error', 'Error', 'Por favor, introduce un correo electrónico válido.');
      return;
    }

    if (password.length < 6) {
      showModal('error', 'Error', 'La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      showModal('error', 'Error', 'Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);

    const response = await AuthService.register(username, email, password);

    setLoading(false);

    if (response.success) {
      showModal(
        'success',
        'Registro exitoso',
        'Hemos enviado un correo de verificación. Por favor, verifica tu correo antes de iniciar sesión.',
        () => {
          hideModal();
          handleNavigateToLogin();
        }
      );
    } else {
      // Si falla, se podría borrar la contraseña por seguridad
      setPassword('');
      setConfirmPassword('');
      const message = getAuthErrorMessage(response.error ?? '');
      showModal('error', 'Error', message);
    }
  };

  const handleNavigateToLogin = () => {
    // router.back() or push to / depending on history. 
    // Usually back() works if we pushed from login.
    // However, if we replace, we should use root:
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  return {
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    togglePasswordVisibility,
    showConfirmPassword,
    toggleConfirmPasswordVisibility,
    loading,
    handleRegister,
    handleNavigateToLogin,
    emailInputRef,
    passwordInputRef,
    confirmPasswordInputRef,
    modalVisible,
    modalConfig,
    hideModal,
  };
};

