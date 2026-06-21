# Guía Completa del Proyecto: Diabet Gluc
### Una explicación para todos, sin importar el nivel técnico

---

## ¿Qué es Diabet Gluc?

**Diabet Gluc** es una aplicación web diseñada para ayudar a personas con diabetes a llevar un control organizado de su glucosa en sangre. Funciona desde cualquier navegador (Chrome, Firefox, Safari) tanto en computador como en celular, y no requiere instalar nada.

La app permite:
- Registrar mediciones de glucosa diarias
- Ver gráficas de evolución semanal
- Configurar recordatorios de medicamentos o mediciones
- Consultar guías de alimentación según el índice glucémico
- Gestionar el perfil personal y los rangos objetivo de glucosa

---

## ¿Cómo se ve y cómo funciona?

La aplicación tiene dos partes visuales principales:

### Pantalla de inicio de sesión / Registro
Cuando un usuario entra a la app por primera vez, ve una pantalla limpia donde puede crear una cuenta nueva (con nombre, correo y contraseña) o iniciar sesión si ya tiene una. La contraseña nunca se guarda tal como la escribe el usuario — se transforma en un código cifrado antes de guardarse, por seguridad.

### Panel principal (Dashboard)
Una vez dentro, el usuario ve:
- **Barra lateral izquierda:** menú de navegación con acceso rápido a todas las secciones, el nombre del usuario, su tipo de diabetes y un botón para cerrar sesión.
- **Tarjetas de resumen:** muestran la última medición registrada, el promedio de glucosa de los últimos 7 días y el total de registros en el historial.
- **Gráfica de línea:** muestra visualmente cómo ha variado la glucosa durante la última semana.
- **Alertas automáticas:** si la última medición está por debajo del mínimo (hipoglucemia) o por encima del máximo, aparece una alerta en rojo o amarillo.
- **Accesos rápidos:** cuatro botones de colores que llevan directamente a Historial, Recordatorios, Nutrición y Perfil.

### Historial de glucosa
Una tabla con todos los registros del usuario, ordenados del más reciente al más antiguo. Cada registro muestra la fecha, hora, valor en mg/dL y un indicador de color:
- 🟢 **Verde (Normal):** el valor está dentro del rango objetivo del usuario
- 🔴 **Rojo (Bajo):** el valor está por debajo del mínimo — señal de hipoglucemia
- 🟡 **Amarillo (Alto):** el valor supera el máximo — señal de hiperglucemia

El usuario puede agregar, editar o eliminar cualquier registro.

### Recordatorios
El usuario puede crear alertas personalizadas indicando el tipo (Medicamento, Medición u Otro), la hora y los días de la semana. Cada recordatorio se puede activar o desactivar con un interruptor, y también eliminar.

### Nutrición
Sección informativa con una guía de alimentos clasificados por su índice glucémico (bajo, medio, alto) y consejos prácticos para mantener la glucosa estable. Incluye un aviso médico recordando que la información es orientativa y no reemplaza la consulta con un profesional.

### Perfil
El usuario puede actualizar su nombre, correo, tipo de diabetes y sus rangos objetivo de glucosa (el mínimo y el máximo personal). Cuando cambia los rangos, todos los registros existentes se reclasifican automáticamente.

---

## ¿Con qué tecnologías fue construida?

La app usa lo que se conoce como el **stack MERN**, que son cuatro herramientas que trabajan juntas:

### 1. MongoDB — La base de datos
Es donde se guarda toda la información: usuarios, mediciones y recordatorios. A diferencia de una hoja de cálculo tradicional, MongoDB guarda los datos en un formato flexible similar a fichas, lo que facilita manejar información variada. Se usa la versión en la nube llamada **MongoDB Atlas**, lo que significa que los datos están guardados de forma segura en internet y no en un computador específico.

### 2. Express — El servidor
Es el programa que recibe las solicitudes del navegador del usuario y decide qué hacer con ellas. Por ejemplo, cuando alguien intenta iniciar sesión, el navegador le envía el correo y la contraseña a Express, que verifica si son correctos y responde con un permiso de acceso.

### 3. React — La interfaz visual
Es la tecnología que construye todo lo que el usuario ve en pantalla: botones, tablas, gráficas, formularios. React hace que la página sea dinámica — cuando se agrega un registro, la tabla se actualiza instantáneamente sin necesidad de recargar toda la página.

