# 🏟️ CanchaYa — Sistema de Reserva de Escenarios Deportivos y Bienestar

> **Tecnológico de Antioquia (TdeA) — Institución Universitaria**  
> **Curso:** Desarrollo Móvil | **Periodo:** 2026-2  
> **Fase:** Primer Entregable — Parte B (Funcionalidades Base)

---

## 📌 1. Descripción del Proyecto

**CanchaYa** es una aplicación móvil diseñada para la comunidad del Tecnológico de Antioquia (estudiantes, docentes y personal administrativo) del **Campus Robledo**, permitiendo consultar el catálogo de escenarios deportivos, verificar la disponibilidad de turnos en tiempo real y gestionar reservas de forma ágil, transparente y moderna.

### Alcance del Primer Entregable (Parte B):
1. **Autenticación completa:** Registro e inicio de sesión seguro con Firebase Authentication y persistencia nativa de sesión.
2. **Catálogo dinámico:** Listado oficial de escenarios deportivos del TdeA consultados en tiempo real desde Cloud Firestore (sin datos quemados).
3. **Buscador y filtros:** Motor de búsqueda reactivo por texto y chips de filtrado por disciplina deportiva.
4. **Navegación robusta:** Enrutamiento condicional (`AuthStack` vs `BottomTabs`) y flujo en Stack (`Inicio -> Detalle -> Disponibilidad`).
5. **Base para el equipo:** Módulos y contratos desacoplados listos para que los demás desarrolladores integren disponibilidad y reservas sin acoplamiento.

> [!NOTE]
> **Aclaración de Alcance:** Conforme a las especificaciones pedagógicas del curso, el soporte **Offline-First** (caché local SQLite/WatermelonDB, sincronización en segundo plano y resolución de conflictos) está planificado y acotado para el **Segundo Entregable**, no para este primer corte.

---

## 🛠️ 2. Stack Tecnológico

| Capa / Herramienta | Tecnología | Versión / Detalle |
|---|---|---|
| **Framework Móvil** | React Native + Expo | SDK 54 (`~54.0.36`) |
| **Persistencia en la Nube** | Cloud Firestore | SDK Modular v12 (Tree-shakeable) |
| **Autenticación** | Firebase Auth | Email & Password con actualización de perfil |
| **Persistencia Local** | AsyncStorage | `@react-native-async-storage/async-storage` (v2.2.0) |
| **Navegación** | React Navigation | v7 (`@react-navigation/native`, `/stack`, `/bottom-tabs`) |
| **Gestión de Estado** | React Context API | Sin Redux ni librerías pesadas externas |
| **Diseño / Estilos** | StyleSheet Nativo | Paleta accesible con identidad TdeA, sin dependencias externas de íconos |

---

## 📂 3. Arquitectura del Proyecto

El repositorio adopta una arquitectura en capas limpias con nombres de carpetas en inglés y módulos/componentes en español:

```text
proyectoAula20262/
├── components/                       # Componentes visuales reutilizables (UI pura)
│   ├── Badge.js                      # Píldora de estado accesible (disponible, ocupado, mantenimiento)
│   ├── EscenarioCard.js              # Tarjeta interactiva de escenario deportivo con fallback visual
│   ├── DateSelector.js               # [P3 - T11]: Selector de fecha para disponibilidad
│   └── SlotPicker.js                 # [P3 - T11]: Selector de turnos horarios libres/ocupados
│
├── contexts/                         # Estado global reactivo
│   └── AuthContexto.js               # Provider y hook useAuth() con onAuthStateChanged y AsyncStorage
│
├── navigation/                       # Enrutamiento con React Navigation v7
│   ├── AppNavigator.js               # Enrutador condicional raíz (conmuta AuthStack <-> Tabs)
│   ├── AuthStack.js                  # Pila de autenticación: LoginScreen <-> RegistroScreen
│   ├── NavegacionStack.js            # Pila operativa: Inicio -> Detalle -> Disponibilidad -> Confirmación
│   └── Tabs.js                       # Barra inferior de 3 pestañas: Escenarios, Mis Reservas, Perfil
│
├── screens/                          # Vistas completas de pantalla
│   ├── LoginScreen.js                # Acceso con inputs seguros y validaciones
│   ├── RegistroScreen.js             # Registro con validación de correo TdeA y contraseñas
│   ├── InicioScreen.js               # Catálogo en FlatList con buscador reactivo y chips
│   ├── DetalleScreen.js              # Ficha técnica, aforo, normas institucionales y botón CTA
│   ├── DisponibilidadScreen.js       # Pantalla de turnos y selección de fecha (P3 - T12)
│   ├── MisReservasScreen.js          # Historial de reservas del estudiante (P4 - T15)
│   └── PerfilScreen.js               # Información de cuenta, badge TdeA y cierre de sesión
│
├── services/                         # Capa de acceso a datos y lógica externa (Data Layer)
│   ├── firebaseConfig.js             # Inicialización idempotente de Firebase (App, Auth, Firestore)
│   ├── authService.js                # Métodos signIn, signUp, signOut y traducción de errores
│   ├── escenariosService.js          # Consultas getEscenarios() y getEscenarioById()
│   ├── seedEscenarios.js             # Siembra de los 5 escenarios reales del TdeA en Firestore
│   ├── disponibilidadService.js      # [P3 - T10]: Cruce de franjas libres contra reservas
│   └── reservasService.js            # [P4 - T13]: crearReserva() y getMisReservas()
│
├── App.js                            # Punto de entrada: Inyecta AuthProvider y NavigationContainer
├── package.json                      # Dependencias y scripts de Expo
└── README.md                         # Documentación maestra del sistema
```

