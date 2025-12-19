import { create } from 'zustand';
import { IRegistrationFormData, IStep } from '@/types/registration';

interface RegistrationState {
  formData: Partial<IRegistrationFormData & { accountType: 'patient' | 'hospital' }>;
  currentStepIndex: number;
  steps: IStep[];
  updateFormData: (data: Partial<IRegistrationFormData>) => void;
  nextStep: () => void;
  previousStep: () => void;
  reset: () => void;
}

// Étape initiale commune
const INITIAL_STEPS: Omit<IStep, 'status'>[] = [
  {
    id: 'account-type',
    title: "Type de Compte",
    description: "Choisissez comment vous souhaitez utiliser la plateforme.",
  },
  {
    id: 'info-step', // ID générique, le contenu changera selon le type
    title: "Informations Personnelles",
    description: "Veuillez remplir les détails requis.",
  },
  {
    id: 'auth-info',
    title: "Sécurisation du compte",
    description: "Définissez vos identifiants de connexion.",
  },
];

export const useRegistrationStore = create<RegistrationState>((set) => ({
  formData: {},
  currentStepIndex: 0,
  steps: INITIAL_STEPS.map((step, index) => ({
    ...step,
    status: index === 0 ? 'current' : 'upcoming',
  })),

  updateFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),

  nextStep: () =>
    set((state) => {
      if (state.currentStepIndex >= state.steps.length - 1) return state;
      const nextIndex = state.currentStepIndex + 1;
      return {
        currentStepIndex: nextIndex,
        steps: state.steps.map((step, idx) => {
          if (idx < nextIndex) return { ...step, status: 'completed' };
          if (idx === nextIndex) return { ...step, status: 'current' };
          return { ...step, status: 'upcoming' };
        }),
      };
    }),

  previousStep: () =>
    set((state) => {
      if (state.currentStepIndex === 0) return state;
      const prevIndex = state.currentStepIndex - 1;
      return {
        currentStepIndex: prevIndex,
        steps: state.steps.map((step, idx) => {
          if (idx < prevIndex) return { ...step, status: 'completed' };
          if (idx === prevIndex) return { ...step, status: 'current' };
          return { ...step, status: 'upcoming' };
        }),
      };
    }),

  reset: () =>
    set({
      formData: {},
      currentStepIndex: 0,
      steps: INITIAL_STEPS.map((step, index) => ({
        ...step,
        status: index === 0 ? 'current' : 'upcoming',
      })),
    }),
}));