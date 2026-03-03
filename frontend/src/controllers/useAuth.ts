import { useState, useRef } from 'react';
import { router } from 'expo-router';
import { Alert, TextInput } from 'react-native';
import { AuthService } from '@/src/services/AuthService';

// Regex básico para validar formato de email
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const useAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Creamos una referencia para poder apuntar al campo de contraseña
  const passwordInputRef = useRef<TextInput>(null);

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

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    handleLogin,
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
    case 'auth/too-many-requests':
      return 'Demasiados intentos. Inténtalo de nuevo más tarde.';
    case 'auth/user-disabled':
      return 'Esta cuenta ha sido deshabilitada.';
    default:
      return `Error de autenticación: ${errorCode}`;
  }
}
