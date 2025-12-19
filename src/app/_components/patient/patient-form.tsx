"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PatientSchema, Patient } from "@/schemas/patient-schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface PatientFormProps {
  onSubmit: (data: Patient) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  defaultValues?: Partial<Patient>;
}

export const PatientForm: React.FC<PatientFormProps> = ({
  onSubmit,
  onCancel,
  isSubmitting = false,
  defaultValues
}) => {
  const { register, handleSubmit, formState: { errors }, control } = useForm<Patient>({
    resolver: zodResolver(PatientSchema),
    defaultValues: defaultValues || {
      sex: "Male",
    } as any,
  });

  const fieldClass = "h-10 border-[#86909C]/30 text-[12px] focus-visible:ring-[#058D66]";
  const labelClass = "text-[11px] font-bold text-[#3E3E3E] lowercase";
  const sectionTitle = "text-[12px] font-bold text-[#058D66] border-b border-[#86909C]/10 pb-1 mt-2 lowercase";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* 1. Informations Identité */}
      <div className="space-y-4">
        <h3 className={sectionTitle}>identité du patient</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="grid gap-1">
            <Label className={labelClass}>prénom *</Label>
            <Input {...register("patientFirstName")} className={fieldClass} disabled={isSubmitting} placeholder="ex: Jean" />
            {errors.patientFirstName && <span className="text-red-500 text-[10px]">{errors.patientFirstName.message}</span>}
          </div>
          <div className="grid gap-1">
            <Label className={labelClass}>nom *</Label>
            <Input {...register("patientLastName")} className={fieldClass} disabled={isSubmitting} placeholder="ex: Dupont" />
            {errors.patientLastName && <span className="text-red-500 text-[10px]">{errors.patientLastName.message}</span>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="grid gap-1">
            <Label className={labelClass}>n° de santé / id *</Label>
            <Input {...register("healthCareNumber")} className={fieldClass} disabled={isSubmitting} placeholder="n° unique" />
            {errors.healthCareNumber && <span className="text-red-500 text-[10px]">{errors.healthCareNumber.message}</span>}
          </div>
          <div className="grid gap-1">
            <Label className={labelClass}>sexe *</Label>
            <Controller control={control} name="sex" render={({ field }) => (
              <RadioGroup className="flex gap-4 h-10 items-center" value={field.value} onValueChange={field.onChange} disabled={isSubmitting}>
                <div className="flex items-center gap-1"><RadioGroupItem value="Male" /><span className="text-[11px]">homme</span></div>
                <div className="flex items-center gap-1"><RadioGroupItem value="Female" /><span className="text-[11px]">femme</span></div>
                <div className="flex items-center gap-1"><RadioGroupItem value="N/A" /><span className="text-[11px]">n/a</span></div>
              </RadioGroup>
            )} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="grid gap-1">
            <Label className={labelClass}>date de naissance</Label>
            <Input type="date" {...register("dateOfBirth")} className={fieldClass} disabled={isSubmitting} />
          </div>
          <div className="grid gap-1">
            <Label className={labelClass}>téléphone</Label>
            <Input {...register("phone")} className={fieldClass} disabled={isSubmitting} placeholder="+237..." />
          </div>
        </div>
      </div>

      {/* 2. Coordonnées */}
      <div className="space-y-4">
        <h3 className={sectionTitle}>coordonnées et contact</h3>
        <div className="grid gap-1">
          <Label className={labelClass}>email</Label>
          <Input type="email" {...register("email")} className={fieldClass} disabled={isSubmitting} placeholder="patient@example.com" />
          {errors.email && <span className="text-red-500 text-[10px]">{errors.email.message}</span>}
        </div>
        <div className="grid gap-1">
          <Label className={labelClass}>adresse complète</Label>
          <Input {...register("address")} className={fieldClass} disabled={isSubmitting} placeholder="quartier, ville..." />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-6 border-t border-[#86909C]/10">
        <Button type="button" variant="ghost" onClick={onCancel} className="h-11 text-[12px] text-[#6F6F6F] lowercase rounded-full" disabled={isSubmitting}>
          annuler
        </Button>
        <Button type="submit" className="h-11 bg-[#058D66] hover:opacity-90 rounded-full px-10 text-[13px] font-bold lowercase shadow-lg transition-all text-white" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          enregistrer le patient
        </Button>
      </div>
    </form>
  );
};