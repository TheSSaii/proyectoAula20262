/**
 * @file AcudeCard.js
 * @description Componente visual para renderizar la tarjeta de una Cátedra o Actividad ACUDE
 * (Bienestar Institucional TdeA).
 * Muestra: fotografía HD con fallback visual, badges semánticos de categoría y cupos,
 * docente asignado, ubicación física en Bloque 10, resumen de franja horaria fija semanal
 * y aforo disponible.
 * @module components/AcudeCard
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
 * Íconos temáticos según la disciplina de la cátedra.
 */
const ICONO_POR_DISCIPLINA = {
  fútbol: '⚽',
  futbol: '⚽',
  danza: '💃',
  teatro: '🎭',
  fitness: '💪',
  acondicionamiento: '🏋️',
  voleibol: '🏐',
  tenis: '🏓',
  ajedrez: '♟️',
  cultural: '🎨',
  deportiva: '🏃',
};

function obtenerIconoDisciplina(disciplina = '', categoria = '') {
  const texto = `${disciplina} ${categoria}`.toLowerCase();
  for (const [clave, icono] of Object.entries(ICONO_POR_DISCIPLINA)) {
    if (texto.includes(clave)) return icono;
  }
  return categoria.toLowerCase() === 'cultural' ? '🎨' : '🏃';
}

/**
 * Genera un resumen legible de los días y horas de las sesiones semanales.
 * Ej: "Mar y Jue · 14:00 - 16:00"
 */
function formatearResumenHorario(horarios = []) {
  if (!horarios || horarios.length === 0) {
    return 'Horario por programar';
  }

  const dias = horarios.map((h) => (h.dia || '').slice(0, 3));
  const diasTexto = dias.join(' y ');
  const primeraSesion = horarios[0];
  const rango = `${primeraSesion.horaInicio || '00:00'} - ${primeraSesion.horaFin || '00:00'}`;

  return `${diasTexto} · ${rango}`;
}

/**
 * Tarjeta de Cátedra ACUDE.
 *
 * @param {Object} props
 * @param {Object} props.acude - Datos normalizados de la cátedra.
 * @param {Function} [props.onPress] - Callback al pulsar la tarjeta.
 * @param {object} [props.style] - Estilos adicionales.
 * @returns {React.JSX.Element}
 */
export default function AcudeCard({ acude, onPress, style }) {
  const [errorImagen, setErrorImagen] = useState(false);

  const {
    id = '',
    nombre = 'Cátedra sin nombre',
    categoria = 'Deportiva',
    disciplina = 'General',
    ubicacion = 'Campus Robledo - Bloque 10',
    docente = 'Docente asignado',
    cupoTotal = 25,
    cuposDisponibles = 0,
    horarios = [],
    imagenUrl,
  } = acude || {};

  const icono = obtenerIconoDisciplina(disciplina, categoria);
  const tieneImagenValida = Boolean(imagenUrl) && !errorImagen;
  const resumenHorario = formatearResumenHorario(horarios);
  const estadoCupo = cuposDisponibles > 0 ? 'disponible' : 'agotado';

  const handlePress = () => {
    if (typeof onPress === 'function') {
      onPress(acude);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={handlePress}
      style={[styles.tarjeta, style]}
      accessibilityRole="button"
      accessibilityLabel={`Cátedra ACUDE: ${nombre}, Categoría: ${categoria}, Cupos disponibles: ${cuposDisponibles}`}
    >
      {/* Cabecera con Imagen / Placeholder */}
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
            <Text style={styles.placeholderIcono}>{icono}</Text>
            <Text style={styles.placeholderTexto}>{disciplina || categoria}</Text>
          </View>
        )}

        {/* Badge de Categoría en esquina superior izquierda */}
        <View style={styles.badgeCategoriaFlotante}>
          <Badge
            estado={categoria === 'Cultural' ? 'cultural' : 'deportiva'}
            texto={`${icono} ${categoria}`}
            tamano="pequeno"
          />
        </View>

        {/* Badge de Cupo en esquina superior derecha */}
        <View style={styles.badgeCupoFlotante}>
          <Badge
            estado={estadoCupo}
            texto={
              cuposDisponibles > 0
                ? `${cuposDisponibles} cupos`
                : 'Agotado (Sobrecupo)'
            }
            tamano="pequeno"
          />
        </View>

        {/* Franja horaria destacada sobre la imagen */}
        <View style={styles.franjaHorariaFlotante}>
          <Text style={styles.textoFranjaFlotante}>⏰ {resumenHorario}</Text>
        </View>
      </View>

      {/* Cuerpo Informativo */}
      <View style={styles.cuerpo}>
        {/* Título de la actividad */}
        <Text style={styles.nombre} numberOfLines={2}>
          {nombre}
        </Text>

        {/* Docente / Tutor */}
        <View style={styles.filaDetalle}>
          <Text style={styles.iconoDetalle}>👨‍🏫</Text>
          <Text style={styles.textoDocente} numberOfLines={1}>
            {docente}
          </Text>
        </View>

        {/* Ubicación en Campus (Bloque 10) */}
        <View style={styles.filaDetalle}>
          <Text style={styles.iconoDetalle}>📍</Text>
          <Text style={styles.textoUbicacion} numberOfLines={1}>
            {ubicacion}
          </Text>
        </View>

        {/* Fila inferior: Indicador de aforo y enlace a horarios */}
        <View style={styles.filaInferior}>
          <View style={styles.contenedorCupos}>
            <Text style={styles.labelCupos}>
              Aforo: <Text style={styles.valorCupos}>{cuposDisponibles}</Text> / {cupoTotal} disp.
            </Text>
          </View>

          <View style={styles.botonAccion}>
            <Text style={styles.textoBotonAccion}>Ver ficha y horarios →</Text>
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
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: Platform.OS === 'ios' ? 1 : 0,
    borderColor: '#E2E8F0',
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
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderIcono: {
    fontSize: 46,
    marginBottom: 4,
  },
  placeholderTexto: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0369A1',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  badgeCategoriaFlotante: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  badgeCupoFlotante: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  franjaHorariaFlotante: {
    position: 'absolute',
    bottom: 8,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.82)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  textoFranjaFlotante: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  cuerpo: {
    padding: 16,
  },
  nombre: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
    lineHeight: 22,
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
  textoDocente: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '600',
    flex: 1,
  },
  textoUbicacion: {
    fontSize: 12,
    color: '#64748B',
    flex: 1,
  },
  filaInferior: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    marginTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  contenedorCupos: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelCupos: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  valorCupos: {
    fontWeight: '800',
    color: '#0284C7',
  },
  botonAccion: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  textoBotonAccion: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0284C7',
  },
});
