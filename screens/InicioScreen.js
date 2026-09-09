/**
 * @file InicioScreen.js
 * @description Pantalla principal del Catálogo de Cátedras y Actividades ACUDE
 * (Bienestar Institucional - Tecnológico de Antioquia).
 * Extensión móvil complementaria de Campus TdeA.
 * Provee búsqueda en tiempo real, chips de categoría ('Todos', 'Deportivas', 'Culturales'),
 * renderizado optimizado en FlatList con AcudeCard, pull-to-refresh y botón de siembra
 * rápida si Firestore no tiene datos.
 * El TextInput permanece fuera del FlatList para garantizar persistencia estricta del foco del teclado.
 * @module screens/InicioScreen
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import AcudeCard from '../components/AcudeCard';
import Badge from '../components/Badge';
import { getAcudes } from '../services/acudesService';
import { ejecutarSeedAcudes } from '../services/seedAcudes';
import { useAuth } from '../contexts/AuthContexto';

const CATEGORIAS_FILTRO = ['Todos', 'Deportivas', 'Culturales'];

export default function InicioScreen({ navigation }) {
  const { user } = useAuth();

  const [acudes, setAcudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);
  const [sembrando, setSembrando] = useState(false);
  const [error, setError] = useState(null);

  // Estados de filtrado y búsqueda reactiva
  const [busqueda, setBusqueda] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todos');

  /**
   * Carga las actividades ACUDE desde Firestore.
   */
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

  /**
   * Permite poblar Firestore directamente desde la app si la base de datos está vacía.
   */
  const handleSembrarDatos = async () => {
    try {
      setSembrando(true);
      const res = await ejecutarSeedAcudes();
      Alert.alert('Datos Sembrados', res.mensaje);
      await cargarDatos();
    } catch (err) {
      Alert.alert('Error al sembrar', err.message);
    } finally {
      setSembrando(false);
    }
  };

  /**
   * Filtro en memoria por texto (nombre, docente, ubicación, disciplina) y chip de categoría.
   */
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
    // Si no hay acudes en la base de datos en lo absoluto
    if (acudes.length === 0) {
      return (
        <View style={styles.contenedorVacio}>
          <Text style={styles.iconoVacio}>🌱</Text>
          <Text style={styles.tituloVacio}>Base de datos lista para sembrar</Text>
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
              <Text style={styles.textoBotonSembrar}>
                🌱 Cargar Cátedras ACUDE TdeA (Seed)
              </Text>
            )}
          </TouchableOpacity>
        </View>
      );
    }

    // Si hay acudes pero no coinciden con la búsqueda/filtro
    return (
      <View style={styles.contenedorVacio}>
        <Text style={styles.iconoVacio}>🔎</Text>
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

  return (
    <SafeAreaView style={styles.contenedor}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* Cabecera estática: Saludo, Buscador y Filtros fuera del FlatList */}
      <View style={styles.cabeceraContenedor}>
        {/* Saludo institucional y badge */}
        <View style={styles.filaSaludo}>
          <View>
            <Text style={styles.subtituloSaludo}>CanchaYa · Extensión Campus TdeA</Text>
            <Text style={styles.tituloUsuario}>
              {user?.displayName || 'Estudiante TdeA'} 👋
            </Text>
          </View>
          <Badge estado="info" texto="Bienestar Bloque 10" tamano="pequeno" />
        </View>

        {/* Barra de búsqueda */}
        <View style={styles.contenedorBuscador}>
          <Text style={styles.iconoBuscador}>🔍</Text>
          <TextInput
            style={styles.inputBuscador}
            placeholder="Buscar por taller, docente o espacio (Bloque 10)..."
            placeholderTextColor="#94A3B8"
            value={busqueda}
            onChangeText={setBusqueda}
            autoCorrect={false}
          />
          {busqueda.length > 0 && (
            <TouchableOpacity
              onPress={() => setBusqueda('')}
              style={styles.botonLimpiar}
            >
              <Text style={styles.textoLimpiar}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Selector horizontal de categorías (Chips) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollCategorias}
        >
          {CATEGORIAS_FILTRO.map((cat) => {
            const estaActiva = categoriaSeleccionada === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.chipCategoria,
                  estaActiva && styles.chipCategoriaActiva,
                ]}
                onPress={() => setCategoriaSeleccionada(cat)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.textoChip,
                    estaActiva && styles.textoChipActivo,
                  ]}
                >
                  {cat === 'Todos' ? '✨ Todas las Cátedras' : cat === 'Deportivas' ? '⚽ Deportivas' : '🎭 Culturales'}
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

      {/* Listado reactivo de Cátedras ACUDE */}
      {cargando && !refrescando ? (
        <View style={styles.centroCarga}>
          <ActivityIndicator size="large" color="#0284C7" />
          <Text style={styles.textoCargando}>
            Consultando Cátedras ACUDE en Firestore...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.cajaError}>
          <Text style={styles.tituloError}>Error de conexión</Text>
          <Text style={styles.detalleError}>{error}</Text>
          <TouchableOpacity style={styles.botonReintentar} onPress={cargarDatos}>
            <Text style={styles.textoBotonReintentar}>Reintentar consulta</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={acudesFiltrados}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <AcudeCard acude={item} onPress={handleSeleccionarAcude} />
          )}
          ListEmptyComponent={renderVacio}
          contentContainerStyle={styles.listaContenedor}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={refrescando}
              onRefresh={handleRefrescar}
              colors={['#0284C7']}
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
    backgroundColor: '#F8FAFC',
  },
  listaContenedor: {
    paddingBottom: 24,
  },
  cabeceraContenedor: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 6,
    backgroundColor: '#F8FAFC',
  },
  filaSaludo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  subtituloSaludo: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tituloUsuario: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
    marginTop: 2,
  },
  contenedorBuscador: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 10 : 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  iconoBuscador: {
    fontSize: 16,
    marginRight: 8,
  },
  inputBuscador: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
  },
  botonLimpiar: {
    padding: 4,
  },
  textoLimpiar: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '700',
  },
  scrollCategorias: {
    paddingBottom: 8,
    gap: 8,
  },
  chipCategoria: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 6,
  },
  chipCategoriaActiva: {
    backgroundColor: '#0284C7',
    borderColor: '#0284C7',
  },
  textoChip: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  textoChipActivo: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  filaContador: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 6,
    paddingHorizontal: 4,
  },
  textoContador: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  textoRestablecer: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0284C7',
  },
  centroCarga: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoCargando: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748B',
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
    color: '#991B1B',
    marginBottom: 6,
  },
  detalleError: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 16,
  },
  botonReintentar: {
    backgroundColor: '#0284C7',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
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
  iconoVacio: {
    fontSize: 48,
    marginBottom: 12,
  },
  tituloVacio: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
    textAlign: 'center',
  },
  textoVacio: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 18,
  },
  botonLimpiarTodo: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  textoBotonLimpiarTodo: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0284C7',
  },
  botonSembrar: {
    backgroundColor: '#16A34A',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  textoBotonSembrar: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
