/**
 * @file inscripcionesService.js
 * @description Capa de servicios para la matrícula y cancelación atómica de Cátedras ACUDE
 * en Cloud Firestore mediante transacciones (runTransaction).
 * Garantiza integridad concurrente de cupos (prevención de sobrecupo virtual duplicado)
 * y persistencia vinculada al perfil del estudiante.
 * @module services/inscripcionesService
 */

import {
  collection,
  doc,
  query,
  where,
  getDocs,
  runTransaction,
} from 'firebase/firestore';
import dayjs from 'dayjs';
import { db } from './firebaseConfig';

const COLECCION_INSCRIPCIONES = 'inscripciones';
const COLECCION_ACUDES = 'acudes';

/**
 * Verifica si un estudiante ya cuenta con una inscripción activa en una cátedra ACUDE.
 *
 * @async
 * @function verificarInscripcionPrevia
 * @param {string} acudeId - ID del taller.
 * @param {string} userId - UID del estudiante.
 * @returns {Promise<Object|null>} El objeto inscripción si existe activa, o null.
 */
export async function verificarInscripcionPrevia(acudeId, userId) {
  if (!acudeId || !userId) return null;

  try {
    const q = query(
      collection(db, COLECCION_INSCRIPCIONES),
      where('idUsuario', '==', userId),
      where('idAcude', '==', acudeId),
      where('estado', '==', 'activa')
    );

    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const primerDoc = snapshot.docs[0];
      return { id: primerDoc.id, ...primerDoc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error al verificar inscripción previa:', error);
    return null;
  }
}

/**
 * Inscribe atómicamente a un estudiante en una cátedra ACUDE.
 * Aplica una transacción de Firestore para garantizar que no se sobrepase el aforo
 * y que el estudiante no quede duplicado.
 *
 * @async
 * @function inscribirEstudiante
 * @param {string} acudeId - ID del ACUDE.
 * @param {string} userId - UID del estudiante en Firebase Auth.
 * @param {Object} [datosEstudiante={}] - Metadatos opcionales (email, nombre).
 * @returns {Promise<{ exitoso: boolean, inscripcionId: string, mensaje: string }>}
 */
export async function inscribirEstudiante(acudeId, userId, datosEstudiante = {}) {
  if (!acudeId || !userId) {
    throw new Error('Se requiere el ID de la actividad y el ID del estudiante.');
  }

  // 1. Verificación previa de duplicados
  const yaInscrito = await verificarInscripcionPrevia(acudeId, userId);
  if (yaInscrito) {
    throw new Error('Ya te encuentras formalmente inscrito en esta cátedra ACUDE.');
  }

  const acudeRef = doc(db, COLECCION_ACUDES, acudeId);
  const nuevaInscripcionRef = doc(collection(db, COLECCION_INSCRIPCIONES));

  try {
    const resultado = await runTransaction(db, async (transaction) => {
      const acudeDoc = await transaction.get(acudeRef);
      if (!acudeDoc.exists()) {
        throw new Error('La cátedra ACUDE no existe en la base de datos.');
      }

      const dataAcude = acudeDoc.data();
      const cuposDisponibles = typeof dataAcude.cuposDisponibles === 'number'
        ? dataAcude.cuposDisponibles
        : 0;

      if (cuposDisponibles <= 0) {
        throw new Error(
          'Los cupos oficiales en la app para esta cátedra están agotados. Puedes consultar el cronograma y lugar para solicitar sobrecupo presencial en la primera sesión con el docente.'
        );
      }

      const nuevosCupos = cuposDisponibles - 1;
      const nuevoEstado = nuevosCupos === 0 ? 'agotado' : 'disponible';

      // 2. Decrementar cupo en la cátedra
      transaction.update(acudeRef, {
        cuposDisponibles: nuevosCupos,
        estado: nuevoEstado,
        actualizadoEn: new Date(),
      });

      // 3. Crear el documento de inscripción vinculado al estudiante
      transaction.set(nuevaInscripcionRef, {
        idUsuario: userId,
        emailUsuario: datosEstudiante.email || '',
        nombreUsuario: datosEstudiante.nombre || 'Estudiante TdeA',
        idAcude: acudeId,
        nombreAcude: dataAcude.nombre || 'Cátedra ACUDE',
        categoria: dataAcude.categoria || 'Deportiva',
        disciplina: dataAcude.disciplina || 'General',
        docente: dataAcude.docente || 'Docente asignado',
        ubicacion: dataAcude.ubicacion || 'Campus Robledo - Bloque 10',
        horarios: Array.isArray(dataAcude.horarios) ? dataAcude.horarios : [],
        estado: 'activa',
        fechaInscripcion: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        asistenciaMinima: dataAcude.asistenciaMinima || '80% de asistencia obligatoria',
      });

      return {
        exitoso: true,
        inscripcionId: nuevaInscripcionRef.id,
        mensaje: `¡Inscripción exitosa en ${dataAcude.nombre}! Recuerda la regla del 80% de asistencia mínima.`,
      };
    });

    return resultado;
  } catch (error) {
    console.error('Error en la transacción de inscripción:', error);
    throw new Error(error.message || 'No fue posible completar la inscripción.');
  }
}

/**
 * Cancela una inscripción activa de forma atómica y reintegra el cupo a la cátedra.
 *
 * @async
 * @function cancelarInscripcion
 * @param {string} inscripcionId - ID del documento de inscripción.
 * @param {string} acudeId - ID de la cátedra para devolver el cupo.
 * @returns {Promise<{ exitoso: boolean, mensaje: string }>}
 */
export async function cancelarInscripcion(inscripcionId, acudeId) {
  if (!inscripcionId || !acudeId) {
    throw new Error('Se requiere el ID de la inscripción y el ID de la cátedra.');
  }

  const inscripcionRef = doc(db, COLECCION_INSCRIPCIONES, inscripcionId);
  const acudeRef = doc(db, COLECCION_ACUDES, acudeId);

  try {
    const resultado = await runTransaction(db, async (transaction) => {
      // 1. TODAS LAS LECTURAS PRIMERO (READS)
      const inscripcionDoc = await transaction.get(inscripcionRef);
      if (!inscripcionDoc.exists()) {
        throw new Error('El registro de inscripción no fue encontrado.');
      }

      const dataInscripcion = inscripcionDoc.data();
      if (dataInscripcion.estado === 'cancelada') {
        throw new Error('Esta inscripción ya se encuentra cancelada.');
      }

      const acudeDoc = await transaction.get(acudeRef);

      // 2. TODAS LAS ESCRITURAS AL FINAL (WRITES)
      // A. Marcar inscripción como cancelada
      transaction.update(inscripcionRef, {
        estado: 'cancelada',
        fechaCancelacion: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      });

      // B. Devolver el cupo en acudes si el documento existe
      if (acudeDoc.exists()) {
        const dataAcude = acudeDoc.data();
        const cuposActuales = typeof dataAcude.cuposDisponibles === 'number'
          ? dataAcude.cuposDisponibles
          : 0;
        const cupoTotal = typeof dataAcude.cupoTotal === 'number'
          ? dataAcude.cupoTotal
          : cuposActuales + 1;

        const nuevosCupos = Math.min(cuposActuales + 1, cupoTotal);

        transaction.update(acudeRef, {
          cuposDisponibles: nuevosCupos,
          estado: 'disponible',
          actualizadoEn: new Date(),
        });
      }

      return {
        exitoso: true,
        mensaje: 'Tu inscripción ha sido cancelada y el cupo ha quedado liberado para otro estudiante.',
      };
    });

    return resultado;
  } catch (error) {
    console.error('Error al cancelar la inscripción:', error);
    throw new Error(error.message || 'No fue posible cancelar la inscripción.');
  }
}

/**
 * Consulta todas las cátedras ACUDE en las que el estudiante se encuentra inscrito activamente.
 *
 * @async
 * @function getMisInscripciones
 * @param {string} userId - UID del estudiante.
 * @returns {Promise<Array<Object>>} Lista de inscripciones activas.
 */
export async function getMisInscripciones(userId) {
  if (!userId) return [];

  try {
    const q = query(
      collection(db, COLECCION_INSCRIPCIONES),
      where('idUsuario', '==', userId),
      where('estado', '==', 'activa')
    );

    const snapshot = await getDocs(q);
    const lista = [];
    snapshot.forEach((docSnap) => {
      lista.push({
        id: docSnap.id,
        ...docSnap.data(),
      });
    });

    return lista;
  } catch (error) {
    console.error('Error al consultar mis inscripciones:', error);
    throw new Error(
      `No se pudo cargar tus inscripciones: ${error.message || 'Error de conexión'}`
    );
  }
}
