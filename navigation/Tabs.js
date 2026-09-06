/**
 * @file Tabs.js
 * @description Navegación inferior persistente (Bottom Tabs) para usuarios autenticados.
 * Integra las 3 áreas maestras de la aplicación:
 * - Escenarios (Catálogo y reserva vía NavegacionStack)
 * - Mis Reservas (Historial de turnos - Prog 4)
 * - Perfil (Cuenta de usuario y cierre de sesión)
 * @module navigation/Tabs
 */

import React from 'react';
import { Text, Platform, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import NavegacionStack from './NavegacionStack';
import MisReservasScreen from '../screens/MisReservasScreen';
import PerfilScreen from '../screens/PerfilScreen';

const Tab = createBottomTabNavigator();

export default function Tabs() {
  return (
    <Tab.Navigator
      initialRouteName="EscenariosTab"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#0284C7',
        tabBarInactiveTintColor: '#64748B',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E2E8F0',
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarIcon: ({ focused }) => {
          let icono = '🏟️';
          if (route.name === 'EscenariosTab') icono = focused ? '🏟️' : '⚽';
          if (route.name === 'MisReservasTab') icono = '📅';
          if (route.name === 'PerfilTab') icono = '👤';

          return <Text style={styles.iconoTab}>{icono}</Text>;
        },
      })}
    >
      <Tab.Screen
        name="EscenariosTab"
        component={NavegacionStack}
        options={{
          tabBarLabel: 'Escenarios',
        }}
      />
      <Tab.Screen
        name="MisReservasTab"
        component={MisReservasScreen}
        options={{
          tabBarLabel: 'Mis Reservas',
          headerShown: true,
          headerTitle: '📅 Mis Reservas',
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
        }}
      />
      <Tab.Screen
        name="PerfilTab"
        component={PerfilScreen}
        options={{
          tabBarLabel: 'Perfil',
          headerShown: true,
          headerTitle: '👤 Mi Perfil',
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
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconoTab: {
    fontSize: 20,
  },
});
