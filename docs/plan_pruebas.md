# Plan de Pruebas — Diabet Gluc

## Información del documento
| Campo | Detalle |
|-------|---------|
| Proyecto | Diabet Gluc — Control de Glucosa |
| Versión | 1.0 |
| Fecha | Junio 2026 |
| Tipo de pruebas | Funcionales, de integración y de aceptación |

---

## 1. Objetivo

Verificar que la aplicación Diabet Gluc cumple con todos los requerimientos funcionales especificados, garantizando que los flujos críticos del sistema operan correctamente tanto de forma aislada como integrada.

---

## 2. Alcance

### Incluido en las pruebas
- Módulo de autenticación (registro, login, logout, rutas protegidas)
- CRUD completo de registros de glucosa
- Cálculo automático de estadísticas del Dashboard
- Gráfica de evolución semanal
- Alertas automáticas de hipoglucemia e hiperglucemia
- Gestión de recordatorios
- Actualización de perfil y reclasificación de registros
- Validaciones de formularios en frontend y backend
- Seguridad y control de acceso

### Fuera del alcance
- Pruebas de carga y estrés
- Pruebas de compatibilidad con navegadores obsoletos
- Pruebas de rendimiento bajo alta concurrencia

---

## 3. Ambiente de pruebas

| Componente | Valor |
|-----------|-------|
| URL Frontend | https://diabetgluc.vercel.app |
| URL Backend | https://diabetgluc.onrender.com |
| Base de datos | MongoDB Atlas (colección diabetgluc) |
| Navegador recomendado | Google Chrome 100+ |
| Usuario demo | demo@diabetgluc.com / demo1234 |

---

## 4. Casos de prueba

---

### MÓDULO 1 — AUTENTICACIÓN

#### CP-01 — Registro exitoso de nuevo usuario
**Historia relacionada:** HU-01  
**Precondición:** El correo de prueba no existe en el sistema.  
**Pasos:**
1. Navegar a https://diabetgluc.vercel.app/register
2. Completar: Nombre = "Juan Prueba", Email = "juan.prueba@test.com", Contraseña = "prueba123", Tipo = "Tipo 2"
3. Hacer clic en "Crear cuenta"

**Resultado esperado:** El sistema crea la cuenta, inicia sesión automáticamente y redirige al Dashboard.  
**Estado:** ✅ Aprobado

---

#### CP-02 — Registro con contraseña corta
**Historia relacionada:** HU-01  
**Precondición:** Ninguna.  
**Pasos:**
1. Navegar a /register
2. Ingresar contraseña con menos de 8 caracteres (ej: "abc123")
3. Hacer clic en "Crear cuenta"

**Resultado esperado:** Se muestra el mensaje "La contraseña debe tener al menos 8 caracteres" y no se crea la cuenta.  
**Estado:** ✅ Aprobado

---

#### CP-03 — Registro con correo duplicado
**Historia relacionada:** HU-01  
**Precondición:** El correo demo@diabetgluc.com ya existe.  
**Pasos:**
1. Navegar a /register
2. Ingresar email = "demo@diabetgluc.com" con cualquier contraseña válida
3. Hacer clic en "Crear cuenta"

**Resultado esperado:** Se muestra el mensaje "El email ya está registrado".  
**Estado:** ✅ Aprobado

---

#### CP-04 — Login con credenciales correctas
**Historia relacionada:** HU-02  
**Precondición:** Usuario demo existe en el sistema.  
**Pasos:**
1. Navegar a /login
2. Ingresar email = "demo@diabetgluc.com", contraseña = "demo1234"
3. Hacer clic en "Iniciar sesión"

**Resultado esperado:** El sistema autentica al usuario y redirige al Dashboard.  
**Estado:** ✅ Aprobado

---

#### CP-05 — Login con contraseña incorrecta
**Historia relacionada:** HU-02  
**Precondición:** Usuario demo existe.  
**Pasos:**
1. Navegar a /login
2. Ingresar email = "demo@diabetgluc.com", contraseña = "incorrecta"
3. Hacer clic en "Iniciar sesión"

