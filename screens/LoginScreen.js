/**
 * @file LoginScreen.js
 * @description Pantalla de inicio de sesión de CanchaYa (TdeA).
 * Gestiona el formulario de acceso con validación de correo y contraseña,
 * soporte para texto seguro, manejo de estados de carga y llamada al AuthContexto.
 * @module screens/LoginScreen
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
  Alert,
} from 'react-native';
import { useAuth } from '../contexts/AuthContexto';

/**
 * Pantalla de inicio de sesión.
 *
 * @param {Object} props
 * @param {Object} [props.navigation] - Objeto de navegación provisto por React Navigation.
 * @param {Function} [props.onIrARegistro] - Callback alternativo para alternar a la pantalla de registro.
 * @returns {React.JSX.Element}
 */
export default function LoginScreen({ navigation, onIrARegistro }) {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [errorLocal, setErrorLocal] = useState('');

  // Validaciones del lado del cliente antes de enviar a Firebase
  const validarFormulario = () => {
    setErrorLocal('');

    if (!email.trim()) {
      setErrorLocal('Ingresa tu correo electrónico.');
      return false;
    }

    // Expresión regular estándar para validación básica de correo
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(email.trim())) {
      setErrorLocal('El formato del correo electrónico no es válido.');
      return false;
    }

    if (!password) {
      setErrorLocal('Ingresa tu contraseña.');
      return false;
    }

    return true;
  };

  const handleLogin = async () => {
    if (!validarFormulario()) return;

    try {
      setCargando(true);
      setErrorLocal('');
      await login(email, password);
      // Al resolverse el login, AuthContexto actualiza 'user' y el router redirige automáticamente
    } catch (error) {
      setErrorLocal(error.message);
    } finally {
      setCargando(false);
    }
  };

  const handleNavegarARegistro = () => {
    if (navigation?.navigate) {
      navigation.navigate('Registro');
    } else if (onIrARegistro) {
      onIrARegistro();
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
        {/* Cabecera / Branding */}
        <View style={styles.cabecera}>
          <View style={styles.circuloLogo}>
            <Text style={styles.iconoLogo}>🏟️</Text>
          </View>
          <Text style={styles.titulo}>CanchaYa</Text>
          <Text style={styles.subtitulo}>
            Extensión Móvil de Campus TdeA · Cátedras ACUDE
          </Text>
          <Text style={styles.insigniaTdeA}>Tecnológico de Antioquia</Text>
        </View>

        {/* Tarjeta del Formulario */}
        <View style={styles.tarjetaFormulario}>
          <Text style={styles.tituloFormulario}>Iniciar Sesión</Text>

          {/* Mensaje de Error en pantalla */}
          {errorLocal ? (
            <View style={styles.cajaError}>
              <Text style={styles.textoError}>⚠️ {errorLocal}</Text>
            </View>
          ) : null}

          {/* Campo Correo */}
          <Text style={styles.label}>Correo Electrónico</Text>
          <TextInput
            style={styles.input}
            placeholder="usuario@tdea.edu.co"
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

          {/* Campo Contraseña */}
          <Text style={styles.label}>Contraseña</Text>
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
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.textoOjo}>{mostrarPassword ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>

          {/* Botón de Ingreso */}
          <TouchableOpacity
            style={[styles.botonIngreso, cargando && styles.botonDeshabilitado]}
            onPress={handleLogin}
            disabled={cargando}
            activeOpacity={0.85}
          >
            {cargando ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.textoBotonIngreso}>Ingresar a CanchaYa</Text>
            )}
          </TouchableOpacity>

          {/* Enlace hacia Registro */}
          <View style={styles.filaRegistro}>
            <Text style={styles.textoPregunta}>¿No tienes una cuenta? </Text>
            <TouchableOpacity onPress={handleNavegarARegistro}>
              <Text style={styles.textoEnlaceRegistro}>Regístrate aquí</Text>
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
    marginBottom: 28,
  },
  circuloLogo: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#0284C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  iconoLogo: {
    fontSize: 34,
  },
  titulo: {
    fontSize: 30,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  subtitulo: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
  },
  insigniaTdeA: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0284C7',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 6,
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
  tituloFormulario: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 16,
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
    marginBottom: 20,
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
  botonIngreso: {
    backgroundColor: '#0284C7',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 2,
  },
  botonDeshabilitado: {
    backgroundColor: '#94A3B8',
  },
  textoBotonIngreso: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  filaRegistro: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
  },
  textoPregunta: {
    fontSize: 13,
    color: '#64748B',
  },
  textoEnlaceRegistro: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0284C7',
  },
});
