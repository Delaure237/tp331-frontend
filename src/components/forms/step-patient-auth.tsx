/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { z } from 'zod';

const patientAuthSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Minimum 8 caractères"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type IPatientAuth = z.infer<typeof patientAuthSchema>;

export default function StepPatientAuth({ initialData, onSubmit, goToPreviousStep }: any) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<IPatientAuth>({
    resolver: zodResolver(patientAuthSchema),
    defaultValues: {
      email: initialData.email || '',
      password: '',
      confirmPassword: ''
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 animate-in fade-in slide-in-from-right-4">
      <div className="space-y-2">
        <Label className="font-semibold text-[#3E3E3E]">Email du compte</Label>
        <Input {...register('email')} type="email" placeholder="votre@email.com" />
        {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="font-semibold text-[#3E3E3E]">Mot de passe</Label>
          <Input {...register('password')} type="password" placeholder="********" />
          {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
        </div>
        <div className="space-y-2">
          <Label className="font-semibold text-[#3E3E3E]">Confirmer</Label>
          <Input {...register('confirmPassword')} type="password" placeholder="********" />
          {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
        </div>
      </div>

      <div className="flex gap-4 pt-6">
        <Button type="button" variant="outline" className="flex-1" onClick={goToPreviousStep} disabled={isSubmitting}>
          Retour
        </Button>
        <Button type="submit" className="flex-1 bg-[#058D66] text-white font-bold" disabled={isSubmitting}>
          {isSubmitting ? "Traitement..." : "Créer mon compte"}
        </Button>
      </div>
    </form>
  );
}