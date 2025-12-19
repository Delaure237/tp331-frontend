import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BookingFormData } from '@/schemas/booking-schema';

interface BookingState {
  step: number;
  formData: Partial<BookingFormData>;

  // Actions
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateFormData: (data: Partial<BookingFormData>) => void;
  resetBooking: () => void;
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      step: 1,
      // On initialise avec 'onsite' par défaut comme sur le design
      formData: {
        paymentMethod: 'onsite',
      },

      setStep: (step) => set({ step }),

      nextStep: () => set((state) => ({
        step: Math.min(state.step + 1, 4)
      })),

      prevStep: () => set((state) => ({
        step: Math.max(state.step - 1, 1)
      })),

      updateFormData: (data) => set((state) => ({
        formData: { ...state.formData, ...data }
      })),

      resetBooking: () => set({
        step: 1,
        formData: { paymentMethod: 'onsite' }
      }),
    }),
    {
      name: 'booking-storage',
    }
  )
);