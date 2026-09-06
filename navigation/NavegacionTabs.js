import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import MisReservasScreen from '../pantallas/MisReservasScreen';
import InicioScreen from '../pantallas/InicioScreen';
import ConfigScreen from '../pantallas/ConfigScreen';
import { Ionicons } from '@expo/vector-icons';

// Definimos 'Tab' con mayúscula (esto es correcto)
const Tab = createBottomTabNavigator();

const NavegacionTabs = () => {
    return (
        <Tab.Navigator
            initialRouteName="Inicio"
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let icono;
                    if (route.name === 'Inicio') {
                        icono = 'home';
                    // CORRECCIÓN 3: Agregamos el ícono para tu nueva pestaña
                    } else if (route.name === 'Mis Reservas') {
                        icono = 'calendar'; // Usamos un ícono sencillo de calendario
                    } else if (route.name === 'Configuracion') {
                        icono = 'settings';
                    }
                    return <Ionicons name={icono} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen
                name="Inicio"
                component={InicioScreen}
                options={{ title: 'Inicio ' }}
            />
            <Tab.Screen
                name="Mis Reservas" 
                component={MisReservasScreen}
                options={{ title: 'Mis Reservas ' }}
            />

            <Tab.Screen
                name="Configuracion"
                component={ConfigScreen}
                options={{ title: 'Configuración ' }}
            />
        </Tab.Navigator>
    );
};

export default NavegacionTabs;