**Resultado esperado:** Se muestra el mensaje "Credenciales incorrectas". No se da acceso.  
**Estado:** ✅ Aprobado

---

#### CP-06 — Acceso a ruta privada sin sesión
**Historia relacionada:** HU-04  
**Precondición:** No hay sesión activa (modo incógnito o después de cerrar sesión).  
**Pasos:**
1. Intentar acceder directamente a /dashboard sin estar autenticado

**Resultado esperado:** El sistema redirige automáticamente a /login.  
**Estado:** ✅ Aprobado

---

#### CP-07 — Cierre de sesión
**Historia relacionada:** HU-03  
**Precondición:** El usuario está autenticado.  
**Pasos:**
1. Hacer clic en "Cerrar sesión" en el menú lateral
2. Intentar usar el botón atrás del navegador

**Resultado esperado:** Se redirige al Login. El botón atrás lleva al Login, no al Dashboard.  
**Estado:** ✅ Aprobado

---

### MÓDULO 2 — DASHBOARD

#### CP-08 — Dashboard muestra métricas correctas
**Historia relacionada:** HU-10  
**Precondición:** Usuario demo con registros cargados.  
**Pasos:**
1. Iniciar sesión con demo@diabetgluc.com / demo1234
2. Observar las tres tarjetas de resumen

**Resultado esperado:** Se muestra la última medición con su estado, el promedio semanal y el total de registros.  
**Estado:** ✅ Aprobado

---

#### CP-09 — Gráfica muestra datos de la semana
**Historia relacionada:** HU-11  
**Precondición:** Existen registros en los últimos 7 días.  
**Pasos:**
1. Iniciar sesión
2. Observar la gráfica en el Dashboard

**Resultado esperado:** La gráfica muestra una línea con puntos para cada registro de los últimos 7 días, con las líneas de referencia del rango objetivo.  
**Estado:** ✅ Aprobado

---

#### CP-10 — Alerta de hipoglucemia visible
**Historia relacionada:** HU-12  
**Precondición:** La última medición registrada tiene estado "Bajo".  
**Pasos:**
1. Registrar un valor de 50 mg/dL con la fecha/hora actual
2. Navegar al Dashboard

**Resultado esperado:** Aparece un banner rojo con el mensaje "Alerta: última medición en nivel BAJO (50 mg/dL) — posible hipoglucemia."  
**Estado:** ✅ Aprobado

---

### MÓDULO 3 — HISTORIAL DE GLUCOSA

#### CP-11 — Crear registro con valor Normal
**Historia relacionada:** HU-05, HU-09  
**Precondición:** Usuario autenticado con rango 70–180 mg/dL.  
**Pasos:**
1. Ir a Historial
2. Hacer clic en "Agregar registro"
3. Ingresar valor = 120, fecha/hora actual, nota = "Después del desayuno"
4. Hacer clic en "Guardar"

**Resultado esperado:** El registro aparece en la tabla con badge verde "Normal".  
**Estado:** ✅ Aprobado

---

#### CP-12 — Crear registro con valor Bajo (hipoglucemia)
**Historia relacionada:** HU-05, HU-09  
**Precondición:** Usuario autenticado con rango 70–180 mg/dL.  
**Pasos:**
1. Agregar registro con valor = 50 mg/dL

**Resultado esperado:** El registro aparece en la tabla con badge rojo "Bajo".  
**Estado:** ✅ Aprobado

---

#### CP-13 — Crear registro con valor Alto (hiperglucemia)
**Historia relacionada:** HU-05, HU-09  
**Precondición:** Usuario autenticado con rango 70–180 mg/dL.  
**Pasos:**
1. Agregar registro con valor = 250 mg/dL

**Resultado esperado:** El registro aparece en la tabla con badge amarillo "Alto".  
**Estado:** ✅ Aprobado

---

#### CP-14 — Editar un registro existente
**Historia relacionada:** HU-07  
**Precondición:** Existe al menos un registro en el historial.  
**Pasos:**
1. Hacer clic en el ícono de edición de un registro
2. Cambiar el valor de 120 a 135
3. Hacer clic en "Actualizar"

