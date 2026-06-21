# Manual de Usuario — Diabet Gluc

## Información del documento
| Campo | Detalle |
|-------|---------|
| Proyecto | Diabet Gluc — Control de Glucosa |
| Versión | 1.0 |
| Fecha | Junio 2026 |
| Dirigido a | Pacientes con diabetes y personas a cargo de su control glucémico |

---

## ¿Qué es Diabet Gluc?

Diabet Gluc es una aplicación web gratuita para llevar el control de tu glucosa en sangre. Puedes usarla desde cualquier navegador (Chrome, Firefox, Safari, Edge) en computador, tablet o celular, sin necesidad de instalar nada.

**Acceso:** https://diabetgluc.vercel.app

---

## Primeros pasos

### Crear una cuenta

Si es la primera vez que usas la aplicación, debes crear una cuenta:

1. Entra a https://diabetgluc.vercel.app
2. Haz clic en **"Regístrate aquí"**
3. Completa el formulario:
   - **Nombre completo:** tu nombre real
   - **Email:** tu correo electrónico (este será tu usuario)
   - **Contraseña:** mínimo 8 caracteres
   - **Tipo de diabetes:** selecciona Tipo 1, Tipo 2 u Otro
4. Haz clic en **"Crear cuenta"**

Si todo está correcto, entrarás automáticamente al Dashboard.

> **Nota de seguridad:** Tu contraseña se guarda cifrada. Ni el equipo de desarrollo puede verla. Si la olvidas, deberás crear una cuenta nueva.

---

### Iniciar sesión

Si ya tienes cuenta:

1. Ingresa tu correo y contraseña
2. Haz clic en **"Iniciar sesión"**

Si la contraseña es incorrecta, verás el mensaje **"Credenciales incorrectas"**. Revisa que el correo y la contraseña estén bien escritos.

Tu sesión se mantiene activa durante 7 días. Después de ese tiempo, el sistema te pedirá iniciar sesión de nuevo.

---

### Cerrar sesión

En la parte inferior del menú lateral encontrarás el botón **"Cerrar sesión"**. Haz clic ahí cuando termines de usar la aplicación, especialmente en dispositivos compartidos.

---

## El menú de navegación

Una vez dentro, verás una barra lateral a la izquierda con las siguientes secciones:

| Sección | ¿Qué encuentras ahí? |
|---------|---------------------|
| **Dashboard** | Resumen de tu glucosa, gráfica semanal y accesos rápidos |
| **Historial** | Todos tus registros de glucosa |
| **Recordatorios** | Alertas para medicamentos y mediciones |
| **Nutrición** | Guía de alimentos por índice glucémico |
| **Perfil** | Tus datos personales y rangos objetivo |

---

## Dashboard

El Dashboard es la pantalla principal que ves al iniciar sesión. Tiene tres partes:

### Tarjetas de resumen
- **Última medición:** el valor más reciente que registraste, con su estado (Normal, Bajo o Alto).
- **Promedio semanal:** el promedio de todos tus registros de los últimos 7 días.
- **Registros totales:** el total de mediciones que tienes guardadas.

### Alertas automáticas
Si tu última medición está fuera de tu rango objetivo, verás una alerta en la parte superior:
- **Banner rojo:** nivel BAJO (hipoglucemia) — actúa rápidamente, consume algo con azúcar.
- **Banner amarillo:** nivel ALTO (hiperglucemia) — consulta con tu médico si persiste.

### Gráfica de la última semana
Muestra una línea con la evolución de tus niveles de glucosa durante los últimos 7 días. Las líneas punteadas indican tu rango objetivo (mínimo y máximo).

Si no tienes registros esta semana, verás el mensaje "No hay registros esta semana" con un botón para agregar uno.

### Accesos rápidos
Cuatro botones de colores que te llevan directamente a Historial, Recordatorios, Nutrición y Perfil.

---

## Historial de Glucosa

Esta sección muestra todos tus registros en una tabla organizada del más reciente al más antiguo.

### ¿Qué significa cada columna?

| Columna | Descripción |
|---------|-------------|
| **Fecha y hora** | Cuándo se tomó la medición |
| **Valor** | La glucosa en mg/dL |
| **Estado** | Normal (verde), Bajo (rojo) o Alto (amarillo) |
| **Nota** | Comentario opcional que agregaste |
| **Acciones** | Botones para editar o eliminar |

### Agregar un registro

1. Haz clic en el botón **"Agregar registro"** (esquina superior derecha)
2. Completa el formulario:
   - **Valor (mg/dL):** el número que marcó tu glucómetro (entre 1 y 600)
   - **Fecha y hora:** cuándo tomaste la medición (por defecto es la hora actual)
   - **Nota (opcional):** por ejemplo "Antes del desayuno", "Post ejercicio"
3. Haz clic en **"Guardar"**

El sistema clasifica automáticamente el registro según tu rango objetivo configurado en el Perfil.

### Editar un registro

1. Haz clic en el ícono de lápiz ✏️ del registro que quieres corregir
2. Modifica los datos necesarios
3. Haz clic en **"Actualizar"**

El registro se actualiza sin crear uno duplicado.

### Eliminar un registro

1. Haz clic en el ícono de papelera 🗑️
2. En la ventana de confirmación, haz clic en **"Eliminar"**

> ⚠️ Esta acción es permanente y no se puede deshacer.

### ¿Qué significan los colores del estado?

