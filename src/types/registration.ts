import { IHospitalInfoForm, IAuthInfoForm } from './form';

/**
 * Interface globale regroupant toutes les données du formulaire de registration.
 * On utilise l'intersection des deux interfaces définies dans forms.ts.
 */
export interface IRegistrationFormData extends IHospitalInfoForm, IAuthInfoForm {}

/**
 * Représente une étape individuelle dans le processus d'inscription multi-étapes.
 */
export interface IStep {
  /** Identifiant unique de l'étape (ex: 'hospital-info') */
  id: string;
  /** Titre affiché à l'utilisateur */
  title: string;
  /** Description courte de ce qui est attendu à cette étape */
  description: string;
  /** État actuel de l'étape pour le suivi visuel (barre de progression, icônes) */
  status: 'current' | 'upcoming' | 'completed';
}

/**
 * Structure de la réponse attendue après une inscription réussie (optionnel)
 */
export interface RegistrationResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    roleName: string;
  };
}