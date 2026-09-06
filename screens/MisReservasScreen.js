/**
 * @file MisReservasScreen.js
 * @description Pantalla para visualizar el listado de reservas activas e históricas del usuario.
 * Cumple con el listado en tiempo real de la tarea T15.
 * @module screens/MisReservasScreen
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, ActivityIndicator } from 'react-native';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { useAuth } from '../contexts/AuthContexto';

export default function MisReservasScreen() {
  const { user } = useAuth();
  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Lógica en tiempo real (T15)
  useEffect(() => {
    if (!user) {
      setCargando(false);
      return;
    }

    const q = query(
      collection(db, 'reservas'),
      where('idUsuario', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const listaReservas = [];
      querySnapshot.forEach((doc) => {
        listaReservas.push({ id: doc.id, ...doc.data() });
      });
      
      setReservas(listaReservas);
      setCargando(false);
    }, (error) => {
      console.error("Error al escuchar reservas: ", error);
      setCargando(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Diseño de cada tarjeta de reserva en la lista
  const renderItem = ({ item }) => (
    <View style={styles.tarjetaReserva}>
      <Text style={styles.nombreEscenario}>{item.nombreEscenario}</Text>
      <Text style={styles.textoDetalle}>📅 Fecha: {item.fecha}</Text>
      <Text style={styles.textoDetalle}>⏰ Hora: {item.hora}</Text>
      <View style={styles.badgeEstado}>
        <Text style={styles.textoBadge}>Estado: {item.estado}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.contenedor}>
      {cargando ? (
        <View style={styles.contenidoCentro}>
          {/* 1. Estado de Carga */}
          <ActivityIndicator size="large" color="#0284C7" />
          <Text style={styles.textoCargando}>Cargando tus reservas...</Text>
        </View>
      ) : reservas.length === 0 ? (
        <View style={styles.contenidoCentro}>
          {/* 2. Estado Vacío (Tu diseño original conservado) */}
          <View style={styles.iconoContenedor}>
            <Text style={styles.icono}>📅</Text>
          </View>
          <Text style={styles.titulo}>Sin reservas activas</Text>
          <Text style={styles.descripcion}>
            Aún no tienes reservas programadas en los escenarios deportivos del TdeA.
          </Text>
          <View style={styles.cajaEstado}>
            <Text style={styles.textoEstado}>
              💡 Módulo conectado a Firestore en tiempo real (T15).
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.contenedorLista}>
          {/* 3. Estado con Datos (La lista en tiempo real) */}
          <Text style={styles.tituloCabecera}>Mis Reservas</Text>
          <FlatList
            data={reservas}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listaScroll}
          />
        </View>
      )}
    </SafeAreaView>
  );
} // <--- SE CERRÓ LA FUNCIÓN DEL COMPONENTE AQUÍ

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  // Estilos para los estados de carga y vacío (los tuyos originales)
  contenidoCentro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  iconoContenedor: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  icono: {
    fontSize: 34,
  },
  titulo: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  descripcion: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  cajaEstado: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 14,
  },
  textoEstado: {
    fontSize: 12,
    color: '#0284C7',
    fontWeight: '600',
    textAlign: 'center',
  },
  textoCargando: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748B',
  },
  // Estilos nuevos para la lista
  contenedorLista: {
    flex: 1,
    padding: 16,
  },
  tituloCabecera: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 16,
  },
  listaScroll: {
    paddingBottom: 20,
  },
  tarjetaReserva: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  nombreEscenario: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0369A1',
    marginBottom: 8,
  },
  textoDetalle: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 4,
  },
  badgeEstado: {
    alignSelf: 'flex-start',
    backgroundColor: '#DCFCE7',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginTop: 8,
  },
  textoBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: '#166534',
    textTransform: 'capitalize',
  },
});
