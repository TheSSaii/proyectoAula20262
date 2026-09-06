/**
 * @file escenariosService.js
 * @description Capa de servicios para la gestión y consulta del catálogo de escenarios deportivos en Cloud Firestore.
 * Provee métodos desacoplados de la UI para obtener todos los escenarios o consultar uno por su ID único.
 * Este servicio es el contrato oficial consumido por el Catálogo (Prog 2) y el Motor de Disponibilidad (Prog 3).
 * @module services/escenariosService
 */

import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from './firebaseConfig';

const COLECCION_ESCENARIOS = 'escenarios';

/**
 * Normaliza y formatea un documento de Firestore agregando su ID de forma explícita.
 * @param {import('firebase/firestore').DocumentSnapshot} docSnapshot
 * @returns {Object} Objeto con los datos del escenario y su propiedad id.
 */
function normalizarDocumentoEscenario(docSnapshot) {
  const data = docSnapshot.data() || {};
  return {
    id: docSnapshot.id,
    nombre: data.nombre || 'Escenario sin nombre',
    tipo: data.tipo || 'General',
    ubicacion: data.ubicacion || 'Campus Robledo',
    capacidad: typeof data.capacidad === 'number' ? data.capacidad : 0,
    estado: data.estado || 'disponible',
    descripcion: data.descripcion || '',
    imagenUrl: data.imagenUrl || null,
    actualizadoEn: data.actualizadoEn ? data.actualizadoEn.toDate() : null,
  };
}

/**
 * Obtiene el listado completo de escenarios deportivos registrados en Firestore.
 * Los resultados vienen ordenados alfabéticamente por nombre.
 *
 * @async
 * @function getEscenarios
 * @returns {Promise<Array<Object>>} Lista de escenarios normalizados con sus IDs.
 * @throws {Error} Si ocurre un error de permisos o conexión con Firestore.
 */
export async function getEscenarios() {
  try {
    const coleccionRef = collection(db, COLECCION_ESCENARIOS);
    const consultaOrdenada = query(coleccionRef, orderBy('nombre', 'asc'));
    const querySnapshot = await getDocs(consultaOrdenada);

    const escenarios = [];
    querySnapshot.forEach((docSnap) => {
      escenarios.push(normalizarDocumentoEscenario(docSnap));
    });

    return escenarios;
  } catch (error) {
    console.error('Error al obtener el catálogo de escenarios desde Firestore:', error);
    throw new Error(
      `No se pudo cargar el catálogo de escenarios: ${error.message || 'Error de conexión'}`
    );
  }
}

/**
 * Obtiene la información detallada de un escenario deportivo específico mediante su ID de documento.
 *
 * @async
 * @function getEscenarioById
 * @param {string} escenarioId - Identificador único del escenario en Firestore.
 * @returns {Promise<Object|null>} Escenario normalizado si existe, o null si no se encuentra.
 * @throws {Error} Si no se proporciona un ID válido o falla la comunicación con la base de datos.
 */
export async function getEscenarioById(escenarioId) {
  if (!escenarioId || typeof escenarioId !== 'string') {
    throw new Error('El parámetro escenarioId es obligatorio y debe ser un texto.');
  }

  try {
    const docRef = doc(db, COLECCION_ESCENARIOS, escenarioId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return normalizarDocumentoEscenario(docSnap);
  } catch (error) {
    console.error(`Error al consultar el escenario con ID ${escenarioId}:`, error);
    throw new Error(
      `No se pudo consultar el escenario solicitado: ${error.message || 'Error de conexión'}`
    );
  }
}
