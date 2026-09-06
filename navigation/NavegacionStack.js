/**
 * @file NavegacionStack.js
 * @description Pila de navegación principal (Stack) para el flujo de reserva de escenarios.
 * Conecta: Inicio (Catálogo) -> Detalle -> Disponibilidad (Prog 3) -> Confirmación (Prog 4).
 * @module navigation/NavegacionStack
 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ConfirmacionReservaScreen from '../screens/ConfirmacionReservaScreen';
import InicioScreen from '../screens/InicioScreen';
import DetalleScreen from '../screens/DetalleScreen';
import DisponibilidadScreen from '../screens/DisponibilidadScreen';

const Stack = createStackNavigator();

/**
 * Pila de navegación del catálogo y reserva de escenarios.
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
          title: '🏟️ CanchaYa TdeA',
        }}
      />
      <Stack.Screen
        name="Detalle"
        component={DetalleScreen}
        options={({ route }) => ({
          title: route.params?.escenario?.nombre || 'Detalle del Escenario',
        })}
      />
      <Stack.Screen
        name="Disponibilidad"
        component={DisponibilidadScreen}
        options={{
          title: '📅 Disponibilidad de Franjas',
        }}
      />
      <Stack.Screen name="ConfirmacionReserva" 
      component={ConfirmacionReservaScreen} 
      />
    </Stack.Navigator>
  );
}