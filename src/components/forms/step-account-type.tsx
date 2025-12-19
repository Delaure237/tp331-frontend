'use client';

import React, { useState } from 'react';
import { Building2, User, CheckCircle2 } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface StepAccountTypeProps {
  onSelect: (type: 'patient' | 'hospital') => void;
  selectedType?: string;
}

export default function StepAccountType({ onSelect, selectedType }: StepAccountTypeProps) {
  const [localType, setLocalType] = useState<string | undefined>(selectedType);

  const options = [
    {
      id: 'patient',
      title: 'Compte Patient',
      description: 'Accédez à vos rendez-vous, dossiers médicaux et consultez votre équipe de soins.',
      icon: User,
    },
    {
      id: 'hospital',
      title: 'Compte Établissement',
      description: 'Gérez vos patients, vos médecins et vos rendez-vous au sein de votre organisation.',
      icon: Building2,
    }
  ];

  return (
    <div className="flex flex-col gap-8 py-4">
      <div className="grid gap-4">
        {options.map((option) => (
          <div
            key={option.id}
            onClick={() => setLocalType(option.id)}
            className={cn(
              "relative flex items-center gap-4 p-5 cursor-pointer rounded-xl border-2 transition-all duration-200",
              localType === option.id
                ? "border-[#058D66] bg-[#058D66]/5 shadow-sm"
                : "border-slate-200 hover:border-slate-300"
            )}
          >
            <div className={cn(
              "p-3 rounded-full transition-colors",
              localType === option.id ? "bg-[#058D66] text-white" : "bg-slate-100 text-slate-500"
            )}>
              <option.icon size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-base text-[#3E3E3E]">{option.title}</h3>
              <p className="text-xs text-[#6F6F6F] leading-tight">{option.description}</p>
            </div>
            {localType === option.id && (
              <CheckCircle2 className="text-[#058D66]" size={20} />
            )}
          </div>
        ))}
      </div>

      <Button
        disabled={!localType}
        onClick={() => onSelect(localType as any)}
        className="w-full bg-[#058D66] hover:bg-[#047a57] text-white h-12 rounded-full font-semibold transition-all"
      >
        Confirmer le type de compte
      </Button>
    </div>
  );
}