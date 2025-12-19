import {
  PatientsResponse,
  PatientPeriod
} from '@/types/patient';
import { handleApiResponse } from './api-utils';

const API_URL = "http://localhost:3050";
const BASE_PATH = `${API_URL}/api/v1/patients`;

/**
 * RÉCUPÉRER LA LISTE DES PATIENTS (Pagination, Recherche, Filtre)
 */
export async function getPatientsApi(options: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}): Promise<PatientsResponse> {
  const params = new URLSearchParams();
  if (options.page) params.append('page', options.page.toString());
  if (options.limit) params.append('limit', options.limit.toString());
  if (options.search) params.append('search', options.search);
  if (options.status) params.append('status', options.status);

  const response = await fetch(`${BASE_PATH}?${params.toString()}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  return handleApiResponse<PatientsResponse>(response);
}

/**
 * RÉCUPÉRER LES STATISTIQUES (Stat-Cards)
 */
export async function getPatientStatsApi(period: PatientPeriod = 'thisMonth'): Promise<any[]> {
  const response = await fetch(`${BASE_PATH}/stats?period=${period}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  return handleApiResponse<any[]>(response);
}

/**
 * RÉCUPÉRER UN PATIENT PAR SON ID
 */
export async function getPatientByIdApi(patientId: string): Promise<any> {
  const response = await fetch(`${BASE_PATH}/${patientId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  return handleApiResponse<any>(response);
}

/**
 * CRÉER UN NOUVEAU PATIENT
 */
export async function createPatientApi(payload: any): Promise<any> {
  const response = await fetch(`${BASE_PATH}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    credentials: 'include',
  });

  return handleApiResponse<any>(response);
}

/**
 * METTRE À JOUR UN PATIENT
 */
export async function updatePatientApi(patientId: string, payload: any): Promise<any> {
  const response = await fetch(`${BASE_PATH}/${patientId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    credentials: 'include',
  });

  return handleApiResponse<any>(response);
}

/**
 * SUPPRIMER UN PATIENT
 */
export async function deletePatientApi(patientId: string): Promise<void> {
  const response = await fetch(`${BASE_PATH}/${patientId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  return handleApiResponse<void>(response);
}