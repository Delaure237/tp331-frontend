import { create } from 'zustand';
import { IRegistrationFormData, IStep } from '@/types/registration';

interface RegistrationState {
  formData: Partial<IRegistrationFormData>;
  currentStepIndex: number;
  steps: IStep[];

  updateFormData: (data: Partial<IRegistrationFormData>) => void;
  nextStep: () => void;
  previousStep: () => void;
  reset: () => void;
}

const REGISTRATION_STEPS: Omit<IStep, 'status'>[] = [
  {
    id: 'hospital-info',
    title: "Informations de l'Hôpital",
    description: "Veuillez fournir les détails de votre établissement de santé.",
  },
  {
    id: 'auth-info',
    title: "Authentification de l'Administrateur",
    description: "Définissez votre rôle et vos identifiants de connexion.",
  },
];

export const useRegistrationStore = create<RegistrationState>((set) => ({
  formData: {},
  currentStepIndex: 0,

  steps: REGISTRATION_STEPS.map((step, index) => ({
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
      steps: REGISTRATION_STEPS.map((step, index) => ({
        ...step,
        status: index === 0 ? 'current' : 'upcoming',
      })),
    }),
}));
export { IRegistrationFormData };

