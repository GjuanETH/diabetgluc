# Historias de Usuario — Diabet Gluc

## Información del documento
| Campo | Detalle |
|-------|---------|
| Proyecto | Diabet Gluc — Control de Glucosa |
| Versión | 1.0 |
| Fecha | Junio 2026 |

---

## Épicas del proyecto

| ID | Épica |
|----|-------|
| EP-01 | Gestión de cuenta y autenticación |
| EP-02 | Registro y seguimiento de glucosa |
| EP-03 | Dashboard y visualización |
| EP-04 | Recordatorios y alertas |
| EP-05 | Nutrición y educación |
| EP-06 | Configuración de perfil |

---

## EP-01 — Gestión de cuenta y autenticación

### HU-01 — Registro de nuevo usuario
**Como** persona con diabetes que no tiene cuenta,  
**quiero** poder crear una cuenta con mi nombre, correo y contraseña,  
**para** acceder a mi panel personal de control de glucosa.

**Criterios de aceptación:**
- El formulario solicita nombre completo, correo electrónico, contraseña y tipo de diabetes.
- La contraseña debe tener mínimo 8 caracteres; si no cumple, se muestra un mensaje de error.
- Si el correo ya está registrado, se muestra el mensaje "El email ya está registrado".
- Al registrarse exitosamente, el sistema inicia sesión automáticamente y redirige al Dashboard.
- La contraseña se almacena cifrada; nunca en texto plano.

**Prioridad:** Alta  
**Estimación:** 3 puntos

---

### HU-02 — Inicio de sesión
**Como** usuario registrado,  
**quiero** poder iniciar sesión con mi correo y contraseña,  
**para** acceder a mi información personal de glucosa.

**Criterios de aceptación:**
- El formulario solicita correo y contraseña.
- Si las credenciales son correctas, el sistema redirige al Dashboard.
- Si las credenciales son incorrectas, se muestra el mensaje "Credenciales incorrectas" sin revelar cuál campo está mal.
- La sesión se mantiene activa durante 7 días sin necesidad de volver a iniciar sesión.

**Prioridad:** Alta  
**Estimación:** 2 puntos

---

### HU-03 — Cierre de sesión
**Como** usuario autenticado,  
**quiero** poder cerrar sesión desde cualquier pantalla,  
**para** proteger mi información en dispositivos compartidos.

**Criterios de aceptación:**
- El botón "Cerrar sesión" está siempre visible en la parte inferior del menú lateral.
- Al hacer clic, se elimina la sesión y se redirige al Login.
- Después de cerrar sesión, no es posible navegar a páginas privadas con el botón atrás del navegador.

**Prioridad:** Alta  
**Estimación:** 1 punto

---

### HU-04 — Protección de rutas privadas
**Como** sistema,  
**quiero** que las páginas privadas sean inaccesibles sin sesión válida,  
**para** garantizar que solo usuarios autenticados accedan a los datos.

**Criterios de aceptación:**
- Si un usuario no autenticado intenta acceder a cualquier URL privada (/dashboard, /historial, etc.), es redirigido automáticamente a /login.
- Si el token de sesión expira, el sistema redirige al Login en la siguiente solicitud.

**Prioridad:** Alta  
**Estimación:** 2 puntos

---

## EP-02 — Registro y seguimiento de glucosa

### HU-05 — Registrar medición de glucosa
**Como** usuario autenticado,  
**quiero** registrar una medición de glucosa con su valor, fecha/hora y una nota opcional,  
**para** llevar un historial detallado de mis niveles.

**Criterios de aceptación:**
- El formulario solicita: valor en mg/dL (obligatorio), fecha y hora (obligatorio), nota (opcional).
- El valor debe estar entre 1 y 600 mg/dL; fuera de ese rango se muestra un error.
- El sistema clasifica automáticamente el registro como Normal, Bajo o Alto según los rangos del perfil del usuario.
- El nuevo registro aparece de inmediato en la tabla del historial sin recargar la página.

**Prioridad:** Alta  
**Estimación:** 3 puntos

---

### HU-06 — Ver historial de mediciones
**Como** usuario autenticado,  
**quiero** ver todos mis registros de glucosa en una tabla ordenada,  
**para** revisar mi historial completo.

**Criterios de aceptación:**
- Los registros se muestran ordenados del más reciente al más antiguo.
- Cada fila muestra: fecha y hora, valor en mg/dL, estado con badge de color, y nota.
- Si no hay registros, se muestra un mensaje indicando que el historial está vacío con un botón para agregar el primero.

**Prioridad:** Alta  
**Estimación:** 2 puntos

---

