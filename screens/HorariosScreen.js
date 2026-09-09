/**
 * @file HorariosScreen.js
 * @description Pantalla para la consulta del cronograma semanal detallado de una Cátedra ACUDE.
 * Integra:
 * - DateSelector: visualizador interactivo de días de clase para evitar cruces con Campus TdeA.
 * - SlotPicker: desglose de sesiones fijas (día, franja horaria, espacio en Bloque 10 y docente).
 * - Módulo de Sobrecupo Presencial Directo: orientación al estudiante para presentarse
 *   físicamente en la primera sesión directamente con el profesor en el aula/escenario sin trámites de oficina.
 * @module screens/HorariosScreen
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Badge from '../components/Badge';
import DateSelector from '../components/DateSelector';
import SlotPicker from '../components/SlotPicker';
import { getHorariosAcude } from '../services/disponibilidadService';

export default function HorariosScreen({ route, navigation }) {
  const { acude } = route.params || {};

  const [horariosData, setHorariosData] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [diaSeleccionado, setDiaSeleccionado] = useState(null);

  useEffect(() => {
    async function cargarHorarios() {
      if (!acude?.id) {
        setCargando(false);
        return;
      }

      try {
        const data = await getHorariosAcude(acude.id);
        setHorariosData(data);
      } catch (err) {
        console.error('Error al cargar cronograma semanal:', err);
      } finally {
        setCargando(false);
      }
    }

    cargarHorarios();
  }, [acude?.id]);

  if (!acude) {
    return (
      <SafeAreaView style={styles.contenedor}>
        <View style={styles.centro}>
          <Text style={styles.textoError}>No se recibieron datos de la cátedra.</Text>
          <TouchableOpacity
            style={styles.botonVolver}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.textoBotonVolver}>Volver al Catálogo</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const sesiones = horariosData?.sesiones || acude.horarios || [];
  const diasActivos = horariosData?.diasSemanales || sesiones.map((s) => s.dia);
  const cuposDisponibles = acude.cuposDisponibles ?? 0;
  const hayCupos = cuposDisponibles > 0;

  return (
    <SafeAreaView style={styles.contenedor}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Cabecera Informativa de la Cátedra */}
        <View style={styles.tarjetaCabecera}>
          <View style={styles.filaEncabezado}>
            <View style={styles.columnaTitulo}>
              <Text style={styles.subtituloCampus}>Campus Robledo · Bloque 10</Text>
              <Text style={styles.tituloCatedra}>{acude.nombre}</Text>
            </View>
            <Badge
              estado={hayCupos ? 'disponible' : 'agotado'}
              texto={hayCupos ? `${cuposDisponibles} cupos` : 'Agotado'}
              tamano="pequeno"
            />
          </View>

          <View style={styles.filaInfoCabecera}>
            <Text style={styles.iconoInfo}>👨‍🏫</Text>
            <Text style={styles.textoDocente}>{acude.docente}</Text>
          </View>

          <View style={styles.filaInfoCabecera}>
            <Text style={styles.iconoInfo}>📍</Text>
            <Text style={styles.textoUbicacion}>{acude.ubicacion}</Text>
          </View>
        </View>

        {/* Componente DateSelector: Días semanales para validar contra Campus TdeA */}
        <DateSelector
          diasActivos={diasActivos}
          diaSeleccionado={diaSeleccionado}
          onSelectDia={(dia) => {
            // Alternar selección de filtro por día
            setDiaSeleccionado(dia === diaSeleccionado ? null : dia);
          }}
        />

        {/* Componente SlotPicker: Desglose de franjas y sesiones fijas */}
        {cargando ? (
          <View style={styles.centroCarga}>
            <ActivityIndicator size="small" color="#0284C7" />
            <Text style={styles.textoCargando}>Cargando franjas horarias...</Text>
          </View>
        ) : (
          <SlotPicker
            sesiones={sesiones}
            diaFiltro={diaSeleccionado}
          />
        )}

        {/* Banner de Sobrecupo Presencial Directo con el Docente */}
        <View style={styles.panelSobrecupo}>
          <View style={styles.filaTituloSobrecupo}>
            <Text style={styles.iconoSobrecupo}>⚠️</Text>
            <Text style={styles.tituloSobrecupo}>
              Guía de Sobrecupo Presencial en Campus
            </Text>
          </View>

          <Text style={styles.parrafoSobrecupo}>
            <Text style={styles.textoNegrita}>¿No alcanzaste cupo en la app o en Campus TdeA? </Text>
            No tienes que ir a buscar oficinas administrativas de Bienestar ni realizar filas.
          </Text>

          <View style={styles.cajaPasoSobrecupo}>
            <Text style={styles.pasoSobrecupo}>
              1. <Text style={styles.textoNegrita}>Preséntate directamente en la primera sesión:</Text> Dirígete al espacio exacto de la clase en el <Text style={styles.textoResaltado}>{acude.ubicacion}</Text> en los horarios indicados arriba.
            </Text>
            <Text style={styles.pasoSobrecupo}>
              2. <Text style={styles.textoNegrita}>Habla en persona con el docente:</Text> Solicita autorización de sobrecupo directamente a <Text style={styles.textoResaltado}>{acude.docente}</Text>.
            </Text>
            <Text style={styles.pasoSobrecupo}>
              3. <Text style={styles.textoNegrita}>Ocupación de cupos liberados:</Text> Como las inasistencias reiteradas cancelan automáticamente el curso a estudiantes ausentes, el docente puede admitirte en sitio para cubrir esas vacantes.
            </Text>
          </View>
        </View>

        {/* Botones de Navegación Inferior */}
        <View style={styles.contenedorBotones}>
          <TouchableOpacity
            style={styles.botonVolver}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.textoBotonVolver}>← Volver a Ficha Técnica</Text>
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
    padding: 16,
    paddingBottom: 32,
  },
  tarjetaCabecera: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  filaEncabezado: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  columnaTitulo: {
    flex: 1,
    paddingRight: 8,
  },
  subtituloCampus: {
    fontSize: 11,
    color: '#0284C7',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  tituloCatedra: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 23,
  },
  filaInfoCabecera: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  iconoInfo: {
    fontSize: 13,
    marginRight: 6,
  },
  textoDocente: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  textoUbicacion: {
    fontSize: 12,
    color: '#64748B',
    flex: 1,
  },
  centroCarga: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoCargando: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 6,
  },
  panelSobrecupo: {
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginVertical: 10,
  },
  filaTituloSobrecupo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconoSobrecupo: {
    fontSize: 18,
    marginRight: 8,
  },
  tituloSobrecupo: {
    fontSize: 14,
    fontWeight: '800',
    color: '#92400E',
  },
  parrafoSobrecupo: {
    fontSize: 13,
    color: '#78350F',
    lineHeight: 19,
    marginBottom: 10,
  },
  cajaPasoSobrecupo: {
    backgroundColor: '#FEF3C7',
    borderRadius: 10,
    padding: 12,
    gap: 8,
  },
  pasoSobrecupo: {
    fontSize: 12,
    color: '#78350F',
    lineHeight: 18,
  },
  textoNegrita: {
    fontWeight: '700',
  },
  textoResaltado: {
    fontWeight: '800',
    color: '#92400E',
  },
  contenedorBotones: {
    marginTop: 10,
  },
  botonVolver: {
    backgroundColor: '#0284C7',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 2,
  },
  textoBotonVolver: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  centro: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  textoError: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 16,
  },
});
