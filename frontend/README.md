# Frontend ClimaNuvem

Aplicacion movil Expo/React Native de ClimaNuvem. Incluye autenticacion con Firebase, captura o seleccion de imagenes, subida al backend, historial de analisis, notificaciones, idioma espanol/ingles y tema claro/oscuro.

## Configuracion

Define la URL del backend antes de iniciar Expo:

```env
EXPO_PUBLIC_BACKEND_URL=http://localhost:8000
EXPO_PUBLIC_TEST_MODE=false
```

En un dispositivo fisico, `EXPO_PUBLIC_BACKEND_URL` debe ser una direccion accesible desde el movil, por ejemplo la IP local del equipo donde se ejecuta el backend.

## Comandos

```bash
npm install
npm start
npm run android
npm run ios
npm run web
npm run lint
npm test
```

## Estructura

- `app/`: rutas gestionadas por Expo Router.
- `src/views/`: pantallas principales.
- `src/controllers/`: logica de cada pantalla.
- `src/services/`: integracion con Firebase, backend, notificaciones y logging.
- `components/`: componentes reutilizables de UI.
- `assets/`: iconos, splash y recursos visuales de la app.

Consulta el `README.md` de la raiz del proyecto para la configuracion completa de backend, base de datos, Ollama y Firebase.
