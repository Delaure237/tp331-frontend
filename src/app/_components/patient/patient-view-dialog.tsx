"use client";

import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import {
  User, Calendar, History, Pill, FileText,
  Activity, ClipboardList, Pencil, X, Paperclip
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface PatientViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient: any | null;
}

export function PatientViewDialog({ open, onOpenChange, patient }: PatientViewDialogProps) {
  if (!patient) return null;

  const initials = `${patient.firstName?.[0] || ""}${patient.lastName?.[0] || ""}`.toLowerCase();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-[96vw] sm:max-w-[1400px] h-[92vh] p-0 rounded-[24px] border-none shadow-xl overflow-hidden bg-[#FBFBFC] flex flex-col [&>button]:hidden"
      >
        {/* [&>button]:hidden ci-dessus supprime la croix par défaut de shadcn */}

        <VisuallyHidden.Root>
          <DialogTitle>détails de {patient.firstName}</DialogTitle>
        </VisuallyHidden.Root>

        {/* Unique bouton de fermeture personnalisé */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onOpenChange(false)}
          className="absolute right-6 top-6 rounded-full z-50 hover:bg-gray-100"
        >
          <X className="h-5 w-5 text-slate-400" />
        </Button>

        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar1">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">

            {/* bloc identité */}
            <div className="lg:col-span-8 bg-white rounded-[24px] p-10 border border-slate-100 flex flex-col md:flex-row gap-10 items-start relative">
              <Avatar className="h-44 w-44 rounded-[20px] bg-slate-50 border-none flex-shrink-0">
                <AvatarFallback className="text-4xl font-light text-slate-300">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-8">
                <div>
                  <h2 className="text-4xl font-medium text-[#333] tracking-tight lowercase">
                    {patient.firstName} {patient.lastName}
                  </h2>
                  <div className="flex gap-6 mt-3 text-sm text-slate-500 font-normal lowercase">
                    <span className="flex items-center gap-2">
                      <Calendar className="size-4 text-[#058D66]" /> {patient.birthDate || "12.02.1995"}
                    </span>
                    <span className="flex items-center gap-2">
                      <User className="size-4 text-[#058D66]" /> {patient.sex || "non spécifié"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-12 gap-y-8">
                  <InfoBlock label="téléphone" value={patient.phone} />
                  <InfoBlock label="email" value={patient.email} />
                  <div className="col-span-2">
                    <InfoBlock label="adresse" value={patient.address} />
                  </div>
                </div>
              </div>
              <EditButton />
            </div>

            {/* bloc visites */}
            <div className="lg:col-span-4">
              <BentoCard title="visites & rdv" icon={<ClipboardList />}>
                <DataRow label="dernière visite" value={patient.lastVisitDate || "aucune"} />
                <DataRow label="rdv manqués" value={patient.missedAppointments || "aucun"} />
                <DataRow label="prochain rdv" value={patient.nextAppointment || "non planifié"} />
              </BentoCard>
            </div>

            {/* Cartes secondaires */}
            <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <BentoCard title="santé actuelle" icon={<Activity />}>
                  <DataRow label="plainte" value={patient.primaryConcern || "aucune"} />
                  <DataRow label="médecin" value={patient.primaryPhysician || "non renseigné"} />
                </BentoCard>

                <BentoCard title="antécédents" icon={<History />}>
                  <DataRow label="maladies" value={patient.chronicConditions || "aucune"} />
                  <DataRow label="chirurgies" value={patient.pastSurgeries || "aucune"} />
                </BentoCard>

                <BentoCard title="médicaments" icon={<Pill />}>
                  <DataRow label="traitements" value={patient.currentMedications || "aucun"} />
                  <DataRow label="observance" value={patient.medicationAdherence || "n/a"} />
                </BentoCard>

                <BentoCard title="examens" icon={<FileText />}>
                  <div className="mt-2 p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center">
                    <p className="text-[11px] text-slate-500 lowercase">
                      {patient.labResultsStatus || "en attente de résultats"}
                    </p>
                  </div>
                </BentoCard>
            </div>

            {/* NOUVELLE SECTION FILES (SANS IMAGES) */}
            <div className="lg:col-span-12">
              <BentoCard title="fichiers & documents" icon={<Paperclip />}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {patient.files?.length > 0 ? (
                    patient.files.map((file: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100 transition-colors cursor-pointer">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                           <FileText className="size-4 text-[#058D66]" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-xs font-medium text-slate-700 truncate lowercase">{file.name}</p>
                          <p className="text-[10px] text-slate-400 lowercase">{file.size || "document"}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic py-2">aucun fichier joint au dossier</p>
                  )}
                </div>
              </BentoCard>
            </div>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function InfoBlock({ label, value }: { label: string, value?: string }) {
  return (
    <div className="space-y-1">
      <p className="text-[11px] text-slate-500 font-bold lowercase tracking-wider">{label}</p>
      <p className="text-base text-slate-700 lowercase leading-tight">{value || "non renseigné"}</p>
    </div>
  );
}

function BentoCard({ title, icon, children }: { title: string, icon: React.ReactElement, children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-[24px] p-8 border border-slate-100 h-full flex flex-col gap-6 relative group transition-all">
      <div className="flex items-center gap-3">
        <div className="text-[#058D66]">
          {React.cloneElement(icon, { size: 18, strokeWidth: 2 })}
        </div>
        <h3 className="text-sm font-bold text-slate-600 lowercase tracking-tight">{title}</h3>
      </div>
      <div className="flex-1">
        {children}
      </div>
      <EditButton size="small" />
    </div>
  );
}

function DataRow({ label, value }: { label: string, value: string }) {
  return (
    <div className="mb-4 last:mb-0">
      <p className="text-[11px] text-slate-500 font-bold lowercase tracking-wide mb-0.5">{label}</p>
      <p className="text-sm text-slate-600 lowercase leading-snug">{value}</p>
    </div>
  );
}

function EditButton({ size = "default" }: { size?: "default" | "small" }) {
  return (
    <Button
      variant="ghost"
      className={`rounded-full text-[#058D66] transition-all ${
        size === "small"
          ? "absolute top-6 right-6 size-8 p-0 opacity-0 group-hover:opacity-100 hover:bg-[#058D66]/10"
          : "absolute top-10 right-10 size-10 bg-[#058D66]/5 hover:bg-[#058D66]/10"
      }`}
    >
      <Pencil className={size === "small" ? "size-3.5" : "size-4"} />
    </Button>
  );
}