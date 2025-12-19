"use client";

import React, { useState, useEffect } from "react";
import { HospitalCard } from "./hospital-card";
import { HospitalDetailView } from "./hospital-detail-view";

interface HospitalBookingContainerProps {
  hospitals: any[];
}

export default function HospitalBookingContainer({ hospitals }: HospitalBookingContainerProps) {
  // On utilise string | number car ton API envoie des UUID (ex: "292b6c81...")
  const [selectedId, setSelectedId] = useState<string | number | null>(null);

  useEffect(() => {
    if (hospitals && hospitals.length > 0 && !selectedId) {
      setSelectedId(hospitals[0].id);
    }
  }, [hospitals, selectedId]);

  // On récupère l'objet COMPLET de l'hôpital sélectionné
  const currentHospital = hospitals.find(h => h.id === selectedId) || null;

  return (
    <div className="flex h-[85vh] w-full bg-white rounded-[24px] border border-slate-100 overflow-hidden shadow-sm">
      <div className="w-[380px] border-r border-slate-50 flex flex-col bg-[#FBFBFC]">
        <div className="p-6 border-b border-slate-50">
          <p className="text-[11px] font-bold text-slate-400 lowercase tracking-widest">établissements</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar1">
          {hospitals.map((hosp) => (
            <HospitalCard
              key={hosp.id}
              name={hosp.hospitalName || hosp.name} // Supporte le champ API
              address={hosp.address}
              isSelected={selectedId === hosp.id}
              onClick={() => setSelectedId(hosp.id)}
            />
          ))}
        </div>
      </div>

      {/* On transmet l'objet complet qui contient maintenant bien l'ID */}
      <HospitalDetailView hospital={currentHospital} />
    </div>
  );
}