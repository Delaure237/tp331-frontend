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

const API_URL = process.env.NEXT_PUBLIC_ACTIVE_API_URL;

/* ============================
   AUTH – PUBLIC
============================ */

/**
 * LOGIN
 * POST /api/v1/auth/login
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
 * SIGNUP HOSPITAL
 * POST /api/v1/auth/signup/hospital
 */
export async function registerHospitalApi(formData: FormData): Promise<SignupResponse> {
  const response = await fetch(`${API_URL}/api/v1/auth/signup/hospital`, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });

  return handleApiResponse<SignupResponse>(response);
}

/**
 * SIGNUP PATIENT
 * POST /api/v1/auth/signup/patient
 */
export async function registerPatientApi(payload: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
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
 * FORGOT PASSWORD
 * POST /api/v1/auth/forgot-password
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
 * RESET PASSWORD
 * POST /api/v1/auth/reset-password
 */
export async function resetPasswordApi(payload: {
  token: string;
  newPassword: string;
}): Promise<ResetPasswordResponse> {
  const response = await fetch(`${API_URL}/api/v1/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  return handleApiResponse<ResetPasswordResponse>(response);
}

/* ============================
   AUTH – PROTECTED
============================ */

/**
 * CURRENT USER
 * GET /api/v1/auth/me
 */
export async function getCurrentUserApi(): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/api/v1/auth/me`, {
    method: 'GET',
    credentials: 'include',
  });

  return handleApiResponse<AuthResponse>(response);
}

/**
 * CHANGE PASSWORD
 * PATCH /api/v1/auth/change-password
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
 * CREATE STAFF (Hospital Admin)
 * POST /api/v1/auth/staff/create
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