### HU-07 — Editar un registro existente
**Como** usuario autenticado,  
**quiero** poder corregir un registro de glucosa que ingresé mal,  
**para** mantener mi historial preciso.

**Criterios de aceptación:**
- Cada registro tiene un botón de edición que abre el formulario prellenado con los datos actuales.
- Al guardar, el registro se actualiza sin crear uno nuevo.
- El estado (Normal/Bajo/Alto) se recalcula automáticamente si el valor cambia.

**Prioridad:** Media  
**Estimación:** 2 puntos

---

### HU-08 — Eliminar un registro
**Como** usuario autenticado,  
**quiero** poder eliminar registros erróneos de mi historial,  
**para** mantener la precisión de mis datos.

**Criterios de aceptación:**
- Cada registro tiene un botón de eliminación.
- Antes de eliminar, aparece un diálogo de confirmación con las opciones "Cancelar" y "Eliminar".
- Una vez confirmado, el registro desaparece de la tabla.

**Prioridad:** Media  
**Estimación:** 1 punto

---

### HU-09 — Clasificación automática por estado
**Como** usuario autenticado,  
**quiero** que el sistema clasifique automáticamente cada registro como Normal, Bajo o Alto,  
**para** identificar de un vistazo si mis niveles son adecuados.

**Criterios de aceptación:**
- Normal: el valor está entre rangoObjetivoMin y rangoObjetivoMax del perfil del usuario.
- Bajo: el valor está por debajo de rangoObjetivoMin (hipoglucemia).
- Alto: el valor supera rangoObjetivoMax (hiperglucemia).
- El badge de estado usa colores: verde para Normal, rojo para Bajo, amarillo para Alto.
- La clasificación se realiza en el servidor, no en el cliente.

**Prioridad:** Alta  
**Estimación:** 2 puntos

---

## EP-03 — Dashboard y visualización

### HU-10 — Ver resumen en el Dashboard
**Como** usuario autenticado,  
**quiero** ver un resumen de mis métricas principales al entrar a la app,  
**para** tener una visión rápida de mi estado actual.

**Criterios de aceptación:**
- Se muestran tres tarjetas: última medición (valor y estado), promedio semanal (últimos 7 días) y total de registros.
- Los datos se cargan automáticamente al entrar al Dashboard.
- Si no hay datos suficientes, las tarjetas muestran "—" en lugar de un valor.

**Prioridad:** Alta  
**Estimación:** 3 puntos

---

### HU-11 — Ver gráfica de evolución semanal
**Como** usuario autenticado,  
**quiero** ver una gráfica con la evolución de mi glucosa durante la última semana,  
**para** identificar tendencias y patrones en mis niveles.

**Criterios de aceptación:**
- La gráfica es de tipo línea y muestra los registros de los últimos 7 días.
- El eje X muestra las fechas y el eje Y los valores en mg/dL.
- Se muestran líneas de referencia horizontales para el mínimo y máximo del rango objetivo.
- Si no hay registros en la semana, se muestra el texto "No hay registros esta semana" con un enlace a Agregar registro.

**Prioridad:** Alta  
**Estimación:** 3 puntos

---

### HU-12 — Alertas automáticas de glucosa crítica
**Como** usuario autenticado,  
**quiero** ver una alerta visible cuando mi última medición es crítica,  
**para** tomar acción inmediata ante una hipoglucemia o hiperglucemia.

**Criterios de aceptación:**
- Si la última medición tiene estado "Bajo", aparece un banner rojo en el Dashboard con el mensaje de alerta.
- Si la última medición tiene estado "Alto", aparece un banner amarillo.
- Si la última medición es Normal, no se muestra ninguna alerta.

**Prioridad:** Alta  
**Estimación:** 2 puntos

---

## EP-04 — Recordatorios y alertas

### HU-13 — Crear recordatorio
**Como** usuario autenticado,  
**quiero** crear recordatorios para medicamentos y mediciones,  
**para** no olvidar mis rutinas de control de diabetes.

**Criterios de aceptación:**
- El formulario solicita: tipo (Medicamento, Medición u Otro), hora en formato HH:mm y días de la semana.
- Se debe seleccionar al menos un día; si no, se muestra un error.
- El recordatorio creado aparece de inmediato en la lista.

**Prioridad:** Media  
**Estimación:** 3 puntos

---

### HU-14 — Activar o desactivar un recordatorio
**Como** usuario autenticado,  
**quiero** poder desactivar temporalmente un recordatorio sin eliminarlo,  
**para** pausarlo cuando no lo necesito sin perder la configuración.

**Criterios de aceptación:**
- Cada recordatorio tiene un interruptor (toggle) que muestra su estado: Activo / Inactivo.
- Al cambiar el estado, el cambio se guarda inmediatamente.
- Los recordatorios inactivos se muestran con opacidad reducida.

