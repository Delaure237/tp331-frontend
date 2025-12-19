"use client";

import React from 'react';
import { useBookingStore } from '@/store/booking-store';
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";

export default function DateTimeStep() {
  const { formData, updateFormData, nextStep, prevStep } = useBookingStore();

  return (
    /* Réduction des espacements pour éviter l'overflow */
    <div className="space-y-2 animate-in fade-in duration-500 max-h-full">
      <div className="flex flex-col md:flex-row items-start gap-1">

        {/* Calendrier décalé à gauche et légèrement réduit */}
        <div className="flex-1 -ml-6 scale-90 origin-top-left">
          <Calendar
            mode="single"
            selected={formData.appointmentDate}
            onSelect={(date) => date && updateFormData({ appointmentDate: date, timeSlot: "" })}
            locale={fr}
            className="p-0 border-none shadow-none"
            /* Désactivation des dates passées et dimanches */
            disabled={(date) => date < new Date() || date.getDay() === 0}
          />
        </div>

        {/* Colonne des créneaux plus compacte */}
        <div className="w-full md:w-[180px] space-y-2 pt-2">
          <h3 className="text-[12px] font-semibold text-[#3E3E3E]">
            {formData.appointmentDate
              ? format(formData.appointmentDate, "eeee d MMMM", { locale: fr })
              : "choisir une date"}
          </h3>

          <div className="grid gap-1.5">
            {["10:00 - 11:00", "14:00 - 15:00", "16:00 - 17:00"].map((slot) => (
              <button
                key={slot}
                onClick={() => updateFormData({ timeSlot: slot })}
                className={cn(
                  "w-full py-2 px-3 text-left text-[12px] rounded-lg border transition-all",
                  /* Utilisation de votre couleur Main #058D66 */
                  formData.timeSlot === slot
                    ? "bg-[#058D66] border-[#058D66] text-white"
                    : "border-[#86909C] text-[#3E3E3E] hover:border-[#058D66] hover:bg-slate-50"
                )}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation avec boutons compacts pour éviter l'overflow */}
      <div className="flex justify-between items-center pt-1">
        <Button
          variant="ghost"
          className="px-0 text-[#6F6F6F] hover:text-[#3E3E3E] text-[12px] h-8"
          onClick={prevStep}
        >
          retour
        </Button>
        <Button
          disabled={!formData.appointmentDate || !formData.timeSlot}
          className="rounded-full px-8 h-9 bg-[#058D66] hover:opacity-90 text-white text-[13px] font-medium transition-all"
          onClick={nextStep}
        >
          suivant
        </Button>
      </div>
    </div>
  );
}