import { PatientSignupValues } from '@/schemas/patient-form-schema';
import { create } from 'zustand';


interface PatientSignupState {
  formData: Partial<PatientSignupValues>;
  setFormData: (data: Partial<PatientSignupValues>) => void;
  resetFormData: () => void;
}

export const usePatientSignupStore = create<PatientSignupState>((set) => ({
  formData: {
    sex: 'N/A',
  },
  setFormData: (data) => set((state) => ({
    formData: { ...state.formData, ...data }
  })),
  resetFormData: () => set({ formData: { sex: 'N/A' } }),
}));