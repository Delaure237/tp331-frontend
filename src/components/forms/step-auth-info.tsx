'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ShieldCheck } from 'lucide-react';
import { AuthInfoSchema, IAuthInfoForm } from '@/types/form';

interface StepAuthProps {
  initialData: any;
  onFinalSubmit: (data: IAuthInfoForm) => Promise<void>;
  goToPreviousStep: () => void;
}

export default function StepAuthInfo({ initialData, onFinalSubmit, goToPreviousStep }: StepAuthProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<IAuthInfoForm>({
    resolver: zodResolver(AuthInfoSchema),
    defaultValues: {
      adminEmail: initialData.hospitalEmail || '', // On pré-remplit avec l'email de l'hôpital par défaut
      adminRole: 'Hospital Admin', // Forcé selon votre consigne
      password: '',
      confirmPassword: ''
    }
  });

  return (
    <form onSubmit={handleSubmit(onFinalSubmit)} className="space-y-4 animate-in fade-in slide-in-from-right-4">
      <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3 mb-6">
        <ShieldCheck className="text-[#058D66] mt-1" size={20} />
        <p className="text-sm text-slate-600">
          Ces identifiants vous permettront de gérer votre établissement sur la plateforme en tant qu'<strong>Administrateur</strong>.
        </p>
      </div>

      <div className="space-y-2">
        <Label className="font-semibold text-[#3E3E3E]">Email Administrateur</Label>
        <Input
          {...register('adminEmail')}
          type="email"
          placeholder="admin@hospicare.com"
          className={errors.adminEmail ? "border-red-500" : ""}
        />
        {errors.adminEmail && <p className="text-xs text-red-500">{errors.adminEmail.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="font-semibold text-[#3E3E3E]">Mot de passe</Label>
          <Input
            {...register('password')}
            type="password"
            placeholder="********"
            className={errors.password ? "border-red-500" : ""}
          />
          {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
        </div>
        <div className="space-y-2">
          <Label className="font-semibold text-[#3E3E3E]">Confirmer</Label>
          <Input
            {...register('confirmPassword')}
            type="password"
            placeholder="********"
            className={errors.confirmPassword ? "border-red-500" : ""}
          />
          {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
        </div>
      </div>

      <div className="flex gap-4 pt-6">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={goToPreviousStep}
          disabled={isSubmitting}
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Retour
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-[#058D66] text-white font-bold"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Création..." : "Finaliser l'inscription"}
        </Button>
      </div>
    </form>
  );
}