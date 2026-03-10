import { useState, useRef } from 'react';
import { router } from 'expo-router';
import { Alert, TextInput } from 'react-native';
import { AuthService } from '@/src/services/AuthService';

// Regex básico para validar formato de email
const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

export const useAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Creamos una referencia para poder apuntar al campo de contraseña
  const passwordInputRef = useRef<TextInput>(null);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    // Validar formato de email
    if (!EMAIL_REGEX.test(email)) {
      Alert.alert('Error', 'Por favor, introduce un correo electrónico válido.');
      return;
    }

    setLoading(true);

    const response = await AuthService.login(email, password);

    setLoading(false);

    if (response.success) {
      router.replace('/home');
    } else {
      setPassword('');
      // Traducir códigos de error de Firebase a mensajes amigables
      const message = getErrorMessage(response.error ?? '');
      Alert.alert('Error', message);
    }
  };

  const handleNavigateToRegister = () => {
    // @ts-ignore typed routes latency
    router.push('/register');
  };

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Por favor, introduce tu correo electrónico primero para restablecer la contraseña.');
      return;
    }

    if (!EMAIL_REGEX.test(email)) {
      Alert.alert('Error', 'Por favor, introduce un correo electrónico válido.');
      return;
    }

    setLoading(true);
    const response = await AuthService.resetPassword(email);
    setLoading(false);

    if (response.success) {
      Alert.alert(
        'Correo enviado',
        'Se ha enviado un enlace para restablecer tu contraseña a tu correo electrónico.'
      );
    } else {
      const message = getErrorMessage(response.error ?? '');
      Alert.alert('Error al restablecer', message);
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
  };
};

// Traduce los códigos de error de Firebase a mensajes en español
function getErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/invalid-email':
      return 'El formato del correo electrónico no es válido.';
    case 'auth/user-not-found':
      return 'No existe una cuenta con este correo electrónico.';
    case 'auth/wrong-password':
      return 'La contraseña es incorrecta.';
    case 'auth/invalid-credential':
      return 'Credenciales incorrectas. Revisa tu correo y contraseña.';
    case 'auth/missing-email':
      return 'Falta el correo electrónico.';
    case 'auth/too-many-requests':
      return 'Demasiados intentos. Inténtalo de nuevo más tarde.';
    case 'auth/user-disabled':
      return 'Esta cuenta ha sido deshabilitada.';
    case 'auth/email-not-verified':
      return 'Debes verificar tu correo electrónico antes de iniciar sesión. Por favor, revisa tu bandeja de entrada y carpeta de spam.';
    default:
      return `Error de autenticación: ${errorCode}`;
  }
}
