/**
 * @file AuthContexto.js
 * @description Contexto global de React (Context API) para la gestión del estado de autenticación.
 * Escucha en tiempo real los cambios de sesión con onAuthStateChanged y expone los métodos
 * login, register, logout y el objeto user a cualquier componente o pantalla.
 * @module contexts/AuthContexto
 */

import React, { createContext, useState, useEffect, useContext } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';
import {
  iniciarSesion,
  registrarUsuario,
  cerrarSesion,
} from '../services/authService';

/**
 * Contexto de autenticación.
 */
export const AuthContexto = createContext({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

/**
 * Hook personalizado para consumir el contexto de autenticación en cualquier parte del árbol de componentes.
 * @returns {{ user: import('firebase/auth').User|null, loading: boolean, login: Function, register: Function, logout: Function }}
 */
export function useAuth() {
  const context = useContext(AuthContexto);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
}

/**
 * Proveedor del contexto de autenticación.
 * Envuelve la aplicación para mantener el estado de sesión persistente con AsyncStorage.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componentes hijos.
 * @returns {React.JSX.Element}
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Escuchar cambios de estado en Firebase Auth (Login, Logout, Persistencia en AsyncStorage)
  useEffect(() => {
    const desuscribir = onAuthStateChanged(auth, (usuarioActual) => {
      setUser(usuarioActual);
      setLoading(false);
    });

    // Limpieza de suscripción al desmontar
    return () => desuscribir();
  }, []);

  /**
   * Inicia sesión y actualiza el estado global.
   */
  const login = async (email, password) => {
    setLoading(true);
    try {
      const usuario = await iniciarSesion(email, password);
      setUser(usuario);
      return usuario;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Registra un nuevo usuario y actualiza el estado global.
   */
  const register = async (email, password, nombre) => {
    setLoading(true);
    try {
      const nuevoUsuario = await registrarUsuario(email, password, nombre);
      setUser(nuevoUsuario);
      return nuevoUsuario;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cierra la sesión activa.
   */
  const logout = async () => {
    setLoading(true);
    try {
      await cerrarSesion();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const valor = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContexto.Provider value={valor}>
      {children}
    </AuthContexto.Provider>
  );
}
