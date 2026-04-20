import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const NotificationService = {
  getPushTokenAsync: async (): Promise<string | undefined> => {
    let token;
    
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.warn('Los permisos de navegación no fueron concedidos.');
        return undefined;
      }
      
      try {
        // Obtenemos el device push token nativo (FCM en Android) porque el backend usa firebase-admin directamente
        const tokenData = await Notifications.getDevicePushTokenAsync();
        token = tokenData.data;
      } catch (error) {
        console.error('Error al obtener el push token del dispositivo:', error);
      }
    } else {
      console.log('Las notificaciones Push requieren de un dispositivo físico.');
    }
    
    return token;
  },
};
