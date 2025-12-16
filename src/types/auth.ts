export interface Role {
  id: string;
  name: 'ADMIN' | 'DOCTOR' | 'PATIENT' | 'STAFF';
}

export interface Hospital {
  id: string;
  hospitalName: string;
}

export interface PatientProfile {
  patientId: string;
  firstName: string;
  lastName: string;
  status: string;
}

export interface DoctorProfile {
  doctorId: string;
  specialty: string;
}

export interface User {
  id: string;
  email: string;

  role: Role;

  hospital?: Hospital | null;

  patientProfile?: PatientProfile | null;
  doctorProfile?: DoctorProfile | null;
}
// src/types/auth.ts

export interface UserRole {
  id: string;
  name: string;
}

export interface Hospital {
  id: string;
  hospitalName: string;
  hospitalEmail: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  hospital?: Hospital | null;
}

export interface AuthResponse {
  user: AuthUser;
}

export interface LoginResponse {
  message: string;
  user: AuthUser;
}

export interface SignupResponse {
  message: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface CreateStaffRequest {
  email: string;
  roleId: string;
}

export interface CreateStaffResponse {
  message: string;
  userId: string;
}
