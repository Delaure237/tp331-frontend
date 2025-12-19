import {
  LoginResponse,
  AuthResponse,
  SignupResponse,
  ForgotPasswordResponse,
  ResetPasswordResponse,
  CreateStaffRequest,
  CreateStaffResponse,
} from '@/types/auth';
import { handleApiResponse } from './api-utils';

/**
 * 💡 CONSEIL : Utilisez 127.0.0.1 au lieu de localhost pour éviter les erreurs CORS
 * si vous rencontrez des problèmes de session.
 */
const API_URL = "http://localhost:3050";

/* ============================
    AUTH – PUBLIC
============================ */

/**
 * LOGIN
 */
export async function loginApi(email: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    credentials: 'include',
  });

  return handleApiResponse<LoginResponse>(response);
}

/**
 * VERIFY OTP (Validation de compte & Reset)
 * Cet endpoint active le compte et pose le cookie de session après l'inscription.
 */
export async function verifyOtpApi(email: string, otp: string): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/api/v1/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp }),
    credentials: 'include',
  });

  return handleApiResponse<LoginResponse>(response);
}

/**
 * SIGNUP HOSPITAL (Utilise FormData pour gérer les fichiers)
 */
export async function registerHospitalApi(formData: FormData): Promise<SignupResponse> {
  const response = await fetch(`${API_URL}/api/v1/auth/signup/hospital`, {
    method: 'POST',
    body: formData, // Pas de Content-Type ici, le navigateur le définit avec le boundary
    credentials: 'include',
  });

  return handleApiResponse<SignupResponse>(response);
}

/**
 * SIGNUP PATIENT
 */
export async function registerPatientApi(payload: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  idNumber: string;
  sex: string;
}): Promise<SignupResponse> {
  const response = await fetch(`${API_URL}/api/v1/auth/signup/patient`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    credentials: 'include',
  });

  return handleApiResponse<SignupResponse>(response);
}

/**
 * FORGOT PASSWORD (Demande l'envoi d'un OTP)
 */
export async function forgotPasswordApi(email: string): Promise<ForgotPasswordResponse> {
  const response = await fetch(`${API_URL}/api/v1/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  return handleApiResponse<ForgotPasswordResponse>(response);
}

/**
 * RESET PASSWORD (Utilise l'OTP reçu par mail)
 */
export async function resetPasswordApi(payload: {
  email: string;
  otp: string;
  newPassword: string;
}): Promise<ResetPasswordResponse> {
  const response = await fetch(`${API_URL}/api/v1/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  return handleApiResponse<ResetPasswordResponse>(response);
}

/**
 * LOGOUT
 */
export async function logoutApi(): Promise<{ success: boolean }> {
  const response = await fetch(`${API_URL}/api/v1/auth/logout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  return handleApiResponse<{ success: boolean }>(response);
}

/* ============================
    AUTH – PROTECTED
============================ */

/**
 * CURRENT USER (Profil)
 */
export async function getCurrentUserApi(): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/api/v1/auth/me`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  return handleApiResponse<AuthResponse>(response);
}

/**
 * CHANGE PASSWORD (Depuis le profil utilisateur)
 */
export async function changePasswordApi(payload: {
  currentPassword: string;
  newPassword: string;
}): Promise<{ message: string }> {
  const response = await fetch(`${API_URL}/api/v1/auth/change-password`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    credentials: 'include',
  });

  return handleApiResponse<{ message: string }>(response);
}

/**
 * CREATE STAFF (Hospital Admin uniquement)
 */
export async function createStaffUserApi(
  payload: CreateStaffRequest
): Promise<CreateStaffResponse> {
  const response = await fetch(`${API_URL}/api/v1/auth/staff/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    credentials: 'include',
  });

  return handleApiResponse<CreateStaffResponse>(response);
}