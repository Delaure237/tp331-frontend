"use client";

import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useBookingStore } from '@/store/booking-store';
import { getBookingSetupDataApi } from '@/api/booking-api';
import { useAuth } from "@/context/auth-context";
import BookingSidebar from './booking-sidebar';
import ServiceStep from './steps/service-step';
import DateTimeStep from './steps/date-time-step';
import DetailsStep from './steps/detail-step';
import ConfirmationStep from './steps/confirmation-step';
import { Loader2, CalendarCheck, ChevronLeft } from 'lucide-react';

export default function BookingContainer({ hospitalIdFromView }: { hospitalIdFromView?: string }) {
  const { step, prevStep, resetBooking } = useBookingStore();
  const { authState } = useAuth();

  // Priorité absolue à l'ID venant de la vue sélectionnée
  const hospitalId = hospitalIdFromView || authState.user?.hospitalId;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['booking-setup', hospitalId],
    queryFn: () => getBookingSetupDataApi(hospitalId as string),
    enabled: !!hospitalId,
    staleTime: 0,
    gcTime: 0
  });

  // On surveille le changement d'ID pour reset le store et recharger les données
  useEffect(() => {
    if (hospitalId) {
      refetch();
    }
  }, [hospitalId, refetch]);

  const renderStep = () => {
    if (isLoading) return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-[#058D66]" />
        <p className="text-sm text-slate-500 font-medium lowercase">chargement du catalogue...</p>
      </div>
    );

    if (error) return (
      <div className="p-8 border border-red-100 bg-red-50 rounded-2xl text-center">
        <p className="text-red-600 text-sm lowercase italic">erreur de connexion au serveur.</p>
      </div>
    );

    switch (step) {
      case 1: return <ServiceStep services={data?.services || []} doctors={data?.doctors || []} />;
      case 2: return <DateTimeStep />;
      case 3: return <DetailsStep />;
      case 4: return <ConfirmationStep />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-row h-full w-full bg-white overflow-hidden items-stretch">
      <section className="flex-1 min-w-0 h-full overflow-y-auto p-8 lg:p-20 flex flex-col bg-white">
        <div className="mb-12 flex items-center justify-between w-full max-w-xl mx-auto">
          {step > 1 && step < 4 ? (
            <button onClick={prevStep} className="flex items-center text-slate-400 hover:text-[#058D66] transition-colors group">
              <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium lowercase">retour</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 text-[#058D66]">
              <CalendarCheck className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-widest">nouveau rdv</span>
            </div>
          )}
          <div className="px-3 py-1 bg-slate-50 rounded-full text-[12px] text-slate-500 font-semibold border border-slate-100">
            étape {step} / 4
          </div>
        </div>

        <div className="w-full max-w-xl mx-auto flex-grow flex flex-col">
          <div className="mb-10">
            <h1 className="text-3xl lg:text-4xl font-semibold text-[#3E3E3E] tracking-tight mb-3 lowercase">
              {step === 4 ? "c'est fait !" : "réserver un rendez-vous"}
            </h1>
            <p className="text-[#6F6F6F] text-[15px] leading-relaxed lowercase italic">
              {step === 1 && "sélectionnez le service médical et votre praticien."}
              {step === 2 && "choisissez le moment qui vous convient."}
              {step === 3 && "complétez vos informations de contact."}
              {step === 4 && "votre demande a été enregistrée avec succès."}
            </p>
          </div>
          <div className="flex-grow">{renderStep()}</div>
        </div>
      </section>
      <section className="hidden lg:block w-[380px] h-full border-l border-slate-50">
        <BookingSidebar />
      </section>
    </div>
  );
}