---

## 🚀 4. Guía de Puesta en Marcha (Instalación y Ejecución)

### Requisitos previos:
- **Node.js**: Versión LTS (v20 o superior).
- **Dispositivo móvil**: Con la app **Expo Go** instalada (Android o iOS) o un simulador/emulador configurado.
- **Git** instalado.

### Paso a paso:

```bash
# 1. Clonar el repositorio
git clone git@github.com:TheSSaii/proyectoAula20262.git
cd proyectoAula20262

# 2. Instalar dependencias exactas
npm install

# 3. Iniciar el servidor de desarrollo de Expo
npx expo start
```

### Opciones de ejecución:
- **En tu celular físico:** Escanea el código QR que aparece en la terminal usando la cámara (iOS) o la app **Expo Go** (Android).
- **En Emulador Android:** Presiona la tecla `a` en la terminal.
- **En Simulador iOS (Mac):** Presiona la tecla `i` en la terminal.
- **Recargar cambios en caliente:** Presiona la tecla `r`.

---

## 🔥 5. Configuración de Firebase y Base de Datos

Las credenciales del proyecto oficial de Firebase (`canchaya-ef35d`) ya se encuentran centralizadas en `services/firebaseConfig.js`.

### ¿Cómo verificar o sembrar la base de datos (Seed)?
La colección `escenarios` ya cuenta con los 5 escenarios deportivos reales del campus Robledo:
1. **Cancha Sintética de Fútbol 8** (Bloque Deportivo)
2. **Coliseo Cubierto Mayor** (Bloque E)
3. **Gimnasio de Acondicionamiento Físico** (Piso 2 Bienestar)
4. **Placa Polideportiva Descubierta** (Zona Canchas Externas)
5. **Sala de Tenis de Mesa y Deportes de Mesa** (Bloque Deportivo, Nivel 1)

> **Garantía de Idempotencia:** El script `services/seedEscenarios.js` utiliza `setDoc` con `{ merge: true }` e IDs fijos. Si la base de datos se limpia o se reconfigura, ejecutar el seed actualizará los registros sin duplicar documentos.

---

## 👥 6. Matriz de Responsabilidades del Equipo (Sprint 1)

