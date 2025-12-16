// src/types/appointment.ts

export type AppointmentStatus = 'Complete' | 'Start' | 'Pending' | 'Canceled';

export type Appointment = {
    patientId: string;
    patientName: string;
    patientAvatar: string;
    timeSlot: string;
    service: string; 
    status: AppointmentStatus;
};