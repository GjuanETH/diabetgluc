# Requerimientos del Sistema — Diabet Gluc

## Información del documento
| Campo | Detalle |
|-------|---------|
| Proyecto | Diabet Gluc — Control de Glucosa |
| Versión | 1.0 |
| Fecha | Junio 2026 |
| Tipo | Especificación de Requerimientos de Software (SRS) |

---

## 1. Introducción

### 1.1 Propósito
Este documento especifica los requerimientos funcionales y no funcionales del sistema Diabet Gluc, una aplicación web para el control y seguimiento de glucosa en sangre dirigida a personas con diabetes.

### 1.2 Alcance
La aplicación permite a los usuarios registrar mediciones de glucosa, visualizar tendencias, gestionar recordatorios de medicación y consultar guías nutricionales, todo desde un navegador web sin necesidad de instalar software adicional.

### 1.3 Definiciones
| Término | Definición |
|---------|-----------|
| mg/dL | Miligramos por decilitro. Unidad de medida de glucosa en sangre |
| Hipoglucemia | Nivel de glucosa por debajo del mínimo objetivo del usuario |
| Hiperglucemia | Nivel de glucosa por encima del máximo objetivo del usuario |
| JWT | JSON Web Token. Mecanismo de autenticación stateless |
| CRUD | Create, Read, Update, Delete. Operaciones básicas sobre datos |
| API REST | Interfaz de programación que sigue el estilo arquitectónico REST |

---

## 2. Requerimientos Funcionales

### RF-01 — Registro de usuario
**Descripción:** El sistema debe permitir que nuevos usuarios creen una cuenta.  
**Entradas:** Nombre completo, correo electrónico, contraseña, tipo de diabetes.  
**Proceso:** Validar campos, verificar unicidad del correo, cifrar contraseña con bcrypt, crear usuario en base de datos, generar token JWT.  
**Salida:** Token de autenticación y datos del usuario.  
**Reglas de negocio:**
- El correo debe ser único en el sistema.
- La contraseña debe tener mínimo 8 caracteres.
- La contraseña se almacena cifrada con bcrypt (factor 12).
- Los rangos objetivo por defecto son: mínimo 70 mg/dL, máximo 180 mg/dL.

---

### RF-02 — Autenticación de usuario
**Descripción:** El sistema debe autenticar usuarios registrados.  
**Entradas:** Correo electrónico, contraseña.  
**Proceso:** Verificar existencia del correo, comparar contraseña con hash almacenado, generar token JWT de 7 días.  
**Salida:** Token JWT y datos del usuario (sin contraseña).  
**Reglas de negocio:**
- Si el correo o la contraseña son incorrectos, el mensaje de error es genérico: "Credenciales incorrectas", sin especificar cuál campo falló.
- El token expira a los 7 días.

---

### RF-03 — Protección de rutas
**Descripción:** El sistema debe restringir el acceso a recursos privados.  
**Proceso:** Verificar presencia y validez del token JWT en cada solicitud a rutas protegidas.  
**Reglas de negocio:**
- Sin token válido, el servidor responde con HTTP 401.
- El frontend redirige automáticamente al Login ante cualquier respuesta 401 en rutas no relacionadas con autenticación.
- Las únicas rutas públicas son /api/auth/register y /api/auth/login.

---

### RF-04 — Registro de medición de glucosa
**Descripción:** El sistema debe permitir registrar mediciones de glucosa.  
**Entradas:** Valor en mg/dL, fecha y hora, nota opcional.  
**Proceso:** Validar campos, calcular estado según rangos del usuario, almacenar en base de datos.  
**Salida:** Registro creado con estado calculado.  
**Reglas de negocio:**
- El valor debe estar entre 1 y 600 mg/dL.
- El estado se calcula en el servidor: Bajo si valor < rangoMin, Alto si valor > rangoMax, Normal en caso contrario.
- Cada registro pertenece exclusivamente al usuario autenticado.

---

### RF-05 — Consulta del historial de glucosa
**Descripción:** El sistema debe devolver todos los registros del usuario autenticado.  
**Proceso:** Consultar base de datos filtrando por userId, ordenar por fecha descendente.  
**Salida:** Lista de registros con todos sus campos.

---

