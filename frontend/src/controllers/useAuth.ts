import { useState, useRef, useEffect } from 'react';
import { router } from 'expo-router';
import { TextInput, Platform } from 'react-native';
import { AuthService } from '@/src/services/AuthService';
import { EMAIL_REGEX, getAuthErrorMessage } from '@/src/utils/authUtils';

import { GoogleSignin } from '@react-native-google-signin/google-signin';


export const useAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Estado para el modal de estado (moderno)
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

  // Configuración de Google Sign-In Nativo
  useEffect(() => {
    if (GoogleSignin && Platform.OS !== 'web') {
      try {
        GoogleSignin.configure({
          webClientId: '404226456428-6kqoq5ic42g0g4k0qe9cur5qt85spu25.apps.googleusercontent.com',
        });
      } catch (error) {
        console.log("Error al configurar Google Sign-in:", error);
      }
    }
  }, []);

  const promptAsync = async () => {
    if (!GoogleSignin) {
      showModal('error', 'Google Sign-in no disponible', 'Esta funcionalidad no está disponible en este entorno (ej. Expo Go).');
      return;
    }

    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.data?.idToken;
      
      if (idToken) {
        handleGoogleLogin(idToken);
      } else {
        showModal('error', 'Error', 'No se pudo obtener el token de Google.');
      }
    } catch (error: any) {
      console.log("Error Google Native:", error);
      // Manejar cancelaciones o errores específicos si es necesario
      if (error.code !== 'SIGN_IN_CANCELLED') {
        showModal('error', 'Error con Google', 'Ocurrió un error al intentar iniciar sesión con Google.');
      }
    }
  };

  const handleGoogleLogin = async (idToken: string) => {
    setLoading(true);
    const result = await AuthService.loginWithGoogle(idToken);
    setLoading(false);

    if (result.success) {
      router.replace('/home' as any);
    } else {
      const message = getAuthErrorMessage(result.error ?? '');
      showModal('error', 'Error con Google Sign-In', message);
    }
  };

  // Creamos una referencia para poder apuntar al campo de contraseña
  const passwordInputRef = useRef<TextInput>(null);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    // Validar formato de email
    if (!EMAIL_REGEX.test(email)) {
      showModal('error', 'Error', 'Por favor, introduce un correo electrónico válido.');
      return;
    }

    setLoading(true);

    const response = await AuthService.login(email, password);

    setLoading(false);

    if (response.success) {
      router.replace('/home' as any);
    } else {
      setPassword('');
      const message = getAuthErrorMessage(response.error ?? '');
      showModal('error', 'Error', message);
    }
  };

  const handleNavigateToRegister = () => {
    // @ts-ignore typed routes latency
    router.push('/register');
  };

  const handleResetPassword = async () => {
    if (!email) {
      showModal('error', 'Error', 'Por favor, introduce tu correo electrónico primero para restablecer la contraseña.');
      return;
    }

    if (!EMAIL_REGEX.test(email)) {
      showModal('error', 'Error', 'Por favor, introduce un correo electrónico válido.');
      return;
    }

    setLoading(true);
    const response = await AuthService.resetPassword(email);
    setLoading(false);

    if (response.success) {
      showModal(
        'success',
        'Correo enviado',
        'Se ha enviado un enlace para restablecer tu contraseña a tu correo electrónico.'
      );
    } else {
      const message = getAuthErrorMessage(response.error ?? '');
      showModal('error', 'Error al restablecer', message);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    togglePasswordVisibility,
    loading,
    handleLogin,
    handleNavigateToRegister,
    handleResetPassword,
    passwordInputRef,
    promptAsync,
    modalVisible,
    modalConfig,
    hideModal,
  };
};

