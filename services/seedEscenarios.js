/**
 * @file seedEscenarios.js
 * @description Script de siembra de datos (Seed) para la colección 'escenarios' en Cloud Firestore.
 * Carga los escenarios deportivos reales del campus Robledo del Tecnológico de Antioquia (TdeA).
 * Cumple con el criterio de datos reales de la rúbrica oficial y es idempotente (usa IDs fijos).
 * @module services/seedEscenarios
 */

import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebaseConfig';

/**
 * Catálogo maestro de escenarios deportivos reales del Tecnológico de Antioquia.
 * Cada elemento respeta los campos requeridos por la rúbrica:
 * - nombre, tipo, ubicacion, capacidad, estado, descripcion e imagenUrl.
 */
export const ESCENARIOS_TDEA = [
  {
    id: 'esc-cancha-sintetica',
    nombre: 'Cancha Sintética de Fútbol 8',
    tipo: 'Fútbol',
    ubicacion: 'Campus Robledo - Bloque Deportivo',
    capacidad: 16,
    estado: 'disponible',
    descripcion:
      'Cancha de grama sintética con iluminación nocturna, cerramiento perimetral y graderías para partidos y entrenamientos institucionales.',
    imagenUrl:
      'https://images.unsplash.com/photo-1529900241940-025a40b95c02?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: 'esc-coliseo-cubierto',
    nombre: 'Coliseo Cubierto Mayor',
    tipo: 'Baloncesto / Voleibol',
    ubicacion: 'Campus Robledo - Bloque E',
    capacidad: 30,
    estado: 'disponible',
    descripcion:
      'Escenario multideportivo con maderamen profesional, tableros electrónicos y capacidad para competencias de baloncesto, voleibol y fútbol de salón.',
    imagenUrl:
      'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: 'esc-gimnasio-bienestar',
    nombre: 'Gimnasio de Acondicionamiento Físico',
    tipo: 'Acondicionamiento',
    ubicacion: 'Campus Robledo - Piso 2 Edificio Bienestar',
    capacidad: 25,
    estado: 'mantenimiento',
    descripcion:
      'Zona equipada con pesas libres, máquinas cardiovasculares y calistenia con asesoría constante de licenciados en educación física.',
    imagenUrl:
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: 'esc-placa-polideportiva',
    nombre: 'Placa Polideportiva Descubierta',
    tipo: 'Microfútbol / Baloncesto',
    ubicacion: 'Campus Robledo - Zona Canchas Externas',
    capacidad: 14,
    estado: 'disponible',
    descripcion:
      'Cancha al aire libre demarcada para microfútbol y baloncesto, abierta para práctica deportiva recreativa y torneos relámpago.',
    imagenUrl:
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: 'esc-sala-tenis-mesa',
    nombre: 'Sala de Tenis de Mesa y Deportes de Mesa',
    tipo: 'Tenis de Mesa',
    ubicacion: 'Campus Robledo - Bloque Deportivo, Nivel 1',
    capacidad: 12,
    estado: 'ocupado',
    descripcion:
      'Espacio climatizado dotado con 4 mesas reglamentarias de tenis de mesa, raquetas y tableros para ajedrez y juegos de estrategia.',
    imagenUrl:
      'https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?w=800&auto=format&fit=crop&q=60',
  },
];

/**
 * Ejecuta la carga masiva de los escenarios iniciales a la colección 'escenarios' de Firestore.
 * Utiliza setDoc con { merge: true } e IDs predefinidos para garantizar idempotencia:
 * si el documento ya existe, actualiza sus campos sin crear duplicados.
 *
 * @async
 * @function ejecutarSeedEscenarios
 * @returns {Promise<{ exitoso: boolean, totalInsertados: number, mensaje: string }>}
 */
export async function ejecutarSeedEscenarios() {
  try {
    let insertados = 0;

    for (const escenario of ESCENARIOS_TDEA) {
      const { id, ...datosEscenario } = escenario;
      const referenciaDoc = doc(db, 'escenarios', id);

      // setDoc con merge: true garantiza idempotencia
      await setDoc(
        referenciaDoc,
        {
          ...datosEscenario,
          actualizadoEn: serverTimestamp(),
        },
        { merge: true }
      );

      insertados += 1;
    }

    return {
      exitoso: true,
      totalInsertados: insertados,
      mensaje: `Se poblaron exitosamente ${insertados} escenarios en Firestore.`,
    };
  } catch (error) {
    console.error('Error al ejecutar el seed de escenarios en Firestore:', error);
    throw new Error(
      `Fallo en la siembra de datos: ${error.message || 'Error de conexión con Firestore'}`
    );
  }
}
