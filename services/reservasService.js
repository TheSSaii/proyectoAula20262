/**
 * @file reservasService.js
 * @description Servicio para manejar la persistencia de las reservas en Firestore.
 */
import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import dayjs from 'dayjs';

/**
 * Crea una nueva reserva en Firestore.
 * @param {Object} datosReserva - Datos provenientes de la pantalla de confirmación.
 */
export const crearReserva = async (datosReserva) => {
  try {
    // 1. Apuntamos a la colección 'reservas' en nuestra base de datos
    const reservasRef = collection(db, 'reservas');
    
    // 2. Guardamos el documento con la fecha de creación automática
    const docRef = await addDoc(reservasRef, {
      idUsuario: datosReserva.idUsuario,
      idEscenario: datosReserva.idEscenario,
      nombreEscenario: datosReserva.nombreEscenario,
      fecha: datosReserva.fecha, // Ej: 2026-10-15
      hora: datosReserva.hora,   // Ej: 14:00
      estado: 'confirmada',
      fechaCreacion: dayjs().format(), // Usamos dayjs como exige el proyecto
    });

    return { exito: true, id: docRef.id };
  } catch (error) {
    console.error("Error al crear reserva: ", error);
    return { exito: false, error };
  }
};