### 4. Node.js — El motor del servidor
Es el entorno que permite que Express funcione. Si Express es el conductor, Node.js es el vehículo. Permite que el servidor esté siempre escuchando solicitudes y respondiendo a ellas.

### Otras herramientas usadas:
- **Vite:** acelera el proceso de construcción del frontend (la parte visual)
- **Axios:** es el mensajero entre el frontend y el backend — lleva las solicitudes y trae las respuestas
- **Recharts:** la librería que dibuja la gráfica de evolución de glucosa
- **Lucide React:** el conjunto de íconos que se usan en la interfaz
- **JWT (JSON Web Token):** el sistema de seguridad que mantiene la sesión activa — funciona como una pulsera de acceso digital
- **bcrypt:** el sistema que cifra las contraseñas antes de guardarlas

---

## ¿Cómo está organizado el código?

El proyecto tiene dos grandes carpetas:

```
DiabetGluc/
├── backend/      ← Todo lo que el usuario NO ve
└── frontend/     ← Todo lo que el usuario SÍ ve
```

### Backend (lo que ocurre detrás de cámara)
```
backend/src/
├── models/        ← Define la estructura de los datos (Usuario, Registro, Recordatorio)
├── controllers/   ← Contiene la lógica: qué hacer cuando llega cada solicitud
├── routes/        ← Define las direcciones web de cada función (login, registros, etc.)
├── middleware/    ← Filtros de seguridad que verifican si el usuario tiene permiso
└── index.js       ← El punto de arranque del servidor
```

### Frontend (lo que el usuario ve)
```
frontend/src/
├── pages/         ← Cada pantalla de la app (Login, Dashboard, Historial, etc.)
├── components/    ← Piezas reutilizables (barra lateral, protección de rutas)
├── context/       ← Maneja la sesión del usuario en toda la app
├── api/           ← Configura la comunicación con el backend
└── styles/        ← El diseño visual (colores, tamaños, tipografía)
```

---

## ¿Cómo se comunican el frontend y el backend?

Cuando el usuario hace algo en la app (iniciar sesión, agregar un registro, etc.), ocurre este proceso:

```
Usuario hace clic
       ↓
React prepara la solicitud
       ↓
Axios la envía al backend (Express)
       ↓
El middleware verifica que el usuario tenga sesión válida
       ↓
El controlador ejecuta la lógica
       ↓
Se consulta o guarda en MongoDB
       ↓
El backend responde con los datos
       ↓
React actualiza la pantalla automáticamente
```

---

## ¿Cómo funciona la seguridad?

La app tiene tres capas de seguridad:

### 1. Contraseñas cifradas
Cuando un usuario crea una cuenta, su contraseña nunca se guarda tal como la escribió. Pasa por un proceso llamado **hashing** (usando bcrypt) que la convierte en una cadena irreconocible. Si alguien accediera a la base de datos, solo vería algo como `$2b$12$xK9...` en lugar de la contraseña real.

### 2. Token de sesión (JWT)
Al iniciar sesión correctamente, el servidor genera un token — una especie de llave digital con tiempo de expiración (7 días). Este token viaja en cada solicitud que hace el frontend, y el backend lo verifica antes de responder. Si el token no es válido o expiró, el acceso es denegado automáticamente.

### 3. Rutas protegidas
Todas las pantallas de la app (excepto Login y Registro) están protegidas. Si alguien intenta acceder directamente a la URL del Dashboard sin haber iniciado sesión, la app lo redirige automáticamente al Login.

---

## ¿Dónde está alojada la app?

La aplicación está dividida en tres servicios en la nube, todos gratuitos:

| Parte | Servicio | URL |
|-------|----------|-----|
| **Frontend** (lo visual) | Vercel | https://diabetgluc.vercel.app |
| **Backend** (el servidor) | Render | https://diabetgluc.onrender.com |
| **Base de datos** | MongoDB Atlas | (acceso interno, sin URL pública) |

### ¿Por qué tres servicios separados?
Separar el frontend del backend es una buena práctica porque permite actualizar cada parte de forma independiente, mejora la seguridad y facilita el mantenimiento.

