/**
 * @file acudesService.js
 * @description Capa de servicios para la consulta del catálogo de Cátedras y Actividades ACUDE
 * (Actividades Culturales y Deportivas) de Bienestar Institucional (TdeA) en Cloud Firestore.
 * Satisface la arquitectura desacoplada: las pantallas no ejecutan queries de Firestore directamente.
 * @module services/acudesService
 */

import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { db } from './firebaseConfig';

const COLECCION_ACUDES = 'acudes';

/**
 * Normaliza y formatea un documento de Firestore de la colección 'acudes'.
 * @param {import('firebase/firestore').DocumentSnapshot} docSnapshot
 * @returns {Object} Objeto normalizado con id y campos estandarizados.
 */
function normalizarDocumentoAcude(docSnapshot) {
  const data = docSnapshot.data() || {};
  const idDoc = docSnapshot.id;
  const rawHorarios = Array.isArray(data.horarios) ? data.horarios : [];

  // Normalizar cada horario individual asegurando aforo por franja
  const horarios = rawHorarios.map((h, idx) => {
    const idHorario = h.id || `${idDoc}-horario-${idx + 1}`;
    const cupoTotalHorario =
      typeof h.cupoTotal === 'number'
        ? h.cupoTotal
        : rawHorarios.length > 0 && typeof data.cupoTotal === 'number'
        ? Math.floor(data.cupoTotal / rawHorarios.length)
        : 10;

    const cuposDisponiblesHorario =
      typeof h.cuposDisponibles === 'number'
        ? h.cuposDisponibles
        : rawHorarios.length > 0 && typeof data.cuposDisponibles === 'number'
        ? Math.floor(data.cuposDisponibles / rawHorarios.length)
        : cupoTotalHorario;

    return {
      id: idHorario,
      dia: h.dia || 'Por definir',
      horaInicio: h.horaInicio || '00:00',
      horaFin: h.horaFin || '00:00',
      lugar: h.lugar || data.ubicacion || 'Campus Robledo - Bloque 10',
      docente: h.docente || data.docente || 'Docente asignado',
      cupoTotal: cupoTotalHorario,
      cuposDisponibles: Math.max(0, cuposDisponiblesHorario),
    };
  });

  // Si hay horarios configurados, la suma de cupos individuales determina el aforo total
  const sumaCuposDisponibles =
    horarios.length > 0
      ? horarios.reduce((acc, h) => acc + (h.cuposDisponibles || 0), 0)
      : typeof data.cuposDisponibles === 'number'
      ? data.cuposDisponibles
      : 0;

  const sumaCupoTotal =
    horarios.length > 0
      ? horarios.reduce((acc, h) => acc + (h.cupoTotal || 0), 0)
      : typeof data.cupoTotal === 'number'
      ? data.cupoTotal
      : 25;

  const estado = sumaCuposDisponibles > 0 ? 'disponible' : 'agotado';

  return {
    id: idDoc,
    nombre: data.nombre || 'Cátedra sin nombre',
    categoria: data.categoria || 'Deportiva', // 'Deportiva' | 'Cultural'
    disciplina: data.disciplina || 'General',
    ubicacion: data.ubicacion || 'Campus Robledo - Bloque 10',
    docente: data.docente || 'Docente de Bienestar',
    cupoTotal: sumaCupoTotal,
    cuposDisponibles: sumaCuposDisponibles,
    estado: data.estado || estado,
    descripcion: data.descripcion || '',
    requisitos: data.requisitos || 'Carné institucional TdeA y vestimenta adecuada.',
    asistenciaMinima:
      data.asistenciaMinima ||
      '80% de asistencia obligatoria durante el semestre para validación de créditos. Inasistencias reiteradas liberan el cupo para otros estudiantes.',
    notaPresencial:
      data.notaPresencial ||
      'Si no alcanzaste cupo virtual en la app o en Campus TdeA, preséntate directamente en el lugar de la clase en la primera sesión con el docente a cargo para solicitar sobrecupo si hay plazas liberadas.',
    horarios,
    imagenUrl: data.imagenUrl || null,
    actualizadoEn: data.actualizadoEn ? data.actualizadoEn.toDate() : null,
  };
}

/**
 * Obtiene el catálogo completo o filtrado de actividades ACUDE desde Firestore.
 *
 * @async
 * @function getAcudes
 * @param {string} [filtroCategoria='Todos'] - 'Todos' | 'Deportiva' | 'Cultural'
 * @returns {Promise<Array<Object>>} Lista de actividades ACUDE normalizadas.
 * @throws {Error} Si falla la comunicación con Firestore.
 */
export async function getAcudes(filtroCategoria = 'Todos') {
  try {
    const coleccionRef = collection(db, COLECCION_ACUDES);
    let consulta;

    if (filtroCategoria && filtroCategoria !== 'Todos') {
      consulta = query(
        coleccionRef,
        where('categoria', '==', filtroCategoria),
        orderBy('nombre', 'asc')
      );
    } else {
      consulta = query(coleccionRef, orderBy('nombre', 'asc'));
    }

    const querySnapshot = await getDocs(consulta);
    const acudes = [];
    querySnapshot.forEach((docSnap) => {
      acudes.push(normalizarDocumentoAcude(docSnap));
    });

    return acudes;
  } catch (error) {
    console.error('Error al consultar actividades ACUDE desde Firestore:', error);
    throw new Error(
      `No se pudo cargar el catálogo de actividades ACUDE: ${
        error.message || 'Error de conexión'
      }`
    );
  }
}

/**
 * Obtiene la ficha técnica completa de una actividad ACUDE por su ID de documento.
 *
 * @async
 * @function getAcudeById
 * @param {string} acudeId - Identificador único del taller en Firestore.
 * @returns {Promise<Object|null>} Actividad normalizada o null si no existe.
 */
export async function getAcudeById(acudeId) {
  if (!acudeId || typeof acudeId !== 'string') {
    throw new Error('El parámetro acudeId es obligatorio y debe ser un texto.');
  }

  try {
    const docRef = doc(db, COLECCION_ACUDES, acudeId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return normalizarDocumentoAcude(docSnap);
  } catch (error) {
    console.error(`Error al consultar actividad ACUDE con ID ${acudeId}:`, error);
    throw new Error(
      `No se pudo consultar el detalle de la actividad: ${
        error.message || 'Error de conexión'
      }`
    );
  }
}
