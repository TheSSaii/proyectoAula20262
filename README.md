# 🏟️ CanchaYa — Extensión Móvil de Cátedras y Actividades ACUDE (TdeA)

> **Tecnológico de Antioquia (TdeA) — Institución Universitaria**  
> **Curso:** Desarrollo Móvil | **Periodo:** 2026-2  
> **Unidad Responsable:** Bienestar Institucional (Campus Robledo)  
> **Sistema Base Complementado:** Portal Web Campus TdeA

---

## 1. Identidad y Objetivo del Sistema

**CanchaYa** conserva su nombre e identidad visual dentro del Tecnológico de Antioquia, consolidándose como la **extensión móvil complementaria del portal institucional Campus TdeA**.

Mientras que la matrícula académica y la gestión oficial global de los estudiantes se centraliza en la plataforma web **Campus TdeA**, **CanchaYa** opera como la herramienta de bolsillo para la comunidad estudiantil del **Campus Robledo**, permitiendo:
1. **Consultar el catálogo oficial de Cátedras y Talleres ACUDE** (Actividades Culturales y Deportivas) organizadas por Bienestar Institucional.
2. **Revisar franjas horarias semanales fijas** para evitar colisiones y cruces con la carga académica matriculada en Campus TdeA.
3. **Inscribirse de forma atómica** en los cupos oficiales disponibles por taller.
4. **Gestionar la asistencia y el sobrecupo presencial directo en campus**: orientación operativa clara sobre el lugar exacto y el docente a cargo para solicitar sobrecupo presencial en caso de que otros estudiantes matriculados liberen sus cupos por inasistencia o deserción.

---

##  2. Reglas de Negocio Críticas (ACUDE TdeA)

### A. Franjas Semanales Fijas (No Alquiler por Horas)
Las cátedras ACUDE no se alquilan por turnos sueltos ni funcionan como reservas comerciales de canchas. Tienen **encuentros semanales recurrentes fijos** durante todo el semestre académico (ej. *Martes y Jueves de 14:00 a 16:00*). La visualización de la agenda semanal en la app permite contrastar de inmediato los días de práctica con el horario de materias registrado en Campus TdeA.

### B. Reglamento de Asistencia y Liberación de Cupos
Conforme al reglamento de Bienestar Institucional:
- Se exige un **mínimo del 80% de asistencia** para acreditar horas o créditos extracurriculares.
- Si un estudiante matriculado incurre en inasistencias reiteradas o deserta, **su curso se cancela administrativamente y el cupo queda liberado**.

### C. Sobrecupo Presencial Directo con el Docente (Sin Trámites en Oficinas)
Cuando una actividad tiene sus cupos virtuales agotados en la app o en Campus TdeA:
- El estudiante **no tiene que hacer filas ni trámites burocráticos** en oficinas administrativas de Bienestar.
- Simplemente consulta en CanchaYa el **cronograma, día, docente responsable y espacio físico exacto dentro del Bloque 10**.
- Se presenta de forma presencial en la **primera sesión de clase** directamente con el profesor en el aula/escenario, solicitando autorización de sobrecupo para ocupar los cupos liberados por estudiantes ausentes o que cancelaron su matrícula.

---

##  3. Mapeo Oficial de Espacios en Campus Robledo

El campus Robledo del TdeA se organiza en bloques numerados del **1 al 13**. Las Cátedras ACUDE de Bienestar Institucional tienen su epicentro en el **Bloque 10**:

