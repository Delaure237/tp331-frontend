/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft } from 'lucide-react';
import { patientSignupSchema } from '@/schemas/patient-form-schema';

interface StepPatientProps {
  initialData: any;
  onSubmit: (data: any) => void;
  onBack: () => void;
}

export default function StepPatientInfo({ initialData, onSubmit, onBack }: StepPatientProps) {
  // On pick uniquement les champs nécessaires pour cette étape
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(patientSignupSchema.pick({
      firstName: true, lastName: true, idNumber: true, sex: true
    })),
    defaultValues: initialData
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 animate-in fade-in slide-in-from-right-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="font-semibold text-[#3E3E3E]">Prénom</Label>
          <Input {...register('firstName')} placeholder="Jean" className={errors.firstName ? "border-red-500" : ""} />
          {errors.firstName && <p className="text-xs text-red-500">{errors.firstName.message as string}</p>}
        </div>
        <div className="space-y-2">
          <Label className="font-semibold text-[#3E3E3E]">Nom</Label>
          <Input {...register('lastName')} placeholder="Dupont" className={errors.lastName ? "border-red-500" : ""} />
          {errors.lastName && <p className="text-xs text-red-500">{errors.lastName.message as string}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="font-semibold text-[#3E3E3E]">N° d'identification</Label>
          <Input {...register('idNumber')} placeholder="123456789" className={errors.idNumber ? "border-red-500" : ""} />
          {errors.idNumber && <p className="text-xs text-red-500">{errors.idNumber.message as string}</p>}
        </div>
        <div className="space-y-2">
          <Label className="font-semibold text-[#3E3E3E]">Sexe</Label>
          <Select
            onValueChange={(val) => setValue('sex', val as any)}
            defaultValue={watch('sex')}
          >
            <SelectTrigger className={errors.sex ? "border-red-500" : ""}>
              <SelectValue placeholder="Sexe" />
            </SelectTrigger>
            <SelectContent>
              {/* CORRECTION : Valeurs alignées sur le modèle Sequelize */}
              <SelectItem value="Male">Masculin</SelectItem>
              <SelectItem value="Female">Féminin</SelectItem>
              <SelectItem value="N/A">Autre</SelectItem>
            </SelectContent>
          </Select>
          {errors.sex && <p className="text-xs text-red-500">{errors.sex.message as string}</p>}
        </div>
      </div>

      <div className="flex gap-4 pt-6">
        <Button type="button" variant="outline" className="flex-1 border-gray-300" onClick={onBack}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Retour
        </Button>
        <Button type="submit" className="flex-1 bg-[#058D66] rounded-full text-white font-bold">
            Suivant
        </Button>
      </div>
    </form>
  );
}