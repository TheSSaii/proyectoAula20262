/**
 * @file SlotPicker.js
 * @description Componente visual para renderizar las franjas horarias fijas y recurrentes
 * de una cátedra ACUDE.
 * Implementa la paleta de identidad oficial TdeA (Verde Pino, Verde Lima, Gris Neutro, Negro Institucional)
 * e iconografía profesional de Ionicons.
 * @module components/SlotPicker
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORES, SOMBRAS } from '../constants/theme';

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
        <Ionicons name="time-outline" size={36} color={COLORES.grisNeutro} />
        <Text style={styles.textoVacio}>
          No hay franjas horarias configuradas para esta cátedra.
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.contenedor, style]}>
      <View style={styles.filaTituloSeccion}>
        <Ionicons name="time-outline" size={18} color={COLORES.verdePino} style={{ marginRight: 6 }} />
        <Text style={styles.tituloSeccion}>Franjas y Sesiones Semanales</Text>
      </View>
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
                  <Ionicons name="location-outline" size={14} color={COLORES.grisNeutro} style={styles.iconoDetalle} />
                  <Text style={styles.textoLugar} numberOfLines={2}>
                    {sesion.lugar || 'Campus Robledo - Bloque 10'}
                  </Text>
                </View>

                {sesion.docente && (
                  <View style={styles.filaInfo}>
                    <Ionicons name="person-outline" size={14} color={COLORES.verdePino} style={styles.iconoDetalle} />
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
    backgroundColor: COLORES.superficie,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORES.borde,
    marginVertical: 8,
    ...SOMBRAS.suave,
  },
  contenedorVacio: {
    backgroundColor: COLORES.superficie,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORES.borde,
    marginVertical: 8,
  },
  textoVacio: {
    fontSize: 13,
    color: COLORES.grisNeutro,
    textAlign: 'center',
    marginTop: 8,
  },
  filaTituloSeccion: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tituloSeccion: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORES.negroInstitucional,
  },
  descripcionSeccion: {
    fontSize: 12,
    color: COLORES.grisNeutro,
    marginTop: 3,
    marginBottom: 14,
  },
  listaSesiones: {
    gap: 10,
  },
  tarjetaSesion: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORES.superficieGris,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORES.borde,
  },
  columnaTiempo: {
    width: 105,
    alignItems: 'flex-start',
  },
  badgeDia: {
    backgroundColor: COLORES.acentoClaro,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#CBE58B',
  },
  textoBadgeDia: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORES.verdePino,
  },
  textoHora: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORES.negroInstitucional,
  },
  divisorVertical: {
    width: 1,
    height: '80%',
    backgroundColor: COLORES.borde,
    marginHorizontal: 12,
  },
  columnaInfo: {
    flex: 1,
  },
  filaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  iconoDetalle: {
    marginRight: 6,
  },
  textoLugar: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORES.negroInstitucional,
    flex: 1,
  },
  textoDocente: {
    fontSize: 12,
    color: COLORES.grisNeutro,
    flex: 1,
  },
  tagPresencial: {
    marginTop: 2,
  },
  textoTagPresencial: {
    fontSize: 10,
    color: COLORES.verdePino,
    fontWeight: '600',
  },
});
