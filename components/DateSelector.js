/**
 * @file DateSelector.js
 * @description Componente visual interactivo para visualizar los días fijos de encuentro semanal
 * de una cátedra ACUDE (Lunes a Sábado).
 * Resalta los días específicos de clase para que el estudiante evalúe de un vistazo
 * si existen cruces de horario con sus materias académicas de Campus TdeA.
 * @module components/DateSelector
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const DIAS_SEMANA = [
  { clave: 'Lunes', abreviatura: 'Lun', nombreCompleto: 'Lunes' },
  { clave: 'Martes', abreviatura: 'Mar', nombreCompleto: 'Martes' },
  { clave: 'Miércoles', abreviatura: 'Mié', nombreCompleto: 'Miércoles' },
  { clave: 'Jueves', abreviatura: 'Jue', nombreCompleto: 'Jueves' },
  { clave: 'Viernes', abreviatura: 'Vie', nombreCompleto: 'Viernes' },
  { clave: 'Sábado', abreviatura: 'Sáb', nombreCompleto: 'Sábado' },
];

/**
 * Normaliza nombres de días (remueve tildes y mayúsculas) para comparaciones seguras.
 */
function normalizarTexto(txt = '') {
  return txt
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Componente DateSelector adaptado a la agenda semanal de cátedras ACUDE.
 *
 * @param {Object} props
 * @param {Array<string>} [props.diasActivos=[]] - Días de la semana en los que sesiona el taller (ej. ['Martes', 'Jueves']).
 * @param {string} [props.diaSeleccionado=null] - Día actualmente seleccionado para filtrar/inspeccionar.
 * @param {Function} [props.onSelectDia] - Callback ejecutado al pulsar un día.
 * @param {object} [props.style]
 * @returns {React.JSX.Element}
 */
export default function DateSelector({
  diasActivos = [],
  diaSeleccionado = null,
  onSelectDia,
  style,
}) {
  const diasActivosNormalizados = diasActivos.map(normalizarTexto);

  return (
    <View style={[styles.contenedor, style]}>
      <View style={styles.encabezado}>
        <Text style={styles.titulo}>📅 Días de Encuentro Semanal</Text>
        <Text style={styles.subtitulo}>
          Verifica que no colisione con tu horario de clases en Campus TdeA
        </Text>
      </View>

      <View style={styles.filaDias}>
        {DIAS_SEMANA.map((item) => {
          const claveNorm = normalizarTexto(item.clave);
          const tieneClase = diasActivosNormalizados.includes(claveNorm);
          const estaSeleccionado =
            diaSeleccionado && normalizarTexto(diaSeleccionado) === claveNorm;

          return (
            <TouchableOpacity
              key={item.clave}
              activeOpacity={tieneClase ? 0.75 : 1}
              disabled={!tieneClase && !onSelectDia}
              onPress={() => {
                if (typeof onSelectDia === 'function') {
                  onSelectDia(item.clave);
                }
              }}
              style={[
                styles.cajaDia,
                tieneClase && styles.cajaDiaActivo,
                estaSeleccionado && styles.cajaDiaSeleccionado,
              ]}
            >
              <Text
                style={[
                  styles.textoAbreviatura,
                  tieneClase && styles.textoAbreviaturaActiva,
                  estaSeleccionado && styles.textoAbreviaturaSeleccionada,
                ]}
              >
                {item.abreviatura}
              </Text>

              {tieneClase ? (
                <View
                  style={[
                    styles.puntoSesion,
                    estaSeleccionado && styles.puntoSesionSeleccionado,
                  ]}
                />
              ) : (
                <Text style={styles.textoLibre}>—</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.leyenda}>
        <View style={styles.itemLeyenda}>
          <View style={[styles.circuloMuestra, styles.muestraActiva]} />
          <Text style={styles.textoLeyenda}>Sesión programada en Campus</Text>
        </View>
        <View style={styles.itemLeyenda}>
          <View style={[styles.circuloMuestra, styles.muestraInactiva]} />
          <Text style={styles.textoLeyenda}>Sin actividad</Text>
        </View>
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
  encabezado: {
    marginBottom: 14,
  },
  titulo: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  subtitulo: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  filaDias: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  cajaDia: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cajaDiaActivo: {
    backgroundColor: '#E0F2FE',
    borderColor: '#BAE6FD',
  },
  cajaDiaSeleccionado: {
    backgroundColor: '#0284C7',
    borderColor: '#0284C7',
  },
  textoAbreviatura: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
    marginBottom: 4,
  },
  textoAbreviaturaActiva: {
    color: '#0369A1',
    fontWeight: '700',
  },
  textoAbreviaturaSeleccionada: {
    color: '#FFFFFF',
  },
  puntoSesion: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0284C7',
  },
  puntoSesionSeleccionado: {
    backgroundColor: '#FFFFFF',
  },
  textoLibre: {
    fontSize: 10,
    color: '#CBD5E1',
  },
  leyenda: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  itemLeyenda: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circuloMuestra: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  muestraActiva: {
    backgroundColor: '#0284C7',
  },
  muestraInactiva: {
    backgroundColor: '#CBD5E1',
  },
  textoLeyenda: {
    fontSize: 11,
    color: '#64748B',
  },
});
