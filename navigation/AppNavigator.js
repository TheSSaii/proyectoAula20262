/**
 * @file AppNavigator.js
 * @description Enrutador raíz de la aplicación CanchaYa.
 * Evalúa el estado reactivo del usuario en AuthContexto para aplicar
 * enrutamiento condicional estricto:
 * - Si no hay sesión: renderiza AuthStack (Login / Registro).
 * - Si hay sesión activa: renderiza Tabs (Escenarios, Mis Reservas, Perfil).
 * @module navigation/AppNavigator
 */

import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useAuth } from '../contexts/AuthContexto';
import AuthStack from './AuthStack';
import Tabs from './Tabs';

export default function AppNavigator() {
  const { user, loading } = useAuth();

  // Pantalla de carga inicial mientras se resuelve la persistencia en AsyncStorage
  if (loading) {
    return (
      <View style={styles.pantallaCarga}>
        <View style={styles.circuloLogo}>
          <Text style={styles.iconoLogo}>🏟️</Text>
        </View>
        <ActivityIndicator size="large" color="#0284C7" style={styles.spinner} />
        <Text style={styles.textoCargando}>Iniciando CanchaYa...</Text>
      </View>
    );
  }

  // Enrutamiento condicional
  return user ? <Tabs /> : <AuthStack />;
}

const styles = StyleSheet.create({
  pantallaCarga: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circuloLogo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#0284C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  iconoLogo: {
    fontSize: 38,
  },
  spinner: {
    marginBottom: 12,
  },
  textoCargando: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
});
