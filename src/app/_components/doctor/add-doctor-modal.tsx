"use client";

import React from "react";
import { Doctor } from "@/schemas/doctor.schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { DoctorForm } from "./doctor-form";

interface AddDoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDoctor: (data: Doctor) => void;
  isSubmitting: boolean;
}

export const AddDoctorModal: React.FC<AddDoctorModalProps> = ({
  isOpen,
  onClose,
  onAddDoctor,
  isSubmitting
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[750px] max-h-[92vh] p-0 rounded-[32px] border-none shadow-2xl overflow-hidden bg-white flex flex-col">
        <DialogHeader className="p-8 pb-4">
          <DialogTitle className="text-xl font-bold text-[#3E3E3E] lowercase">
            ajouter un nouveau docteur
          </DialogTitle>
          <DialogDescription className="text-[#6F6F6F] text-[12px]">
            veuillez renseigner les informations du praticien. les champs marqués d'un astérisque (*) sont obligatoires.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar1">
          <DoctorForm
            onSubmit={onAddDoctor}
            onCancel={onClose}
            isSubmitting={isSubmitting}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};