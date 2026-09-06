/**
 * @file App.js
 * @description Punto de entrada de la aplicación CanchaYa.
 * [CICLO 2 - T02]: Incluye panel de control para ejecutar el Seed en Cloud Firestore
 * y visualización interactiva de componentes con datos dinámicos.
 */

import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  Alert,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Badge from './components/Badge';
import EscenarioCard from './components/EscenarioCard';
import { ejecutarSeedEscenarios, ESCENARIOS_TDEA } from './services/seedEscenarios';

export default function App() {
  const [cargandoSeed, setCargandoSeed] = useState(false);
  const [estadoSeed, setEstadoSeed] = useState(null);

  // Ejecución del Seed en Cloud Firestore
  const handleEjecutarSeed = async () => {
    try {
      setCargandoSeed(true);
      setEstadoSeed(null);

      const resultado = await ejecutarSeedEscenarios();
      setEstadoSeed({ exito: true, mensaje: resultado.mensaje });

      Alert.alert(
        '✅ Seed Completado',
        `${resultado.mensaje}\n\nPuedes abrir tu consola de Firebase en 'Firestore Database' para verificar la colección 'escenarios'.`,
        [{ text: 'Entendido', style: 'default' }]
      );
    } catch (error) {
      console.error('Error al ejecutar seed:', error);
      setEstadoSeed({ exito: false, mensaje: error.message });
      Alert.alert(
        '❌ Error en el Seed',
        `No se pudo sincronizar con Firestore:\n${error.message}\n\nVerifica que hayas habilitado Firestore en 'Modo de prueba'.`,
        [{ text: 'Cerrar', style: 'destructive' }]
      );
    } finally {
      setCargandoSeed(false);
    }
  };

  const handleSeleccionarEscenario = (escenario) => {
    Alert.alert(
      'Escenario Seleccionado',
      `Nombre: ${escenario.nombre}\nEstado: ${escenario.estado.toUpperCase()}\nCapacidad: ${escenario.capacidad} personas\nUbicación: ${escenario.ubicacion}`,
      [{ text: 'Aceptar', style: 'default' }]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Encabezado principal */}
        <View style={styles.encabezado}>
          <Text style={styles.tituloApp}>🏟️ CanchaYa</Text>
          <Text style={styles.subtituloApp}>
            Tecnológico de Antioquia · Verificación Ciclo 2 (T02)
          </Text>
        </View>

        {/* Panel de Control de Firestore (Seed T02) */}
        <View style={styles.panelSeed}>
          <View style={styles.encabezadoPanel}>
            <Text style={styles.tituloPanel}>🔥 Sincronización Firestore (T02)</Text>
            <Badge
              estado={estadoSeed?.exito ? 'disponible' : 'info'}
              texto={estadoSeed?.exito ? 'Sincronizado' : 'Listo para sembrar'}
              tamano="pequeno"
            />
          </View>

          <Text style={styles.textoPanel}>
            Puebla la colección <Text style={styles.codigo}>escenarios</Text> en Firebase con
            los 5 escenarios deportivos oficiales del campus Robledo.
          </Text>

          <TouchableOpacity
            style={[styles.botonSeed, cargandoSeed && styles.botonDeshabilitado]}
            onPress={handleEjecutarSeed}
            disabled={cargandoSeed}
            activeOpacity={0.8}
          >
            {cargandoSeed ? (
              <View style={styles.filaBoton}>
                <ActivityIndicator color="#FFFFFF" size="small" />
                <Text style={styles.textoBoton}> Guardando en Firestore...</Text>
              </View>
            ) : (
              <Text style={styles.textoBoton}>🚀 Poblar Base de Datos en Firebase</Text>
            )}
          </TouchableOpacity>

          {estadoSeed && (
            <View
              style={[
                styles.alertaResultado,
                estadoSeed.exito ? styles.alertaExito : styles.alertaError,
              ]}
            >
              <Text
                style={[
                  styles.textoAlerta,
                  estadoSeed.exito ? styles.textoExito : styles.textoError,
                ]}
              >
                {estadoSeed.exito ? '✓ ' : '✕ '}
                {estadoSeed.mensaje}
              </Text>
            </View>
          )}
        </View>

        {/* Vista previa de los datos a sembrar usando EscenarioCard (T07) */}
        <View style={styles.seccion}>
          <Text style={styles.tituloSeccion}>
            Escenarios Reales del TdeA ({ESCENARIOS_TDEA.length})
          </Text>
          <Text style={styles.descripcionSeccion}>
            Estos son los documentos que se sembrarán en Firestore:
          </Text>
        </View>

        {ESCENARIOS_TDEA.map((escenario) => (
          <EscenarioCard
            key={escenario.id}
            escenario={escenario}
            onPress={handleSeleccionarEscenario}
          />
        ))}

        <View style={styles.espacioFinal} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContainer: {
    paddingVertical: 16,
  },
  encabezado: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  tituloApp: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  subtituloApp: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  panelSeed: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  encabezadoPanel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tituloPanel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  textoPanel: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 14,
  },
  codigo: {
    fontWeight: '700',
    color: '#0284C7',
    fontFamily: 'monospace',
  },
  botonSeed: {
    backgroundColor: '#0284C7',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonDeshabilitado: {
    backgroundColor: '#94A3B8',
  },
  filaBoton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoBoton: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  alertaResultado: {
    marginTop: 12,
    padding: 10,
    borderRadius: 8,
  },
  alertaExito: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  alertaError: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  textoAlerta: {
    fontSize: 12,
    fontWeight: '600',
  },
  textoExito: {
    color: '#065F46',
  },
  textoError: {
    color: '#991B1B',
  },
  seccion: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  tituloSeccion: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  descripcionSeccion: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  espacioFinal: {
    height: 32,
  },
});
