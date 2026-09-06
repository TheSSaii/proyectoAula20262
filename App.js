/**
 * @file App.js
 * @description Punto de entrada de la aplicación CanchaYa.
 * [CICLO T04]: Verificación en vivo de LoginScreen y RegistroScreen conectadas a AuthContexto
 * con alternancia fluida entre formularios y visualización del catálogo al autenticar.
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import { AuthProvider, useAuth } from './contexts/AuthContexto';
import LoginScreen from './screens/LoginScreen';
import RegistroScreen from './screens/RegistroScreen';
import EscenarioCard from './components/EscenarioCard';
import { getEscenarios } from './services/escenariosService';

function ContenidoPrincipal() {
  const { user, loading, logout } = useAuth();
  const [pantallaActual, setPantallaActual] = useState('login'); // 'login' | 'registro'
  const [escenarios, setEscenarios] = useState([]);
  const [cargandoEscenarios, setCargandoEscenarios] = useState(false);

  const cargarCatalogo = useCallback(async () => {
    try {
      setCargandoEscenarios(true);
      const datos = await getEscenarios();
      setEscenarios(datos);
    } catch (error) {
      console.error('Error al cargar escenarios:', error);
    } finally {
      setCargandoEscenarios(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      cargarCatalogo();
    }
  }, [user, cargarCatalogo]);

  const handleCerrarSesion = async () => {
    try {
      await logout();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  // Pantalla de carga mientras se verifica AsyncStorage
  if (loading) {
    return (
      <View style={styles.centroCarga}>
        <ActivityIndicator size="large" color="#0284C7" />
        <Text style={styles.textoCargando}>Iniciando CanchaYa...</Text>
      </View>
    );
  }

  // Si NO hay sesión activa, muestra LoginScreen o RegistroScreen
  if (!user) {
    return pantallaActual === 'login' ? (
      <LoginScreen onIrARegistro={() => setPantallaActual('registro')} />
    ) : (
      <RegistroScreen onIrALogin={() => setPantallaActual('login')} />
    );
  }

  // Si HAY sesión activa, muestra la vista autenticada
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Barra superior de usuario */}
        <View style={styles.barraSuperior}>
          <View>
            <Text style={styles.saludo}>¡Hola, {user.displayName || 'Estudiante'}! 👋</Text>
            <Text style={styles.correoUsuario}>{user.email}</Text>
          </View>
          <TouchableOpacity style={styles.botonSalir} onPress={handleCerrarSesion}>
            <Text style={styles.textoBotonSalir}>Salir</Text>
          </TouchableOpacity>
        </View>

        {/* Banner de verificación T04 */}
        <View style={styles.bannerExito}>
          <Text style={styles.tituloBanner}>🎉 Autenticación Exitosa (T04)</Text>
          <Text style={styles.textoBanner}>
            Has ingresado mediante los formularios de Login/Registro con validación y
            persistencia real en Firebase Auth.
          </Text>
        </View>

        {/* Catálogo de escenarios */}
        <View style={styles.seccion}>
          <Text style={styles.tituloSeccion}>
            Catálogo Disponible ({escenarios.length})
          </Text>
          <Text style={styles.descripcionSeccion}>
            Escenarios deportivos consultados desde Firestore:
          </Text>
        </View>

        {cargandoEscenarios ? (
          <View style={styles.centroCarga}>
            <ActivityIndicator size="small" color="#0284C7" />
            <Text style={styles.textoCargando}>Cargando escenarios...</Text>
          </View>
        ) : (
          escenarios.map((item) => (
            <EscenarioCard
              key={item.id}
              escenario={item}
              onPress={(esc) =>
                Alert.alert(
                  'Escenario Seleccionado',
                  `Has seleccionado "${esc.nombre}".\nListo para el flujo de reserva.`
                )
              }
            />
          ))
        )}

        <View style={styles.espacioFinal} />
      </ScrollView>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ContenidoPrincipal />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContainer: {
    paddingVertical: 16,
  },
  centroCarga: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  textoCargando: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748B',
  },
  barraSuperior: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    marginBottom: 16,
  },
  saludo: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  correoUsuario: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  botonSalir: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  textoBotonSalir: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
  },
  bannerExito: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginHorizontal: 16,
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
  tituloBanner: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E40AF',
    marginBottom: 4,
  },
  textoBanner: {
    fontSize: 12,
    color: '#3B82F6',
    lineHeight: 17,
  },
  seccion: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  tituloSeccion: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  descripcionSeccion: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  espacioFinal: {
    height: 32,
  },
});