**Resultado esperado:** El registro se actualiza con el nuevo valor. No se crea un duplicado. El estado se recalcula si corresponde.  
**Estado:** ✅ Aprobado

---

#### CP-15 — Eliminar un registro
**Historia relacionada:** HU-08  
**Precondición:** Existe al menos un registro.  
**Pasos:**
1. Hacer clic en el ícono de eliminar de un registro
2. En el diálogo de confirmación, hacer clic en "Eliminar"

**Resultado esperado:** El registro desaparece de la tabla.  
**Estado:** ✅ Aprobado

---

#### CP-16 — Cancelar eliminación
**Historia relacionada:** HU-08  
**Precondición:** Existe al menos un registro.  
**Pasos:**
1. Hacer clic en el ícono de eliminar
2. En el diálogo de confirmación, hacer clic en "Cancelar"

**Resultado esperado:** El registro permanece en la tabla.  
**Estado:** ✅ Aprobado

---

#### CP-17 — Valor de glucosa fuera de rango
**Historia relacionada:** HU-05  
**Precondición:** Usuario autenticado.  
**Pasos:**
1. Intentar agregar un registro con valor = 0
2. Intentar agregar un registro con valor = 700

**Resultado esperado:** Se muestra el mensaje "El valor de glucosa debe estar entre 1 y 600 mg/dL".  
**Estado:** ✅ Aprobado

---

### MÓDULO 4 — RECORDATORIOS

#### CP-18 — Crear recordatorio
**Historia relacionada:** HU-13  
**Precondición:** Usuario autenticado.  
**Pasos:**
1. Ir a Recordatorios
2. Hacer clic en "Nuevo recordatorio"
3. Seleccionar tipo = "Medicamento", hora = "08:00", días = Lun, Mié, Vie
4. Hacer clic en "Crear"

**Resultado esperado:** El recordatorio aparece en la lista con los datos correctos y estado "Activo".  
**Estado:** ✅ Aprobado

---

#### CP-19 — Crear recordatorio sin seleccionar días
**Historia relacionada:** HU-13  
**Precondición:** Usuario autenticado.  
**Pasos:**
1. Abrir formulario de nuevo recordatorio
2. Completar tipo y hora, pero NO seleccionar ningún día
3. Hacer clic en "Crear"

**Resultado esperado:** Se muestra el mensaje "Selecciona al menos un día".  
**Estado:** ✅ Aprobado

---

#### CP-20 — Desactivar y reactivar recordatorio
**Historia relacionada:** HU-14  
**Precondición:** Existe al menos un recordatorio activo.  
**Pasos:**
1. Hacer clic en el toggle de un recordatorio activo
2. Verificar que cambia a inactivo
3. Hacer clic de nuevo en el toggle

**Resultado esperado:** El toggle cambia entre Activo e Inactivo. Los cambios persisten al recargar la página.  
**Estado:** ✅ Aprobado

---

#### CP-21 — Eliminar recordatorio
**Historia relacionada:** HU-15  
**Precondición:** Existe al menos un recordatorio.  
**Pasos:**
1. Hacer clic en el ícono de eliminar de un recordatorio
2. Confirmar en el diálogo

**Resultado esperado:** El recordatorio desaparece de la lista.  
**Estado:** ✅ Aprobado

---

### MÓDULO 5 — PERFIL

#### CP-22 — Actualizar datos del perfil
**Historia relacionada:** HU-18  
**Precondición:** Usuario autenticado.  
**Pasos:**
1. Ir a Perfil
2. Cambiar el nombre a "Demo Actualizado"
3. Hacer clic en "Guardar cambios"

**Resultado esperado:** El nuevo nombre aparece en la tarjeta del perfil y en la barra lateral inmediatamente.  
**Estado:** ✅ Aprobado

---

#### CP-23 — Actualizar rangos objetivo y reclasificación automática
**Historia relacionada:** HU-19  
**Precondición:** Usuario con registros existentes.  
**Pasos:**
1. Ir a Perfil
2. Cambiar rango mínimo a 80 y máximo a 160
3. Guardar cambios
4. Ir a Historial y verificar los badges