| Tarea | Rol Asignado | Descripción | Estado |
|---|---|---|:---:|
| **T01** | Prog 1 | Setup Firebase SDK modular + persistencia nativa con AsyncStorage | ✅ Completado |
| **T03** | Prog 1 | Capa de negocio: `authService.js` y `contexts/AuthContexto.js` | ✅ Completado |
| **T04** | Prog 1 | Pantallas `LoginScreen.js` y `RegistroScreen.js` validadas | ✅ Completado |
| **T17** | Prog 1 | Reglas de seguridad en Firestore (`firestore.rules`) y perfil | ⏳ En desarrollo |
| **T07** | Prog 2 | Componentes UI: `Badge.js` y `EscenarioCard.js` dinámicos | ✅ Completado |
| **T02** | Prog 2 | Seed de datos reales del TdeA en Cloud Firestore | ✅ Completado |
| **T06** | Prog 2 | Capa de servicios: `escenariosService.js` (`getEscenarios`, `getById`) | ✅ Completado |
| **T05** | Prog 2 | Navegación global (`AuthStack`, `Tabs`, `NavegacionStack`) en `App.js` | ✅ Completado |
| **T08** | Prog 2 | `InicioScreen.js`: Catálogo interactivo con buscador y filtros | ✅ Completado |
| **T09** | Prog 2 | `DetalleScreen.js`: Ficha técnica, aforo, normas y botón CTA | ✅ Completado |
| **T11** | Prog 3 | Componentes `DateSelector.js` y `SlotPicker.js` | ⏳ Asignado |
| **T10** | Prog 3 | Servicio `consultarDisponibilidad(escenarioId, fecha)` | ⏳ Asignado |
| **T12** | Prog 3 | Pantalla `DisponibilidadScreen.js` interactiva con franjas | ⏳ Asignado |
| **T13** | Prog 4 | Servicio transaccional `crearReserva()` en Firestore | ⏳ Asignado |
| **T14** | Prog 4 | Pantalla de confirmación y voucher `ConfirmacionReservaScreen.js` | ⏳ Asignado |
| **T15** | Prog 4 | Pantalla de gestión de turnos `MisReservasScreen.js` | ⏳ Asignado |
| **T16/18**| Prog 4 | Documentación técnica final, matriz de pruebas E2E y video | ⏳ Asignado |

---

## 🎯 7. Metodología de Trabajo y Commits

El equipo opera bajo ciclos cerrados de desarrollo guiados por un **Definition of Done (DoD)** estricto por tarea:

$$\text{Tarea individual} \longrightarrow \text{Código modular documentado} \longrightarrow \text{Verificación manual DoD} \longrightarrow \text{Commit estandarizado}$$

### Estándar de Commits (Conventional Commits):
- `feat(T01): setup inicial de Firebase SDK modular con persistencia en AsyncStorage`
- `feat(T02): seed de datos reales de escenarios en Firestore`
- `feat(T03): contexto global de autenticacion y servicio con Firebase Auth`
- `feat(T04): pantallas LoginScreen y RegistroScreen con validaciones e inputs seguros`
- `feat(T05): navegacion global con AuthStack, NavegacionStack y Tabs en App.js`
- `feat(T06): servicio de consulta de escenarios con Firestore SDK`
- `feat(T07): componentes EscenarioCard y Badges con datos dinámicos`
- `feat(T08-T09): catalogo interactivo con buscador y filtros, y detalle de escenario`

---

## 🎓 8. Guía para la Sustentación Oral Individual

Respuestas técnicas clave a preguntas frecuentes de evaluación:

1. **¿Por qué la arquitectura es desacoplada y modular?**  
   Las pantallas (`screens`) nunca consumen directamente el SDK de Firestore ni ejecutan queries inline; delegan la responsabilidad a la capa de servicios (`services/escenariosService.js`). Esto respeta el principio de responsabilidad única (SRP) y facilita pruebas o cambios de proveedor de base de datos sin tocar la interfaz gráfica.

2. **¿Cómo se garantiza que la sesión de usuario no se pierda al reiniciar la app?**  
   Al configurar Firebase Auth en `services/firebaseConfig.js`, se utilizó `initializeAuth` con `getReactNativePersistence(AsyncStorage)`. Esto asegura que los tokens de sesión se almacenen de forma segura y persistente en el dispositivo móvil, permitiendo a `onAuthStateChanged` rehidratar el usuario al iniciar la app.

3. **¿Cómo se resuelve el enrutamiento condicional seguro?**  
   En `navigation/AppNavigator.js`, la aplicación evalúa el valor reactivo `user` expuesto por el hook `useAuth()`. Si `user` es nulo, React Navigation monta exclusivamente `AuthStack`; una vez autenticado, desmonta las rutas de acceso y monta `Tabs`. Es imposible para un usuario acceder al catálogo o reservar sin haberse autenticado.

4. **¿Por qué la búsqueda y los chips no cierran el teclado al escribir?**  
   Se mantuvo el contenedor de búsqueda y filtros en una vista estática fija **fuera del `FlatList`**. Si el `TextInput` estuviese dentro de `ListHeaderComponent`, cada cambio de estado en React recrearía la cabecera, provocando la pérdida de foco (`blur`) del input y el cierre automático del teclado.
