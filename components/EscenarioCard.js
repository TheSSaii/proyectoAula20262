/**
 * @file EscenarioCard.js
 * @description Componente visual para renderizar la tarjeta resumen de un escenario deportivo.
 * Diseñado para listas optimizadas (FlatList) con soporte de estados dinámicos,
 * fallback visual ante ausencia de imágenes y respuesta táctil para navegación.
 * @module components/EscenarioCard
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Badge from './Badge';

/**
 * Mapeo de íconos o representaciones visuales según el tipo de escenario deportivo.
 */
const ICONO_POR_TIPO = {
  fútbol: '⚽',
  futbol: '⚽',
  baloncesto: '🏀',
  voleibol: '🏐',
  gimnasio: '🏋️',
  acondicionamiento: '💪',
  tenis: '🏓',
  piscina: '🏊',
  general: '🏟️',
};

/**
 * Obtiene un emoji representativo según el tipo de deporte.
 * @param {string} tipo - Tipo de deporte o escenario.
 * @returns {string} Emoji representativo.
 */
function obtenerIconoTipo(tipo) {
  if (!tipo) return ICONO_POR_TIPO.general;
  const normalizado = tipo.toLowerCase().trim();
  for (const [clave, icono] of Object.entries(ICONO_POR_TIPO)) {
    if (normalizado.includes(clave)) return icono;
  }
  return ICONO_POR_TIPO.general;
}

/**
 * Componente de tarjeta de escenario deportivo.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {Object} props.escenario - Datos del escenario deportivo.
 * @param {string} props.escenario.id - Identificador único del escenario.
 * @param {string} props.escenario.nombre - Nombre del escenario (ej. 'Cancha Sintética 1').
 * @param {string} props.escenario.tipo - Tipo de deporte o instalación (ej. 'Fútbol').
 * @param {string} props.escenario.ubicacion - Ubicación física dentro del campus TdeA.
 * @param {number|string} props.escenario.capacidad - Capacidad máxima de personas.
 * @param {('disponible'|'mantenimiento'|'ocupado')} props.escenario.estado - Estado actual del escenario.
 * @param {string} [props.escenario.imagenUrl] - URL remota de la fotografía del escenario.
 * @param {Function} [props.onPress] - Callback ejecutado al pulsar la tarjeta. Recibe el objeto escenario.
 * @param {object} [props.style] - Estilos adicionales para el contenedor exterior.
 * @returns {React.JSX.Element}
 */
export default function EscenarioCard({ escenario, onPress, style }) {
  const [errorImagen, setErrorImagen] = useState(false);

  // Manejo de valores por defecto seguros para evitar caídas por datos incompletos
  const {
    id = '',
    nombre = 'Escenario sin nombre',
    tipo = 'General',
    ubicacion = 'Tecnológico de Antioquia',
    capacidad = 0,
    estado = 'disponible',
    imagenUrl,
  } = escenario || {};

  const iconoDeporte = obtenerIconoTipo(tipo);
  const tieneImagenValida = Boolean(imagenUrl) && !errorImagen;

  const handlePress = () => {
    if (typeof onPress === 'function') {
      onPress(escenario);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={handlePress}
      style={[styles.tarjeta, style]}
      accessibilityRole="button"
      accessibilityLabel={`Escenario: ${nombre}, Tipo: ${tipo}, Estado: ${estado}`}
    >
      {/* Contenedor de Imagen de Cabecera con Badge superpuesto */}
      <View style={styles.contenedorImagen}>
        {tieneImagenValida ? (
          <Image
            source={{ uri: imagenUrl }}
            style={styles.imagen}
            resizeMode="cover"
            onError={() => setErrorImagen(true)}
          />
        ) : (
          <View style={styles.placeholderImagen}>
            <Text style={styles.placeholderIcono}>{iconoDeporte}</Text>
            <Text style={styles.placeholderTexto}>{tipo}</Text>
          </View>
        )}

        {/* Badge flotante de estado en la esquina superior derecha */}
        <View style={styles.badgeFlotante}>
          <Badge estado={estado} tamano="pequeno" />
        </View>

        {/* Tag con el tipo de escenario en la esquina inferior izquierda */}
        <View style={styles.tipoFlotante}>
          <Text style={styles.tipoTexto}>
            {iconoDeporte} {tipo}
          </Text>
        </View>
      </View>

      {/* Cuerpo de información del escenario */}
      <View style={styles.cuerpo}>
        {/* Título principal */}
        <Text style={styles.nombre} numberOfLines={2}>
          {nombre}
        </Text>

        {/* Fila de Ubicación */}
        <View style={styles.filaInfo}>
          <Text style={styles.iconoDetalle}>📍</Text>
          <Text style={styles.textoUbicacion} numberOfLines={1}>
            {ubicacion}
          </Text>
        </View>

        {/* Fila inferior: Capacidad y llamada a la acción */}
        <View style={styles.filaInferior}>
          <View style={styles.filaCapacidad}>
            <Text style={styles.iconoDetalle}>👥</Text>
            <Text style={styles.textoCapacidad}>
              Capacidad: <Text style={styles.textoCapacidadValor}>{capacidad}</Text> pers.
            </Text>
          </View>

          <View style={styles.botonAccion}>
            <Text style={styles.textoBotonAccion}>Ver disponibilidad →</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: 'hidden',
    // Sombra para iOS
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    // Elevación para Android
    elevation: 3,
    borderWidth: Platform.OS === 'ios' ? 1 : 0,
    borderColor: '#F1F5F9',
  },
  contenedorImagen: {
    width: '100%',
    height: 160,
    backgroundColor: '#E2E8F0',
    position: 'relative',
  },
  imagen: {
    width: '100%',
    height: '100%',
  },
  placeholderImagen: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderIcono: {
    fontSize: 44,
    marginBottom: 4,
  },
  placeholderTexto: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  badgeFlotante: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  tipoFlotante: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tipoTexto: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  cuerpo: {
    padding: 16,
  },
  nombre: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
    lineHeight: 22,
  },
  filaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconoDetalle: {
    fontSize: 14,
    marginRight: 6,
  },
  textoUbicacion: {
    fontSize: 13,
    color: '#64748B',
    flex: 1,
  },
  filaInferior: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  filaCapacidad: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textoCapacidad: {
    fontSize: 13,
    color: '#475569',
  },
  textoCapacidadValor: {
    fontWeight: '700',
    color: '#0F172A',
  },
  botonAccion: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  textoBotonAccion: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563EB',
  },
});
