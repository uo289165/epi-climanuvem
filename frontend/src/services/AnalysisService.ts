export interface AnalysisHistoryItem {
  id: string;
  status: 'completed' | 'analyzing' | 'cancelled';
  date: string;
  location?: string;
}

export class AnalysisService {
  static async uploadImage(_imageUri: string) {
    try {
      // Simulamos un retraso de red de 1.5 segundos
      await new Promise((resolve) => setTimeout(resolve, 5000));

      // Simulamos una respuesta exitosa del servidor
      return {
        message: "Imagen recibida correctamente. Iniciando análisis...",
        status: "analyzing"
      };
    } catch (error) {
      console.error('Error simulating image upload:', error);
      throw error;
    }
  }

  static async getHistory(isLoggedIn: boolean): Promise<AnalysisHistoryItem[]> {
    // Simulamos un retraso de red
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (isLoggedIn) {
      // Retornamos análisis de ejemplo para usuario con sesión iniciada
      return [
        {
          id: '1',
          status: 'completed',
          date: '2026-03-15T10:30:00Z',
          location: 'Gijón, España',
        },
        {
          id: '2',
          status: 'cancelled',
          date: '2026-03-14T15:45:00Z',
          location: 'Oviedo, España',
        },
        {
          id: '3',
          status: 'completed',
          date: '2026-03-10T09:15:00Z',
          location: 'Madrid, España',
        },
      ];
    } else {
      // Retornamos análisis de la sesión actual para invitados
      return [
        {
          id: 'temp-1',
          status: 'analyzing',
          date: new Date().toISOString(),
          location: 'Ubicación actual',
        },
      ];
    }
  }
}
