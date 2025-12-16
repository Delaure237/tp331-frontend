'use client';

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PatientSchema, Patient } from "@/schemas/patient-schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DatePicker } from "@/components/ui/date-picker"; // ou adapter à ton composant date
import dayjs from "dayjs";

interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSuccess?: (patient: Patient) => void;
}

export const AddPatientModal: React.FC<AddPatientModalProps> = ({ isOpen, onClose, onAddSuccess }) => {
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<Patient>({
    resolver: zodResolver(PatientSchema),
    defaultValues: {},
  });

  const onSubmit = (data: Patient) => {
    console.log("Patient submitted:", data);
    onAddSuccess?.(data);
    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const watchSex = watch("sex");
  const watchIsUnder18 = watch("isUnder18");

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-auto p-6">
        <DialogHeader>
          <DialogTitle>Ajouter un patient</DialogTitle>
          <DialogDescription>Remplissez les informations du patient. Les champs avec * sont requis.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">

          {/* Informations personnelles */}
          <h3 className="font-semibold">Informations personnelles</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label>Prénom *</label>
              <Input {...register("patientFirstName")} placeholder="Prénom" />
              {errors.patientFirstName && <p className="text-red-500 text-sm">{errors.patientFirstName.message}</p>}
            </div>

            <div>
              <label>Nom *</label>
              <Input {...register("patientLastName")} placeholder="Nom" />
              {errors.patientLastName && <p className="text-red-500 text-sm">{errors.patientLastName.message}</p>}
            </div>

            <div>
              <label>Date de naissance *</label>
              <Input type="date" {...register("dateOfBirth")} />
              {errors.dateOfBirth && <p className="text-red-500 text-sm">{errors.dateOfBirth.message}</p>}
            </div>

            <div>
              <label>Sexe *</label>
              <RadioGroup className="flex space-x-4" value={watchSex} onValueChange={val => setValue("sex", val)}>
                <RadioGroupItem value="Male" /> Homme
                <RadioGroupItem value="Female" /> Femme
                <RadioGroupItem value="N/A" /> N/A
              </RadioGroup>
              {errors.sex && <p className="text-red-500 text-sm">{errors.sex.message}</p>}
            </div>

            <div>
              <label>Téléphone *</label>
              <Input {...register("phone")} placeholder="Téléphone" />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
            </div>

            <div>
              <label>Email *</label>
              <Input type="email" {...register("email")} placeholder="Email" />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            <div className="sm:col-span-2">
              <label>Adresse *</label>
              <Input {...register("address")} placeholder="Adresse" />
              {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
            </div>

            <div>
              <label>État civil *</label>
              <Select {...register("maritalStatus")} placeholder="Sélectionnez">
                <Option value="Single">Célibataire</Option>
                <Option value="Married">Marié(e)</Option>
                <Option value="Divorced">Divorcé(e)</Option>
                <Option value="Widowed">Veuf/Veuve</Option>
              </Select>
              {errors.maritalStatus && <p className="text-red-500 text-sm">{errors.maritalStatus.message}</p>}
            </div>

            <div>
              <label>Patient  *</label>
              <RadioGroup value={watchIsUnder18} onValueChange={val => setValue("isUnder18", val)}>
                <RadioGroupItem value="Yes" /> Oui
                <RadioGroupItem value="No" /> Non
              </RadioGroup>
              {errors.isUnder18 && <p className="text-red-500 text-sm">{errors.isUnder18.message}</p>}
            </div>

            <div>
              <label>Groupe sanguin</label>
              <Input {...register("bloodGroup")} placeholder="A+, O-, B+, etc." />
            </div>

            <div>
              <label>Taille (cm)</label>
              <Input type="number" {...register("height", { valueAsNumber: true })} placeholder="Taille" />
              {errors.height && <p className="text-red-500 text-sm">{errors.height.message}</p>}
            </div>

            <div>
              <label>Poids (kg)</label>
              <Input type="number" {...register("weight", { valueAsNumber: true })} placeholder="Poids" />
              {errors.weight && <p className="text-red-500 text-sm">{errors.weight.message}</p>}
            </div>
          </div>

          {/* Contact d'urgence */}
          <h3 className="font-semibold mt-4">Contact d'urgence</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label>Nom du contact</label>
              <Input {...register("emergencyContactName")} placeholder="Nom" />
            </div>

            <div>
              <label>Relation</label>
              <Input {...register("emergencyContactRelationship")} placeholder="Relation" />
            </div>

            <div className="sm:col-span-2">
              <label>Téléphone</label>
              <Input {...register("emergencyContactNumber")} placeholder="Téléphone" />
            </div>
          </div>

          {/* Médecin et pharmacie */}
          <h3 className="font-semibold mt-4">Médecin et pharmacie</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label>Nom du médecin traitant</label>
              <Input {...register("familyDoctorName")} placeholder="Nom" />
            </div>

            <div>
              <label>Téléphone médecin</label>
              <Input {...register("familyDoctorPhone")} placeholder="Téléphone" />
            </div>

            <div>
              <label>Pharmacie préférée</label>
              <Input {...register("preferredPharmacy")} placeholder="Nom de la pharmacie" />
            </div>

            <div>
              <label>Téléphone pharmacie</label>
              <Input {...register("pharmacyPhone")} placeholder="Téléphone" />
            </div>
          </div>

          {/* Historique santé */}
          <h3 className="font-semibold mt-4">Historique santé</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label>Motif d'inscription</label>
              <Input {...register("reasonForRegistration")} placeholder="Motif" />
            </div>

            <div>
              <label>Notes supplémentaires</label>
              <Input {...register("additionalNotes")} placeholder="Notes" />
            </div>

            <div>
              <label>Prend des médicaments ?</label>
              <Input {...register("takingMedications")} placeholder="Oui/Non" />
            </div>

            <div>
              <label>Liste des médicaments</label>
              <Input {...register("medicationsList")} placeholder="Médicaments" />
            </div>
          </div>

          {/* Assurances */}
          <h3 className="font-semibold mt-4">Assurances</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label>Compagnie d'assurance</label>
              <Input {...register("insuranceCompany")} placeholder="Compagnie" />
            </div>

            <div>
              <label>ID Assurance</label>
              <Input {...register("insuranceID")} placeholder="ID Assurance" />
            </div>

            <div>
              <label>Nom du titulaire</label>
              <Input {...register("policyHolderName")} placeholder="Nom titulaire" />
            </div>

            <div>
              <label>Date de naissance du titulaire</label>
              <Input type="date" {...register("policyHolderDOB")} />
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <Button type="button" variant="outline" onClick={handleClose}>Annuler</Button>
            <Button type="submit">Ajouter</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
