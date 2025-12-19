"use client";

import React, { useMemo } from 'react';
import { useBookingStore } from '@/store/booking-store';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface ServiceStepProps {
  services: any[];
  doctors: any[];
}

export default function ServiceStep({ services, doctors }: ServiceStepProps) {
  const { formData, updateFormData, nextStep, resetBooking } = useBookingStore();

  const selectedService = useMemo(() => {
    return services?.find(s => (s.id || s.service_id) === formData.serviceId);
  }, [services, formData.serviceId]);

  const filteredDoctors = useMemo(() => {
    if (!selectedService || !doctors) return [];
    const serviceName = (selectedService.name || "").toLowerCase().trim();

    return doctors.filter(doc => {
      const docSpecialty = (doc.specialty || "").toLowerCase().trim();
      return docSpecialty === serviceName;
    });
  }, [doctors, selectedService]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="space-y-4">
        <div className="grid gap-1.5">
          <Label className="text-xs font-bold text-slate-700">Service</Label>
          <Select
            value={formData.serviceId}
            onValueChange={(val) => updateFormData({ serviceId: val, operationId: "", doctorId: "" })}
          >
            <SelectTrigger className="bg-white border-slate-200">
              <SelectValue placeholder="Sélectionner un service" />
            </SelectTrigger>
            <SelectContent>
              {services?.map((s) => (
                <SelectItem key={s.id || s.service_id} value={s.id || s.service_id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className={`grid gap-1.5 ${!formData.serviceId && 'opacity-50'}`}>
          <Label className="text-xs font-bold text-slate-700">Traitement</Label>
          <Select
            disabled={!formData.serviceId}
            value={formData.operationId}
            onValueChange={(val) => updateFormData({ operationId: val })}
          >
            <SelectTrigger className="bg-white border-slate-200">
              <SelectValue placeholder="Sélectionner un acte" />
            </SelectTrigger>
            <SelectContent>
              {selectedService?.operations?.map((op: any) => (
                <SelectItem key={op.id || op.operation_id} value={op.id || op.operation_id}>
                  {op.name} ({Number(op.price).toLocaleString()} FCFA)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className={`grid gap-1.5 ${!formData.operationId && 'opacity-50'}`}>
          <Label className="text-xs font-bold text-slate-700">Praticien</Label>
          <Select
            disabled={!formData.operationId}
            value={formData.doctorId}
            onValueChange={(val) => updateFormData({ doctorId: val })}
          >
            <SelectTrigger className="bg-white border-slate-200">
              <SelectValue placeholder="Sélectionner un médecin" />
            </SelectTrigger>
            <SelectContent>
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map((doc) => (
                  <SelectItem key={doc.id || doc.doctor_id} value={doc.id || doc.doctor_id}>
                    Dr. {doc.firstName} {doc.lastName}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="none" disabled>aucun médecin en {selectedService?.name || "ce service"}</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4">
        <Button variant="ghost" onClick={resetBooking} className="text-slate-500 lowercase">annuler</Button>
        <Button
          disabled={!formData.doctorId || formData.doctorId === "none"}
          onClick={nextStep}
          className="bg-[#058D66] hover:bg-[#047a57] rounded-full px-10"
        >
          Suivant
        </Button>
      </div>
    </div>
  );
}