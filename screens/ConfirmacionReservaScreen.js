import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../contexts/AuthContexto";
import { db } from "../services/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function ConfirmacionReservaScreen({ route, navigation }) {
  const { user } = useAuth();

  // Extraemos los datos que mockeamos en DisponibilidadScreen
  const { escenario, fecha, hora } = route.params || {};
  const [cargando, setCargando] = useState(false);

  const handlesConfirmation = async () => {
    if (!user) {
      Alert.alert("Error", "Debes iniciar sesión para realizar la reserva.");
      return;
    }

    setCargando(true);

    setCargando(false);

    Alert.alert(
      "¡Reserva Exitosa!",
      "Tu franja ha sido apartada correctamente.",
    );
    navigation.navigate("MisReservasTab");
  };

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
        <Text style={styles.textoDetalle}>
          🏟️ Escenario: {escenario.nombre}
        </Text>
        <Text style={styles.textoDetalle}>
          📍 Ubicación: {escenario.ubicacion}
        </Text>
        <Text style={styles.textoDetalle}>📅 Fecha: {fecha}</Text>
        <Text style={styles.textoDetalle}>⏰ Hora: {hora}</Text>
      </View>

      <TouchableOpacity
        style={styles.botonConfirmar}
        onPress={handlesConfirmation}
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
  contenedor: { flex: 1, padding: 20, backgroundColor: "#F8FAFC" },
  centro: { flex: 1, justifyContent: "center", alignItems: "center" },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: 20,
    textAlign: "center",
  },
  tarjetaResumen: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 30,
  },
  textoDetalle: { fontSize: 16, color: "#334155", marginBottom: 10 },
  botonConfirmar: {
    backgroundColor: "#0284C7",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  textoBoton: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
});
