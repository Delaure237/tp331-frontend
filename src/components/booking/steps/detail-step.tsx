"use client";

import React, { useEffect, useState } from 'react';
import { useBookingStore } from '@/store/booking-store';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Smartphone, Banknote } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Script from 'next/script';

// Déclaration pour TypeScript
declare var campay: any;

export default function DetailsStep() {
  const { formData, updateFormData, nextStep, prevStep } = useBookingStore();
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const isFormValid = formData.fullName && formData.phone && formData.email && formData.paymentMethod;

  // Injection du CSS pour corriger le problème de visibilité (z-index)
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      #campay-modal-container {
        z-index: 9999 !important;
      }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  // Configuration de Campay
  const initCampay = () => {
    if (typeof campay !== 'undefined' && formData.paymentMethod !== 'onsite') {
      try {
        campay.options({
          payButtonId: "payButton",
          description: `RDV Médical - ${formData.fullName}`,
          amount: "500", // À dynamiser selon vos besoins
          currency: "XAF",
          externalReference: `booking_${Date.now()}`,
          redirectUrl: "",
        });

        campay.onSuccess = function (data: any) {
          console.log('Paiement réussi:', data);
          nextStep();
        };

        campay.onFail = function (data: any) {
          console.error('Paiement échoué:', data);
          alert('Le paiement a échoué ou a été annulé.');
        };
      } catch (error) {
        console.error("Erreur d'initialisation Campay:", error);
      }
    }
  };

  // Ré-initialiser si le mode de paiement change ou si le script finit de charger
  useEffect(() => {
    if (scriptLoaded) {
      initCampay();
    }
  }, [formData.paymentMethod, scriptLoaded, formData.fullName]);

  const handleFinalSubmit = () => {
    if (formData.paymentMethod === 'onsite') {
      nextStep();
    } else {
      // Le SDK Campay intercepte automatiquement le clic sur l'élément avec l'ID "payButton"
      console.log("Lancement du module de paiement...");
    }
  };

  return (
    <div className="space-y-3 animate-in fade-in duration-500 max-h-full">
      <Script
        src="https://demo.campay.net/sdk/js?app-id=yf_kHXHCltxUh-cNWKEe4U8Enq2LDKXaai1LLAl_2f-9VbwgFRrT2yiq71u97ooGHloDCiXnKpeVl96cjY4ujw"
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
      />

      {/* Récapitulatif */}
      {formData.appointmentDate && (
        <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 text-[12px] text-[#3E3E3E] leading-snug">
          rendez-vous le <span className="font-semibold text-[#058D66]">{format(formData.appointmentDate, "d MMMM yyyy", { locale: fr })}</span> à <span className="font-semibold text-[#058D66]">{formData.timeSlot?.split(' - ')[0]}</span>.
        </div>
      )}

      <div className="grid gap-2">
        <div className="grid gap-1">
          <Label htmlFor="fullName" className="text-[12px] text-[#3E3E3E] font-semibold">nom complet</Label>
          <Input
            id="fullName"
            placeholder="votre nom"
            value={formData.fullName || ""}
            onChange={(e) => updateFormData({ fullName: e.target.value })}
            className="h-9 rounded-lg border-[#86909C]/40 focus-visible:ring-[#058D66] text-[13px]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="grid gap-1">
            <Label htmlFor="phone" className="text-[12px] text-[#3E3E3E] font-semibold">téléphone</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="votre numéro"
              value={formData.phone || ""}
              onChange={(e) => updateFormData({ phone: e.target.value })}
              className="h-9 rounded-lg border-[#86909C]/40 text-[13px]"
            />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="email" className="text-[12px] text-[#3E3E3E] font-semibold">e-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="votre@email.com"
              value={formData.email || ""}
              onChange={(e) => updateFormData({ email: e.target.value })}
              className="h-9 rounded-lg border-[#86909C]/40 text-[13px]"
            />
          </div>
        </div>

        <div className="grid gap-1.5 pt-1">
          <Label className="text-[12px] text-[#3E3E3E] font-semibold">mode de paiement</Label>
          <RadioGroup
            value={formData.paymentMethod}
            onValueChange={(val: any) => updateFormData({ paymentMethod: val })}
            className="grid grid-cols-3 gap-2"
          >
            {[
              { id: 'onsite', label: 'sur place', icon: Banknote },
              { id: 'mobile', label: 'mobile', icon: Smartphone },
              { id: 'card', label: 'carte', icon: CreditCard },
            ].map((method) => (
              <Label
                key={method.id}
                className={`flex flex-col items-center justify-center rounded-lg border p-1.5 cursor-pointer transition-all ${
                  formData.paymentMethod === method.id
                    ? "border-[#058D66] bg-[#058D66]/5 text-[#058D66]"
                    : "border-[#86909C]/30 text-[#6F6F6F] hover:border-[#058D66]/50"
                }`}
              >
                <RadioGroupItem value={method.id} className="sr-only" />
                <method.icon className="w-4 h-4 mb-1" />
                <span className="text-[10px] font-medium">{method.label}</span>
              </Label>
            ))}
          </RadioGroup>
        </div>

        <div className="grid gap-1">
          <Label htmlFor="notes" className="text-[12px] text-[#3E3E3E] font-semibold">notes (optionnel)</Label>
          <Textarea
            id="notes"
            placeholder="précisions utiles..."
            value={formData.notes || ""}
            onChange={(e) => updateFormData({ notes: e.target.value })}
            className="min-h-[50px] rounded-lg border-[#86909C]/40 text-[12px]"
          />
        </div>
      </div>

      <div className="flex justify-between items-center pt-2">
        <Button
          variant="ghost"
          className="px-0 text-[#6F6F6F] hover:text-[#3E3E3E] text-[12px] h-8"
          onClick={prevStep}
        >
          retour
        </Button>

        <Button
          id="payButton"
          disabled={!isFormValid}
          className="rounded-full px-8 h-9 bg-[#058D66] hover:opacity-90 text-white text-[13px] font-medium transition-all"
          onClick={handleFinalSubmit}
        >
          {formData.paymentMethod === 'onsite' ? 'confirmer' : 'payer maintenant'}
        </Button>
      </div>
    </div>
  );
}