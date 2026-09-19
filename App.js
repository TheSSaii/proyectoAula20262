/**
 * @file App.js
 * @description Punto de entrada principal de la aplicación CanchaYa (Tecnológico de Antioquia).
 * [CICLO 4 - T05]: Envoltorio raíz con AuthProvider (Context API) y NavigationContainer (React Navigation v7).
 * Integra el enrutamiento condicional centralizado en AppNavigator.
 */

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './contexts/AuthContexto';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  return (
    // AuthProvider provee el estado global de autenticación (usuario actual, si está cargando, etc.) a toda la app
    <AuthProvider>
      {/* NavigationContainer es el contenedor principal de React Navigation que maneja el árbol de navegación */}
      <NavigationContainer>
        {/* StatusBar controla el estilo de la barra de estado del celular (hora, batería, etc.) */}
        <StatusBar style="dark" />
        
        {/* AppNavigator decide qué pantallas mostrar (Login si no hay sesión, o el contenido principal si lo hay) */}
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