**Prioridad:** Media  
**Estimación:** 1 punto

---

### HU-15 — Eliminar un recordatorio
**Como** usuario autenticado,  
**quiero** poder eliminar recordatorios que ya no necesito,  
**para** mantener mi lista organizada.

**Criterios de aceptación:**
- Cada recordatorio tiene un botón de eliminación.
- Aparece un diálogo de confirmación antes de eliminar.
- El recordatorio desaparece de la lista tras confirmar.

**Prioridad:** Baja  
**Estimación:** 1 punto

---

## EP-05 — Nutrición y educación

### HU-16 — Consultar guía nutricional
**Como** usuario autenticado,  
**quiero** ver una guía de alimentos clasificados por índice glucémico,  
**para** tomar mejores decisiones alimentarias para controlar mi glucosa.

**Criterios de aceptación:**
- Se muestran tres categorías: Bajo, Medio y Alto índice glucémico.
- Cada categoría tiene una lista de alimentos representativos con ejemplos concretos.
- Los colores de cada categoría son intuitivos: verde para bajo, amarillo para medio, rojo para alto.
- Se incluye un aviso médico indicando que la guía es informativa.

**Prioridad:** Baja  
**Estimación:** 2 puntos

---

### HU-17 — Leer consejos prácticos diarios
**Como** usuario autenticado,  
**quiero** ver consejos prácticos para el control de glucosa,  
**para** mejorar mis hábitos de forma progresiva.

**Criterios de aceptación:**
- Se muestran al menos 6 consejos prácticos relacionados con alimentación, hidratación y ejercicio.
- Cada consejo tiene un título descriptivo y una explicación breve.

**Prioridad:** Baja  
**Estimación:** 1 punto

---

## EP-06 — Configuración de perfil

### HU-18 — Ver y editar perfil
**Como** usuario autenticado,  
**quiero** poder actualizar mi información personal,  
**para** mantener mis datos al día.

**Criterios de aceptación:**
- El usuario puede editar nombre, correo y tipo de diabetes.
- Si el nuevo correo ya está en uso por otro usuario, se muestra un error.
- Al guardar, los cambios se reflejan inmediatamente en la barra lateral.

**Prioridad:** Media  
**Estimación:** 2 puntos

---

### HU-19 — Configurar rangos objetivo de glucosa
**Como** usuario autenticado,  
**quiero** poder personalizar mi rango objetivo de glucosa,  
**para** que las clasificaciones Normal/Bajo/Alto correspondan a mi caso médico específico.

**Criterios de aceptación:**
- El usuario puede establecer un valor mínimo y máximo para su rango objetivo.
- El mínimo debe ser menor que el máximo; de lo contrario, se muestra un error.
- Al guardar los nuevos rangos, todos los registros existentes se reclasifican automáticamente.
- La tarjeta de perfil muestra el rango configurado actualizado.

**Prioridad:** Alta  
**Estimación:** 3 puntos

---

## Resumen de historias

| ID | Historia | Épica | Prioridad | Puntos |
|----|----------|-------|-----------|--------|
| HU-01 | Registro de nuevo usuario | EP-01 | Alta | 3 |
| HU-02 | Inicio de sesión | EP-01 | Alta | 2 |
| HU-03 | Cierre de sesión | EP-01 | Alta | 1 |
| HU-04 | Protección de rutas | EP-01 | Alta | 2 |
| HU-05 | Registrar medición | EP-02 | Alta | 3 |
| HU-06 | Ver historial | EP-02 | Alta | 2 |
| HU-07 | Editar registro | EP-02 | Media | 2 |
| HU-08 | Eliminar registro | EP-02 | Media | 1 |
| HU-09 | Clasificación automática | EP-02 | Alta | 2 |
| HU-10 | Resumen en Dashboard | EP-03 | Alta | 3 |
| HU-11 | Gráfica semanal | EP-03 | Alta | 3 |
| HU-12 | Alertas de glucosa crítica | EP-03 | Alta | 2 |
| HU-13 | Crear recordatorio | EP-04 | Media | 3 |
| HU-14 | Activar/desactivar recordatorio | EP-04 | Media | 1 |
| HU-15 | Eliminar recordatorio | EP-04 | Baja | 1 |
| HU-16 | Guía nutricional | EP-05 | Baja | 2 |
| HU-17 | Consejos prácticos | EP-05 | Baja | 1 |
| HU-18 | Editar perfil | EP-06 | Media | 2 |
| HU-19 | Configurar rangos objetivo | EP-06 | Alta | 3 |
| | **TOTAL** | | | **39 puntos** |
