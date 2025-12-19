"use client";

import React from "react";
import { Patient } from "@/schemas/patient-schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { PatientForm } from "./patient-form";

interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPatient: (data: Patient) => void;
  isSubmitting: boolean;
}

export const AddPatientModal: React.FC<AddPatientModalProps> = ({
  isOpen,
  onClose,
  onAddPatient,
  isSubmitting
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[750px] max-h-[92vh] p-0 rounded-[32px] border-none shadow-2xl overflow-hidden bg-white flex flex-col">
        <DialogHeader className="p-8 pb-4">
          <DialogTitle className="text-xl font-bold text-[#3E3E3E] lowercase">ajouter un nouveau patient</DialogTitle>
          <DialogDescription className="text-[#6F6F6F] text-[12px]">
            veuillez remplir tous les champs obligatoires marqués d'un astérisque (*).
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar1">
          <PatientForm
            onSubmit={onAddPatient}
            onCancel={onClose}
            isSubmitting={isSubmitting}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};