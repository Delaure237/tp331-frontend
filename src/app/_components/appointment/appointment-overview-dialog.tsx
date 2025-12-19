'use client';

import * as React from 'react';
import {
  X,
  Edit2,
  Calendar,
  Clock,
  UserCircle,
  Stethoscope,
  FileText,
  Bell,
  CheckCircle2,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface AppointmentOverviewProps {
  isOpen: boolean;
  onClose: () => void;
  reservationId: string;
  patientName: string;
  status: string;
  symptoms: string;
  serviceName: string;
  operationName: string;
  date: string;
  timeSlot: string;
  doctorName: string;
  billNumber: string;
  isPaid: boolean;
  patientDetails: {
    fullName: string;
    phone: string;
    birthDate: string;
    email: string;
    gender: string;
    address: string;
  };
  onEditMedicalCheckup: () => void;
  onAddMedicalRecord: () => void;
  onFinish: () => void;
}

export const AppointmentOverviewDialog = ({
  isOpen,
  onClose,
  reservationId,
  patientName,
  status,
  symptoms,
  serviceName,
  operationName,
  date,
  timeSlot,
  doctorName,
  billNumber,
  isPaid,
  patientDetails,
  onEditMedicalCheckup,
  onAddMedicalRecord,
  onFinish
}: AppointmentOverviewProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 gap-0 border-none overflow-hidden bg-white shadow-2xl">

        {/* Barre d'en-tête */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-[15px] text-slate-500 font-medium">
            <span>ID Réservation</span>
            <span className="text-slate-900 font-bold">#{reservationId}</span>
            <span className="text-slate-300 mx-1">•</span>
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 tracking-wider uppercase">
              <Calendar className="w-3.5 h-3.5" /> Rendez-vous manuel
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl border border-slate-200">
              <Edit2 className="w-4 h-4 text-slate-600" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-9 w-9 text-slate-400">
              <X className="w-6 h-6" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[85vh]">
          {/* Carte Profil Patient */}
          <div className="flex items-center justify-between p-5 border border-slate-100 rounded-2xl bg-[#fcfcfd]">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#E879F9] flex items-center justify-center text-white font-bold text-xl">
                {patientName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-[13px] text-slate-400 font-medium">Nom du patient</p>
                <h3 className="text-2xl font-bold text-slate-900 leading-tight">{patientName}</h3>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <p className="text-[13px] text-slate-400">Statut</p>
              <Badge variant="outline" className="bg-white border-slate-200 px-4 py-1.5 rounded-full font-bold text-slate-700">
                <div className="w-2 h-2 rounded-full bg-slate-400 mr-2.5" />
                {status}
                <span className="ml-2 text-slate-400 text-xs">▼</span>
              </Badge>
            </div>
          </div>

          {/* Bannière Symptômes */}
          <div className="flex items-center gap-4 p-4 border border-slate-100 rounded-xl bg-[#f8faff]">
            <div className="p-2 bg-white rounded-lg border border-slate-100 shadow-sm">
                <FileText className="w-5 h-5 text-slate-500" />
            </div>
            <p className="text-[14px] text-slate-600 flex-1">{symptoms}</p>
            <Button variant="link" className="font-bold text-blue-600 px-0">Modifier</Button>
          </div>

          {/* Info créneau horaire */}
          <div className="flex items-center gap-3 p-3.5 bg-[#eff6ff] border border-[#dbeafe] rounded-lg">
             <Clock className="w-5 h-5 text-blue-500" />
             <p className="text-[14px] text-[#1e40af] flex-1">Créneau disponible dans le futur, vous pouvez prolonger la réservation</p>
             <Button variant="link" className="font-bold text-blue-700 px-0 h-auto py-0">Prolonger</Button>
          </div>

          {/* Données du RDV */}
          <div className="grid grid-cols-3 gap-8 py-2">
            <div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 font-bold tracking-wider uppercase mb-2.5">
                <Stethoscope className="w-4 h-4" /> {serviceName}
              </div>
              <p className="font-bold text-slate-900 text-[15px]">{operationName}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 font-bold tracking-wider uppercase mb-2.5">
                <Clock className="w-4 h-4" /> Date et heure
              </div>
              <p className="font-bold text-slate-900 text-[15px]">{date}</p>
              <p className="text-slate-500 text-[13px] mt-0.5">{timeSlot}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 font-bold tracking-wider uppercase mb-2.5">
                <UserCircle className="w-4 h-4" /> Médecin
              </div>
              <p className="font-bold text-slate-900 text-[15px]">{doctorName}</p>
            </div>
          </div>

          <Separator className="bg-slate-100" />

          {/* Section Paiement */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-[15px] text-slate-500 font-medium">Paiement</span>
              <span className="text-[15px] font-bold text-slate-900">Facture #{billNumber}</span>
              <Badge className={cn(
                  "px-2.5 py-0.5 rounded text-[10px] font-bold border-none",
                  isPaid ? "bg-green-100 text-green-700" : "bg-[#fdf2f8] text-[#ec4899]"
              )}>
                {isPaid ? "PAYÉ" : "NON PAYÉ"}
              </Badge>
            </div>
            <Button variant="outline" className="text-[13px] font-bold h-10 gap-2 border-slate-200 rounded-xl px-4">
              <Bell className="w-4 h-4 text-[#f59e0b]" /> Envoyer rappel
            </Button>
          </div>

          {/* Informations Générales */}
          <div className="space-y-5 pt-2">
            <h4 className="text-[17px] font-bold text-slate-900">Informations générales</h4>
            <div className="grid grid-cols-2 gap-x-12 gap-y-6">
              {[
                  { label: "Nom complet", value: patientDetails.fullName },
                  { label: "Numéro de téléphone", value: patientDetails.phone },
                  { label: "Âge / Naissance", value: patientDetails.birthDate },
                  { label: "Email", value: patientDetails.email },
                  { label: "Genre", value: patientDetails.gender },
                  { label: "Adresse", value: patientDetails.address },
              ].map((info) => (
                <div key={info.label}>
                  <p className="text-[11px] text-slate-400 font-bold tracking-wider uppercase mb-1.5">{info.label}</p>
                  <p className="text-[15px] font-bold text-[#1e293b]">{info.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Boutons d'actions */}
          <div className="grid grid-cols-2 gap-4 pt-6">
            <Button
              onClick={onEditMedicalCheckup}
              className="bg-[#34d399] hover:bg-[#10b981] text-white flex justify-between px-5 h-14 rounded-xl border-none"
            >
              <div className="flex items-center gap-2.5 text-[12px] font-bold tracking-wider uppercase">
                <FileText className="w-4 h-4" /> Modifier le bilan médical
              </div>
              <CheckCircle2 className="w-6 h-6 opacity-90" />
            </Button>
            <Button
              onClick={onAddMedicalRecord}
              variant="outline"
              className="border-[#3b82f6] text-[#3b82f6] border-dashed border-2 hover:bg-blue-50 h-14 rounded-xl text-[12px] font-bold tracking-wider uppercase gap-2.5"
            >
              <Plus className="w-5 h-5" /> Ajouter dossier médical
            </Button>
          </div>

          <Button
            onClick={onFinish}
            className="w-full bg-[#e2e8f0] text-slate-500 font-bold h-14 rounded-xl text-[15px] border-none shadow-none mt-2"
          >
            Terminer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};