### Nota sobre el plan gratuito de Render
El servidor en Render se "duerme" automáticamente después de 15 minutos sin recibir visitas. La primera vez que alguien entra a la app después de ese período de inactividad, puede tardar hasta 30 segundos en cargar. Esto es completamente normal en el plan gratuito.

---

## ¿Cómo se conectan los tres servicios?

```
Usuario en el navegador
         ↓
   diabetgluc.vercel.app    ← Frontend (Vercel)
         ↓ solicitudes
  diabetgluc.onrender.com   ← Backend (Render)
         ↓ consultas
     MongoDB Atlas           ← Base de datos en la nube
```

El frontend sabe a dónde enviar las solicitudes gracias a una variable de configuración llamada `VITE_API_URL` que apunta al backend. El backend sabe cómo conectarse a la base de datos gracias a otra variable llamada `MONGO_URI`. Ninguna de estas variables está visible en el código público — están guardadas de forma segura en cada plataforma.

---

## ¿Cómo fue construido el proyecto paso a paso?

1. **Diseño de la base de datos:** se definieron los tres modelos de datos (Usuario, Registro de Glucosa, Recordatorio) con todos sus campos y reglas de validación.

2. **Backend — Autenticación:** se construyeron los endpoints de registro e inicio de sesión con cifrado de contraseñas y generación de tokens JWT.

3. **Backend — API de glucosa:** se crearon todos los endpoints para crear, leer, actualizar y eliminar registros, incluyendo el cálculo automático del estado (Normal/Bajo/Alto) según los rangos del usuario.

4. **Backend — Recordatorios y perfil:** se completaron los endpoints restantes para la gestión de recordatorios y actualización del perfil.

5. **Frontend — Autenticación:** se construyeron las pantallas de Login y Registro con manejo de errores y redirección automática.

6. **Frontend — Dashboard:** se integró la gráfica de Recharts con los datos reales de la API y se añadieron las alertas automáticas de hipoglucemia e hiperglucemia.

7. **Frontend — Historial:** se construyó el CRUD completo con tabla, modal de formulario y confirmación de eliminación.

8. **Frontend — Recordatorios, Nutrición y Perfil:** se completaron las pantallas restantes.

9. **Pruebas:** se verificaron los 10 criterios de aceptación del proyecto, incluyendo el manejo correcto de errores, la clasificación automática de registros y la protección de rutas.

10. **Deploy:** se subió el código a GitHub, el backend a Render y el frontend a Vercel, configurando las variables de entorno necesarias en cada plataforma.

---

## Funcionalidades principales en resumen

| Funcionalidad | Descripción |
|---------------|-------------|
| Registro de cuenta | El usuario crea su perfil con nombre, correo, contraseña y tipo de diabetes |
| Inicio de sesión seguro | Verifica credenciales y genera un token de acceso de 7 días |
| Dashboard con resumen | Muestra última medición, promedio semanal y total de registros |
| Gráfica semanal | Línea de tiempo con la evolución de glucosa de los últimos 7 días |
| Alertas automáticas | Aviso visual inmediato si hay hipoglucemia o hiperglucemia |
| Historial completo | Tabla con todos los registros, ordenados del más reciente al más antiguo |
| Clasificación automática | Cada registro se clasifica como Normal, Bajo o Alto según los rangos del usuario |
| CRUD de registros | Crear, ver, editar y eliminar mediciones con confirmación |
| Recordatorios | Alertas por tipo, hora y días de la semana, activables/desactivables |
| Guía nutricional | Alimentos clasificados por índice glucémico con consejos prácticos |
| Perfil editable | Actualización de datos personales y rangos objetivo de glucosa |
| Reclasificación automática | Al cambiar los rangos, todos los registros se reclasifican instantáneamente |
| Rutas protegidas | Sin sesión válida, cualquier URL privada redirige al Login |
| Diseño responsive | Funciona en computador, tablet y celular |

---

## Datos del proyecto

- **Nombre:** Diabet Gluc — Control de Glucosa
- **Tipo:** Aplicación web full-stack
- **Stack:** MERN (MongoDB, Express, React, Node.js)
- **URL pública:** https://diabetgluc.vercel.app
- **Repositorio:** https://github.com/gjuaneth/diabetgluc
- **Usuario demo:** demo@diabetgluc.com / demo1234

---

*Esta guía fue elaborada para explicar el proyecto de forma accesible, sin requerir conocimientos técnicos previos.*