| Cátedra ACUDE | Categoría | Espacio Físico (Campus Robledo) | Horario Semanal Fijo | Docente a Cargo |
|---|---|---|---|---|
| **Fútbol Sala Formativo y Representativo** | Deportiva | Bloque 10 — Coliseo Institucional | Mar y Jue · 14:00 - 16:00 | Lic. Carlos Mario Restrepo |
| **Danza Folclórica y Expresión Tradicional** | Cultural | Bloque 10 — Salón de Expresión Cultural | Lun y Mié · 16:00 - 18:00 | Prof. María Elena Morales |
| **Acondicionamiento Físico y Salud** | Deportiva | Bloque 10 — Gimnasio Bienestar (Piso 2) | Lun y Mié · 08:00 - 10:00 | Lic. Andrés Felipe Henao |
| **Voleibol Formativo Mixto** | Deportiva | Bloque 10 — Coliseo / Placa Externa | Mié y Vie · 14:00 - 16:00 | Lic. Juan David Gómez |
| **Tenis de Mesa y Concentración** | Deportiva | Bloque 10 — Área Multideportiva (Nivel 1) | Mar y Jue · 10:00 - 12:00 | Prof. Gabriel Jaime Montoya |
| **Teatro, Cuentería y Expresión Oral** | Cultural | Bloque 10 — Auditorio Gilberto Echeverri Mejía | Viernes · 14:00 - 18:00 | Maestra Laura Restrepo |

---

##  4. Stack Tecnológico

| Capa / Herramienta | Tecnología | Versión / Detalle |
|---|---|---|
| **Framework Móvil** | React Native + Expo | SDK 54 (`~54.0.36`) |
| **Persistencia en la Nube** | Cloud Firestore | SDK Modular v12 (Tree-shakeable, transacciones atómicas `runTransaction`) |
| **Autenticación** | Firebase Auth | Email & Password con persistencia nativa en AsyncStorage |
| **Persistencia Local** | AsyncStorage | `@react-native-async-storage/async-storage` (v2.2.0) |
| **Navegación** | React Navigation | v7 (`@react-navigation/native`, `/stack`, `/bottom-tabs`) |
| **Gestión de Estado** | React Context API | `AuthContexto` con sincronización de estado de sesión |
| **Estilos y Diseño** | StyleSheet Nativo | Paleta semántica accesible e institucional (sin dependencias externas pesadas) |

---

## 5. Arquitectura del Proyecto

El repositorio implementa una arquitectura modular por capas desacopladas donde la interfaz de usuario nunca ejecuta consultas directas a la base de datos:

```text
canchaYa/
├── components/                       # Componentes visuales atómicos y moleculares
│   ├── AcudeCard.js                  # Tarjeta de cátedra ACUDE (aforo, horario, badges, docente)
│   ├── Badge.js                      # Píldora semántica (cupos disponibles, agotado, inscrito, categorías)
│   ├── DateSelector.js               # Selector semanal interactivo para evitar cruces con Campus TdeA
│   └── SlotPicker.js                 # Visualizador de franjas horarias y sesiones fijas en Bloque 10
│
├── contexts/                         # Estado global reactivo
│   └── AuthContexto.js               # Provider y hook useAuth() con onAuthStateChanged y AsyncStorage
│
├── navigation/                       # Enrutamiento robusto con React Navigation v7
│   ├── AppNavigator.js               # Enrutador condicional raíz (AuthStack <-> Tabs)
│   ├── AuthStack.js                  # Pila de autenticación: LoginScreen <-> RegistroScreen
│   ├── NavegacionStack.js            # Pila operativa: Inicio -> Detalle -> Horarios
│   └── Tabs.js                       # Bottom Tabs: Cátedras ACUDE, Mis Inscripciones, Perfil
│
├── screens/                          # Pantallas completas del sistema
│   ├── InicioScreen.js               # Catálogo con FlatList, chips y buscador fuera del listado
│   ├── DetalleScreen.js              # Ficha técnica, regla del 80%, enlace a horarios y matrícula atómica
│   ├── HorariosScreen.js             # Agenda semanal detallada y guía de sobrecupo presencial con el docente
│   ├── MisInscripcionesScreen.js     # Gestión de cátedras matriculadas y cancelación con liberación de cupo
│   ├── PerfilScreen.js               # Información del estudiante, sincronización y cierre de sesión
│   ├── LoginScreen.js                # Acceso institucional con validaciones y textos seguros
│   └── RegistroScreen.js             # Registro de cuenta estudiantil TdeA
│
├── services/                         # Capa de datos desacoplada (Data Layer)
│   ├── firebaseConfig.js             # Inicialización centralizada con variables EXPO_PUBLIC_*
│   ├── authService.js                # Métodos de autenticación y mapeo de errores en español
│   ├── acudesService.js              # Consultas getAcudes() y getAcudeById() a Firestore
│   ├── disponibilidadService.js      # getHorariosAcude(): cronograma semanal y metadata operativa
│   ├── inscripcionesService.js       # inscribirEstudiante() y cancelarInscripcion() con runTransaction
│   └── seedAcudes.js                 # Siembra idempotente de las 6 cátedras reales del Bloque 10
│
├── App.js                            # Punto de entrada con AuthProvider y NavigationContainer
├── package.json                      # Dependencias y scripts de Expo
└── README.md                         # Documentación técnica maestra
```

