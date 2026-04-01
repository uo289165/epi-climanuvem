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
  static async uploadImage(imageUri: string, locationStr: string) {
    try {
      return await BackendService.uploadImage(imageUri, locationStr);
    } catch (error) {
      console.error('Error uploading image to backend:', error);
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
