"use client";

import React from "react";
import { Building2 } from "lucide-react";

interface HospitalCardProps {
  name?: string;
  address?: string;
  isSelected?: boolean;
  onClick: () => void;
}

export function HospitalCard({ name, address, isSelected, onClick }: HospitalCardProps) {
  const displayName = name || "établissement sans nom";

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-xl cursor-pointer transition-all border ${
        isSelected
          ? "bg-white border-[#058D66] shadow-sm ring-1 ring-[#058D66]/10"
          : "border-transparent hover:bg-slate-50"
      }`}
    >
      <div className="flex gap-4 items-center">
        <div className={`p-2.5 rounded-lg shrink-0 transition-colors ${
          isSelected ? "text-[#058D66] bg-[#058D66]/10" : "text-slate-300 bg-slate-100"
        }`}>
          <Building2 size={18} />
        </div>

        <div className="flex-1 min-w-0">
          <p className={`text-[13px] font-bold lowercase truncate ${
            isSelected ? "text-[#3E3E3E]" : "text-slate-600"
          }`}>
            {displayName}
          </p>
          <p className="text-[11px] text-[#6F6F6F] lowercase truncate mt-0.5 opacity-80">
            {address || "adresse non renseignée"}
          </p>
        </div>
      </div>
    </div>
  );
}