import { BackendService } from '@/src/services/BackendService';

export interface AnalysisHistoryItem {
  id: string;
  status: 'completed' | 'analyzing' | 'cancelled';
  date: string;
  location?: string;
  imageUrl?: string;
  results?: {
    cloudTypes: string[];
    forecast: string;
    warnings: string[];
  };
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
      try {
        const history = await BackendService.getAnalysisHistory();
        return history as AnalysisHistoryItem[];
      } catch (error) {
        console.error('Error al obtener el historial de análisis:', error);
        return [];
      }
    } else {
      // Retornamos análisis de la sesión actual para invitados
      return [
        {
          id: 'temp-1',
          status: 'analyzing',
          date: new Date().toISOString(),
          location: 'Ubicación actual',
          imageUrl: 'https://picsum.photos/id/1015/800/600',
        },
      ];
    }
  }
}
