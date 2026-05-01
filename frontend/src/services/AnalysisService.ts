import { BackendService } from '@/src/services/BackendService';

export interface AnalysisHistoryItem {
  id: string;
  status: 'completed' | 'analyzing' | 'cancelled';
  date: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  imageUrl?: string;
  results?: {
    cloudTypes: string[];
    cloudDetails?: { type: string; box: [number, number, number, number] | null }[];
    forecast: string;
    warnings: { text: string; level: number }[];
  };
}

export class AnalysisService {
  static async uploadImage(imageUri: string, locationStr: string, latitude?: number, longitude?: number, fcmToken?: string, includeExplainability: boolean = false) {
    try {
      return await BackendService.uploadImage(imageUri, locationStr, latitude, longitude, fcmToken, includeExplainability);
    } catch (error) {
      console.error('Error uploading image to backend:', error);
      throw error;
    }
  }

  static async deleteAnalysis(analysisId: string) {
    try {
      return await BackendService.deleteAnalysis(analysisId);
    } catch (error) {
      console.error('Error deleting analysis:', error);
      throw error;
    }
  }

  static async cancelAnalysis(analysisId: string) {
    try {
      return await BackendService.cancelAnalysis(analysisId);
    } catch (error) {
      console.error('Error cancelling analysis:', error);
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
