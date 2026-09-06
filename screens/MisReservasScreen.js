/**
 * @file MisReservasScreen.js
 * @description Pantalla para visualizar el listado de reservas activas e históricas del usuario.
 * Estructurada como destino de la pestaña 'Mis Reservas' (Programador 4 - T15).
 * @module screens/MisReservasScreen
 */

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

export default function MisReservasScreen() {
  return (
    <SafeAreaView style={styles.contenedor}>
      <View style={styles.contenido}>
        <View style={styles.iconoContenedor}>
          <Text style={styles.icono}>📅</Text>
        </View>
        <Text style={styles.titulo}>Mis Reservas</Text>
        <Text style={styles.descripcion}>
          Aquí podrás consultar y gestionar todas tus reservas activas en los escenarios deportivos del TdeA.
        </Text>
        <View style={styles.cajaEstado}>
          <Text style={styles.textoEstado}>
            💡 Módulo conectado a la arquitectura. Listo para recibir la lógica de persistencia de reservas (T15).
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  contenido: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  iconoContenedor: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  icono: {
    fontSize: 34,
  },
  titulo: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  descripcion: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  cajaEstado: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 14,
  },
  textoEstado: {
    fontSize: 12,
    color: '#0284C7',
    fontWeight: '600',
    textAlign: 'center',
  },
});
