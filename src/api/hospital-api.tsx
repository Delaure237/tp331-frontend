/* eslint-disable @typescript-eslint/no-explicit-any */
import { handleApiResponse } from './api-utils';

const API_URL = "http://localhost:3050";
const BASE_PATH = `${API_URL}/api/v1/hospitals`;

/**
 * RÉCUPÉRER LA LISTE DES HÔPITAUX
 */
export async function getHospitalsApi(options: {
  search?: string;
  city?: string;
}): Promise<any[]> {
  const params = new URLSearchParams();
  if (options.search) params.append('search', options.search);
  if (options.city) params.append('city', options.city);

  const response = await fetch(`${BASE_PATH}?${params.toString()}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  return handleApiResponse<any[]>(response);
}

/**
 * CRÉER OU METTRE À JOUR UN CATALOGUE (Service + Opérations)
 */
export async function createFullServiceCatalogueApi(data: {
  name: string;
  description?: string;
  operations: { name: string; price: number }[];
}): Promise<any> {
  const response = await fetch(`${BASE_PATH}/services/setup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',
  });

  return handleApiResponse<any>(response);
}

/**
 * RÉCUPÉRER LES DÉTAILS D'UN HÔPITAL
 */
export async function getHospitalByIdApi(hospitalId: string): Promise<any> {
  const response = await fetch(`${BASE_PATH}/${hospitalId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  return handleApiResponse<any>(response);
}

/**
 * RÉCUPÉRER LES SERVICES ET LEURS OPÉRATIONS
 * Corrigé : Retourne un tableau d'objets (services) contenant les opérations
 */
export async function getHospitalServicesApi(hospitalId: string): Promise<any[]> {
  const response = await fetch(`${BASE_PATH}/${hospitalId}/services`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  // Changé string[] en any[] car le backend renvoie désormais les objets services complets
  return handleApiResponse<any[]>(response);
}

/**
 * RÉCUPÉRER LES STATISTIQUES RAPIDES
 */
export async function getHospitalQuickStatsApi(): Promise<any> {
  const response = await fetch(`${BASE_PATH}/stats/quick`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  return handleApiResponse<any>(response);
}

/**
 * SUPPRIMER UNE OPÉRATION (ACTE MÉDICAL)
 */
export async function deleteOperationApi(operationId: string): Promise<void> {
  const response = await fetch(`${BASE_PATH}/operations/${operationId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  return handleApiResponse<void>(response);
}