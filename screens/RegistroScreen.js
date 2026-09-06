/**
 * @file RegistroScreen.js
 * @description Pantalla de registro de nuevos usuarios en CanchaYa.
 * Valida nombre completo, formato de correo, longitud mínima de contraseña (6 caracteres)
 * y coincidencia de confirmación antes de enviar a Firebase Authentication.
 * @module screens/RegistroScreen
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useAuth } from '../contexts/AuthContexto';

/**
 * Pantalla de registro de usuario.
 *
 * @param {Object} props
 * @param {Object} [props.navigation] - Objeto de navegación de React Navigation.
 * @param {Function} [props.onIrALogin] - Callback alternativo para regresar al login.
 * @returns {React.JSX.Element}
 */
export default function RegistroScreen({ navigation, onIrALogin }) {
  const { register } = useAuth();

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [errorLocal, setErrorLocal] = useState('');

  const validarFormulario = () => {
    setErrorLocal('');

    if (!nombre.trim()) {
      setErrorLocal('Ingresa tu nombre completo.');
      return false;
    }

    if (!email.trim()) {
      setErrorLocal('Ingresa tu correo institucional o personal.');
      return false;
    }

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(email.trim())) {
      setErrorLocal('El formato del correo electrónico no es válido.');
      return false;
    }

    if (password.length < 6) {
      setErrorLocal('La contraseña debe tener al menos 6 caracteres.');
      return false;
    }

    if (password !== confirmarPassword) {
      setErrorLocal('Las contraseñas no coinciden. Verifícalas.');
      return false;
    }

    return true;
  };

  const handleRegistro = async () => {
    if (!validarFormulario()) return;

    try {
      setCargando(true);
      setErrorLocal('');
      await register(email, password, nombre);
      // Tras registrarse con éxito, el contexto actualiza el usuario automáticamente
    } catch (error) {
      setErrorLocal(error.message);
    } finally {
      setCargando(false);
    }
  };

  const handleRegresarALogin = () => {
    if (navigation?.goBack) {
      navigation.goBack();
    } else if (navigation?.navigate) {
      navigation.navigate('Login');
    } else if (onIrALogin) {
      onIrALogin();
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.contenedorPrincipal}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollInterno}
        keyboardShouldPersistTaps="handled"
      >
        {/* Cabecera */}
        <View style={styles.cabecera}>
          <Text style={styles.titulo}>Crear Cuenta</Text>
          <Text style={styles.subtitulo}>
            Únete a CanchaYa para reservar espacios deportivos del TdeA
          </Text>
        </View>

        {/* Tarjeta del Formulario */}
        <View style={styles.tarjetaFormulario}>
          {/* Alerta de Error */}
          {errorLocal ? (
            <View style={styles.cajaError}>
              <Text style={styles.textoError}>⚠️ {errorLocal}</Text>
            </View>
          ) : null}

          {/* Nombre Completo */}
          <Text style={styles.label}>Nombre Completo</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej. Juan Pérez"
            placeholderTextColor="#94A3B8"
            autoCapitalize="words"
            value={nombre}
            onChangeText={(texto) => {
              setNombre(texto);
              if (errorLocal) setErrorLocal('');
            }}
          />

          {/* Correo Electrónico */}
          <Text style={styles.label}>Correo Electrónico</Text>
          <TextInput
            style={styles.input}
            placeholder="juan.perez@tdea.edu.co"
            placeholderTextColor="#94A3B8"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={(texto) => {
              setEmail(texto);
              if (errorLocal) setErrorLocal('');
            }}
          />

          {/* Contraseña */}
          <Text style={styles.label}>Contraseña (mínimo 6 caracteres)</Text>
          <View style={styles.contenedorPassword}>
            <TextInput
              style={styles.inputPassword}
              placeholder="••••••••"
              placeholderTextColor="#94A3B8"
              secureTextEntry={!mostrarPassword}
              autoCapitalize="none"
              value={password}
              onChangeText={(texto) => {
                setPassword(texto);
                if (errorLocal) setErrorLocal('');
              }}
            />
            <TouchableOpacity
              style={styles.botonOjo}
              onPress={() => setMostrarPassword(!mostrarPassword)}
            >
              <Text style={styles.textoOjo}>{mostrarPassword ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>

          {/* Confirmar Contraseña */}
          <Text style={styles.label}>Confirmar Contraseña</Text>
          <View style={styles.contenedorPassword}>
            <TextInput
              style={styles.inputPassword}
              placeholder="••••••••"
              placeholderTextColor="#94A3B8"
              secureTextEntry={!mostrarPassword}
              autoCapitalize="none"
              value={confirmarPassword}
              onChangeText={(texto) => {
                setConfirmarPassword(texto);
                if (errorLocal) setErrorLocal('');
              }}
            />
          </View>

          {/* Botón de Registro */}
          <TouchableOpacity
            style={[styles.botonRegistro, cargando && styles.botonDeshabilitado]}
            onPress={handleRegistro}
            disabled={cargando}
            activeOpacity={0.85}
          >
            {cargando ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.textoBotonRegistro}>Completar Registro</Text>
            )}
          </TouchableOpacity>

          {/* Enlace para volver a Iniciar Sesión */}
          <View style={styles.filaLogin}>
            <Text style={styles.textoPregunta}>¿Ya tienes una cuenta? </Text>
            <TouchableOpacity onPress={handleRegresarALogin}>
              <Text style={styles.textoEnlaceLogin}>Inicia sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  contenedorPrincipal: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollInterno: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  cabecera: {
    alignItems: 'center',
    marginBottom: 24,
  },
  titulo: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  subtitulo: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 12,
  },
  tarjetaFormulario: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cajaError: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 10,
    padding: 10,
    marginBottom: 14,
  },
  textoError: {
    color: '#B91C1C',
    fontSize: 13,
    fontWeight: '500',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#0F172A',
    marginBottom: 14,
  },
  contenedorPassword: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    marginBottom: 14,
  },
  inputPassword: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#0F172A',
  },
  botonOjo: {
    paddingHorizontal: 14,
  },
  textoOjo: {
    fontSize: 18,
  },
  botonRegistro: {
    backgroundColor: '#0284C7',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 2,
  },
  botonDeshabilitado: {
    backgroundColor: '#94A3B8',
  },
  textoBotonRegistro: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  filaLogin: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
  },
  textoPregunta: {
    fontSize: 13,
    color: '#64748B',
  },
  textoEnlaceLogin: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0284C7',
  },
});
