/**
 * @file SlotPicker.js
 * @description Componente visual para renderizar las franjas horarias fijas y recurrentes
 * de una cátedra ACUDE.
 * En lugar de turnos de alquiler sueltos, presenta las sesiones semanales oficiales:
 * día de la semana, franja de clase, espacio físico dentro del Bloque 10 y docente a cargo.
 * @module components/SlotPicker
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

/**
 * Visualizador de franjas y sesiones de cátedras ACUDE.
 *
 * @param {Object} props
 * @param {Array<Object>} [props.sesiones=[]] - Lista de sesiones recurrentes.
 * @param {string} [props.diaFiltro=null] - Filtro opcional por día específico.
 * @param {Function} [props.onSelectSesion] - Callback al pulsar una sesión.
 * @param {object} [props.style]
 * @returns {React.JSX.Element}
 */
export default function SlotPicker({
  sesiones = [],
  diaFiltro = null,
  onSelectSesion,
  style,
}) {
  const sesionesFiltradas = diaFiltro
    ? sesiones.filter(
        (s) => s.dia?.toLowerCase() === diaFiltro.toLowerCase()
      )
    : sesiones;

  if (sesiones.length === 0) {
    return (
      <View style={[styles.contenedorVacio, style]}>
        <Text style={styles.iconoVacio}>⏰</Text>
        <Text style={styles.textoVacio}>
          No hay franjas horarias configuradas para esta cátedra.
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.contenedor, style]}>
      <Text style={styles.tituloSeccion}>⏰ Franjas y Sesiones Semanales</Text>
      <Text style={styles.descripcionSeccion}>
        Horarios fijos en los que debes asistir en el campus Robledo (Bloque 10):
      </Text>

      <View style={styles.listaSesiones}>
        {sesionesFiltradas.map((sesion, index) => {
          const rangoHora = `${sesion.horaInicio || '00:00'} a ${
            sesion.horaFin || '00:00'
          }`;

          return (
            <TouchableOpacity
              key={sesion.id || `sesion-${index}`}
              activeOpacity={onSelectSesion ? 0.8 : 1}
              onPress={() => onSelectSesion && onSelectSesion(sesion)}
              style={styles.tarjetaSesion}
            >
              {/* Columna Izquierda: Día y Hora */}
              <View style={styles.columnaTiempo}>
                <View style={styles.badgeDia}>
                  <Text style={styles.textoBadgeDia}>{sesion.dia}</Text>
                </View>
                <Text style={styles.textoHora}>{rangoHora}</Text>
              </View>

              {/* Divisor vertical */}
              <View style={styles.divisorVertical} />

              {/* Columna Derecha: Ubicación y Docente */}
              <View style={styles.columnaInfo}>
                <View style={styles.filaInfo}>
                  <Text style={styles.iconoDetalle}>📍</Text>
                  <Text style={styles.textoLugar} numberOfLines={2}>
                    {sesion.lugar || 'Campus Robledo - Bloque 10'}
                  </Text>
                </View>

                {sesion.docente && (
                  <View style={styles.filaInfo}>
                    <Text style={styles.iconoDetalle}>👨‍🏫</Text>
                    <Text style={styles.textoDocente} numberOfLines={1}>
                      {sesion.docente}
                    </Text>
                  </View>
                )}

                <View style={styles.tagPresencial}>
                  <Text style={styles.textoTagPresencial}>
                    • Asistencia presencial directa
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginVertical: 8,
  },
  tituloSeccion: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  descripcionSeccion: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 14,
    lineHeight: 18,
  },
  listaSesiones: {
    gap: 10,
  },
  tarjetaSesion: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  columnaTiempo: {
    width: 110,
    alignItems: 'flex-start',
  },
  badgeDia: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 6,
  },
  textoBadgeDia: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  textoHora: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  divisorVertical: {
    width: 1,
    height: '80%',
    backgroundColor: '#CBD5E1',
    marginHorizontal: 10,
  },
  columnaInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  filaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  iconoDetalle: {
    fontSize: 12,
    marginRight: 6,
  },
  textoLugar: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
    flex: 1,
  },
  textoDocente: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
    flex: 1,
  },
  tagPresencial: {
    marginTop: 2,
  },
  textoTagPresencial: {
    fontSize: 11,
    color: '#0284C7',
    fontWeight: '600',
  },
  contenedorVacio: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  iconoVacio: {
    fontSize: 32,
    marginBottom: 8,
  },
  textoVacio: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
  },
});
