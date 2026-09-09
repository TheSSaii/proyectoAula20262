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

// Credenciales del proyecto Firebase CanchaYa (compatibles con EXPO_PUBLIC_* y fallback)
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "AIzaSyBsCwccJMcPHpYzUwCg8PA76VgHWCcFbKA",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "canchaya-ef35d.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "canchaya-ef35d",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "canchaya-ef35d.firebasestorage.app",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "915281497132",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:915281497132:web:77848c292b3c58a4e91589",
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-9C6Q32QZM7",
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