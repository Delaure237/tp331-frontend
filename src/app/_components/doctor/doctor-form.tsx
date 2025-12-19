"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DoctorSchema, Doctor } from "@/schemas/doctor-schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface DoctorFormProps {
  onSubmit: (data: Doctor) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  defaultValues?: Partial<Doctor>;
}

export const DoctorForm: React.FC<DoctorFormProps> = ({
  onSubmit,
  onCancel,
  isSubmitting = false,
  defaultValues
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm<Doctor>({
    resolver: zodResolver(DoctorSchema),
    defaultValues: defaultValues || {},
  });

  const fieldClass = "h-10 border-[#86909C]/30 text-[12px] focus-visible:ring-[#058D66]";
  const labelClass = "text-[11px] font-bold text-[#3E3E3E] lowercase";
  const sectionTitle = "text-[12px] font-bold text-[#058D66] border-b border-[#86909C]/10 pb-1 mt-2 lowercase";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* 1. Informations Professionnelles */}
      <div className="space-y-4">
        <h3 className={sectionTitle}>identité et spécialité</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="grid gap-1">
            <Label className={labelClass}>prénom *</Label>
            <Input
              {...register("firstName")}
              className={fieldClass}
              disabled={isSubmitting}
              placeholder="ex: marc"
            />
            {errors.firstName && <span className="text-red-500 text-[10px]">{errors.firstName.message}</span>}
          </div>
          <div className="grid gap-1">
            <Label className={labelClass}>nom *</Label>
            <Input
              {...register("lastName")}
              className={fieldClass}
              disabled={isSubmitting}
              placeholder="ex: mbarga"
            />
            {errors.lastName && <span className="text-red-500 text-[10px]">{errors.lastName.message}</span>}
          </div>
        </div>

        <div className="grid gap-1">
          <Label className={labelClass}>spécialité *</Label>
          <Input
            {...register("specialty")}
            className={fieldClass}
            disabled={isSubmitting}
            placeholder="ex: cardiologue, généraliste..."
          />
          {errors.specialty && <span className="text-red-500 text-[10px]">{errors.specialty.message}</span>}
        </div>
      </div>

      {/* 2. Coordonnées de contact */}
      <div className="space-y-4">
        <h3 className={sectionTitle}>coordonnées de contact</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="grid gap-1">
            <Label className={labelClass}>téléphone</Label>
            <Input
              {...register("phone")}
              className={fieldClass}
              disabled={isSubmitting}
              placeholder="+237..."
            />
            {errors.phone && <span className="text-red-500 text-[10px]">{errors.phone.message}</span>}
          </div>
          <div className="grid gap-1">
            <Label className={labelClass}>email professionnel</Label>
            <Input
              type="email"
              {...register("email")}
              className={fieldClass}
              disabled={isSubmitting}
              placeholder="dr.nom@hopital.com"
            />
            {errors.email && <span className="text-red-500 text-[10px]">{errors.email.message}</span>}
          </div>
        </div>
      </div>

      {/* Note informative pour la liaison compte */}
      <div className="p-3 bg-gray-50 rounded-xl border border-dashed border-gray-200">
        <p className="text-[10px] text-[#6F6F6F] leading-tight italic">
          note : si ce docteur est un intervenant externe, laissez les informations de compte vides.
          son profil sera créé sans accès au système.
        </p>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-6 border-t border-[#86909C]/10">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          className="h-11 text-[12px] text-[#6F6F6F] lowercase rounded-full"
          disabled={isSubmitting}
        >
          annuler
        </Button>
        <Button
          type="submit"
          className="h-11 bg-[#058D66] hover:opacity-90 rounded-full px-10 text-[13px] font-bold lowercase shadow-lg transition-all text-white"
          disabled={isSubmitting}
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          enregistrer le docteur
        </Button>
      </div>
    </form>
  );
};