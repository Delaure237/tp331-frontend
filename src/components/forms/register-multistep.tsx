// src/components/forms/register-multistep.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

import StepHospitalInfo from "@/components/forms/step-hospital-info";
import StepAuthInfo from "@/components/forms/step-auth-info";

import { registerHospitalApi } from '@/api/auth-api';
import { useRegistrationStore } from "@/store/registration-store";
import { useAuth } from '@/context/auth-context';
import { IRegistrationFormData } from '@/store/registration-store';

export function RegisterMultistep({ className }: React.ComponentProps<'div'>) {
  const router = useRouter();
  const { refreshUser } = useAuth();

  
  const {
    steps,
    currentStepIndex,
    formData,
    updateFormData,
    nextStep,
    previousStep,
    reset,
  } = useRegistrationStore();

  const totalSteps = steps.length;
  const currentStep = steps[currentStepIndex];
  const progressValue = ((currentStepIndex + 1) / totalSteps) * 100;

  // Typage strict basé sur votre interface IRegistrationFormData
  const handleNext = (data: Partial<IRegistrationFormData>) => {
    updateFormData(data);
    nextStep();
  };

  const handleFinalSubmit = async (lastStepData: Partial<IRegistrationFormData>) => {
    const finalData = { ...formData, ...lastStepData };
    const loadingToast = toast.loading("Création de votre établissement...");

    try {
      const submissionData = new FormData();

      // On construit le FormData
      Object.entries(finalData).forEach(([key, value]) => {
        if (value instanceof File) {
          submissionData.append(key, value);
        } else if (value !== undefined && value !== null) {
          submissionData.append(key, String(value));
        }
      });

      // Appel API
      await registerHospitalApi(submissionData);

      // On rafraîchit l'état global de l'utilisateur
      await refreshUser();

      toast.success("Inscription réussie !", { id: loadingToast });

      // On utilise 'reset()' ici
      reset();

      router.push('/dashboard/overview');

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Une erreur est survenue";
      toast.error(message, { id: loadingToast });
    }
  };

  return (
    <div className={cn("flex flex-col gap-6 w-full h-full", className)}>
      {/* Progress */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-center text-muted-foreground">
          Étape {currentStepIndex + 1} sur {totalSteps}
        </p>
        <Progress value={progressValue} className="h-2 w-full" />
      </div>

      {/* Header */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">{currentStep.title}</h1>
        <p className="text-sm text-muted-foreground">
          {currentStep.description}
        </p>
      </div>

      {/* Steps Content */}
      <div className="flex-1 overflow-y-auto">
        {currentStep.id === 'hospital-info' && (
          <StepHospitalInfo
            initialData={formData}
            onSubmit={handleNext}
          />
        )}

        {currentStep.id === 'auth-info' && (
          <StepAuthInfo
            initialData={formData}
            onSubmit={handleFinalSubmit}
            goToPreviousStep={previousStep}
          />
        )}
      </div>

      {/* Footer / Privacy */}
      {currentStepIndex === 0 && (
        <p className="text-xs text-center text-muted-foreground px-6 mt-4">
          En continuant, vous acceptez nos conditions d&apos;utilisation et notre politique de confidentialité.
        </p>
      )}
    </div>
  );
}