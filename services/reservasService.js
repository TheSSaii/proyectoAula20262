/**
 * @file reservasService.js
 * @description Servicio para manejar la persistencia de las reservas en Firestore.
 */
import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import dayjs from 'dayjs';

/**
 * Crea una nueva reserva en Firestore.
 * @param {Object} datosReserva 
 */
export const crearReserva = async (datosReserva) => {
  try {
    
    const reservasRef = collection(db, 'reservas');
    
    
    const docRef = await addDoc(reservasRef, {
      idUsuario: datosReserva.idUsuario,
      idEscenario: datosReserva.idEscenario,
      nombreEscenario: datosReserva.nombreEscenario,
      fecha: datosReserva.fecha,
      hora: datosReserva.hora,   
      estado: 'confirmada',
      fechaCreacion: dayjs().format(), 
    });

    return { exito: true, id: docRef.id };
  } catch (error) {
    console.error("Error al crear reserva: ", error);
    return { exito: false, error };
  }
};