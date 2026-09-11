/**
 * @file InicioScreen.js
 * @description Pantalla principal del Catálogo de Cátedras y Actividades ACUDE
 * (Bienestar Institucional - Tecnológico de Antioquia).
 * Diseñado con la paleta de identidad oficial TdeA (Verde Pino, Verde Lima, Gris Neutro, Negro Institucional),
 * iconografía vectorial profesional de Ionicons y encabezado dinámico colapsable al hacer scroll:
 * el saludo con el logo y el nombre del estudiante se contrae suavemente dejando fija la zona esencial
 * (Barra de búsqueda, filtros de categorías y contador).
 * @module screens/InicioScreen
 */

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  Platform,
  Alert,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AcudeCard from '../components/AcudeCard';
import Badge from '../components/Badge';
import LogoInstitucional from '../components/LogoInstitucional';
import { getAcudes } from '../services/acudesService';
import { ejecutarSeedAcudes } from '../services/seedAcudes';
import { useAuth } from '../contexts/AuthContexto';
import { COLORES, SOMBRAS } from '../constants/theme';

const CATEGORIAS_FILTRO = [
  { clave: 'Todos', label: 'Todas las Cátedras', icono: 'layers-outline' },
  { clave: 'Deportivas', label: 'Deportivas', icono: 'trophy-outline' },
  { clave: 'Culturales', label: 'Culturales', icono: 'color-palette-outline' },
];

