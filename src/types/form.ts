// Ex: src/types/forms.ts

import { z } from 'zod';

/**
 * Liste des spécialités pour le champ "Services"
 */
export const HOSPITAL_SPECIALTIES = [
    'Cardiologie', 
    'Neurologie', 
    'Pédiatrie', 
    'Oncologie', 
    'Orthopédie', 
    'Chirurgie',
    'Gynécologie',
    'Urgences',
] as const;


/**
 * Étape 1 : Informations de l'Hôpital (Mise à jour)
 */
export interface IHospitalInfoForm {
    hospitalName: string;
    hospitalEmail: string;
    // Nouveaux champs
    phoneNumber1: string; // On suppose que l'email est le contact principal, mais on ajoute les numéros
    phoneNumber2: string;
    address: string;
    openingHours: string;
    services: typeof HOSPITAL_SPECIALTIES[number][]; // Tableau de spécialités

    // Champs existants
    hospitalLogo: FileList | null;
    hospitalImages: FileList | null;
}

/**
 * Étape 2 : Informations d'Authentification (Reste inchangé)
 */
export interface IAuthInfoForm {
    adminRole: 'Administrator' | 'Doctor' | 'Cashier';
    adminEmail: string;
    password: string;
    confirmPassword: string;
}


/**
 * Schéma de base pour la validation des FileList
 */
const fileSchema = z.instanceof(FileList, {
    message: "Veuillez téléverser un fichier."
}).nullable();

/**
 * Schéma Zod pour l'étape 1 : Informations de l'Hôpital (Mise à jour)
 */
export const HospitalInfoSchema = z.object({
    hospitalName: z.string().min(3, "Le nom de l'hôpital doit contenir au moins 3 caractères."),
    hospitalEmail: z.string().email("Format d'email invalide."),
    
    // Nouveaux champs de validation
    phoneNumber1: z.string().min(8, "Veuillez entrer un numéro de téléphone valide."),
    phoneNumber2: z.string().optional().or(z.literal('')), // Rendu optionnel
    address: z.string().min(10, "Veuillez entrer une adresse complète (minimum 10 caractères)."),
    openingHours: z.string().min(3, "Veuillez indiquer les heures d'ouverture (ex: 8h-18h)."),
    // Validation du tableau de services
    services: z.array(z.enum(HOSPITAL_SPECIALTIES, {
        required_error: "Veuillez sélectionner au moins un service.",
    })).min(1, "Veuillez sélectionner au moins un service/spécialité."),


    // Champs de fichiers existants
    hospitalLogo: fileSchema.refine(files =>
        !files || files.length === 1,
        "Veuillez sélectionner un seul fichier pour le logo."
    ).refine(files =>
        !files || files[0].size <= 10 * 1024 * 1024,
        "Le logo ne doit pas dépasser 10 Mo."
    ).optional(),

    hospitalImages: fileSchema.refine(files =>
        !files || files.length <= 3, // Mis à jour à 3 photos Max (comme dans le texte)
        "Vous ne pouvez téléverser que 3 photos au maximum."
    ).refine(files =>
        !files || Array.from(files).every(file => file.size <= 10 * 1024 * 1024),
        "Chaque image ne doit pas dépasser 10 Mo."
    ).optional(),
});

/**
 * Schéma Zod pour l'étape 2 : Informations d'Authentification (Reste inchangé)
 */
export const AuthInfoSchema = z.object({
    adminRole: z.enum(['Administrator', 'Doctor', 'Cashier'], {
        message: "Veuillez sélectionner un rôle.",
    }),
    adminEmail: z.string().email("Format d'email invalide pour l'administrateur."),
    password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères."),
    confirmPassword: z.string().min(1, "Veuillez confirmer votre mot de passe."),
})
.refine(data => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirmPassword"],
});