# ClimaNuvem

ClimaNuvem es una aplicacion movil para analizar fotografias de nubes. Permite tomar o seleccionar una imagen, enviarla al backend, clasificar los tipos de nubes detectados mediante un modelo multimodal servido con Ollama y consultar el historial de analisis desde la app.

## Funcionalidades

- Autenticacion con Firebase, incluyendo modo invitado.
- Captura desde camara o seleccion desde galeria.
- Subida de imagenes JPG de hasta 5 MB.
- Registro opcional de ubicacion y coordenadas del analisis.
- Analisis asincrono con cola en backend.
- Clasificacion de tipos de nube y avisos asociados.
- Explicabilidad opcional mediante cajas delimitadoras.
- Historial de analisis por usuario.
- Cancelacion de analisis en progreso.
- Eliminacion de analisis individuales o de todos los datos del usuario.
- Notificaciones push al finalizar o fallar un analisis.
- Soporte de idioma espanol/ingles y tema claro/oscuro.

## Arquitectura

El proyecto esta dividido en dos aplicaciones principales:

- `frontend/`: aplicacion Expo/React Native con Expo Router, Firebase Auth, camara, galeria, ubicacion, notificaciones e historial.
- `backend/`: API FastAPI con PostgreSQL, Firebase Admin, cola asincrona de analisis y cliente Ollama.

Flujo principal:

1. El usuario inicia sesion o entra como invitado.
2. La app obtiene una imagen JPG desde camara o galeria.
3. Opcionalmente se adjuntan ubicacion, token FCM y explicabilidad.
4. El backend guarda la imagen y crea un registro `analysis` en estado `analyzing`.
5. Un worker procesa la cola, llama a Ollama y persiste los resultados.
6. La app consulta el historial y muestra resultados, avisos y cajas delimitadoras si existen.

## Backend

Tecnologias principales:

- FastAPI
- SQLAlchemy
- PostgreSQL
- Firebase Admin
- Ollama
- HTTPX
- Uvicorn

Endpoints principales:

- `GET /ping`: comprobacion basica de disponibilidad.
- `GET /`: estado del servicio.
- `POST /analysis/upload`: subida de imagen JPG para analisis.
- `GET /analysis/history`: historial del usuario autenticado.
- `DELETE /analysis/{analysis_id}`: elimina un analisis concreto.
- `PATCH /analysis/{analysis_id}/cancel`: cancela un analisis en curso.
- `DELETE /analysis/user-data`: elimina los analisis y archivos asociados al usuario.
- `/uploads/...`: servicio estatico para imagenes subidas.

Variables de entorno relevantes:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/climanuvem
FIREBASE_KEY_PATH=secrets/firebase_key.json
FIREBASE_CLOCK_SKEW_SECONDS=5
OLLAMA_URL=http://localhost:11434/api/generate
CORS_ALLOW_ORIGINS=http://localhost:8081,http://localhost:19006,http://127.0.0.1:8081,http://127.0.0.1:19006
LOG_LEVEL=INFO
TEST_MODE=false
DISABLE_WORKER=false
```

Notas:

- `CORS_ALLOW_ORIGINS` debe contener origenes explicitos separados por comas. No se usa wildcard con credenciales.
- `FIREBASE_KEY_PATH` debe apuntar a un fichero de credenciales fuera del control de versiones.
- `FIREBASE_CLOCK_SKEW_SECONDS` define el margen en segundos para tolerar pequenos desfases de reloj al verificar tokens Firebase. Valor recomendado: `5`.
- `TEST_MODE=true` permite usar autenticacion simulada en pruebas.
- `DISABLE_WORKER=true` desactiva el worker asincrono.

Ejecucion local del backend:

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Docker Backend

El fichero `backend/docker-compose.yml` levanta:

- PostgreSQL 15
- Ollama
- Backend FastAPI en el puerto `8000`

Ejemplo:

```bash
cd backend
docker compose up --build
```

El servicio espera las variables de PostgreSQL (`POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`) y monta:

- `backend_uploads` para imagenes subidas persistentes.
- `./secrets` para credenciales privadas en modo solo lectura.

## Frontend

Tecnologias principales:

- Expo
- React Native
- Expo Router
- Firebase
- i18next
- Expo Camera, Image Picker, Location y Notifications

Variables de entorno relevantes:

```env
EXPO_PUBLIC_BACKEND_URL=http://localhost:8000
EXPO_PUBLIC_TEST_MODE=false
```

Comandos habituales:

```bash
cd frontend
npm install
npm start
npm run android
npm run ios
npm run web
```

Para probar en un movil fisico, `EXPO_PUBLIC_BACKEND_URL` debe apuntar a una direccion accesible desde el dispositivo, no necesariamente a `localhost`.

## Base De Datos

El backend crea las tablas necesarias al arrancar si no existen:

- `analysis`: metadatos de cada analisis, usuario, imagen, ubicacion y estado.
- `clouds`: catalogo de tipos de nube, prevision y avisos.
- `analysis_cloud`: relacion entre analisis y tipos detectados, incluyendo confianza y cajas delimitadoras.

Tambien inicializa el catalogo de nubes cuando la tabla esta vacia.

## Seguridad Y Configuracion

- No subir credenciales Firebase, claves privadas ni ficheros `.env`.
- Mantener CORS limitado a origenes conocidos.
- El backend valida que las imagenes sean JPG, no esten vacias y no superen 5 MB.
- Los analisis anonimos antiguos se limpian automaticamente a partir de la politica implementada en el arranque del backend.

## Tests

Backend:

```bash
cd backend
pytest
```

Frontend:

```bash
cd frontend
npm test
npm run lint
```
