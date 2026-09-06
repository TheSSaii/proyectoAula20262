/**
 * @file firebaseConfig.js
 * @description Inicialización centralizada de Firebase SDK modular (v10/v11/v12) para Expo.
 * Configura la persistencia de autenticación en AsyncStorage y exporta la instancia de Firestore.
 * Satisface la infraestructura base de Persistencia (T01) y desbloquea el seed de escenarios (T02).
 * @module services/firebaseConfig
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Credenciales oficiales del proyecto Firebase CanchaYa (TdeA)
const firebaseConfig = {
  apiKey: "AIzaSyBsCwccJMcPHpYzUwCg8PA76VgHWCcFbKA",
  authDomain: "canchaya-ef35d.firebaseapp.com",
  projectId: "canchaya-ef35d",
  storageBucket: "canchaya-ef35d.firebasestorage.app",
  messagingSenderId: "915281497132",
  appId: "1:915281497132:web:77848c292b3c58a4e91589",
  measurementId: "G-9C6Q32QZM7",
};

// 1. Inicialización idempotente de Firebase App para evitar duplicaciones en recargas de desarrollo
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// 2. Inicialización de Autenticación con persistencia nativa en AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// 3. Inicialización del cliente de Cloud Firestore
const db = getFirestore(app);

export { app, auth, db };