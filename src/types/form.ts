import { z } from 'zod';

/**
 * Mapping des rôles (UI -> Backend)
 */
export const ROLE_MAPPING = {
  'Administrateur': 'Hospital Admin',
  'Docteur': 'Doctor',
  'Caissier': 'Cashier',
  'Patient': 'Patient'
} as const;

/**
 * Liste des spécialités
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
 * Schéma Zod Étape 1 : Informations de l'Hôpital
 */
export const HospitalInfoSchema = z.object({
  hospitalName: z.string().min(3, "Le nom de l'hôpital doit contenir au moins 3 caractères."),
  hospitalEmail: z.string().email("Format d'email invalide."),
  phoneNumber1: z.string().min(8, "Veuillez entrer un numéro de téléphone valide."),
  phoneNumber2: z.string().optional().or(z.literal('')),
  address: z.string().min(10, "Veuillez entrer une adresse complète."),
  openingHours: z.string().min(3, "Veuillez indiquer les heures d'ouverture."),

  services: z
    .array(z.enum(HOSPITAL_SPECIALTIES))
    .min(1, "Veuillez sélectionner au moins un service."),

  hospitalLogo: z.any().optional(),
  hospitalImages: z.any().optional(),
});

/**
 * Schéma Zod Étape 2 : Informations d'Authentification
 */
export const AuthInfoSchema = z
  .object({
    adminRole: z.enum(
        ['Administrateur', 'Docteur', 'Caissier', 'Patient'],
        { invalid_type_error: "Veuillez sélectionner un rôle valide." }
    ),
    adminEmail: z.string().email("Format d'email invalide."),
    password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères."),
    confirmPassword: z.string().min(1, "Veuillez confirmer votre mot de passe."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirmPassword"],
  });

/* ========================================================================
   AJOUT DES EXPORTS DE TYPES (Pour corriger vos erreurs)
   ======================================================================== */

// On génère les interfaces à partir des schémas Zod
export type IHospitalInfoForm = z.infer<typeof HospitalInfoSchema>;
export type IAuthInfoForm = z.infer<typeof AuthInfoSchema>;