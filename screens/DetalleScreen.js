/**
 * @file DetalleScreen.js
 * @description Pantalla de detalle de escenario deportivo (Tarea T09).
 * Ficha técnica ampliada que consume el objeto escenario pasado vía route.params,
 * renderiza la galería fotográfica en alta definición con fallback visual, especificaciones
 * operativas del campus Robledo (horarios, normas institucionales) y enlace al motor de disponibilidad (Prog 3).
 * @module screens/DetalleScreen
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import Badge from '../components/Badge';

/**
 * Pantalla de Detalle del Escenario Deportivo.
 *
 * @param {Object} props
 * @param {Object} props.route - React Navigation route con route.params.escenario.
 * @param {Object} props.navigation - React Navigation prop.
 * @returns {React.JSX.Element}
 */
export default function DetalleScreen({ route, navigation }) {
  const { escenario } = route.params || {};
  const [errorImagen, setErrorImagen] = useState(false);

  if (!escenario) {
    return (
      <SafeAreaView style={styles.contenedor}>
        <View style={styles.centroMensaje}>
          <Text style={styles.textoNoEncontrado}>
            No se recibió información de ningún escenario.
          </Text>
          <TouchableOpacity
            style={styles.botonRegresar}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.textoBotonRegresar}>Volver al Catálogo</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const {
    id = '',
    nombre = 'Escenario deportivo',
    tipo = 'General',
    ubicacion = 'Campus Robledo',
    capacidad = 0,
    estado = 'disponible',
    descripcion = 'Sin descripción detallada.',
    imagenUrl,
  } = escenario;

  const tieneImagenValida = Boolean(imagenUrl) && !errorImagen;

  /**
   * Conduce al motor de disponibilidad de franjas horarias (Programador 3 - T12).
   */
  const handleConsultarDisponibilidad = () => {
    if (estado === 'mantenimiento') {
      Alert.alert(
        'Escenario No Disponible',
        'Este escenario se encuentra temporalmente en labores de mantenimiento preventivo. No admite reservas actualmente.'
      );
      return;
    }

    try {
      // Intenta navegar si ya está registrada la pantalla de Disponibilidad
      navigation.navigate('Disponibilidad', { escenarioId: id, escenario });
    } catch (e) {
      // Alerta informativa si la tarea T12 de P3 aún no está incorporada al Stack
      Alert.alert(
        'Paso hacia Disponibilidad (T12)',
        `Escenario: "${nombre}"\nID: ${id}\n\nListo para vincular con DisponibilidadScreen del Programador 3.`
      );
    }
  };

  return (
    <SafeAreaView style={styles.contenedor}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Cabecera visual con fotografía / placeholder */}
        <View style={styles.contenedorImagen}>
          {tieneImagenValida ? (
            <Image
              source={{ uri: imagenUrl }}
              style={styles.imagen}
              resizeMode="cover"
              onError={() => setErrorImagen(true)}
            />
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderIcono}>🏟️</Text>
              <Text style={styles.placeholderTexto}>{tipo}</Text>
            </View>
          )}

          {/* Badge de estado en esquina superior */}
          <View style={styles.badgeFlotante}>
            <Badge estado={estado} tamano="mediano" />
          </View>
        </View>

        {/* Información del escenario */}
        <View style={styles.cuerpo}>
          {/* Tag de Categoría */}
          <View style={styles.tagTipo}>
            <Text style={styles.textoTagTipo}>DEPORTE INSTITUCIONAL · {tipo.toUpperCase()}</Text>
          </View>

          <Text style={styles.titulo}>{nombre}</Text>

          {/* Tarjeta de Especificaciones Clave */}
          <View style={styles.tarjetaFicha}>
            <View style={styles.filaFicha}>
              <Text style={styles.iconoFicha}>📍</Text>
              <View style={styles.infoFicha}>
                <Text style={styles.labelFicha}>Ubicación Institucional</Text>
                <Text style={styles.valorFicha}>{ubicacion}</Text>
              </View>
            </View>

            <View style={styles.divisor} />

            <View style={styles.filaFicha}>
              <Text style={styles.iconoFicha}>👥</Text>
              <View style={styles.infoFicha}>
                <Text style={styles.labelFicha}>Aforo / Capacidad</Text>
                <Text style={styles.valorFicha}>{capacidad} usuarios permitidos</Text>
              </View>
            </View>

            <View style={styles.divisor} />

            <View style={styles.filaFicha}>
              <Text style={styles.iconoFicha}>⏰</Text>
              <View style={styles.infoFicha}>
                <Text style={styles.labelFicha}>Horario de Servicio</Text>
                <Text style={styles.valorFicha}>Lunes a Sábado · 06:00 a 20:00</Text>
              </View>
            </View>
          </View>

          {/* Descripción del espacio */}
          <Text style={styles.seccionTitulo}>Descripción del Espacio</Text>
          <Text style={styles.seccionContenido}>{descripcion}</Text>

          {/* Normas y Recomendaciones para la reserva */}
          <Text style={styles.seccionTitulo}>Reglamento de Uso (TdeA)</Text>
          <View style={styles.cajaNormas}>
            <Text style={styles.itemNorma}>• Presentar carné institucional o cédula al ingresar.</Text>
            <Text style={styles.itemNorma}>• Uso obligatorio de calzado y vestimenta deportiva adecuada.</Text>
            <Text style={styles.itemNorma}>• Presentarse 10 minutos antes del inicio de la franja horaria.</Text>
            <Text style={styles.itemNorma}>• Cuidar los implementos y elementos deportivos facilitados.</Text>
          </View>

          {/* Botón de acción principal */}
          <TouchableOpacity
            style={[
              styles.botonAccion,
              estado === 'mantenimiento' && styles.botonAccionDeshabilitado,
            ]}
            onPress={handleConsultarDisponibilidad}
            activeOpacity={0.85}
          >
            <Text style={styles.textoBotonAccion}>
              {estado === 'mantenimiento'
                ? '⚠️ Escenario en Mantenimiento'
                : '📅 Consultar Disponibilidad de Franjas →'}
            </Text>
          </TouchableOpacity>
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
    paddingBottom: 40,
  },
  contenedorImagen: {
    width: '100%',
    height: 250,
    backgroundColor: '#E2E8F0',
    position: 'relative',
  },
  imagen: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#CBD5E1',
  },
  placeholderIcono: {
    fontSize: 54,
  },
  placeholderTexto: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
  badgeFlotante: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  cuerpo: {
    padding: 20,
  },
  tagTipo: {
    alignSelf: 'flex-start',
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginBottom: 8,
  },
  textoTagTipo: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0369A1',
    letterSpacing: 0.5,
  },
  titulo: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 16,
    lineHeight: 30,
  },
  tarjetaFicha: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  filaFicha: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconoFicha: {
    fontSize: 22,
    marginRight: 12,
  },
  infoFicha: {
    flex: 1,
  },
  labelFicha: {
    fontSize: 11,
    color: '#64748B',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  valorFicha: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 1,
  },
  divisor: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  seccionTitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 8,
    marginBottom: 8,
  },
  seccionContenido: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
    marginBottom: 18,
  },
  cajaNormas: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 14,
    marginBottom: 24,
  },
  itemNorma: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 20,
    marginBottom: 4,
  },
  botonAccion: {
    backgroundColor: '#0284C7',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  botonAccionDeshabilitado: {
    backgroundColor: '#94A3B8',
  },
  textoBotonAccion: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  centroMensaje: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  textoNoEncontrado: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 16,
  },
  botonRegresar: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  textoBotonRegresar: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
