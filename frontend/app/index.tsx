import React from 'react';
import { useAuth } from '@/src/controllers/useAuth';
import { AuthView } from '@/src/views/AuthView';

export default function LoginScreen() {
  // Inicializamos el Controlador
  const authController = useAuth();
  
  // Renderizamos la Vista pura inyectándole el Controlador
  return <AuthView controller={authController} />;
}
