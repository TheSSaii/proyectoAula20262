/**
 * @file Tabs.js
 * @description Navegación inferior persistente (Bottom Tabs) para usuarios autenticados en CanchaYa.
 * Conecta las 3 áreas maestras del sistema:
 * - Cátedras ACUDE (Catálogo y ficha vía NavegacionStack)
 * - Mis Inscripciones (Mis talleres matriculados y liberación de cupo)
 * - Perfil (Cuenta de usuario, datos institucionales y cierre de sesión)
 * @module navigation/Tabs
 */

import React from 'react';
import { Text, Platform, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import NavegacionStack from './NavegacionStack';
import MisInscripcionesScreen from '../screens/MisInscripcionesScreen';
import PerfilScreen from '../screens/PerfilScreen';

const Tab = createBottomTabNavigator();

export default function Tabs() {
  return (
    <Tab.Navigator
      initialRouteName="InicioTab"
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
          let icono = '🎨';
          if (route.name === 'InicioTab') icono = focused ? '🎨' : '🏃';
          if (route.name === 'MisInscripcionesTab') icono = focused ? '📋' : '📑';
          if (route.name === 'PerfilTab') icono = focused ? '👤' : '👥';

          return <Text style={styles.iconoTab}>{icono}</Text>;
        },
      })}
    >
      <Tab.Screen
        name="InicioTab"
        component={NavegacionStack}
        options={{
          tabBarLabel: 'Cátedras ACUDE',
        }}
      />
      <Tab.Screen
        name="MisInscripcionesTab"
        component={MisInscripcionesScreen}
        options={{
          tabBarLabel: 'Mis Cátedras',
          headerShown: true,
          headerTitle: '📋 Mis Inscripciones ACUDE',
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
          headerTitle: '👤 Mi Perfil TdeA',
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
