/**
 * @file DetalleScreen.js
 * @description Ficha técnica completa de una Cátedra o Actividad ACUDE (Bienestar Institucional TdeA).
 * Muestra: información formativa, docente, aforo en Bloque 10, regla del 80% de asistencia mínima,
 * botón para consultar el cronograma semanal en HorariosScreen y acción de matrícula con
 * runTransaction de Firestore.
 * @module screens/DetalleScreen
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Badge from '../components/Badge';
import { useAuth } from '../contexts/AuthContexto';
import {
  inscribirEstudiante,
  verificarInscripcionPrevia,
} from '../services/inscripcionesService';
import { getAcudeById } from '../services/acudesService';

export default function DetalleScreen({ route, navigation }) {
  const { acude: acudeParam } = route.params || {};
  const { user } = useAuth();

  const [acude, setAcude] = useState(acudeParam || null);
  const [errorImagen, setErrorImagen] = useState(false);
  const [estaInscrito, setEstaInscrito] = useState(false);
  const [verificandoInscripcion, setVerificandoInscripcion] = useState(true);
  const [inscribiendo, setInscribiendo] = useState(false);

  // Consulta el estado de inscripción previo del estudiante
  const revisarInscripcion = useCallback(async () => {
    if (!acude?.id || !user?.uid) {
      setVerificandoInscripcion(false);
      return;
    }

    try {
      const inscripcion = await verificarInscripcionPrevia(acude.id, user.uid);
      setEstaInscrito(Boolean(inscripcion));

      // Actualizar datos del acude en segundo plano para tener el cupo más reciente
      const acudeActualizado = await getAcudeById(acude.id);
      if (acudeActualizado) {
        setAcude(acudeActualizado);
      }
    } catch (err) {
      console.warn('Error al verificar estado de inscripción:', err);
    } finally {
      setVerificandoInscripcion(false);
    }
  }, [acude?.id, user?.uid]);

  useEffect(() => {
    revisarInscripcion();
  }, [revisarInscripcion]);

  if (!acude) {
    return (
      <SafeAreaView style={styles.contenedor}>
        <View style={styles.centroMensaje}>
          <Text style={styles.textoNoEncontrado}>
            No se recibió información de la cátedra ACUDE.
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
    nombre = 'Cátedra ACUDE',
    categoria = 'Deportiva',
    disciplina = 'General',
    ubicacion = 'Campus Robledo - Bloque 10',
    docente = 'Docente asignado',
    cupoTotal = 25,
    cuposDisponibles = 0,
    descripcion = 'Sin descripción formativa disponible.',
    requisitos = 'Carné institucional TdeA y vestimenta deportiva adecuada.',
    asistenciaMinima = '80% de asistencia obligatoria.',
    imagenUrl,
  } = acude;

  const tieneImagenValida = Boolean(imagenUrl) && !errorImagen;
  const hayCupos = cuposDisponibles > 0;

  const handleIrAHorarios = () => {
    navigation.navigate('Horarios', { acude });
  };

  const handleInscribirse = () => {
    if (!user) {
      Alert.alert(
        'Iniciar Sesión',
        'Debes iniciar sesión para inscribirte a una cátedra ACUDE.'
      );
      return;
    }

    if (!hayCupos) {
      Alert.alert(
        'Cupos Oficiales Agotados',
        'Los cupos en la app están agotados. Puedes consultar el cronograma y lugar para solicitar sobrecupo presencial en la primera sesión directamente con el docente.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Ver Horarios', onPress: handleIrAHorarios },
        ]
      );
      return;
    }

    Alert.alert(
      'Confirmar Inscripción',
      `¿Deseas inscribirte a "${nombre}"?\n\nDocente: ${docente}\nLugar: ${ubicacion}\n\n⚠️ Recuerda: Se requiere el 80% de asistencia mínima para acreditar el taller. Inasistencias reiteradas liberan el cupo para otro estudiante.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí, Inscribirme',
          onPress: async () => {
            try {
              setInscribiendo(true);
              const respuesta = await inscribirEstudiante(id, user.uid, {
                email: user.email,
                nombre: user.displayName,
              });

              setEstaInscrito(true);
              // Decrementar cupo en la vista local
              setAcude((prev) => ({
                ...prev,
                cuposDisponibles: Math.max(0, prev.cuposDisponibles - 1),
              }));

              Alert.alert(
                '¡Inscripción Exitosa!',
                respuesta.mensaje || 'Te has inscrito formalmente en esta cátedra ACUDE.',
                [
                  {
                    text: 'Ver Mis Inscripciones',
                    onPress: () => navigation.navigate('MisInscripcionesTab'),
                  },
                  { text: 'Aceptar', style: 'default' },
                ]
              );
            } catch (err) {
              Alert.alert('No fue posible inscribirte', err.message);
            } finally {
              setInscribiendo(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.contenedor}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Fotografía cabecera con badges superpuestos */}
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
              <Text style={styles.placeholderIcono}>
                {categoria === 'Cultural' ? '🎭' : '⚽'}
              </Text>
              <Text style={styles.placeholderTexto}>{disciplina}</Text>
            </View>
          )}

          {/* Badge de Categoría */}
          <View style={styles.badgeFlotanteIzquierda}>
            <Badge
              estado={categoria === 'Cultural' ? 'cultural' : 'deportiva'}
              texto={categoria}
              tamano="mediano"
            />
          </View>

          {/* Badge de Estado de Cupos */}
          <View style={styles.badgeFlotanteDerecha}>
            <Badge
              estado={hayCupos ? 'disponible' : 'agotado'}
              texto={
                hayCupos
                  ? `${cuposDisponibles} cupos libres`
                  : 'Agotado (Ver sobrecupo)'
              }
              tamano="mediano"
            />
          </View>
        </View>

        {/* Cuerpo de la ficha técnica */}
        <View style={styles.cuerpo}>
          <Text style={styles.subtituloCategoria}>
            BIENESTAR INSTITUCIONAL · CÁTEDRA {categoria.toUpperCase()}
          </Text>
          <Text style={styles.titulo}>{nombre}</Text>

          {/* Tarjeta de Especificaciones (Docente, Ubicación, Aforo) */}
          <View style={styles.tarjetaFicha}>
            <View style={styles.filaFicha}>
              <Text style={styles.iconoFicha}>👨‍🏫</Text>
              <View style={styles.infoFicha}>
                <Text style={styles.labelFicha}>Docente / Instructor</Text>
                <Text style={styles.valorFicha}>{docente}</Text>
              </View>
            </View>

            <View style={styles.divisor} />

            <View style={styles.filaFicha}>
              <Text style={styles.iconoFicha}>📍</Text>
              <View style={styles.infoFicha}>
                <Text style={styles.labelFicha}>Lugar en Campus Robledo</Text>
                <Text style={styles.valorFicha}>{ubicacion}</Text>
              </View>
            </View>

            <View style={styles.divisor} />

            <View style={styles.filaFicha}>
              <Text style={styles.iconoFicha}>👥</Text>
              <View style={styles.infoFicha}>
                <Text style={styles.labelFicha}>Aforo Institucional</Text>
                <Text style={styles.valorFicha}>
                  {cuposDisponibles} disponibles de {cupoTotal} plazas totales
                </Text>
              </View>
            </View>
          </View>

          {/* Botón de Enlace a Cronograma y Horarios Semanales */}
          <TouchableOpacity
            style={styles.botonHorarios}
            onPress={handleIrAHorarios}
            activeOpacity={0.8}
          >
            <View style={styles.filaBotonHorarios}>
              <Text style={styles.iconoBotonHorarios}>📅</Text>
              <View style={styles.infoBotonHorarios}>
                <Text style={styles.tituloBotonHorarios}>
                  Ver Cronograma Semanal y Sobrecupo
                </Text>
                <Text style={styles.subtituloBotonHorarios}>
                  Consulta franjas fijas para evitar cruces con Campus TdeA
                </Text>
              </View>
              <Text style={styles.flechaBotonHorarios}>→</Text>
            </View>
          </TouchableOpacity>

          {/* Descripción pedagógica del taller */}
          <Text style={styles.seccionTitulo}>Descripción del Taller</Text>
          <Text style={styles.seccionContenido}>{descripcion}</Text>

          {/* Requisitos y Materiales */}
          <Text style={styles.seccionTitulo}>Requisitos para la Clase</Text>
          <Text style={styles.seccionContenido}>{requisitos}</Text>

          {/* Regla Reglamentaria de Asistencia */}
          <Text style={styles.seccionTitulo}>Reglamento de Asistencia (TdeA)</Text>
          <View style={styles.cajaAsistencia}>
            <Text style={styles.itemAsistencia}>
              • <Text style={styles.textoDestacado}>80% de asistencia mínima:</Text> Obligatoria para acreditar horas de Bienestar Universitario.
            </Text>
            <Text style={styles.itemAsistencia}>
              • <Text style={styles.textoDestacado}>Liberación de cupos:</Text> Si un estudiante matriculado incurre en inasistencias reiteradas, su curso se cancela y el cupo queda liberado para otro compañero.
            </Text>
            <Text style={styles.itemAsistencia}>
              • <Text style={styles.textoDestacado}>Sobrecupo presencial:</Text> Si no alcanzaste cupo oficial, asiste a la primera sesión directamente con el docente en el Bloque 10 para solicitar sobrecupo si hay cupos liberados.
            </Text>
          </View>

          {/* Botón CTA de Acción */}
          {verificandoInscripcion ? (
            <View style={styles.contenedorCargaBoton}>
              <ActivityIndicator size="small" color="#0284C7" />
              <Text style={styles.textoCargandoBoton}>
                Comprobando estado de matrícula...
              </Text>
            </View>
          ) : estaInscrito ? (
            <View style={styles.cajaYaInscrito}>
              <Text style={styles.textoYaInscrito}>
                ✅ Ya te encuentras formalmente inscrito en esta cátedra
              </Text>
              <TouchableOpacity
                style={styles.botonVerMisInscripciones}
                onPress={() => navigation.navigate('MisInscripcionesTab')}
              >
                <Text style={styles.textoBotonVerMisInscripciones}>
                  Ir a Mis Inscripciones →
                </Text>
              </TouchableOpacity>
            </View>
          ) : hayCupos ? (
            <TouchableOpacity
              style={[
                styles.botonInscribirme,
                inscribiendo && styles.botonDeshabilitado,
              ]}
              onPress={handleInscribirse}
              disabled={inscribiendo}
              activeOpacity={0.85}
            >
              {inscribiendo ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.textoBotonInscribirme}>
                  📝 Inscribirme en esta Cátedra
                </Text>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.botonSobrecupo}
              onPress={handleIrAHorarios}
              activeOpacity={0.85}
            >
              <Text style={styles.textoBotonSobrecupo}>
                ⚠️ Cupo Oficial Lleno — Ver Lugar para Sobrecupo Presencial
              </Text>
            </TouchableOpacity>
          )}
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
    backgroundColor: '#E0F2FE',
  },
  placeholderIcono: {
    fontSize: 54,
  },
  placeholderTexto: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '700',
    color: '#0369A1',
  },
  badgeFlotanteIzquierda: {
    position: 'absolute',
    top: 14,
    left: 14,
  },
  badgeFlotanteDerecha: {
    position: 'absolute',
    top: 14,
    right: 14,
  },
  cuerpo: {
    padding: 20,
  },
  subtituloCategoria: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0284C7',
    letterSpacing: 0.5,
    marginBottom: 6,
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
    marginBottom: 16,
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
  botonHorarios: {
    backgroundColor: '#F0F9FF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    padding: 14,
    marginBottom: 20,
  },
  filaBotonHorarios: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconoBotonHorarios: {
    fontSize: 26,
    marginRight: 12,
  },
  infoBotonHorarios: {
    flex: 1,
  },
  tituloBotonHorarios: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0369A1',
  },
  subtituloBotonHorarios: {
    fontSize: 12,
    color: '#0284C7',
    marginTop: 2,
  },
  flechaBotonHorarios: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0284C7',
    marginLeft: 8,
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
    marginBottom: 16,
  },
  cajaAsistencia: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 24,
  },
  itemAsistencia: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 20,
    marginBottom: 8,
  },
  textoDestacado: {
    fontWeight: '700',
    color: '#0F172A',
  },
  contenedorCargaBoton: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoCargandoBoton: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 6,
  },
  cajaYaInscrito: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  textoYaInscrito: {
    fontSize: 14,
    fontWeight: '700',
    color: '#15803D',
    textAlign: 'center',
    marginBottom: 8,
  },
  botonVerMisInscripciones: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  textoBotonVerMisInscripciones: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0284C7',
  },
  botonInscribirme: {
    backgroundColor: '#0284C7',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  botonSobrecupo: {
    backgroundColor: '#EA580C',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#EA580C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  botonDeshabilitado: {
    backgroundColor: '#94A3B8',
  },
  textoBotonInscribirme: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  textoBotonSobrecupo: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    paddingHorizontal: 8,
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
