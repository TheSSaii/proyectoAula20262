/**
 * @file InicioScreen.js
 * @description Pantalla principal de catálogo de escenarios deportivos de CanchaYa.
 * Consulta Firestore mediante escenariosService.js y renderiza la lista con EscenarioCard.
 * Al presionar una tarjeta, navega a DetalleScreen pasando el objeto escenario.
 * @module screens/InicioScreen
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import EscenarioCard from '../components/EscenarioCard';
import { getEscenarios } from '../services/escenariosService';

/**
 * Pantalla del Catálogo de Escenarios.
 *
 * @param {Object} props
 * @param {Object} props.navigation - React Navigation prop.
 * @returns {React.JSX.Element}
 */
export default function InicioScreen({ navigation }) {
  const [escenarios, setEscenarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);
  const [error, setError] = useState(null);

  const cargarDatos = useCallback(async () => {
    try {
      setError(null);
      const datos = await getEscenarios();
      setEscenarios(datos);
    } catch (err) {
      console.error('Error al cargar escenarios en InicioScreen:', err);
      setError(err.message);
    } finally {
      setCargando(false);
      setRefrescando(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const handleRefrescar = () => {
    setRefrescando(true);
    cargarDatos();
  };

  const handleSeleccionarEscenario = (escenario) => {
    navigation.navigate('Detalle', { escenario });
  };

  const renderCabecera = () => (
    <View style={styles.cabeceraLista}>
      <Text style={styles.tituloSeccion}>Escenarios Deportivos</Text>
      <Text style={styles.subtituloSeccion}>
        Campus Robledo · Tecnológico de Antioquia
      </Text>
      {escenarios.length > 0 && (
        <Text style={styles.contadorEscenarios}>
          Mostrando {escenarios.length} espacios disponibles para reserva
        </Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.contenedor}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {cargando && !refrescando ? (
        <View style={styles.centroCarga}>
          <ActivityIndicator size="large" color="#0284C7" />
          <Text style={styles.textoCargando}>Cargando catálogo desde Firestore...</Text>
        </View>
      ) : error ? (
        <View style={styles.cajaError}>
          <Text style={styles.tituloError}>No se pudo cargar el catálogo</Text>
          <Text style={styles.detalleError}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={escenarios}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EscenarioCard
              escenario={item}
              onPress={handleSeleccionarEscenario}
            />
          )}
          ListHeaderComponent={renderCabecera}
          contentContainerStyle={styles.listaContenedor}
          refreshControl={
            <RefreshControl
              refreshing={refrescando}
              onRefresh={handleRefrescar}
              colors={['#0284C7']}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  listaContenedor: {
    paddingVertical: 12,
  },
  cabeceraLista: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  tituloSeccion: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  subtituloSeccion: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  contadorEscenarios: {
    fontSize: 12,
    color: '#0284C7',
    fontWeight: '600',
    marginTop: 6,
  },
  centroCarga: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoCargando: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748B',
  },
  cajaError: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  tituloError: {
    fontSize: 16,
    fontWeight: '700',
    color: '#991B1B',
    marginBottom: 6,
  },
  detalleError: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
  },
});
