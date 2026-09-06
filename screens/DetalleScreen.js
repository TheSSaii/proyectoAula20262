/**
 * @file DetalleScreen.js
 * @description Ficha técnica detallada del escenario deportivo seleccionado.
 * Recibe el escenario a través de route.params, muestra su fotografía en gran formato,
 * estado actual, especificaciones de capacidad y botón de enlace a Disponibilidad (Prog 3).
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

export default function DetalleScreen({ route, navigation }) {
  const { escenario } = route.params || {};
  const [errorImagen, setErrorImagen] = useState(false);

  if (!escenario) {
    return (
      <SafeAreaView style={styles.contenedor}>
        <View style={styles.centroMensaje}>
          <Text style={styles.textoNoEncontrado}>
            No se seleccionó ningún escenario válido.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const {
    nombre = 'Escenario',
    tipo = 'General',
    ubicacion = 'Campus Robledo',
    capacidad = 0,
    estado = 'disponible',
    descripcion = 'Sin descripción disponible.',
    imagenUrl,
  } = escenario;

  const tieneImagenValida = Boolean(imagenUrl) && !errorImagen;

  const handleIrADisponibilidad = () => {
    // Si la pantalla de disponibilidad ya está registrada en el Stack, navega hacia ella
    if (navigation?.navigate) {
      try {
        navigation.navigate('Disponibilidad', { escenario });
      } catch (error) {
        Alert.alert(
          'Motor de Disponibilidad',
          `Escenario listo: "${nombre}".\nEsta ruta conectará con DisponibilidadScreen (Programador 3 - T12).`
        );
      }
    }
  };

  return (
    <SafeAreaView style={styles.contenedor}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Imagen de Cabecera */}
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

          <View style={styles.badgeFlotante}>
            <Badge estado={estado} tamano="mediano" />
          </View>
        </View>

        {/* Información Detallada */}
        <View style={styles.cuerpo}>
          <View style={styles.tagTipo}>
            <Text style={styles.textoTagTipo}>DEPORTE / BIENESTAR: {tipo.toUpperCase()}</Text>
          </View>

          <Text style={styles.titulo}>{nombre}</Text>

          {/* Ficha de Ubicación y Capacidad */}
          <View style={styles.tarjetaResumen}>
            <View style={styles.filaResumen}>
              <Text style={styles.iconoResumen}>📍</Text>
              <View style={styles.columnaTexto}>
                <Text style={styles.labelResumen}>Ubicación</Text>
                <Text style={styles.valorResumen}>{ubicacion}</Text>
              </View>
            </View>

            <View style={styles.separador} />

            <View style={styles.filaResumen}>
              <Text style={styles.iconoResumen}>👥</Text>
              <View style={styles.columnaTexto}>
                <Text style={styles.labelResumen}>Capacidad Máxima</Text>
                <Text style={styles.valorResumen}>{capacidad} personas simultáneas</Text>
              </View>
            </View>
          </View>

          {/* Descripción del escenario */}
          <Text style={styles.subtituloBloque}>Descripción del Espacio</Text>
          <Text style={styles.textoDescripcion}>{descripcion}</Text>

          {/* Botón hacia el flujo de Disponibilidad */}
          <TouchableOpacity
            style={[
              styles.botonReservar,
              estado === 'mantenimiento' && styles.botonDeshabilitado,
            ]}
            onPress={handleIrADisponibilidad}
            disabled={estado === 'mantenimiento'}
            activeOpacity={0.85}
          >
            <Text style={styles.textoBotonReservar}>
              {estado === 'mantenimiento'
                ? '⚠️ Escenario en Mantenimiento'
                : '📅 Consultar Disponibilidad y Horarios'}
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
    paddingBottom: 32,
  },
  contenedorImagen: {
    width: '100%',
    height: 240,
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
  },
  placeholderIcono: {
    fontSize: 50,
  },
  placeholderTexto: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
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
    paddingVertical: 4,
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
  tarjetaResumen: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  filaResumen: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconoResumen: {
    fontSize: 22,
    marginRight: 12,
  },
  columnaTexto: {
    flex: 1,
  },
  labelResumen: {
    fontSize: 11,
    color: '#64748B',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  valorResumen: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 1,
  },
  separador: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  subtituloBloque: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  textoDescripcion: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
    marginBottom: 24,
  },
  botonReservar: {
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
  botonDeshabilitado: {
    backgroundColor: '#94A3B8',
  },
  textoBotonReservar: {
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
  },
});
