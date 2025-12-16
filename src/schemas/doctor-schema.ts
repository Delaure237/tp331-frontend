// src/schemas/doctor-schema.ts
import { z } from "zod";

// Listes exhaustives pour le Select (utilisées pour la validation)
export const DoctorSpecialist = z.enum([
    "Urologie", "Dentisterie", "Cardiologie",
    "Pédiatrie", "Neurologie", "Généraliste",
    "Dermatologie", "Orthopédie", "Prostate"
    // ... autres spécialités
]);

export const DoctorDepartment = z.enum([
    "Chirurgie", "Médecine interne", "Urologie",
    "Pédiatrie", "Dermatologie", "Radiologie",
    "Dentisterie"

]);

export const DoctorSchema = z.object({
    // BLOC 1
    name: z.string().min(3, "Le nom doit contenir au moins 3 caractères."),
    email: z.string().email("Format d'email invalide."),
    phone: z.string().regex(/^\d{8,}$/, "Numéro de téléphone invalide (au moins 8 chiffres)."),
    imageUrl: z.string().url("URL de l'image invalide.").optional().or(z.literal("")),

    // BLOC 2
    specialist: z.string().min(1, "Le spécialiste est requis."),
    department: z.string().min(1, "Le département est requis."),
    degree: z.string().min(2, "Le diplôme est requis (ex: MBBS, MD)."),
    joinDate: z.date({
        required_error: "La date d'adhésion est requise.",
        invalid_type_error: "Format de date invalide.",
    }),
});

export type DoctorFormValues = z.infer<typeof DoctorSchema>;