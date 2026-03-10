import { useState, useRef } from 'react';
import { router } from 'expo-router';
import { Alert, TextInput } from 'react-native';
import { AuthService } from '@/src/services/AuthService';

const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

export const useRegister = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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
      Alert.alert('Error', 'El nombre de usuario debe tener entre 3 y 20 caracteres.');
      return;
    }

    if (!EMAIL_REGEX.test(email)) {
      Alert.alert('Error', 'Por favor, introduce un correo electrónico válido.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);

    const response = await AuthService.register(username, email, password);

    setLoading(false);

    if (response.success) {
      Alert.alert(
        'Registro exitoso',
        'Hemos enviado un correo de verificación. Por favor, verifica tu correo antes de iniciar sesión.',
        [{ text: 'OK', onPress: handleNavigateToLogin }]
      );
    } else {
      // Si falla, se podría borrar la contraseña por seguridad
      setPassword('');
      setConfirmPassword('');
      const message = getErrorMessage(response.error ?? '');
      Alert.alert('Error', message);
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
  };
};

function getErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'Este correo electrónico ya está en uso por otra cuenta.';
    case 'auth/invalid-email':
      return 'El formato del correo electrónico no es válido.';
    case 'auth/operation-not-allowed':
      return 'La creación de cuentas con correo y contraseña no está habilitada.';
    case 'auth/weak-password':
      return 'La contraseña es demasiado débil (debe tener al menos 6 caracteres).';
    case 'auth/password-does-not-meet-requirements':
      return 'La contraseña debe contener al menos una letra mayúscula y un número.';
    default:
      return `Error al registrarse: ${errorCode}`;
  }
}
