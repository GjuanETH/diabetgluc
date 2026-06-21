# Diabet Gluc — Control de Glucosa en Sangre

Aplicación web MERN para el seguimiento de glucosa en pacientes con diabetes.

## Requisitos previos

- Node.js v18+
- MongoDB Community Server (local) o cuenta en MongoDB Atlas

## 1. Instalar dependencias

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

## 2. Configurar variables de entorno

Copia el archivo de ejemplo y ajusta los valores:

```bash
cd backend
copy .env.example .env
```

Edita `backend/.env`:

```
MONGO_URI=mongodb://localhost:27017/diabetgluc
PORT=5000
JWT_SECRET=cambia_esto_por_una_clave_secreta_larga
```

Si usas MongoDB Atlas, reemplaza `MONGO_URI` con tu connection string.

## 3. Levantar MongoDB (local)

En Windows con MongoDB instalado como servicio:

```bash
# Verificar que el servicio está corriendo
net start MongoDB

# O iniciarlo manualmente si está detenido
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath="C:\data\db"
```

## 4. Cargar datos de demostración (opcional)

```bash
cd backend
npm run seed
```

Esto crea un usuario demo con ~30 registros de glucosa y 2 recordatorios:
- **Email:** demo@diabetgluc.com
- **Contraseña:** demo1234

## 5. Correr el backend

```bash
cd backend
npm run dev        # con hot-reload (nodemon)
# o
npm start          # producción
```

El servidor corre en: http://localhost:5000

## 6. Correr el frontend

Abre una nueva terminal:

```bash
cd frontend
npm run dev
```

La app corre en: http://localhost:5173

## Endpoints de la API

| Método | Ruta                  | Descripción                          | Auth |
|--------|-----------------------|--------------------------------------|------|
| POST   | /api/auth/register    | Registro de usuario                  | No   |
| POST   | /api/auth/login       | Login, devuelve JWT                  | No   |
| GET    | /api/glucose          | Historial del usuario                | Sí   |
| POST   | /api/glucose          | Crear registro                       | Sí   |
| PUT    | /api/glucose/:id      | Editar registro                      | Sí   |
| DELETE | /api/glucose/:id      | Eliminar registro                    | Sí   |
| GET    | /api/glucose/stats    | Estadísticas y datos de gráfica      | Sí   |
| GET    | /api/reminders        | Listar recordatorios                 | Sí   |
| POST   | /api/reminders        | Crear recordatorio                   | Sí   |
| PUT    | /api/reminders/:id    | Actualizar/toggle recordatorio       | Sí   |
| DELETE | /api/reminders/:id    | Eliminar recordatorio                | Sí   |
| GET    | /api/profile          | Obtener perfil                       | Sí   |
| PUT    | /api/profile          | Actualizar perfil y rangos           | Sí   |

## Estructura del proyecto

```
DiabetGluc/
├── backend/
│   ├── src/
│   │   ├── controllers/   # Lógica de negocio
│   │   ├── middleware/    # JWT auth
│   │   ├── models/        # Esquemas Mongoose
│   │   ├── routes/        # Definición de rutas
│   │   ├── index.js       # Servidor Express
│   │   └── seed.js        # Datos de demostración
│   ├── .env
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api/           # Instancia Axios configurada
    │   ├── components/    # Sidebar, PrivateRoute
    │   ├── context/       # AuthContext
    │   ├── pages/         # Dashboard, Historial, etc.
    │   └── styles/        # CSS global
    └── package.json
```
