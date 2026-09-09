/**
 * @file Badge.js
 * @description Componente visual atómico para mostrar etiquetas y estados en Cátedras ACUDE
 * (cupos disponibles, agotado/sobrecupo, inscrito, deportiva, cultural).
 * Diseñado con contraste accesible y estilo tipo 'píldora' para su uso en tarjetas y pantallas.
 * @module components/Badge
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * Paleta semántica para estados y etiquetas de Cátedras ACUDE.
 * Cada clave contiene color de fondo, texto y borde para mantener coherencia visual.
 */
const PALETA_ESTADOS = {
  disponible: {
    fondo: '#E8F5E9',
    texto: '#1B5E20',
    borde: '#C8E6C9',
    labelPorDefecto: 'Cupos disponibles',
  },
  agotado: {
    fondo: '#FFF3E0',
    texto: '#D84315',
    borde: '#FFE0B2',
    labelPorDefecto: 'Agotado (Ver sobrecupo)',
  },
  inscrito: {
    fondo: '#E0F2FE',
    texto: '#0369A1',
    borde: '#BAE6FD',
    labelPorDefecto: 'Inscrito',
  },
  cultural: {
    fondo: '#F3E8FF',
    texto: '#7E22CE',
    borde: '#E9D5FF',
    labelPorDefecto: 'Cultural',
  },
  deportiva: {
    fondo: '#ECFDF5',
    texto: '#047857',
    borde: '#A7F3D0',
    labelPorDefecto: 'Deportiva',
  },
  mantenimiento: {
    fondo: '#FFFBEB',
    texto: '#B45309',
    borde: '#FDE68A',
    labelPorDefecto: 'Mantenimiento',
  },
  cancelado: {
    fondo: '#FEF2F2',
    texto: '#B91C1C',
    borde: '#FECACA',
    labelPorDefecto: 'Cancelada',
  },
  info: {
    fondo: '#F0F9FF',
    texto: '#0284C7',
    borde: '#BAE6FD',
    labelPorDefecto: 'Info',
  },
  default: {
    fondo: '#F1F5F9',
    texto: '#475569',
    borde: '#E2E8F0',
    labelPorDefecto: 'General',
  },
};

/**
 * Componente Badge reutilizable.
 *
 * @param {Object} props
 * @param {string} [props.texto] - Texto a mostrar. Si no se provee, usa el label por defecto del estado.
 * @param {('disponible'|'agotado'|'inscrito'|'cultural'|'deportiva'|'mantenimiento'|'cancelado'|'info'|'default')} [props.estado='default']
 * @param {('pequeno'|'mediano')} [props.tamano='mediano']
 * @param {object} [props.style]
 * @param {object} [props.textStyle]
 * @returns {React.JSX.Element}
 */
export default function Badge({
  texto,
  estado = 'default',
  tamano = 'mediano',
  style,
  textStyle,
}) {
  const estadoNormalizado = (estado || 'default').toLowerCase().trim();
  const configuracion = PALETA_ESTADOS[estadoNormalizado] || PALETA_ESTADOS.default;
  const textoAMostrar = texto || configuracion.labelPorDefecto;

  return (
    <View
      style={[
        styles.badge,
        tamano === 'pequeno' ? styles.badgePequeno : styles.badgeMediano,
        {
          backgroundColor: configuracion.fondo,
          borderColor: configuracion.borde,
        },
        style,
      ]}
    >
      <View
        style={[
          styles.puntoIndicador,
          { backgroundColor: configuracion.texto },
          tamano === 'pequeno' && styles.puntoPequeno,
        ]}
      />
      <Text
        style={[
          styles.texto,
          tamano === 'pequeno' ? styles.textoPequeno : styles.textoMediano,
          { color: configuracion.texto },
          textStyle,
        ]}
        numberOfLines={1}
      >
        {textoAMostrar}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 20,
    borderWidth: 1,
  },
  badgeMediano: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgePequeno: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  puntoIndicador: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  puntoPequeno: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginRight: 4,
  },
  texto: {
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  textoMediano: {
    fontSize: 12,
  },
  textoPequeno: {
    fontSize: 11,
  },
});
