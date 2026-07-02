# Frontend ClimaNuvem

Aplicacion movil Expo/React Native de ClimaNuvem. Incluye autenticacion con Firebase, captura o seleccion de imagenes, subida al backend, historial de analisis, notificaciones, idioma espanol/ingles y tema claro/oscuro.

## Configuracion

Define la URL del backend antes de iniciar Expo:

```env
EXPO_PUBLIC_BACKEND_URL=http://localhost:8000
EXPO_PUBLIC_TEST_MODE=false
```

En un dispositivo fisico, `EXPO_PUBLIC_BACKEND_URL` debe ser una direccion accesible desde el movil, por ejemplo la IP local del equipo donde se ejecuta el backend.

El fichero `google-services.json` no se versiona. Para desarrollo local, descargalo desde Firebase o restauralo desde un almacenamiento privado y colocalo en la raiz de `frontend/`.

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

## Build Android Y CI

GitHub Actions compila automaticamente un APK release firmado cuando hay cambios en `frontend/` sobre `main` y los tests pasan. El APK se adjunta a una nueva GitHub Release.

Secrets requeridos para el build Android:

```text
ANDROID_KEYSTORE_BASE64
ANDROID_KEYSTORE_PASSWORD
ANDROID_KEY_ALIAS
ANDROID_KEY_PASSWORD
GOOGLE_SERVICES_JSON_BASE64
```

Para generar los valores base64 en PowerShell:

```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("google-services.json"))
[Convert]::ToBase64String([IO.File]::ReadAllBytes("ruta\a\climanuvem-release.keystore"))
```

El workflow restaura `google-services.json`, crea la keystore en `android/app/release.keystore` y escribe la configuracion de firma en Gradle durante la ejecucion.

## Estructura

- `app/`: rutas gestionadas por Expo Router.
- `src/views/`: pantallas principales.
- `src/controllers/`: logica de cada pantalla.
- `src/services/`: integracion con Firebase, backend, notificaciones y logging.
- `components/`: componentes reutilizables de UI.
- `assets/`: iconos, splash y recursos visuales de la app.

Consulta el `README.md` de la raiz del proyecto para la configuracion completa de backend, base de datos, Ollama y Firebase.
