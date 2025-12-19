import { handleApiResponse } from './api-utils';

const API_URL = "http://localhost:3050";
const BASE_PATH = `${API_URL}/api/v1/bookings`;

/**
 * RÉCUPÉRER LE CATALOGUE COMPLET POUR LE BOOKING (Step 1)
 * Retourne les services, les opérations et les docteurs
 */
export async function getBookingSetupDataApi(hospitalId: string | undefined): Promise<{ services: any[], doctors: any[] }> {

  if (!hospitalId) {
    return { services: [], doctors: [] };
  }

  const response = await fetch(`${BASE_PATH}/setup/${hospitalId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  return handleApiResponse<{ services: any[], doctors: any[] }>(response);
}
/**
 * RÉCUPÉRER LES CRÉNEAUX DISPONIBLES POUR UN DOCTEUR (Step 2 - Anticipation)
 */
export async function getDoctorAvailableSlotsApi(doctorId: string, date: string): Promise<any> {
  const response = await fetch(`${BASE_PATH}/slots/${doctorId}?date=${date}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  return handleApiResponse<any>(response);
}

/**
 * CRÉER UNE RÉSERVATION (Step 3 - Finalisation)
 */
export async function createBookingApi(payload: any): Promise<any> {
  const response = await fetch(`${BASE_PATH}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    credentials: 'include',
  });

  return handleApiResponse<any>(response);
}