---

## 6. Modelo de Datos en Cloud Firestore

### Colección: `acudes`
Documento representativo de una Cátedra o Taller formativo:
```json
{
  "id": "acude-futsal",
  "nombre": "Fútbol Sala Formativo y Representativo",
  "categoria": "Deportiva",
  "disciplina": "Fútbol Sala",
  "docente": "Lic. Carlos Mario Restrepo",
  "ubicacion": "Campus Robledo - Bloque 10 (Coliseo Institucional)",
  "cupoTotal": 25,
  "cuposDisponibles": 8,
  "estado": "disponible",
  "descripcion": "Taller formativo de técnica individual, táctica colectiva y acondicionamiento aeróbico...",
  "requisitos": "Carné estudiantil TdeA vigente, calzado para maderamen e hidratación.",
  "asistenciaMinima": "80% de asistencia obligatoria. Inasistencias reiteradas liberan el cupo.",
  "notaPresencial": "Si los cupos están agotados, preséntate en el Coliseo en la primera sesión con el docente.",
  "horarios": [
    { "dia": "Martes", "horaInicio": "14:00", "horaFin": "16:00", "lugar": "Bloque 10 - Coliseo Institucional" },
    { "dia": "Jueves", "horaInicio": "14:00", "horaFin": "16:00", "lugar": "Bloque 10 - Coliseo Institucional" }
  ],
  "imagenUrl": "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800",
  "actualizadoEn": "Timestamp"
}
```

### Colección: `inscripciones`
Documento generado mediante transacción atómica que vincula al estudiante con la cátedra:
```json
{
  "id": "auto_id_firestore",
  "idUsuario": "uid_estudiante_firebase_auth",
  "emailUsuario": "estudiante@tdea.edu.co",
  "nombreUsuario": "Juan Pérez",
  "idAcude": "acude-futsal",
  "nombreAcude": "Fútbol Sala Formativo y Representativo",
  "categoria": "Deportiva",
  "docente": "Lic. Carlos Mario Restrepo",
  "ubicacion": "Campus Robledo - Bloque 10 (Coliseo Institucional)",
  "horarios": [ ... ],
  "estado": "activa",
  "fechaInscripcion": "2026-09-08 22:30:00",
  "asistenciaMinima": "80% de asistencia obligatoria"
}
### Colección: `users`
Perfil institucional del estudiante en Firestore (vinculado con su UID de Firebase Auth, sin exponer contraseñas):
```json
{
  "uid": "uid_estudiante_firebase_auth",
  "email": "estudiante@tdea.edu.co",
  "nombre": "Juan Pérez",
  "rol": "estudiante",
  "institucion": "Tecnológico de Antioquia",
  "sede": "Campus Robledo",
  "creadoEn": "Timestamp",
  "actualizadoEn": "Timestamp"
}
```

---

##  7. Puesta en Marcha (Instalación y Ejecución)

### Requisitos previos:
- **Node.js**: Versión LTS (v20 o superior).
- **Dispositivo móvil**: Con la app **Expo Go** instalada (Android o iOS) o un simulador/emulador configurado.
- Variables de entorno en `.env` (guíate con `.env.example`).

### Paso a paso:

```bash
# 1. Instalar dependencias del proyecto
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Completa tus claves de Firebase en .env