| Color | Estado | Significado |
|-------|--------|-------------|
| 🟢 Verde | Normal | El valor está dentro de tu rango objetivo |
| 🔴 Rojo | Bajo | El valor está por debajo del mínimo (hipoglucemia) |
| 🟡 Amarillo | Alto | El valor supera el máximo (hiperglucemia) |

Los rangos que definen estos estados los configuras tú en la sección **Perfil**.

---

## Recordatorios

En esta sección puedes crear alertas para no olvidar tus rutinas de control de diabetes.

### Crear un recordatorio

1. Haz clic en **"Nuevo recordatorio"**
2. Completa el formulario:
   - **Tipo:** Medicamento, Medición u Otro
   - **Hora:** a qué hora quieres que te recuerdes (formato 24 horas)
   - **Días:** selecciona los días de la semana en que aplica
3. Haz clic en **"Crear"**

> ℹ️ Debes seleccionar al menos un día para poder guardar el recordatorio.

### Activar o desactivar un recordatorio

Cada recordatorio tiene un interruptor a la derecha. Puedes desactivarlo temporalmente sin eliminarlo — útil para pausar recordatorios en vacaciones o períodos especiales.

### Eliminar un recordatorio

Haz clic en el ícono de papelera 🗑️ del recordatorio y confirma la eliminación.

---

## Nutrición

Esta sección tiene información para ayudarte a tomar mejores decisiones alimentarias.

### Alimentos por índice glucémico

Los alimentos están organizados en tres categorías según cómo afectan tu glucosa:

| Categoría | Color | Qué significa |
|-----------|-------|---------------|
| **IG Bajo (< 55)** | Verde | Se absorben lentamente; mantienen la glucosa estable |
| **IG Medio (55–70)** | Amarillo | Efecto moderado; consumir con moderación |
| **IG Alto (> 70)** | Rojo | Se absorben rápido; pueden elevar la glucosa bruscamente |

### Consejos prácticos

Debajo de la clasificación de alimentos encontrarás 6 consejos prácticos sobre hábitos alimentarios, hidratación y ejercicio que ayudan a controlar la glucosa.

> ⚕️ **Aviso médico:** La información de esta sección es orientativa. No reemplaza la consulta con tu médico o nutricionista. Siempre consulta con tu equipo médico antes de hacer cambios en tu dieta.

---

## Perfil

En esta sección puedes actualizar tu información personal y configurar tus rangos objetivo de glucosa.

### Actualizar información personal

Puedes cambiar:
- **Nombre completo**
- **Correo electrónico**
- **Tipo de diabetes**

Haz clic en **"Guardar cambios"** para aplicar las modificaciones.

### Configurar rangos objetivo de glucosa

Los rangos objetivo son los valores entre los cuales tu glucosa debe estar. Estos rangos son personales y deben ser indicados por tu médico.

- **Mínimo:** valor por debajo del cual se considera hipoglucemia (por defecto: 70 mg/dL)
- **Máximo:** valor por encima del cual se considera hiperglucemia (por defecto: 180 mg/dL)

> ⚠️ Al guardar nuevos rangos, **todos tus registros históricos** se reclasifican automáticamente según los nuevos valores. Esto puede cambiar los colores que ves en el Historial.

---

## Preguntas frecuentes

**¿Mis datos están seguros?**  
Sí. La aplicación usa conexiones cifradas (HTTPS), las contraseñas se guardan con cifrado seguro (bcrypt) y solo tú puedes ver tus datos. Ningún otro usuario puede acceder a tu información.

**¿Puedo usar la app en el celular?**  
Sí. La interfaz se adapta automáticamente a pantallas pequeñas. Se recomienda usar el navegador Chrome en Android o Safari en iPhone.

**¿La app envía notificaciones al celular?**  
No. Los recordatorios son visuales dentro de la aplicación. Para recibir notificaciones externas, deberías dejar la app abierta en el navegador.

**¿Qué pasa si la app tarda mucho en cargar?**  
El servidor puede tardar hasta 30 segundos en responder después de un período de inactividad (esto es normal en el plan gratuito). Si después de 30 segundos sigue sin cargar, recarga la página.

**¿Puedo tener varias cuentas?**  
Sí, pero cada cuenta requiere un correo diferente. No es posible que dos cuentas usen el mismo correo.

**¿Cómo sé si mi sesión expiró?**  
Si al intentar usar la app te redirige al Login sin que hayas cerrado sesión, es porque tu sesión expiró (después de 7 días). Simplemente vuelve a iniciar sesión.

**¿Puedo cambiar mi contraseña?**  
En la versión actual, no hay opción de cambio de contraseña. Si olvidaste tu contraseña, deberás crear una cuenta nueva con otro correo.

---

## Rangos de glucosa de referencia

> Estos son valores de referencia general. Tu médico puede indicarte rangos diferentes según tu caso específico.

| Momento | Rango normal (mg/dL) |
|---------|---------------------|
| En ayunas | 70 – 100 |
| 2 horas después de comer | Menos de 140 |
| Antes de dormir | 100 – 140 |

| Estado | Valor |
|--------|-------|
| Hipoglucemia | Menos de 70 mg/dL |
| Normal | 70 – 180 mg/dL |
| Hiperglucemia | Más de 180 mg/dL |

---

## Información de contacto y soporte

- **URL de la aplicación:** https://diabetgluc.vercel.app
- **Repositorio del proyecto:** https://github.com/gjuaneth/diabetgluc
- **Usuario de demostración:** demo@diabetgluc.com / demo1234
