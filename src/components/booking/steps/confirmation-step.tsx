"use client";

import React from 'react';
import { useBookingStore } from '@/store/booking-store';
import { Button } from "@/components/ui/button";
import { CheckCircle2, QrCode } from 'lucide-react';

export default function ConfirmationStep() {
  const { resetBooking } = useBookingStore();

  return (
    /* Réduction drastique de space-y pour éviter l'overflow */
    <div className="space-y-3 animate-in zoom-in-95 duration-500">

      {/* En-tête avec votre couleur primaire (Main: #058D66) */}
      <div className="flex items-center gap-2">
        <CheckCircle2 className="w-5 h-5 text-[#058D66]" />
        <h2 className="text-lg font-semibold text-[#3E3E3E]">réservation confirmée</h2>
      </div>

      {/* Grille compacte pour gagner de la place verticale */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 border-y border-[#86909C]/10 py-3">
        <div>
          <p className="text-[10px] text-[#6F6F6F] font-medium">praticien</p>
          <p className="text-[12px] text-[#3E3E3E] font-semibold">dr. ahmad dimas</p>
        </div>
        <div>
          <p className="text-[10px] text-[#6F6F6F] font-medium">numéro</p>
          <p className="text-[12px] text-[#058D66] font-bold">vrm112499</p>
        </div>
      </div>

      {/* QR Code réduit */}
      <div className="flex items-center gap-3 py-1">
        <div className="bg-white p-1 rounded-lg border border-[#86909C]/20">
          <QrCode className="w-8 h-8 text-[#3E3E3E]" />
        </div>
        <p className="text-[10px] text-[#6F6F6F] italic leading-tight">
          le règlement s'effectuera lors de votre arrivée à la clinique.
        </p>
      </div>

      {/* BOUTON RÉAPPARU : Utilisation de la couleur primaire */}
      <div className="pt-2">
        <Button
          onClick={resetBooking}
          className="w-full h-9 bg-[#058D66] hover:opacity-90 text-white rounded-full font-medium text-[13px] transition-all"
        >
          retour à l'accueil
        </Button>
      </div>
    </div>
  );
}