### RF-06 — Actualización de registro de glucosa
**Descripción:** El sistema debe permitir modificar un registro existente.  
**Entradas:** ID del registro, campos a actualizar (valor, fecha, nota).  
**Proceso:** Verificar que el registro pertenece al usuario, actualizar campos, recalcular estado si el valor cambió.  
**Reglas de negocio:**
- Solo el propietario del registro puede modificarlo.
- Si se actualiza el valor, el estado se recalcula automáticamente.

---

### RF-07 — Eliminación de registro de glucosa
**Descripción:** El sistema debe permitir eliminar un registro.  
**Entradas:** ID del registro.  
**Reglas de negocio:**
- Solo el propietario puede eliminar su registro.
- La eliminación es permanente.

---

### RF-08 — Estadísticas del Dashboard
**Descripción:** El sistema debe calcular y devolver métricas resumidas del usuario.  
**Proceso:** Calcular total de registros, obtener el más reciente, calcular promedio de los últimos 7 días, preparar datos para la gráfica semanal.  
**Salida:**
- `total`: conteo total de registros.
- `ultimaMedicion`: el registro más reciente.
- `promedioSemanal`: promedio de valores de los últimos 7 días (null si no hay datos).
- `grafica`: array de registros de los últimos 7 días con valor, fecha y estado.

---

### RF-09 — Gestión de recordatorios
**Descripción:** El sistema debe permitir crear, listar, actualizar y eliminar recordatorios.  
**Entradas para creación:** Tipo (Medicamento/Medición/Otro), hora (HH:mm), días de la semana.  
**Reglas de negocio:**
- Se debe seleccionar al menos un día.
- El formato de hora es HH:mm (24 horas).
- Solo el propietario puede gestionar sus recordatorios.
- Los recordatorios se crean activos por defecto.

---

### RF-10 — Gestión del perfil de usuario
**Descripción:** El sistema debe permitir consultar y actualizar el perfil.  
**Campos actualizables:** Nombre, correo, tipo de diabetes, rango objetivo mínimo y máximo.  
**Reglas de negocio:**
- El nuevo correo no puede estar en uso por otro usuario.
- El rango mínimo debe ser menor que el rango máximo.
- Al actualizar los rangos, todos los registros del usuario se reclasifican automáticamente con los nuevos valores.

---

### RF-11 — Alertas visuales de glucosa crítica
**Descripción:** El Dashboard debe mostrar alertas cuando la última medición es crítica.  
**Reglas de negocio:**
- Estado Bajo: banner rojo con mensaje de hipoglucemia.
- Estado Alto: banner amarillo con mensaje de hiperglucemia.
- Estado Normal: sin alerta.

---

### RF-12 — Guía nutricional
**Descripción:** El sistema debe presentar información nutricional estática clasificada por índice glucémico.  
**Contenido:** Alimentos de bajo, medio y alto índice glucémico, con consejos prácticos.  
**Reglas de negocio:**
- El contenido es estático (no requiere base de datos).
- Se incluye un aviso indicando que la información no reemplaza la consulta médica.

---

## 3. Requerimientos No Funcionales

### RNF-01 — Seguridad

| ID | Requerimiento |
|----|--------------|
| RNF-01.1 | Las contraseñas se almacenan usando bcrypt con factor de costo 12. Nunca en texto plano. |
| RNF-01.2 | Toda comunicación entre cliente y servidor usa HTTPS en producción. |
| RNF-01.3 | El token JWT tiene tiempo de expiración de 7 días. |
| RNF-01.4 | Cada usuario solo puede acceder, modificar y eliminar sus propios datos. |
| RNF-01.5 | Las rutas del backend validan el token en cada solicitud mediante middleware. |
| RNF-01.6 | Los secretos (MONGO_URI, JWT_SECRET) se gestionan mediante variables de entorno, nunca en el código fuente. |
| RNF-01.7 | El CORS solo permite solicitudes desde orígenes autorizados (localhost en desarrollo, URL de Vercel en producción). |

---

### RNF-02 — Rendimiento

| ID | Requerimiento |
|----|--------------|
| RNF-02.1 | El tiempo de respuesta de los endpoints de la API no debe superar los 2 segundos en condiciones normales de carga. |
| RNF-02.2 | La gráfica semanal debe renderizarse en menos de 1 segundo después de recibir los datos. |
| RNF-02.3 | Las consultas a MongoDB deben usar índices para optimizar la búsqueda por userId y fecha. |
| RNF-02.4 | El bundle del frontend compilado no debe superar los 1 MB comprimido (gzip). |

---

### RNF-03 — Usabilidad

