import { handleApiResponse } from './api-utils';
import { PatientPeriod } from '@/types/patient'; // On réutilise le type Period pour la cohérence

const API_URL = "http://localhost:3050";
const BASE_PATH = `${API_URL}/api/v1/doctors`;

/**
 * RÉCUPÉRER LA LISTE DES DOCTEURS (Pagination, Recherche, Filtre)
 */
export async function getDoctorsApi(options: {
  page?: number;
  limit?: number;
  search?: string;
  specialty?: string;
}): Promise<{ doctors: any[]; total: number }> {
  const params = new URLSearchParams();
  if (options.page) params.append('page', options.page.toString());
  if (options.limit) params.append('limit', options.limit.toString());
  if (options.search) params.append('search', options.search);
  if (options.specialty) params.append('specialty', options.specialty);

  const response = await fetch(`${BASE_PATH}?${params.toString()}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  return handleApiResponse<{ doctors: any[]; total: number }>(response);
}

/**
 * RÉCUPÉRER LES STATISTIQUES (Stat-Cards)
 */
export async function getDoctorStatsApi(period: PatientPeriod = 'thisMonth'): Promise<any[]> {
  // Correction ici : ajout de la query param period comme pour les patients
  const response = await fetch(`${BASE_PATH}/stats?period=${period}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  return handleApiResponse<any[]>(response);
}

/**
 * RÉCUPÉRER UN DOCTEUR PAR SON ID
 */
export async function getDoctorByIdApi(doctorId: string): Promise<any> {
  const response = await fetch(`${BASE_PATH}/${doctorId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  return handleApiResponse<any>(response);
}

/**
 * CRÉER UN NOUVEAU DOCTEUR
 */
export async function createDoctorApi(payload: any): Promise<any> {
  const response = await fetch(`${BASE_PATH}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    credentials: 'include',
  });

  return handleApiResponse<any>(response);
}

/**
 * METTRE À JOUR UN DOCTEUR
 */
export async function updateDoctorApi(doctorId: string, payload: any): Promise<any> {
  const response = await fetch(`${BASE_PATH}/${doctorId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    credentials: 'include',
  });

  return handleApiResponse<any>(response);
}

/**
 * SUPPRIMER UN DOCTEUR
 */
export async function deleteDoctorApi(doctorId: string): Promise<void> {
  const response = await fetch(`${BASE_PATH}/${doctorId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  return handleApiResponse<void>(response);
}