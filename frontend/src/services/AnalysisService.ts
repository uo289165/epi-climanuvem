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
}
