/**
 * @file App.js
 * @description Punto de entrada de la aplicación CanchaYa.
 * [CICLO 1 - T07]: Vista de verificación visual del Definition of Done (DoD)
 * para los componentes Badge y EscenarioCard con datos dinámicos representativos del TdeA.
 */

import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  Alert,
  StatusBar,
} from 'react-native';
import Badge from './components/Badge';
import EscenarioCard from './components/EscenarioCard';

// Mocks representativos del Tecnológico de Antioquia para pruebas del Ciclo 1 (T07)
const ESCENARIOS_MOCK = [
  {
    id: 'esc-01',
    nombre: 'Cancha Sintética de Fútbol 8',
    tipo: 'Fútbol',
    ubicacion: 'Campus Robledo - Bloque Deportivo',
    capacidad: 16,
    estado: 'disponible',
    imagenUrl: 'https://images.unsplash.com/photo-1529900241940-025a40b95c02?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: 'esc-02',
    nombre: 'Coliseo Cubierto Múltiple',
    tipo: 'Baloncesto / Voleibol',
    ubicacion: 'Campus Robledo - Bloque E',
    capacidad: 30,
    estado: 'ocupado',
    imagenUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: 'esc-03',
    nombre: 'Gimnasio de Acondicionamiento Físico',
    tipo: 'Acondicionamiento',
    ubicacion: 'Campus Robledo - Piso 2 Bienestar',
    capacidad: 25,
    estado: 'mantenimiento',
    // Sin imagenUrl a propósito para verificar el fallback visual del placeholder
  },
];

export default function App() {
  const handleSeleccionarEscenario = (escenario) => {
    Alert.alert(
      'Escenario Seleccionado',
      `Has pulsado: "${escenario.nombre}"\nEstado: ${escenario.estado.toUpperCase()}\nCapacidad: ${escenario.capacidad} personas.`,
      [{ text: 'Aceptar', style: 'default' }]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Encabezado de la aplicación */}
        <View style={styles.encabezado}>
          <Text style={styles.tituloApp}>🏟️ CanchaYa</Text>
          <Text style={styles.subtituloApp}>
            Tecnológico de Antioquia · Verificación T07
          </Text>
        </View>

        {/* Sección 1: Verificación de Badges independientes */}
        <View style={styles.seccion}>
          <Text style={styles.tituloSeccion}>Componente: Badges Atómicos</Text>
          <Text style={styles.descripcionSeccion}>
            Prueba de estados semánticos y tamaños:
          </Text>
          <View style={styles.filaBadges}>
            <Badge estado="disponible" />
            <Badge estado="mantenimiento" />
            <Badge estado="ocupado" />
          </View>
          <View style={[styles.filaBadges, { marginTop: 8 }]}>
            <Badge estado="info" texto="Fútbol Sala" />
            <Badge estado="disponible" tamano="pequeno" texto="Poco concurrido" />
          </View>
        </View>

        {/* Sección 2: Verificación de EscenarioCard dinámico */}
        <View style={styles.seccion}>
          <Text style={styles.tituloSeccion}>
            Componente: EscenarioCard Dinámico
          </Text>
          <Text style={styles.descripcionSeccion}>
            Prueba de datos dinámicos, carga de imagen, fallback y evento onPress:
          </Text>
        </View>

        {ESCENARIOS_MOCK.map((escenario) => (
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
    marginBottom: 20,
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
  seccion: {
    paddingHorizontal: 20,
    marginBottom: 12,
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
    marginBottom: 8,
  },
  filaBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  espacioFinal: {
    height: 32,
  },
});
