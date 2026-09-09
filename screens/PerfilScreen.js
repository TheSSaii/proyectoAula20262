/**
 * @file PerfilScreen.js
 * @description Pantalla de perfil de usuario en CanchaYa.
 * Muestra información del estudiante autenticado, datos institucionales de Bienestar Institucional (TdeA)
 * y permite cerrar sesión en Firebase Auth con persistencia nativa en AsyncStorage.
 * @module screens/PerfilScreen
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useAuth } from '../contexts/AuthContexto';
import Badge from '../components/Badge';
import { ejecutarSeedAcudes } from '../services/seedAcudes';

export default function PerfilScreen() {
  const { user, logout } = useAuth();
  const [saliendo, setSaliendo] = useState(false);
  const [sembrando, setSembrando] = useState(false);

  const handleCerrarSesion = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas salir de tu cuenta en CanchaYa?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí, Salir',
          style: 'destructive',
          onPress: async () => {
            try {
              setSaliendo(true);
              await logout();
            } catch (error) {
              Alert.alert('Error', error.message);
            } finally {
              setSaliendo(false);
            }
          },
        },
      ]
    );
  };

  const handleSincronizarCatalogo = async () => {
    try {
      setSembrando(true);
      const res = await ejecutarSeedAcudes();
      Alert.alert('Sincronización Exitosa', res.mensaje);
    } catch (err) {
      Alert.alert('Error al sincronizar', err.message);
    } finally {
      setSembrando(false);
    }
  };

  return (
    <SafeAreaView style={styles.contenedor}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.contenido}>
          {/* Avatar representativo */}
          <View style={styles.avatar}>
            <Text style={styles.textoAvatar}>
              {(user?.displayName?.[0] || user?.email?.[0] || 'U').toUpperCase()}
            </Text>
          </View>

          <Text style={styles.nombre}>{user?.displayName || 'Estudiante TdeA'}</Text>
          <Text style={styles.correo}>{user?.email}</Text>

          <View style={styles.badgeRol}>
            <Badge estado="inscrito" texto="Comunidad TdeA · Cátedras ACUDE" />
          </View>

          {/* Tarjeta de detalles de cuenta */}
          <View style={styles.tarjetaDetalles}>
            <View style={styles.filaDetalle}>
              <Text style={styles.labelDetalle}>Institución:</Text>
              <Text style={styles.valorDetalle}>Tecnológico de Antioquia</Text>
            </View>
            <View style={styles.separador} />
            <View style={styles.filaDetalle}>
              <Text style={styles.labelDetalle}>Sede Principal:</Text>
              <Text style={styles.valorDetalle}>Campus Robledo</Text>
            </View>
            <View style={styles.separador} />
            <View style={styles.filaDetalle}>
              <Text style={styles.labelDetalle}>Espacio ACUDE:</Text>
              <Text style={styles.valorDetalle}>Bloque 10 (Bienestar / Coliseo)</Text>
            </View>
            <View style={styles.separador} />
            <View style={styles.filaDetalle}>
              <Text style={styles.labelDetalle}>Plataforma Base:</Text>
              <Text style={styles.valorDetalle}>Campus TdeA (Web Oficial)</Text>
            </View>
            <View style={styles.separador} />
            <View style={styles.filaDetalle}>
              <Text style={styles.labelDetalle}>Identificador (UID):</Text>
              <Text style={styles.valorUid} numberOfLines={1} ellipsizeMode="middle">
                {user?.uid}
              </Text>
            </View>
          </View>

          {/* Botón de Sincronización / Seed de Cátedras */}
          <TouchableOpacity
            style={styles.botonSincronizar}
            onPress={handleSincronizarCatalogo}
            disabled={sembrando}
            activeOpacity={0.8}
          >
            {sembrando ? (
              <ActivityIndicator color="#0284C7" size="small" />
            ) : (
              <Text style={styles.textoBotonSincronizar}>
                🔄 Sincronizar Catálogo ACUDE (Bloque 10)
              </Text>
            )}
          </TouchableOpacity>

          {/* Botón de Cerrar Sesión */}
          <TouchableOpacity
            style={styles.botonSalir}
            onPress={handleCerrarSesion}
            disabled={saliendo}
            activeOpacity={0.8}
          >
            {saliendo ? (
              <ActivityIndicator color="#DC2626" size="small" />
            ) : (
              <Text style={styles.textoBotonSalir}>🚪 Cerrar Sesión</Text>
            )}
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
  contenido: {
    padding: 24,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#0284C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  textoAvatar: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  nombre: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  correo: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  badgeRol: {
    marginTop: 10,
    marginBottom: 20,
  },
  tarjetaDetalles: {
    width: '100%',
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
    elevation: 1,
  },
  filaDetalle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  labelDetalle: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  valorDetalle: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '700',
  },
  valorUid: {
    fontSize: 12,
    color: '#475569',
    fontFamily: 'monospace',
    maxWidth: 160,
  },
  separador: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  botonSincronizar: {
    width: '100%',
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  textoBotonSincronizar: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0284C7',
  },
  botonSalir: {
    width: '100%',
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FECACA',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoBotonSalir: {
    fontSize: 14,
    fontWeight: '700',
    color: '#DC2626',
  },
});
