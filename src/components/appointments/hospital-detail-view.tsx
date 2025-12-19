"use client";

import React from "react";
import { MapPin, Phone, Building2, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import BookingContainer from "@/components/booking/booking-container";

export function HospitalDetailView({ hospital }: { hospital: any }) {
  if (!hospital) {
    return <div className="flex-1 flex items-center justify-center text-xs italic">sélectionnez un établissement</div>;
  }

  // Extraction basée sur tes logs API réels
  const hospitalId = hospital.id;
  const displayName = hospital.hospitalName || hospital.name;
  const phone = hospital.phoneNumber1 || hospital.phone;

  return (
    <div className="flex-1 overflow-y-auto bg-white p-16">
      <div className="max-w-2xl mx-auto space-y-16">
        <div className="flex justify-between items-start border-b border-slate-100 pb-12">
          <div className="flex gap-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#058D66] text-white font-bold text-xl">
              {(displayName || "H").substring(0, 2).toUpperCase()}
            </div>
            <div className="space-y-3">
              <h2 className="text-4xl font-bold text-[#3E3E3E] lowercase tracking-tight">{displayName}</h2>
              <div className="space-y-1.5 text-xs text-[#6F6F6F] lowercase font-medium">
                <p className="flex items-center gap-2"><MapPin size={14} /> {hospital.address}</p>
                <p className="flex items-center gap-2"><Phone size={14} /> {phone}</p>
              </div>
            </div>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                disabled={!hospitalId} // Désactivé si l'ID est manquant
                className="bg-[#058D66] hover:bg-[#047a57] text-white px-8 rounded-full h-11 text-xs font-bold lowercase transition-all"
              >
                {hospitalId ? "prendre rendez-vous" : "indisponible"}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[1150px] h-[90vh] p-0 overflow-hidden border-none rounded-[32px] bg-white">
              <VisuallyHidden.Root><DialogTitle>réservation</DialogTitle></VisuallyHidden.Root>
              {hospitalId && <BookingContainer hospitalIdFromView={hospitalId.toString()} />}
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-8">
          <h3 className="text-[11px] font-black uppercase tracking-widest">services disponibles</h3>
          <div className="grid grid-cols-2 gap-6">
            {(hospital.servicesProvided || []).map((s: any, i: number) => (
              <div key={i} className="flex items-center gap-4">
                <Stethoscope size={15} className="text-[#058D66]" />
                <span className="text-sm font-semibold">{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}