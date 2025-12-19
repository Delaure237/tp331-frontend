"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import BookingContainer from "@/components/booking/booking-container";

import { CalendarCheck2, Settings2 } from "lucide-react";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import ServiceBuilder from "@/components/services/service-builder";

export default function PatientBookingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 bg-slate-50/50">
      <div className="max-w-md text-center space-y-4">
        {/* En-tête avec votre gris foncé #3E3E3E */}
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
          <div className="bg-emerald-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <CalendarCheck2 className="w-8 h-8 text-[#058D66]" />
          </div>
          <h1 className="text-3xl font-bold text-[#3E3E3E] tracking-tight lowercase">gestion hospitalière</h1>
          <p className="text-[#6F6F6F] mt-3 leading-relaxed text-sm">
            accédez aux outils de réservation patient ou à la configuration des services.
          </p>
        </div>

        <div className="grid gap-3">
          {/* BOUTON RÉSERVATION PATIENT */}
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg" className="w-full h-14 bg-[#058D66] hover:opacity-90 rounded-full text-md font-semibold transition-all">
                démarrer une réservation
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] lg:max-w-[1150px] h-[90vh] p-0 gap-0 overflow-hidden border-none rounded-[32px] bg-white flex flex-row items-stretch">
               <VisuallyHidden.Root>
                  <DialogTitle>tunnel de réservation médicale</DialogTitle>
               </VisuallyHidden.Root>
               <BookingContainer />
            </DialogContent>
          </Dialog>

          {/* BOUTON CONFIGURATION SERVICE (ServiceBuilder) */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="lg" className="w-full h-14 border-[#86909C] text-[#3E3E3E] hover:bg-slate-50 rounded-full text-md font-semibold flex gap-2">
                <Settings2 className="w-4 h-4" />
                configurer les services
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[90vw] md:max-w-[600px] max-h-[85vh] p-6 overflow-y-auto rounded-[24px] bg-white border-none shadow-2xl custom-scrollbar1">
               <VisuallyHidden.Root>
                  <DialogTitle>création et assignation de service</DialogTitle>
               </VisuallyHidden.Root>

               {/* Affichage du builder minimaliste */}
               <ServiceBuilder />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}