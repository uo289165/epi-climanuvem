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
   * Sube una imagen para su análisis con su ubicación.
   * Requiere autenticación.
   */
  uploadImage: async (imageUri: string, locationStr: string, latitude?: number, longitude?: number, fcmToken?: string) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No hay usuario autenticado. Por favor, inicia sesión.');
      }
      const token = await user.getIdToken(true);
      
      const formData = new FormData();
      const filename = imageUri.split('/').pop() || 'photo.jpg';
      const match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image/jpeg`;
      if (type === 'image/jpg') type = 'image/jpeg'; // Android compatibility

      formData.append('file', {
        uri: imageUri,
        name: filename,
        type: type,
      } as any);

      formData.append('location', locationStr);
      if (latitude !== undefined) formData.append('latitude', String(latitude));
      if (longitude !== undefined) formData.append('longitude', String(longitude));
      
      if (fcmToken) {
        formData.append('fcm_token', fcmToken);
      }

      const response = await fetch(`${BACKEND_URL}/analysis/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Fetch sets Content-Type automatically for FormData boundary
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Error de red desconocido' }));
        throw new Error(errorData.detail || `Error del servidor: ${response.status}`);
      }

      return await response.json();
    } catch (error: any) {
      console.error('Error en BackendService.uploadImage:', error);
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

      const data = await response.json();
      return data.map((item: any) => {
        if (item.imageUrl?.startsWith('/uploads/')) {
          item.imageUrl = `${BACKEND_URL}${item.imageUrl}`;
        }
        return item;
      });
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('La petición excedió el tiempo de espera al obtener historial.');
      }
      console.error('Error en BackendService.getAnalysisHistory:', error);
      throw error;
    }
  },

  /**
   * Elimina todos los análisis y datos asociados al usuario actual.
   * Requiere autenticación.
   */
  deleteUserData: async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No hay usuario autenticado. Por favor, inicia sesión.');
      }

      const token = await user.getIdToken(true);
      const response = await fetch(`${BACKEND_URL}/analysis/user-data`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
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
        throw new Error('La petición excedió el tiempo de espera al eliminar historial.');
      }
      console.error('Error en BackendService.deleteUserData:', error);
      throw error;
    }
  },

  /**
   * Elimina un análisis específico del historial.
   * Requiere autenticación.
   */
  deleteAnalysis: async (analysisId: string) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No hay usuario autenticado. Por favor, inicia sesión.');
      }

      const token = await user.getIdToken(true);
      const response = await fetch(`${BACKEND_URL}/analysis/${analysisId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
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
        throw new Error('La petición excedió el tiempo de espera al eliminar análisis.');
      }
      console.error('Error en BackendService.deleteAnalysis:', error);
      throw error;
    }
  },

  /**
   * Cancela un análisis que esté en progreso.
   * Requiere autenticación.
   */
  cancelAnalysis: async (analysisId: string) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No hay usuario autenticado. Por favor, inicia sesión.');
      }

      const token = await user.getIdToken(true);
      const response = await fetch(`${BACKEND_URL}/analysis/${analysisId}/cancel`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
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
        throw new Error('La petición excedió el tiempo de espera al cancelar análisis.');
      }
      console.error('Error en BackendService.cancelAnalysis:', error);
      throw error;
    }
  },
};
