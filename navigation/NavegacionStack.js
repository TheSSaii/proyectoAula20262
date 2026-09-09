/**
 * @file NavegacionStack.js
 * @description Pila de navegación principal (Stack) para el flujo operativo de Cátedras ACUDE.
 * Conecta: Inicio (Catálogo) -> Detalle (Ficha técnica e inscripción) -> Horarios (Agenda semanal y sobrecupo).
 * @module navigation/NavegacionStack
 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import InicioScreen from '../screens/InicioScreen';
import DetalleScreen from '../screens/DetalleScreen';
import HorariosScreen from '../screens/HorariosScreen';

const Stack = createStackNavigator();

/**
 * Pila de navegación de Cátedras ACUDE.
 * @returns {React.JSX.Element}
 */
export default function NavegacionStack() {
  return (
    <Stack.Navigator
      initialRouteName="Inicio"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#FFFFFF',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#E2E8F0',
        },
        headerTitleStyle: {
          fontWeight: '700',
          color: '#0F172A',
        },
        headerTintColor: '#0284C7',
        headerBackTitle: 'Atrás',
        cardStyle: { backgroundColor: '#F8FAFC' },
      }}
    >
      <Stack.Screen
        name="Inicio"
        component={InicioScreen}
        options={{
          title: '🏟️ CanchaYa · Cátedras ACUDE',
        }}
      />
      <Stack.Screen
        name="Detalle"
        component={DetalleScreen}
        options={({ route }) => ({
          title: route.params?.acude?.nombre || 'Detalle de la Cátedra',
        })}
      />
      <Stack.Screen
        name="Horarios"
        component={HorariosScreen}
        options={{
          title: '📅 Cronograma y Sobrecupo',
        }}
      />
    </Stack.Navigator>
  );
}