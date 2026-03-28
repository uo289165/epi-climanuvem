import { auth } from '@/src/config/firebaseConfig';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export const BackendService = {
  /**
   * Realiza una petición GET al endpoint de prueba del backend.
   * Requiere que el usuario esté autenticado para enviar el token ID.
   */
  testEndpoint: async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No hay usuario autenticado. Por favor, inicia sesión.');
      }

      console.log('Obteniendo token de Firebase...');
      const token = await user.getIdToken(true);
      console.log('Token obtenido. Realizando petición a:', `${BACKEND_URL}/test`);

      const response = await fetch(`${BACKEND_URL}/test`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      console.log('Respuesta recibida:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Error de red desconocido' }));
        throw new Error(errorData.detail || `Error del servidor: ${response.status}`);
      }

      return await response.json();
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        console.error('La petición excedió el tiempo de espera (10s)');
        throw new Error('La petición excedió el tiempo de espera. Verifica que el backend sea alcanzable.');
      }
      console.error('Error en BackendService.testEndpoint:', error);
      throw error;
    }
  },

  /**
   * Obtiene el historial real de análisis del usuario.
   * Requiere autenticación.
   */
  getAnalysisHistory: async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No hay usuario autenticado. Por favor, inicia sesión.');
      }

      const token = await user.getIdToken(true);
      const response = await fetch(`${BACKEND_URL}/analysis/history`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Error de red desconocido' }));
        throw new Error(errorData.detail || `Error del servidor: ${response.status}`);
      }

      return await response.json();
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('La petición excedió el tiempo de espera al obtener historial.');
      }
      console.error('Error en BackendService.getAnalysisHistory:', error);
      throw error;
    }
  },
};
