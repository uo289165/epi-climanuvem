import { useState, useRef } from 'react';
import { router } from 'expo-router';
import { Alert, TextInput } from 'react-native';

export const useAuth = () => {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');

  // Creamos una referencia para poder apuntar al campo de contraseña
  const passwordInputRef = useRef<TextInput>(null);

  const handleLogin = () => {
    if (user === 'test' && password === '1234') {
        router.replace('/home');
    } else {
        setUser('');
        setPassword('');
        Alert.alert('Error', 'Credenciales incorrectas. (Usa test / 1234)');
    }
  };

  return {
    user,
    setUser,
    password, 
    setPassword,
    handleLogin,
    passwordInputRef
  };
};
