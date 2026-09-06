/**
 * @file Badge.js
 * @description Componente visual atómico para mostrar etiquetas y estados (disponible, mantenimiento, ocupado).
 * Diseñado con contraste accesible y estilo tipo 'píldora' para su uso en tarjetas y pantallas.
 * @module components/Badge
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * Paleta semántica para estados y etiquetas informativas.
 * Cada clave contiene color de fondo, texto y borde para mantener coherencia visual.
 */
const PALETA_ESTADOS = {
  disponible: {
    fondo: '#E8F5E9',
    texto: '#2E7D32',
    borde: '#C8E6C9',
    labelPorDefecto: 'Disponible',
  },
  mantenimiento: {
    fondo: '#FFF8E1',
    texto: '#F57F17',
    borde: '#FFE082',
    labelPorDefecto: 'Mantenimiento',
  },
  ocupado: {
    fondo: '#FFEBEE',
    texto: '#C62828',
    borde: '#FFCDD2',
    labelPorDefecto: 'Ocupado',
  },
  info: {
    fondo: '#E3F2FD',
    texto: '#1565C0',
    borde: '#BBDEFB',
    labelPorDefecto: 'Info',
  },
  default: {
    fondo: '#F5F5F5',
    texto: '#616161',
    borde: '#E0E0E0',
    labelPorDefecto: 'General',
  },
};

/**
 * Componente Badge reutilizable.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {string} [props.texto] - Texto a mostrar. Si no se provee, usa el label por defecto del estado.
 * @param {('disponible'|'mantenimiento'|'ocupado'|'info'|'default')} [props.estado='default'] - Clave semántica del estado.
 * @param {('pequeno'|'mediano')} [props.tamano='mediano'] - Tamaño visual del badge.
 * @param {object} [props.style] - Estilos adicionales para el contenedor del badge.
 * @param {object} [props.textStyle] - Estilos adicionales para el texto del badge.
 * @returns {React.JSX.Element}
 */
export default function Badge({
  texto,
  estado = 'default',
  tamano = 'mediano',
  style,
  textStyle,
}) {
  // Normalizar estado a minúsculas para evitar errores de tipeo
  const estadoNormalizado = (estado || 'default').toLowerCase();
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
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  textoMediano: {
    fontSize: 12,
  },
  textoPequeno: {
    fontSize: 11,
  },
});
