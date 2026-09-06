import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../contexts/AuthContexto';
import { crearReserva } from '../services/reservasService';

export default function ConfirmacionReservaScreen({ route, navigation }) {
  // Extraemos el usuario logueado del contexto que me compartiste
  const { user } = useAuth();
  
  // Asumimos que el Programador 3 nos enviará estos datos por navegación
  const { escenario, fecha, hora } = route.params || {};
  const [cargando, setCargando] = useState(false);

  const manejarConfirmacion = async () => {
    if (!user) {
      Alert.alert("Error", "Debes iniciar sesión para realizar la reserva.");
      return;
    }

    setCargando(true);
    
    // Llamamos a nuestro servicio
    const resultado = await crearReserva({
      idUsuario: user.uid,
      idEscenario: escenario.id,
      nombreEscenario: escenario.nombre,
      fecha: fecha,
      hora: hora,
    });

    setCargando(false);

    if (resultado.exito) {
      Alert.alert("¡Reserva Exitosa!", "Tu franja ha sido apartada correctamente.");
      // Navegamos a la pestaña de "Mis Reservas" para que el usuario vea su lista
      navigation.navigate('Mis Reservas'); 
    } else {
      Alert.alert("Error", "Hubo un problema al guardar tu reserva. Intenta de nuevo.");
    }
  };

  // Si por algún motivo llegamos aquí sin datos, evitamos que la app se caiga
  if (!escenario) {
    return (
      <View style={styles.centro}>
        <Text>Error: No se recibieron los datos de la reserva.</Text>
      </View>
    );
  }

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Resumen de tu Reserva</Text>
      
      <View style={styles.tarjetaResumen}>
        <Text style={styles.textoDetalle}>🏟️ Escenario: {escenario.nombre}</Text>
        <Text style={styles.textoDetalle}>📍 Ubicación: {escenario.ubicacion}</Text>
        <Text style={styles.textoDetalle}>📅 Fecha: {fecha}</Text>
        <Text style={styles.textoDetalle}>⏰ Hora: {hora}</Text>
      </View>

      <TouchableOpacity 
        style={styles.botonConfirmar} 
        onPress={manejarConfirmacion}
        disabled={cargando}
      >
        {cargando ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.textoBoton}>Confirmar Reserva</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, padding: 20, backgroundColor: '#F8FAFC' },
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  titulo: { fontSize: 22, fontWeight: 'bold', color: '#0F172A', marginBottom: 20, textAlign: 'center' },
  tarjetaResumen: { backgroundColor: '#FFF', padding: 20, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 30 },
  textoDetalle: { fontSize: 16, color: '#334155', marginBottom: 10 },
  botonConfirmar: { backgroundColor: '#0284C7', padding: 15, borderRadius: 10, alignItems: 'center' },
  textoBoton: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});