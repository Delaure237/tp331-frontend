// src/app/_utils/appointment-utils.ts

import { Appointment, AppointmentStatus } from "@/types/appointment"; // Importation des types

// Données simulées pour les rendez-vous
export const MOCK_APPOINTMENTS: Appointment[] = [
    { patientId: "A001", patientName: "Jessica Dahlgren", patientAvatar: "/avatars/jessica.jpg", timeSlot: "10.30 - 10:30", service: "Chirurgie", status: 'Complete' },
    { patientId: "A002", patientName: "Birgitta Hansson", patientAvatar: "/avatars/birgitta.jpg", timeSlot: "10.30 - 11:30", service: "Pédiatrie", status: 'Complete' },
    { patientId: "A003", patientName: "Jane Cooper", patientAvatar: "/avatars/jane.jpg", timeSlot: "11.30 - 12:30", service: "Radiologie", status: 'Pending' },
    { patientId: "A004", patientName: "Brooklyn Simmons", patientAvatar: "/avatars/brooklyn.jpg", timeSlot: "12.30 - 01:30", service: "Urgence", status: 'Start' },
    { patientId: "A005", patientName: "Ralph Edwards", patientAvatar: "/avatars/ralph.jpg", timeSlot: "02.00 - 03:00", service: "Cardiologie", status: 'Pending' },
];

// Logique simple pour obtenir le badge de statut
export const getAppointmentStatusBadge = (status: AppointmentStatus) => {
    // ... (Logique de badge inchangée)
    let style = "bg-gray-100 text-gray-800";
    let text = status;

    switch (status) {
        case 'Complete':
            style = "bg-green-100 text-green-700 hover:bg-green-200";
            break;
        case 'Start':
            style = "bg-indigo-100 text-indigo-700 hover:bg-indigo-200";
            break;
        case 'Canceled':
            style = "bg-red-100 text-red-700 hover:bg-red-200";
            break;
    }

    return (
        <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-lg ${style}`}>
            {text}
        </span>
    );
};