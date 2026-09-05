# ⚽ proyectoAula20262 — canchaYa

![Expo SDK](https://shields.io)
![React Native](https://shields.io)
![Node](https://shields.io>=18.0.0-339933?style=for-the-badge&logo=node.js&logoColor=white)

Este repositorio contiene el código fuente de la aplicación móvil **canchaYa**, desarrollada con **React Native** y **Expo**. La arquitectura del proyecto está diseñada de forma modular, separando las vistas, los flujos de navegación y la gestión del estado global de autenticación.


---

## 🛠️ Tecnologías y Dependencias

Las versiones clave definidas en el `package.json` son:
* **Expo CLI:** `~54.0.36`
* **React / React Native:** `19.1.0` / `0.81.5`
* **Navegación:** `@react-navigation/native` (v7) con soporte para Tabs y Stacks.
* **Core Nativo:** `react-native-reanimated` (~4.1.1) y `react-native-gesture-handler` (~2.28.0).

---

## 🚀 Requisitos de Instalación

Para asegurar la consistencia absoluta de las versiones dentro de todo el equipo de desarrollo, sigue estos pasos estrictamente desde tu terminal:

1. **Clonar el proyecto y acceder a la carpeta:**
   ```bash
   git clone <URL_DE_TU_FORK>
   cd proyectoAula20262
   ```

2. **Cambiar a la rama de desarrollo activa:**
   ```bash
   git checkout investigacion
   ```

3. **Instalación limpia de dependencias:**
   > [!IMPORTANT]
   > No utilices el comando `npm install`. Para forzar a tu máquina a instalar exactamente las mismas versiones del archivo candado de tu compañero, ejecuta de forma mandatoria:
   ```bash
   npm ci
   ```

---

## 💻 Ejecución y Pruebas en Celular

Para encender el servidor de desarrollo local y compilar los archivos, ejecuta:
```bash
npm start
```

### 📱 Configuración Crítica de Expo Go (Dispositivos Android)

> [!WARNING]
> **Error de Incompatibilidad del SDK:**
> El proyecto está desarrollado bajo el **SDK 54**. Las versiones de Expo Go disponibles en la Google Play Store vienen por defecto actualizadas al SDK 57, lo que impedirá abrir la app y romperá el entorno de desarrollo.

**Pasos obligatorios para conectar tu teléfono Android:**
1. **Desinstala** cualquier versión comercial de Expo Go que tengas instalada en tu teléfono.
2. Abre el navegador de tu celular y descarga el **APK oficial de Expo Go para el SDK 54** desde el portal oficial de desarrolladores: [Instalar Expo Go para SDK 54](https://expo.dev).
3. Instala el archivo APK en tu dispositivo móvil.
4. Asegúrate de que **tu computadora y tu celular estén conectados exactamente a la misma red Wi-Fi**.
5. Abre la app instalada en tu teléfono, escanea el código QR de la terminal y espera a que el bundle de JavaScript se compile al 100%.

---