export default function InicioScreen({ navigation }) {
  const { user, perfil } = useAuth();

  const [acudes, setAcudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);
  const [sembrando, setSembrando] = useState(false);
  const [error, setError] = useState(null);

  const [busqueda, setBusqueda] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todos');

  // Animación del encabezado dinámico al scrollear
  const scrollY = useRef(new Animated.Value(0)).current;

  const alturaSaludo = scrollY.interpolate({
    inputRange: [0, 65],
    outputRange: [56, 0],
    extrapolate: 'clamp',
  });

  const opacidadSaludo = scrollY.interpolate({
    inputRange: [0, 40],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const margenSaludo = scrollY.interpolate({
    inputRange: [0, 65],
    outputRange: [12, 0],
    extrapolate: 'clamp',
  });

  const cargarDatos = useCallback(async () => {
    try {
      setError(null);
      const datos = await getAcudes();
      setAcudes(datos);
    } catch (err) {
      console.error('Error al cargar actividades ACUDE en InicioScreen:', err);
      setError(err.message);
    } finally {
      setCargando(false);
      setRefrescando(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const handleRefrescar = () => {
    setRefrescando(true);
    cargarDatos();
  };

  const handleSembrarDatos = async () => {
    try {
      setSembrando(true);
      const res = await ejecutarSeedAcudes();
      Alert.alert('Datos Sincronizados', res.mensaje);
      await cargarDatos();
    } catch (err) {
      Alert.alert('Error al sincronizar', err.message);
    } finally {
      setSembrando(false);
    }
  };

  const acudesFiltrados = useMemo(() => {
    return acudes.filter((acude) => {
      const termino = busqueda.toLowerCase().trim();
      const coincideBusqueda =
        !termino ||
        acude.nombre?.toLowerCase().includes(termino) ||
        acude.docente?.toLowerCase().includes(termino) ||
        acude.disciplina?.toLowerCase().includes(termino) ||
        acude.ubicacion?.toLowerCase().includes(termino);

      let coincideCategoria = true;
      if (categoriaSeleccionada === 'Deportivas') {
        coincideCategoria = acude.categoria?.toLowerCase() === 'deportiva';
      } else if (categoriaSeleccionada === 'Culturales') {
        coincideCategoria = acude.categoria?.toLowerCase() === 'cultural';
      }

      return coincideBusqueda && coincideCategoria;
    });
  }, [acudes, busqueda, categoriaSeleccionada]);

  const handleSeleccionarAcude = (acude) => {
    navigation.navigate('Detalle', { acude });
  };

  const renderVacio = () => {
    if (acudes.length === 0) {
      return (
        <View style={styles.contenedorVacio}>
          <View style={styles.circuloIconoVacio}>
            <Ionicons name="server-outline" size={36} color={COLORES.verdePino} />
          </View>
          <Text style={styles.tituloVacio}>Base de datos lista para sincronizar</Text>
          <Text style={styles.textoVacio}>
            Aún no se encuentran registradas las cátedras ACUDE del TdeA en Firestore.
            Puedes cargar el catálogo oficial de Bienestar Institucional con un toque:
          </Text>
          <TouchableOpacity
            style={styles.botonSembrar}
            onPress={handleSembrarDatos}
            disabled={sembrando}
          >
            {sembrando ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <View style={styles.filaBotonSembrar}>
                <Ionicons name="cloud-download-outline" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.textoBotonSembrar}>
                  Cargar Catálogo ACUDE TdeA
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.contenedorVacio}>
        <View style={styles.circuloIconoVacio}>
          <Ionicons name="search-outline" size={36} color={COLORES.grisNeutro} />
        </View>
        <Text style={styles.tituloVacio}>No encontramos cátedras coincidentes</Text>
        <Text style={styles.textoVacio}>
          No hay actividades para "{busqueda || categoriaSeleccionada}". Prueba con otros términos o restablece los filtros.
        </Text>
        <TouchableOpacity
          style={styles.botonLimpiarTodo}
          onPress={() => {
            setBusqueda('');
            setCategoriaSeleccionada('Todos');
          }}
        >
          <Text style={styles.textoBotonLimpiarTodo}>Mostrar todas las cátedras</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const nombreUsuario = perfil?.nombre || user?.displayName || 'Estudiante TdeA';

  return (
    <SafeAreaView style={styles.contenedor}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORES.fondo} />

      {/* Cabecera: Sección dinámica con logo que se encoge + Filtros esenciales fijados */}
      <View style={styles.cabeceraContenedor}>
        {/* Fila superior que se contrae con el scroll: Logo arriba a la izquierda + Nombre + Badge */}
        <Animated.View
          style={[
            styles.filaSaludoAnimada,
            {
              height: alturaSaludo,
              opacity: opacidadSaludo,
              marginBottom: margenSaludo,
            },
          ]}
        >
          <View style={styles.columnaLogoYUsuario}>
            <LogoInstitucional size={42} redondeado conSombra style={{ marginRight: 10 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.subtituloSaludo}>Campus TdeA · ACUDE</Text>
              <Text style={styles.tituloUsuario} numberOfLines={1}>
                {nombreUsuario}
              </Text>
            </View>
          </View>
          <Badge estado="info" texto="Bloque 10" tamano="pequeno" />
        </Animated.View>

        {/* Zona Esencial: Barra de búsqueda */}
        <View style={styles.contenedorBuscador}>
          <Ionicons name="search-outline" size={18} color={COLORES.grisNeutro} style={styles.iconoBuscador} />
          <TextInput
            style={styles.inputBuscador}
            placeholder="Buscar por taller, docente o espacio..."
            placeholderTextColor="#9E9E9E"
            value={busqueda}
            onChangeText={setBusqueda}
            autoCorrect={false}
          />
          {busqueda.length > 0 && (
            <TouchableOpacity
              onPress={() => setBusqueda('')}
              style={styles.botonLimpiar}
            >
              <Ionicons name="close-circle" size={18} color={COLORES.grisNeutro} />
            </TouchableOpacity>
          )}
        </View>

        {/* Selector horizontal de clases y categorías (Chips) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollCategorias}
        >
          {CATEGORIAS_FILTRO.map((cat) => {
            const estaActiva = categoriaSeleccionada === cat.clave;
            return (
              <TouchableOpacity
                key={cat.clave}
                style={[
                  styles.chipCategoria,
                  estaActiva && styles.chipCategoriaActiva,
                ]}
                onPress={() => setCategoriaSeleccionada(cat.clave)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={cat.icono}
                  size={14}
                  color={estaActiva ? '#FFFFFF' : COLORES.grisNeutro}
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={[
                    styles.textoChip,
                    estaActiva && styles.textoChipActivo,
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Contador de resultados */}
        <View style={styles.filaContador}>
          <Text style={styles.textoContador}>
            {acudesFiltrados.length === 1
              ? '1 cátedra disponible'
              : `${acudesFiltrados.length} cátedras disponibles`}
          </Text>
          {(categoriaSeleccionada !== 'Todos' || busqueda.length > 0) && (
            <TouchableOpacity
              onPress={() => {
                setCategoriaSeleccionada('Todos');
                setBusqueda('');
              }}
            >
              <Text style={styles.textoRestablecer}>Limpiar filtros</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Listado reactivo de Cátedras ACUDE con Animated.FlatList */}
      {cargando && !refrescando ? (
        <View style={styles.centroCarga}>
          <ActivityIndicator size="large" color={COLORES.verdePino} />
          <Text style={styles.textoCargando}>
            Consultando Cátedras ACUDE en Firestore...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.cajaError}>
          <Ionicons name="alert-circle-outline" size={36} color={COLORES.error} style={{ marginBottom: 8 }} />
          <Text style={styles.tituloError}>Error de conexión</Text>
          <Text style={styles.detalleError}>{error}</Text>
          <TouchableOpacity style={styles.botonReintentar} onPress={cargarDatos}>
            <Text style={styles.textoBotonReintentar}>Reintentar consulta</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Animated.FlatList
          data={acudesFiltrados}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <AcudeCard acude={item} onPress={handleSeleccionarAcude} />
          )}
          ListEmptyComponent={renderVacio}
          contentContainerStyle={styles.listaContenedor}
          keyboardShouldPersistTaps="handled"
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl
              refreshing={refrescando}
              onRefresh={handleRefrescar}
              colors={[COLORES.verdePino]}
              tintColor={COLORES.verdePino}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: COLORES.fondo,
  },
  listaContenedor: {
    paddingBottom: 24,
  },
  cabeceraContenedor: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 6,
    backgroundColor: COLORES.fondo,
  },
  filaSaludoAnimada: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
  },
  columnaLogoYUsuario: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 8,
  },
  subtituloSaludo: {
    fontSize: 11,
    color: COLORES.grisNeutro,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tituloUsuario: {
    fontSize: 19,
    fontWeight: '800',
    color: COLORES.negroInstitucional,
    letterSpacing: -0.5,
    marginTop: 1,
  },
  contenedorBuscador: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORES.superficie,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 10 : 4,
    borderWidth: 1,
    borderColor: COLORES.borde,
    marginBottom: 10,
    ...SOMBRAS.suave,
  },
  iconoBuscador: {
    marginRight: 8,
  },
  inputBuscador: {
    flex: 1,
    fontSize: 14,
    color: COLORES.negroInstitucional,
  },
  botonLimpiar: {
    padding: 4,
  },
  scrollCategorias: {
    paddingBottom: 6,
    gap: 8,
  },
  chipCategoria: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORES.superficie,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORES.borde,
    marginRight: 6,
  },
  chipCategoriaActiva: {
    backgroundColor: COLORES.verdePino,
    borderColor: COLORES.verdePino,
  },
  textoChip: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORES.grisNeutro,
  },
  textoChipActivo: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  filaContador: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 4,
    paddingHorizontal: 4,
  },
  textoContador: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORES.grisNeutro,
  },
  textoRestablecer: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORES.verdePino,
  },
  centroCarga: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoCargando: {
    marginTop: 12,
    fontSize: 14,
    color: COLORES.grisNeutro,
  },
  cajaError: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  tituloError: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORES.error,
    marginBottom: 6,
  },
  detalleError: {
    fontSize: 13,
    color: COLORES.grisNeutro,
    textAlign: 'center',
    marginBottom: 16,
  },
  botonReintentar: {
    backgroundColor: COLORES.verdePino,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    ...SOMBRAS.boton,
  },
  textoBotonReintentar: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  contenedorVacio: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circuloIconoVacio: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORES.acentoClaro,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#CBE58B',
  },
  tituloVacio: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORES.negroInstitucional,
    marginBottom: 6,
    textAlign: 'center',
  },
  textoVacio: {
    fontSize: 13,
    color: COLORES.grisNeutro,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 18,
  },
  botonLimpiarTodo: {
    backgroundColor: COLORES.superficie,
    borderWidth: 1,
    borderColor: COLORES.borde,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  textoBotonLimpiarTodo: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORES.verdePino,
  },
  botonSembrar: {
    backgroundColor: COLORES.verdePino,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    ...SOMBRAS.boton,
  },
  filaBotonSembrar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textoBotonSembrar: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
