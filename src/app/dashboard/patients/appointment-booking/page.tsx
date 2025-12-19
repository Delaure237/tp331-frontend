"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { HospitalCard } from "@/components/appointments/hospital-card";
import { HospitalDetailView } from "@/components/appointments/hospital-detail-view";
import { getHospitalsApi } from "@/api/hospital-api";

export default function AppointmentBookingPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Utilisation de useQuery pour être synchronisé avec ServiceBuilder
  const { data: hospitals = [], isLoading } = useQuery({
    queryKey: ['hospital-services', searchTerm],
    queryFn: () => getHospitalsApi({ search: searchTerm }),
  });

  // Gestion de la sélection par défaut
  useEffect(() => {
    if (hospitals.length > 0 && !selectedId) {
      setSelectedId(hospitals[0].id);
    }
  }, [hospitals, selectedId]);

  const selectedHospital = hospitals.find((h: any) => h.id === selectedId) || null;

  return (
    <div className="flex h-[calc(100vh-40px)] w-full bg-white rounded-[24px] border border-slate-100 overflow-hidden shadow-sm">
      <div className="w-[400px] border-r border-slate-50 flex flex-col bg-[#FBFBFC]">
        <div className="p-6 space-y-4">
          <h1 className="text-xl font-medium text-[#3E3E3E] lowercase tracking-tight">réserver un rdv</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input
              placeholder="rechercher un établissement..."
              className="pl-10 bg-white border-slate-100 rounded-xl text-sm lowercase"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <ScrollArea className="flex-1 px-4">
          <div className="space-y-2 pb-6">
            {isLoading ? (
              <div className="flex justify-center p-10"><Loader2 className="animate-spin text-slate-300" /></div>
            ) : hospitals.length > 0 ? (
              hospitals.map((hosp: any) => (
                <HospitalCard
                  key={hosp.id}
                  name={hosp.hospitalName}
                  address={hosp.address}
                  isSelected={selectedId === hosp.id}
                  onClick={() => setSelectedId(hosp.id)}
                />
              ))
            ) : (
              <p className="text-center text-xs text-slate-400 mt-10 italic">aucun établissement trouvé</p>
            )}
          </div>
        </ScrollArea>
      </div>

      <div className="flex-1 flex flex-col bg-white">
        <HospitalDetailView
          hospital={selectedHospital ? {
            name: selectedHospital.hospitalName,
            address: selectedHospital.address,
            phone: selectedHospital.phoneNumber1,
            description: selectedHospital.description,
        
            services: selectedHospital.servicesProvided || [],
            logoPath: selectedHospital.hospitalLogo
          } : null}
        />
      </div>
    </div>
  );
}