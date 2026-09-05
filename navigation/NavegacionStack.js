import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import InicioScreen from '../screens/InicioScreen';
import DetalleScreen from '../screens/DetalleScreen';
const Stack = createStackNavigator();
const NavegacionStack = () => {
return (
<Stack.Navigator initialRouteName="Inicio" screenOptions={{
headerShown: true }}>
<Stack.Screen name="Inicio" component={InicioScreen} options={{
title: 'Inicio ' }} />
<Stack.Screen name="Detalle" component={DetalleScreen} options={{
title: 'Detalle ' }} />
</Stack.Navigator>
);
};
export default NavegacionStack;