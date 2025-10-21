// src/components/forms/register-multistep.tsx

'use client';

import * as React from 'react';
import { useState } from 'react';
import { cn } from "@/lib/utils";
import StepHospitalInfo from "@/components/forms/step-hospital-info";
import StepAuthInfo from "@/components/forms/step-auth-info";
import { Progress } from "@/components/ui/progress";


interface FormState {
  hospitalName: string;
  hospitalEmail: string;
  hospitalLogo: FileList | null;
  hospitalImages: FileList | null;
  adminRole: 'Administrator' | 'Doctor' | 'Cashier';
  adminEmail: string;
  password: string;
  confirmPassword: string;
}

export function RegisterMultistep({ className }: React.ComponentProps<'div'>) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<FormState>>({});
  const totalSteps = 2;
  const progressValue = (currentStep / totalSteps) * 100;

  const handleNextStep = (data: Partial<FormState>) => {
    setFormData(prev => ({ ...prev, ...data }));
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Étape finale : Soumission des données
      console.log('FINAL SUBMISSION DATA:', { ...formData, ...data });
      alert('Inscription terminée! Voir la console pour les données.');
    }
  };

  const goToPreviousStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const getTitle = () => {
    switch (currentStep) {
      case 1:
        return {
          title: "Informations de l'Hôpital",
          description: "Veuillez fournir les détails de votre établissement de santé."
        };
      case 2:
        return {
          title: "Authentification de l'Administrateur",
          description: "Définissez votre rôle et vos identifiants de connexion."
        };
      default:
        return { title: "", description: "" };
    }
  };


  return (
    // 'w-full flex-1 h-full' permet au composant de prendre toute la place dans le conteneur parent (SignupPage)
    <div className={cn("flex flex-col gap-6 w-full flex-1 h-full", className)}>

      {/* Barre de progression et numéro d'étape */}
      <div className="w-full space-y-2 shrink-0">
        <p className="text-sm font-medium text-center">Étape {currentStep} sur {totalSteps}</p>
        <Progress value={progressValue} className="h-2" />
      </div>

      {/* Titre de l'étape */}
      <div className="flex flex-col items-center gap-1 text-center shrink-0">
        <h1 className="text-2xl font-bold">{getTitle().title}</h1>
        <p className="text-muted-foreground text-sm text-balance">
          {getTitle().description}
        </p>
      </div>

      {/* Conteneur des étapes du formulaire - utilise le reste de l'espace vertical disponible */}
      <div className="flex-1 overflow-auto">
        {currentStep === 1 && (
          <StepHospitalInfo
            initialData={formData}
            onSubmit={handleNextStep}
          />
        )}

        {currentStep === 2 && (
          <StepAuthInfo
            initialData={formData}
            onSubmit={handleNextStep}
            goToPreviousStep={goToPreviousStep}
          />
        )}
      </div>
    </div>
  );
}