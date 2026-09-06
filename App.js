/**
 * @file App.js
 * @description Punto de entrada de la aplicación CanchaYa.
 * [CICLO 3 - T06]: Verificación en vivo de la capa de servicios (escenariosService.js)
 * consumiendo datos directamente desde Cloud Firestore y renderizando con EscenarioCard.
 */

import React, { useState, useEffect, useCallback } from 'react';
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
  RefreshControl,
} from 'react-native';
import Badge from './components/Badge';
import EscenarioCard from './components/EscenarioCard';
import { getEscenarios, getEscenarioById } from './services/escenariosService';
import { ejecutarSeedEscenarios } from './services/seedEscenarios';

export default function App() {
  const [escenarios, setEscenarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);
  const [errorConsulta, setErrorConsulta] = useState(null);
  const [consultandoId, setConsultandoId] = useState(null);

  // Función para consultar el catálogo desde Firestore usando el servicio
  const cargarCatalogo = useCallback(async () => {
    try {
      setErrorConsulta(null);
      const datos = await getEscenarios();
      setEscenarios(datos);
    } catch (error) {
      console.error('Error en cargarCatalogo:', error);
      setErrorConsulta(error.message);
    } finally {
      setCargando(false);
      setRefrescando(false);
    }
  }, []);

  useEffect(() => {
    cargarCatalogo();
  }, [cargarCatalogo]);

  const handleRefrescar = () => {
    setRefrescando(true);
    cargarCatalogo();
  };

  // Verificación del método getEscenarioById al pulsar una tarjeta
  const handleSeleccionarEscenario = async (escenarioSeleccionado) => {
    try {
      setConsultandoId(escenarioSeleccionado.id);

      // Llamada real a getEscenarioById() para validar el segundo método de T06
      const escenarioDetallado = await getEscenarioById(escenarioSeleccionado.id);

      if (!escenarioDetallado) {
        Alert.alert('Aviso', 'El escenario ya no existe en la base de datos.');
        return;
      }

      Alert.alert(
        `✅ getEscenarioById('${escenarioDetallado.id}')`,
        `Nombre: ${escenarioDetallado.nombre}\n` +
          `Tipo: ${escenarioDetallado.tipo}\n` +
          `Ubicación: ${escenarioDetallado.ubicacion}\n` +
          `Capacidad: ${escenarioDetallado.capacidad} personas\n` +
          `Estado: ${escenarioDetallado.estado.toUpperCase()}\n` +
          `Descripción: ${escenarioDetallado.descripcion || 'Sin descripción'}`,
        [{ text: 'Aceptar', style: 'default' }]
      );
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setConsultandoId(null);
    }
  };

  // En caso de que se necesite resembrar
  const handleResembrar = async () => {
    try {
      setCargando(true);
      await ejecutarSeedEscenarios();
      await cargarCatalogo();
      Alert.alert('Éxito', 'Base de datos sincronizada y catálogo recargado.');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refrescando} onRefresh={handleRefrescar} />
        }
      >
        {/* Encabezado */}
        <View style={styles.encabezado}>
          <Text style={styles.tituloApp}>🏟️ CanchaYa</Text>
          <Text style={styles.subtituloApp}>
            Tecnológico de Antioquia · Verificación T06 (escenariosService)
          </Text>
        </View>

        {/* Panel informativo de la capa de servicio */}
        <View style={styles.panelInfo}>
          <View style={styles.filaPanel}>
            <Text style={styles.tituloPanel}>📡 Capa de Servicios Conectada</Text>
            <Badge
              estado={errorConsulta ? 'ocupado' : cargando ? 'mantenimiento' : 'disponible'}
              texto={
                errorConsulta
                  ? 'Error de Red'
                  : cargando
                  ? 'Consultando...'
                  : `${escenarios.length} en Firestore`
              }
              tamano="pequeno"
            />
          </View>
          <Text style={styles.textoPanel}>
            Los datos a continuación se obtienen en tiempo real con{' '}
            <Text style={styles.codigo}>getEscenarios()</Text>. Toca una tarjeta para
            probar <Text style={styles.codigo}>getEscenarioById()</Text>.
          </Text>

          <View style={styles.filaBotones}>
            <TouchableOpacity
              style={styles.botonSecundario}
              onPress={handleRefrescar}
              disabled={cargando}
            >
              <Text style={styles.textoBotonSecundario}>🔄 Recargar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.botonSecundario}
              onPress={handleResembrar}
              disabled={cargando}
            >
              <Text style={styles.textoBotonSecundario}>🌱 Resembrar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Estado de carga inicial */}
        {cargando && !refrescando && (
          <View style={styles.centroCarga}>
            <ActivityIndicator size="large" color="#0284C7" />
            <Text style={styles.textoCargando}>
              Consultando colección 'escenarios' en Firestore...
            </Text>
          </View>
        )}

        {/* Estado de error */}
        {errorConsulta && !cargando && (
          <View style={styles.cajaError}>
            <Text style={styles.tituloError}>Error al cargar catálogo</Text>
            <Text style={styles.detalleError}>{errorConsulta}</Text>
            <TouchableOpacity style={styles.botonReintentar} onPress={cargarCatalogo}>
              <Text style={styles.textoBotonReintentar}>Reintentar consulta</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Listado dinámico obtenido de Firestore */}
        {!cargando && !errorConsulta && (
          <>
            <View style={styles.seccion}>
              <Text style={styles.tituloSeccion}>
                Catálogo desde Firestore ({escenarios.length})
              </Text>
              <Text style={styles.descripcionSeccion}>
                Documentos leídos de la colección oficial de Firebase:
              </Text>
            </View>

            {escenarios.length === 0 ? (
              <View style={styles.cajaVacia}>
                <Text style={styles.textoVacio}>No hay escenarios en Firestore.</Text>
                <TouchableOpacity style={styles.botonReintentar} onPress={handleResembrar}>
                  <Text style={styles.textoBotonReintentar}>Sembrar escenarios ahora</Text>
                </TouchableOpacity>
              </View>
            ) : (
              escenarios.map((item) => (
                <EscenarioCard
                  key={item.id}
                  escenario={item}
                  onPress={handleSeleccionarEscenario}
                />
              ))
            )}
          </>
        )}

        {/* Indicador de consulta puntual */}
        {consultandoId && (
          <View style={styles.overlayCargaPuntual}>
            <ActivityIndicator size="small" color="#FFFFFF" />
            <Text style={styles.textoCargaPuntual}>
              Consultando getEscenarioById('{consultandoId}')...
            </Text>
          </View>
        )}

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
    marginBottom: 14,
  },
  tituloApp: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  subtituloApp: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  panelInfo: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filaPanel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  tituloPanel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  textoPanel: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 17,
    marginBottom: 10,
  },
  codigo: {
    fontWeight: '700',
    color: '#0284C7',
    fontFamily: 'monospace',
  },
  filaBotones: {
    flexDirection: 'row',
    gap: 8,
  },
  botonSecundario: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  textoBotonSecundario: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  centroCarga: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  textoCargando: {
    marginTop: 12,
    fontSize: 13,
    color: '#64748B',
  },
  cajaError: {
    backgroundColor: '#FEF2F2',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
    alignItems: 'center',
  },
  tituloError: {
    fontSize: 14,
    fontWeight: '700',
    color: '#991B1B',
    marginBottom: 4,
  },
  detalleError: {
    fontSize: 12,
    color: '#B91C1C',
    textAlign: 'center',
    marginBottom: 12,
  },
  botonReintentar: {
    backgroundColor: '#0284C7',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  textoBotonReintentar: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  cajaVacia: {
    padding: 30,
    alignItems: 'center',
  },
  textoVacio: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 12,
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
  overlayCargaPuntual: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  textoCargaPuntual: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  espacioFinal: {
    height: 40,
  },
});