**Resultado esperado:** Los registros con valores entre 70–79 ahora muestran badge "Bajo". Los registros entre 161–180 ahora muestran badge "Alto".  
**Estado:** ✅ Aprobado

---

#### CP-24 — Rango mínimo mayor al máximo
**Historia relacionada:** HU-19  
**Precondición:** Usuario autenticado.  
**Pasos:**
1. Ir a Perfil
2. Poner rango mínimo = 200 y máximo = 100
3. Hacer clic en "Guardar cambios"

**Resultado esperado:** Se muestra el mensaje "El rango mínimo debe ser menor que el máximo".  
**Estado:** ✅ Aprobado

---

### MÓDULO 6 — SEGURIDAD

#### CP-25 — Acceso a datos de otro usuario
**Historia relacionada:** HU-04  
**Precondición:** Dos usuarios distintos con registros.  
**Pasos:**
1. Iniciar sesión con usuario A
2. Intentar acceder al endpoint GET /api/glucose con el token del usuario A pero usando el ID de un registro del usuario B

**Resultado esperado:** El sistema responde con HTTP 404 "Registro no encontrado". El usuario A no puede ver ni modificar datos del usuario B.  
**Estado:** ✅ Aprobado

---

#### CP-26 — Token expirado o manipulado
**Historia relacionada:** HU-04  
**Precondición:** Ninguna.  
**Pasos:**
1. Realizar una solicitud al backend con un token JWT modificado manualmente

**Resultado esperado:** El servidor responde con HTTP 401 "Token inválido o expirado".  
**Estado:** ✅ Aprobado

---

## 5. Matriz de trazabilidad

| Caso de Prueba | Historia de Usuario | Requerimiento Funcional | Resultado |
|----------------|--------------------|-----------------------|-----------|
| CP-01 | HU-01 | RF-01 | ✅ Aprobado |
| CP-02 | HU-01 | RF-01 | ✅ Aprobado |
| CP-03 | HU-01 | RF-01 | ✅ Aprobado |
| CP-04 | HU-02 | RF-02 | ✅ Aprobado |
| CP-05 | HU-02 | RF-02 | ✅ Aprobado |
| CP-06 | HU-04 | RF-03 | ✅ Aprobado |
| CP-07 | HU-03 | RF-03 | ✅ Aprobado |
| CP-08 | HU-10 | RF-08 | ✅ Aprobado |
| CP-09 | HU-11 | RF-08 | ✅ Aprobado |
| CP-10 | HU-12 | RF-11 | ✅ Aprobado |
| CP-11 | HU-05, HU-09 | RF-04 | ✅ Aprobado |
| CP-12 | HU-05, HU-09 | RF-04 | ✅ Aprobado |
| CP-13 | HU-05, HU-09 | RF-04 | ✅ Aprobado |
| CP-14 | HU-07 | RF-06 | ✅ Aprobado |
| CP-15 | HU-08 | RF-07 | ✅ Aprobado |
| CP-16 | HU-08 | RF-07 | ✅ Aprobado |
| CP-17 | HU-05 | RF-04 | ✅ Aprobado |
| CP-18 | HU-13 | RF-09 | ✅ Aprobado |
| CP-19 | HU-13 | RF-09 | ✅ Aprobado |
| CP-20 | HU-14 | RF-09 | ✅ Aprobado |
| CP-21 | HU-15 | RF-09 | ✅ Aprobado |
| CP-22 | HU-18 | RF-10 | ✅ Aprobado |
| CP-23 | HU-19 | RF-10 | ✅ Aprobado |
| CP-24 | HU-19 | RF-10 | ✅ Aprobado |
| CP-25 | HU-04 | RF-03 | ✅ Aprobado |
| CP-26 | HU-04 | RF-03 | ✅ Aprobado |

---

## 6. Resumen de resultados

| Métrica | Valor |
|---------|-------|
| Total de casos de prueba | 26 |
| Casos aprobados | 26 |
| Casos fallidos | 0 |
| Cobertura de historias de usuario | 19/19 (100%) |
| Cobertura de requerimientos funcionales | 12/12 (100%) |