| ID | Requerimiento |
|----|--------------|
| RNF-03.1 | La interfaz debe ser responsive y funcionar correctamente en resoluciones desde 360px (móvil) hasta 1920px (escritorio). |
| RNF-03.2 | Los mensajes de error deben ser claros, estar en español y orientar al usuario sobre cómo corregir el problema. |
| RNF-03.3 | Las acciones destructivas (eliminar) deben requerir confirmación explícita del usuario. |
| RNF-03.4 | El estado de carga debe ser visible (texto "Cargando..." o spinner) mientras se esperan respuestas del servidor. |
| RNF-03.5 | Los badges de estado (Normal/Bajo/Alto) deben usar colores que cumplan con estándares básicos de accesibilidad (contraste mínimo 4.5:1). |
| RNF-03.6 | La navegación entre secciones debe realizarse sin recargar la página completa. |

---

### RNF-04 — Disponibilidad

| ID | Requerimiento |
|----|--------------|
| RNF-04.1 | La aplicación debe estar disponible al menos el 99% del tiempo mensual (excluyendo mantenimientos programados). |
| RNF-04.2 | En el plan gratuito de Render, el backend puede experimentar latencias de hasta 30 segundos en el primer acceso tras 15 minutos de inactividad (spin-down). |
| RNF-04.3 | La base de datos en MongoDB Atlas debe tener réplicas activas para garantizar disponibilidad ante fallos de un nodo. |

---

### RNF-05 — Mantenibilidad

| ID | Requerimiento |
|----|--------------|
| RNF-05.1 | El código debe seguir una arquitectura por capas (routes → controllers → models) para facilitar el mantenimiento. |
| RNF-05.2 | Las variables de entorno deben estar documentadas en el archivo .env.example. |
| RNF-05.3 | El proyecto debe estar versionado con Git y alojado en un repositorio en GitHub. |
| RNF-05.4 | Cada módulo de la aplicación debe ser independiente y modificable sin afectar a los demás. |

---

### RNF-06 — Portabilidad

| ID | Requerimiento |
|----|--------------|
| RNF-06.1 | La aplicación debe funcionar en los navegadores modernos: Chrome 100+, Firefox 100+, Safari 15+, Edge 100+. |
| RNF-06.2 | El backend debe funcionar en entornos Node.js 18 o superior. |
| RNF-06.3 | No se deben usar dependencias que requieran instalación de software adicional en el cliente. |

---

### RNF-07 — Escalabilidad

| ID | Requerimiento |
|----|--------------|
| RNF-07.1 | La arquitectura debe soportar el incremento del número de usuarios sin cambios estructurales mayores. |
| RNF-07.2 | La base de datos debe soportar al menos 10,000 registros por usuario sin degradación de rendimiento. |
| RNF-07.3 | El sistema de autenticación stateless (JWT) permite escalar horizontalmente el backend sin compartir estado entre instancias. |

---

## 4. Requerimientos de Interfaz

### 4.1 Interfaz de usuario
- Layout con barra lateral fija a la izquierda (260px) y contenido principal a la derecha.
- Paleta de colores: fondo blanco/gris claro (#f8fafc), sidebar oscuro (#0f172a), acento azul (#2563eb).
- Tipografía: Inter (sans-serif), legible en todos los tamaños.
- Iconografía: librería lucide-react.

### 4.2 Interfaz de comunicación
- El frontend se comunica con el backend mediante solicitudes HTTP/HTTPS en formato JSON.
- El token JWT se transmite en el header Authorization: Bearer {token}.
- La URL base de la API es configurable mediante la variable de entorno VITE_API_URL.

### 4.3 Interfaz de base de datos
- El backend se conecta a MongoDB mediante Mongoose como ODM.
- La cadena de conexión se especifica en la variable de entorno MONGO_URI.

---

## 5. Restricciones del sistema

| ID | Restricción |
|----|------------|
| R-01 | El sistema está diseñado para uso individual; no soporta múltiples usuarios gestionando la misma cuenta. |
| R-02 | No se incluye módulo de notificaciones push; los recordatorios son solo visuales dentro de la app. |
| R-03 | La guía nutricional es contenido estático y no se personaliza según el perfil del usuario. |
| R-04 | El sistema no se integra con dispositivos medidores de glucosa; los datos se ingresan manualmente. |
| R-05 | En el plan gratuito de Render, el servidor tiene un límite de 750 horas de cómputo mensuales. |
