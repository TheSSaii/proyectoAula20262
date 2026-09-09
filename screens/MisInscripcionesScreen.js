/**
 * @file MisInscripcionesScreen.js
 * @description Panel personal del estudiante para consultar y gestionar sus Cátedras ACUDE matriculadas.
 * Muestra: cronograma de clases, docente, espacio en Bloque 10, regla del 80% y
 * cancelación atómica con Alert nativo que libera el cupo en Firestore para otros estudiantes.
 * @module screens/MisInscripcionesScreen
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import Badge from '../components/Badge';
import { useAuth } from '../contexts/AuthContexto';
import {
  getMisInscripciones,
  cancelarInscripcion,
} from '../services/inscripcionesService';

export default function MisInscripcionesScreen({ navigation }) {
  const { user } = useAuth();
  const [inscripciones, setInscripciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);
  const [cancelandoId, setCancelandoId] = useState(null);

  const cargarInscripciones = useCallback(async () => {
    if (!user?.uid) {
      setCargando(false);
      setRefrescando(false);
      return;
    }

    try {
      const lista = await getMisInscripciones(user.uid);
      setInscripciones(lista);
    } catch (err) {
      console.error('Error al cargar inscripciones:', err);
    } finally {
      setCargando(false);
      setRefrescando(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    cargarInscripciones();
  }, [cargarInscripciones]);

  // Recargar al volver a enfocar la pestaña
  useEffect(() => {
    const unsubscribe = navigation?.addListener?.('focus', () => {
      cargarInscripciones();
    });
    return unsubscribe;
  }, [navigation, cargarInscripciones]);

  const handleRefrescar = () => {
    setRefrescando(true);
    cargarInscripciones();
  };

  const handleConfirmarCancelacion = (item) => {
    Alert.alert(
      'Cancelar Inscripción',
      `¿Estás seguro de cancelar tu inscripción a "${item.nombreAcude}"?\n\n⚠️ Tu cupo quedará inmediatamente liberado para que otro estudiante pueda matricularse o solicitar sobrecupo presencial.`,
      [
        { text: 'No, Conservar mi cupo', style: 'cancel' },
        {
          text: 'Sí, Cancelar Inscripción',
          style: 'destructive',
          onPress: async () => {
            try {
              setCancelandoId(item.id);
              await cancelarInscripcion(item.id, item.idAcude);

              // Eliminar de la lista local
              setInscripciones((prev) => prev.filter((i) => i.id !== item.id));

              Alert.alert(
                'Inscripción Cancelada',
                'Tu cupo ha sido liberado exitosamente en el sistema.'
              );
            } catch (err) {
              Alert.alert('Error al cancelar', err.message);
            } finally {
              setCancelandoId(null);
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => {
    const estaCancelando = cancelandoId === item.id;
    const horarios = item.horarios || [];
    const resumenHorarios =
      horarios.length > 0
        ? horarios
            .map((h) => `${h.dia || ''}: ${h.horaInicio || ''} - ${h.horaFin || ''}`)
            .join(' | ')
        : 'Horario según programación institucional';

    return (
      <View style={styles.tarjetaInscripcion}>
        {/* Cabecera de la tarjeta */}
        <View style={styles.cabeceraTarjeta}>
          <View style={styles.columnaTitulo}>
            <Badge
              estado={item.categoria === 'Cultural' ? 'cultural' : 'deportiva'}
              texto={item.categoria}
              tamano="pequeno"
            />
            <Text style={styles.nombreAcude}>{item.nombreAcude}</Text>
          </View>
          <Badge estado="inscrito" texto="Matriculado" tamano="pequeno" />
        </View>

        {/* Detalles operativos */}
        <View style={styles.cuerpoTarjeta}>
          <View style={styles.filaDetalle}>
            <Text style={styles.iconoDetalle}>👨‍🏫</Text>
            <Text style={styles.textoDetalle}>Docente: {item.docente}</Text>
          </View>

          <View style={styles.filaDetalle}>
            <Text style={styles.iconoDetalle}>📍</Text>
            <Text style={styles.textoDetalle}>Lugar: {item.ubicacion}</Text>
          </View>

          <View style={styles.filaDetalle}>
            <Text style={styles.iconoDetalle}>⏰</Text>
            <Text style={styles.textoDetalleResaltado}>
              {resumenHorarios}
            </Text>
          </View>

          <View style={styles.cajaRecordatorio}>
            <Text style={styles.textoRecordatorio}>
              📌 Recuerda cumplir con el 80% de asistencia mínima para validar créditos de Bienestar.
            </Text>
          </View>
        </View>

        {/* Pie de tarjeta con botón de cancelación */}
        <View style={styles.pieTarjeta}>
          <Text style={styles.fechaInscripcion}>
            Inscrito: {item.fechaInscripcion?.slice(0, 10) || 'Semestre 2026-2'}
          </Text>

          <TouchableOpacity
            style={styles.botonCancelar}
            onPress={() => handleConfirmarCancelacion(item)}
            disabled={estaCancelando}
            activeOpacity={0.8}
          >
            {estaCancelando ? (
              <ActivityIndicator size="small" color="#DC2626" />
            ) : (
              <Text style={styles.textoBotonCancelar}>Liberar Cupo</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.contenedor}>
      {cargando && !refrescando ? (
        <View style={styles.centro}>
          <ActivityIndicator size="large" color="#0284C7" />
          <Text style={styles.textoCargando}>Cargando tus inscripciones...</Text>
        </View>
      ) : inscripciones.length === 0 ? (
        <View style={styles.centroVacio}>
          <View style={styles.iconoVacioContenedor}>
            <Text style={styles.iconoVacio}>📋</Text>
          </View>
          <Text style={styles.tituloVacio}>Sin Cátedras Inscritas</Text>
          <Text style={styles.descripcionVacio}>
            Aún no te has matriculado en ninguna Cátedra ACUDE para este semestre.
            Explora la oferta de bienestar y reserva tu cupo semanal.
          </Text>
          <TouchableOpacity
            style={styles.botonExplorar}
            onPress={() => navigation.navigate('InicioTab')}
          >
            <Text style={styles.textoBotonExplorar}>
              Explorar Cátedras ACUDE →
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.contenedorLista}>
          <FlatList
            data={inscripciones}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listaScroll}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refrescando}
                onRefresh={handleRefrescar}
                colors={['#0284C7']}
              />
            }
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  centro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  textoCargando: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748B',
  },
  centroVacio: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  iconoVacioContenedor: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  iconoVacio: {
    fontSize: 36,
  },
  tituloVacio: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  descripcionVacio: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  botonExplorar: {
    backgroundColor: '#0284C7',
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 12,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 2,
  },
  textoBotonExplorar: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  contenedorLista: {
    flex: 1,
    padding: 16,
  },
  listaScroll: {
    paddingBottom: 24,
  },
  tarjetaInscripcion: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cabeceraTarjeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  columnaTitulo: {
    flex: 1,
    paddingRight: 8,
    gap: 4,
  },
  nombreAcude: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  cuerpoTarjeta: {
    marginBottom: 12,
  },
  filaDetalle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  iconoDetalle: {
    fontSize: 13,
    marginRight: 6,
  },
  textoDetalle: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
    flex: 1,
  },
  textoDetalleResaltado: {
    fontSize: 13,
    color: '#0284C7',
    fontWeight: '700',
    flex: 1,
  },
  cajaRecordatorio: {
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 6,
  },
  textoRecordatorio: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 16,
  },
  pieTarjeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  fechaInscripcion: {
    fontSize: 11,
    color: '#94A3B8',
  },
  botonCancelar: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  textoBotonCancelar: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
  },
});
