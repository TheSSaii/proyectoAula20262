/**
 * @file InicioScreen.js
 * @description Pantalla principal de catálogo de escenarios deportivos (Tarea T08).
 * Consume la capa de servicios (escenariosService.js) conectada a Cloud Firestore,
 * provee un motor de búsqueda en tiempo real, filtrado por categorías deportivas (chips),
 * estado de carga, Pull-to-Refresh y renderizado optimizado en FlatList con EscenarioCard.
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
} from 'react-native';
import EscenarioCard from '../components/EscenarioCard';
import Badge from '../components/Badge';
import { getEscenarios } from '../services/escenariosService';
import { useAuth } from '../contexts/AuthContexto';

/**
 * Categorías deportivas para el filtrado rápido por chips.
 */
const CATEGORIAS_FILTRO = [
  'Todos',
  'Fútbol',
  'Baloncesto',
  'Voleibol',
  'Acondicionamiento',
  'Tenis de Mesa',
];

/**
 * Pantalla de Catálogo de Escenarios con filtrado dinámico.
 *
 * @param {Object} props
 * @param {Object} props.navigation - React Navigation prop.
 * @returns {React.JSX.Element}
 */
export default function InicioScreen({ navigation }) {
  const { user } = useAuth();

  const [escenarios, setEscenarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);
  const [error, setError] = useState(null);

  // Estados de filtrado y búsqueda
  const [busqueda, setBusqueda] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todos');

  /**
   * Carga los datos de escenarios desde Firestore mediante el servicio.
   */
  const cargarDatos = useCallback(async () => {
    try {
      setError(null);
      const datos = await getEscenarios();
      setEscenarios(datos);
    } catch (err) {
      console.error('Error al cargar escenarios en InicioScreen:', err);
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
   * Filtra los escenarios en memoria según el texto de búsqueda y la categoría seleccionada.
   */
  const escenariosFiltrados = useMemo(() => {
    return escenarios.filter((escenario) => {
      const termino = busqueda.toLowerCase().trim();
      const coincideBusqueda =
        !termino ||
        escenario.nombre?.toLowerCase().includes(termino) ||
        escenario.tipo?.toLowerCase().includes(termino) ||
        escenario.ubicacion?.toLowerCase().includes(termino);

      const coincideCategoria =
        categoriaSeleccionada === 'Todos' ||
        escenario.tipo?.toLowerCase().includes(categoriaSeleccionada.toLowerCase());

      return coincideBusqueda && coincideCategoria;
    });
  }, [escenarios, busqueda, categoriaSeleccionada]);

  const handleSeleccionarEscenario = (escenario) => {
    navigation.navigate('Detalle', { escenario });
  };

  /**
   * Componente para listado vacío (sin resultados tras filtrar).
   */
  const renderVacio = () => (
    <View style={styles.contenedorVacio}>
      <Text style={styles.iconoVacio}>🔎</Text>
      <Text style={styles.tituloVacio}>No encontramos escenarios</Text>
      <Text style={styles.textoVacio}>
        No hay coincidencias para "{busqueda || categoriaSeleccionada}". Intenta con otros términos o limpia los filtros.
      </Text>
      <TouchableOpacity
        style={styles.botonLimpiarTodo}
        onPress={() => {
          setBusqueda('');
          setCategoriaSeleccionada('Todos');
        }}
      >
        <Text style={styles.textoBotonLimpiarTodo}>Mostrar todos los escenarios</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.contenedor}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* Cabecera fija: Saludo, Buscador y Filtros por Categoría */}
      {/* Al estar fuera del FlatList, el TextInput NUNCA se desmonta ni pierde el foco al escribir */}
      <View style={styles.cabeceraContenedor}>
        {/* Saludo y bienvenida */}
        <View style={styles.filaSaludo}>
          <View>
            <Text style={styles.subtituloSaludo}>Bienvenido a CanchaYa</Text>
            <Text style={styles.tituloUsuario}>
              {user?.displayName || 'Estudiante TdeA'} 👋
            </Text>
          </View>
          <Badge estado="info" texto="Campus Robledo" tamano="pequeno" />
        </View>

        {/* Barra de búsqueda */}
        <View style={styles.contenedorBuscador}>
          <Text style={styles.iconoBuscador}>🔍</Text>
          <TextInput
            style={styles.inputBuscador}
            placeholder="Buscar por nombre, tipo o bloque..."
            placeholderTextColor="#94A3B8"
            value={busqueda}
            onChangeText={setBusqueda}
            autoCorrect={false}
          />
          {busqueda.length > 0 && (
            <TouchableOpacity onPress={() => setBusqueda('')} style={styles.botonLimpiar}>
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
          {CATEGORIAS_FILTRO.map((categoria) => {
            const estaActiva = categoriaSeleccionada === categoria;
            return (
              <TouchableOpacity
                key={categoria}
                style={[
                  styles.chipCategoria,
                  estaActiva && styles.chipCategoriaActiva,
                ]}
                onPress={() => setCategoriaSeleccionada(categoria)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.textoChip,
                    estaActiva && styles.textoChipActivo,
                  ]}
                >
                  {categoria}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Contador de resultados */}
        <View style={styles.filaContador}>
          <Text style={styles.textoContador}>
            {escenariosFiltrados.length === 1
              ? '1 escenario disponible'
              : `${escenariosFiltrados.length} escenarios disponibles`}
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

      {/* Lista de escenarios */}
      {cargando && !refrescando ? (
        <View style={styles.centroCarga}>
          <ActivityIndicator size="large" color="#0284C7" />
          <Text style={styles.textoCargando}>Consultando escenarios en Firestore...</Text>
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
          data={escenariosFiltrados}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EscenarioCard
              escenario={item}
              onPress={handleSeleccionarEscenario}
            />
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
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
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
    paddingVertical: 7,
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
    padding: 40,
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
  },
  textoVacio: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
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
});