# 3. Iniciar el servidor de desarrollo de Expo
npx expo start
```

### Opciones de ejecución:
- **En tu dispositivo físico:** Escanea el código QR que genera la terminal usando Expo Go (Android) o la cámara (iOS).
- **En Emulador Android:** Presiona la tecla `a`.
- **En Simulador iOS:** Presiona la tecla `i`.
- **Recarga rápida (Fast Refresh):** Presiona la tecla `r`.

### Siembra inicial de datos (Seed):
Si ejecutas la app por primera vez con una base de datos vacía, en la pantalla principal (`InicioScreen`) o en `PerfilScreen` encontrarás el botón:
> **  Cargar Cátedras ACUDE TdeA (Seed)**  
Al pulsarlo, se insertarán automáticamente las 6 cátedras reales del campus Robledo con sus horarios, docentes y espacios del Bloque 10 de forma 100% idempotente (`setDoc` con `{ merge: true }`).

---

## 8. Criterios de Aceptación y Estado de la Rúbrica

### A. Funcionalidad Base
- [x] **Aislamiento de usuario:** El usuario visualiza únicamente sus propias reservas (`idUsuario == request.auth.uid`).
- [ ] **Reprogramación atómica:** La reprogramación actualiza correctamente fecha y hora en Firestore, y libera la franja anterior.
- [ ] **Validación de disponibilidad:** El sistema impide reprogramar hacia una franja no disponible o ya ocupada.
- [x] **Cancelación y liberación:** La cancelación cambia el estado de la reserva a `cancelada` y libera el cupo en la franja (`+1`).
- [ ] **Visualización de estados:** Los estados de la reserva (`activa`, `cancelada`, `reprogramada`, `pendiente_sincronizacion`) se visualizan de forma clara y consistente en todas las pantallas.
- [x] **Navegación estable:** Flujo consistente entre reservar, mis reservas y detalle de la cátedra sin fugas de memoria.

### B. Modo Offline
- [ ] **Visibilidad sin conexión:** El listado de cátedras, la disponibilidad descargada y el módulo "Mis reservas" siguen visibles offline vía caché local.
- [ ] **Indicador de conectividad:** La app muestra un indicador visual y permanente del estado de la conexión en cabecera.
- [ ] **Cola de acciones pendientes:** Las acciones ejecutadas sin red se guardan localmente y se marcan como `"pendiente por sincronizar"`.
- [ ] **Advertencia preventiva:** La app advierte al usuario que una reserva creada sin conexión queda sujeta a confirmación al sincronizar.
- [ ] **Sincronización automática:** Al recuperar la conexión, las acciones pendientes se envían a Firestore y el indicador desaparece.
- [ ] **Estabilidad sin red:** La app no se bloquea, no muestra pantallas en blanco ni entra en bucles de carga infinita sin internet.
- [ ] **Aislamiento por usuario:** Los datos locales están asociados al usuario autenticado y se limpian al cerrar sesión.

### C. Funcionalidad Emergente (FE-01)
> *[Espacio reservado para documentar el hallazgo propio seleccionado por el equipo]*
> 
> * **Problema que resuelve:** [A definir por el equipo]
> * **Quién lo reportó (Trazabilidad con entregable 1):** [A definir según docs/investigación/]
> * **Cómo se implementó:** [Componente / Pantalla / Servicio]
> * **Regla Offline:** [Comportamiento o degradación controlada sin red]

---

## 9. Asignación de Tareas del Equipo (Roadmap 4 Desarrolladores)

### Santiago — Persistencia Local & Caché Offline (Data Layer)
* **Responsabilidad:** Garantizar que la app nunca se quede en blanco sin internet y los datos persistan localmente.
* **Criterios de Aceptación Asignados:**
  - [ ] Listado de cátedras, horarios y "Mis reservas" visibles sin conexión vía caché local.
  - [ ] La app no se bloquea ni muestra pantalla de error al abrir sin red (estrategia Cache-First).
  - [ ] Los datos en caché están asociados al `uid` del usuario y se borran de `AsyncStorage` al hacer `logout`.
* **Archivos a modificar/crear:**
  - `services/storageService.js` *(Nuevo: operaciones `guardarEnCache`, `obtenerDeCache`, `limpiarCacheUsuario`)*
  - `services/acudesService.js` *(Fallback local en `getAcudes()` si Firestore no responde)*
  - `services/inscripcionesService.js` *(Fallback local en `getMisInscripciones()`)*
  - `contexts/AuthContexto.js` *(Invocar limpieza de caché al cerrar sesión)*

---

### Simon — Conectividad, Sincronización & Cola Offline (Sync Layer)
* **Responsabilidad:** Monitorear el estado de red, mostrar avisos visuales y procesar acciones pendientes diferidas.
* **Criterios de Aceptación Asignados:**
  - [ ] Indicador permanente y visible del estado de conexión (Banner/Badge superior).
  - [ ] Registro local de reservas/cancelaciones sin red con marca "pendiente por sincronizar".
  - [ ] Alerta de confirmación advirtiendo que la reserva offline queda sujeta a sincronización.
  - [ ] Disparo automático de la cola hacia Firestore al detectar reconexión a internet.
* **Archivos a modificar/crear:**
  - `contexts/NetworkContext.js` *(Nuevo: listener de `@react-native-community/netinfo`)*
  - `components/NetworkBanner.js` *(Nuevo: banner visual de estado de conexión)*
  - `services/syncQueueService.js` *(Nuevo: lógica de encolado, persistencia y despacho de acciones)*
  - `App.js` *(Integración del `NetworkProvider` y del `NetworkBanner`)*

---

### Kenner — Lógica Transaccional de Reprogramación (Backend / Firestore)
* **Responsabilidad:** Asegurar la integridad matemática y concurrente al cambiar de horario en la base de datos.
* **💡 Nota de avance:** La validación de disponibilidad y el decremento (`-1`) ya están construidos en `inscribirEstudiante()`, y la liberación (`+1`) ya existe en `cancelarInscripcion()`. El trabajo consiste en combinarlas en una sola transacción atómica (`runTransaction`).
* **Criterios de Aceptación Asignados:**
  - [ ] Crear la función `reprogramarInscripcion()` en `services/inscripcionesService.js` con `runTransaction`.
  - [ ] Reutilizar e integrar en una sola transacción la liberación (+1) de la franja anterior y el decremento (-1) de la nueva franja.
  - [ ] Reutilizar el bloqueo estricto ya existente que impide reprogramar hacia horarios sin cupos o agotados.
  - [ ] Soporte de estados de reserva persistidos: `activa`, `cancelada`, `reprogramada`, `pendiente_sincronizacion`.
* **Archivos a modificar/crear:**
  - `services/inscripcionesService.js` *(Implementar función `reprogramarInscripcion()` combinando la lógica de las líneas 149-175 y 341-352)*
  - `services/disponibilidadService.js` *(Validación de aforo por franja específica)*
  - `firestore.rules` *(Garantizar reglas de update para la reprogramación del usuario)*

---

### El goat — UI de Reprogramación, Estados & Control FE-01 (UI/UX)
* **Responsabilidad:** Diseñar la interacción del usuario para cambiar de horario y asegurar consistencia visual de estados.
* **Criterios de Aceptación Asignados:**
  - [ ] Botón "Cambiar Franja" en cada reserva de `MisInscripcionesScreen.js`.
  - [ ] Modal interactivo que lista las franjas alternativas del taller, mostrando cuáles tienen cupo y cuáles están bloqueadas.
  - [ ] Visualización clara de los badges de estado (`Matriculado`, `Reprogramado`, `Pendiente de sincronizar`, `Cancelado`).
  - [ ] Integración y verificación de la FE-01 definida por el equipo en modo offline y navegación estable sin crashes.
* **Archivos a modificar/crear:**
  - `screens/MisInscripcionesScreen.js` *(Integración de botón y estado de reprogramación)*
  - `components/ModalReprogramar.js` *(Nuevo: selector modal de nueva franja con validación visual)*
  - `components/Badge.js` *(Nuevas variantes para `reprogramada` y `offline`)*
  - `README.md` *(Documentación final de la FE-01 y trazabilidad)*
