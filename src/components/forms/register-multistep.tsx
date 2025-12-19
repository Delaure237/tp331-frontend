'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner'; // Utilisation de sonner pour la cohérence
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

// Import des étapes
import StepAccountType from "@/components/forms/step-account-type";
import StepHospitalInfo from "@/components/forms/step-hospital-info";
import StepPatientInfo from "@/components/forms/step-patient-info";
import StepAuthInfo from "@/components/forms/step-auth-info";
import StepPatientAuth from "@/components/forms/step-patient-auth";

import { registerHospitalApi, registerPatientApi } from '@/api/auth-api';
import { useRegistrationStore } from "@/store/registration-store";

export function RegisterMultistep({ className }: React.ComponentProps<'div'>) {
  const router = useRouter();

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

  const isHospital = formData.accountType === 'hospital';

  // Gestion des passages d'étapes simples
  const handleNext = (data: any) => {
    updateFormData(data);
    nextStep();
  };

  /**
   * SOUMISSION FINALE : Redirection vers OTP
   */
  const handleFinalSubmit = async (lastStepData: any) => {
    const finalData = { ...formData, ...lastStepData };
    const loadingToast = toast.loading(
      isHospital ? "Création de l'établissement..." : "Création de votre compte..."
    );

    try {
      let emailForOtp = "";

      if (isHospital) {
        const submissionData = new FormData();
        submissionData.append('hospitalName', finalData.hospitalName || "");
        submissionData.append('hospitalEmail', finalData.adminEmail || "");
        submissionData.append('password', finalData.password || "");
        submissionData.append('address', finalData.address || "");
        submissionData.append('phoneNumber1', finalData.phoneNumber1 || "");
        submissionData.append('adminRole', 'Hospital Admin');

        const services = Array.isArray(finalData.services) ? finalData.services : ["Général"];
        submissionData.append('services', JSON.stringify(services));

        if (finalData.hospitalLogo?.[0]) {
          submissionData.append('hospitalLogo', finalData.hospitalLogo[0]);
        }

        await registerHospitalApi(submissionData);
        emailForOtp = finalData.adminEmail;
      } else {
        const patientPayload = {
          firstName: finalData.firstName,
          lastName: finalData.lastName,
          idNumber: finalData.idNumber,
          sex: finalData.sex,
          phone: finalData.phone,
          email: finalData.email,
          address: finalData.address,
          password: finalData.password,
          status: 'Active'
        };
        await registerPatientApi(patientPayload);
        emailForOtp = finalData.email;
      }

      toast.success("Inscription réussie ! Un code a été envoyé.", { id: loadingToast });
      reset(); // On vide le store zustand

      // Navigation vers la page OTP
      router.push(`/auth/otp?email=${encodeURIComponent(emailForOtp)}`);

    } catch (error: any) {
      toast.error(error.message || "Erreur lors de l'inscription", { id: loadingToast });
    }
  };

  return (
    <div className={cn("flex flex-col gap-6 w-full h-full", className)}>
      <div className="space-y-2">
        <p className="text-sm font-medium text-center text-muted-foreground">
          Étape {currentStepIndex + 1} sur {totalSteps}
        </p>
        <Progress value={progressValue} className="h-2 w-full bg-slate-100" />
      </div>

      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-[#3E3E3E]">{currentStep.title}</h1>
        <p className="text-sm text-[#6F6F6F]">{currentStep.description}</p>
      </div>

      <div className="flex-1 overflow-y-auto pr-2">
        {/* ÉTAPE 0 : TYPE DE COMPTE */}
        {currentStep.id === 'account-type' && (
          <StepAccountType
            selectedType={formData.accountType}
            onSelect={(type) => {
              updateFormData({ accountType: type });
              nextStep();
            }}
          />
        )}

        {/* ÉTAPE 1 : INFOS */}
        {currentStep.id === 'info-step' && (
          isHospital ? (
            <StepHospitalInfo
              initialData={formData}
              onSubmit={handleNext}
              onBack={previousStep}
            />
          ) : (
            <StepPatientInfo
              initialData={formData}
              onSubmit={handleNext}
              onBack={previousStep}
            />
          )
        )}

        {/* ÉTAPE 2 : AUTH & FINNALISATION */}
        {currentStep.id === 'auth-info' && (
          isHospital ? (
            <StepAuthInfo
              initialData={formData}
              onFinalSubmit={handleFinalSubmit}
              goToPreviousStep={previousStep}
            />
          ) : (
            <StepPatientAuth
              initialData={formData}
              onSubmit={handleFinalSubmit}
              goToPreviousStep={previousStep}
            />
          )
        )}
      </div>
    </div>
  );
}