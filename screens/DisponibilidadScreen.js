/**
 * @file DisponibilidadScreen.js
 * @description Pantalla para la selección de fecha y consulta de franjas horarias libres/ocupadas.
 * Estructurada en la arquitectura como la pantalla de paso hacia el Motor de Disponibilidad (Programador 3 - T12).
 * Incluye un botón de prueba temporal para que el Programador 4 valide su flujo de reserva (T14/T15)[cite: 1, 2].
 * @module screens/DisponibilidadScreen
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Badge from '../components/Badge';
export default function DisponibilidadScreen({ route, navigation }) {
  const { escenario } = route.params || {};

  return (
    <SafeAreaView style={styles.contenedor}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Cabecera del escenario seleccionado */}
        <View style={styles.tarjetaEscenario}>
          <View style={styles.filaEncabezado}>
            <Text style={styles.tituloEscenario}>
              {escenario?.nombre || 'Escenario Seleccionado'}
            </Text>
            <Badge estado={escenario?.estado || 'disponible'} tamano="pequeno" />
          </View>
          <Text style={styles.ubicacionEscenario}>📍 {escenario?.ubicacion}</Text>
          <Text style={styles.capacidadEscenario}>
            👥 Aforo máximo: {escenario?.capacidad || 0} personas
          </Text>
        </View>

        {/* Módulo de Disponibilidad (Prog 3) */}
        <View style={styles.panelProg3}>
          <View style={styles.iconoPanel}>
            <Text style={styles.iconoTexto}>📅</Text>
          </View>
          <Text style={styles.tituloPanel}>Motor de Disponibilidad (T10 / T12)</Text>
          <Text style={styles.descripcionPanel}>
            Esta vista está vinculada correctamente en la navegación Stack y recibe el
            escenario con ID: <Text style={styles.codigo}>{escenario?.id}</Text>.
          </Text>
          <View style={styles.cajaComponentesPendientes}>
            <Text style={styles.tituloPendientes}>Componentes a integrar por Programador 3:</Text>
            <Text style={styles.itemPendiente}>• DateSelector (T11) - Selector de fecha</Text>
            <Text style={styles.itemPendiente}>• SlotPicker (T11) - Selector de turnos 6:00 a 20:00</Text>
            <Text style={styles.itemPendiente}>• consultarDisponibilidad(id, fecha) (T10)</Text>
          </View>

          
          <View style={styles.contenedorBotones}>
            
            {/* Botón Volver de Prog 3 */}
            <TouchableOpacity
              style={styles.botonVolver}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.textoBotonVolver}>← Volver a Ficha Técnica</Text>
            </TouchableOpacity>

            
            <TouchableOpacity
              style={styles.botonTestP4}
              onPress={() => navigation.navigate('ConfirmacionReserva', {
                // Mandamos datos falsos (Mocks) para simular que el usuario ya eligió una franja
                escenario: escenario || { id: 'TEST-123', nombre: 'Cancha Sintética (Prueba)', ubicacion: 'Zona Sur' },
                fecha: '2026-09-12', // Una fecha de ejemplo para probar
                hora: '14:00' // Una hora de ejemplo para probar
                // NOTA: Cuando Programador 3 termine, simplemente se usará navigation.navigate desde su SlotPicker.
              })}
            >
              <Text style={styles.textoBotonTest}>
                🧪 [TEST P4] Simular Selección y saltar a Confirmación
              </Text>
            </TouchableOpacity>
            {/* --- FIN DEL BOTÓN DE PRUEBA --- */}

          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scroll: {
    padding: 16,
  },
  tarjetaEscenario: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  filaEncabezado: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
    gap: 8,
  },
  tituloEscenario: {
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  ubicacionEscenario: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 4,
  },
  capacidadEscenario: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0284C7',
  },
  panelProg3: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    alignItems: 'center',
  },
  iconoPanel: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  iconoTexto: {
    fontSize: 30,
  },
  tituloPanel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0369A1',
    marginBottom: 6,
  },
  descripcionPanel: {
    fontSize: 13,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  codigo: {
    fontFamily: 'monospace',
    fontWeight: '700',
    color: '#0284C7',
  },
  cajaComponentesPendientes: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  tituloPendientes: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  itemPendiente: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
  },
  // --- NUEVO CONTENEDOR DE BOTONES ---
  contenedorBotones: {
    width: '100%',
    gap: 12, // Espacio ordenado entre botones
  },
  botonVolver: {
    width: '100%',
    backgroundColor: '#0284C7',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  textoBotonVolver: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  // --- ESTILOS PARA EL BOTÓN VERDE DE PRUEBA P4 ---
  botonTestP4: {
    width: '100%',
    backgroundColor: '#16A34A', // Un verde distinto para diferenciarlo
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  textoBotonTest: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});