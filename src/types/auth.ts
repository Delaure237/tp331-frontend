export type RoleName = 'Hospital Admin' | 'Doctor' | 'Patient' | 'STAFF' | 'Cashier';

export interface Role {
    id: string;
    name: RoleName;
}

export interface UserRole {
    id: string;
    name: string;
}

export interface Hospital {
    id: string;
    hospitalName: string;
    hospitalEmail?: string;
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
    // On supporte les deux formats de l'API
    role?: Role;
    roleName?: string;
    hospital?: Hospital | null;
    hospitalId?: string;
    patientProfile?: PatientProfile | null;
    doctorProfile?: DoctorProfile | null;
}

export interface AuthResponse {
    user: User;
    message?: string;
    success?: boolean;
}

export interface LoginResponse extends AuthResponse {}

export interface SignupResponse {
    success: boolean;
    message: string;
    data?: {
        email: string;
        expiresAt: string;
    };
}