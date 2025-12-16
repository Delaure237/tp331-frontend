// src/schemas/patient-schema.ts
import { z } from "zod";

export const PatientSchema = z.object({
  registrationDate: z.coerce.date().optional(),
  healthCareNumber: z.string().min(1, "Le numéro de sécurité sociale est requis"),
  patientFirstName: z.string().min(1, "Le prénom est requis"),
  patientLastName: z.string().min(1, "Le nom de famille est requis"),
  sex: z.enum(["Male", "Female", "N/A"], "Le sexe est requis"),
  dateOfBirth: z.coerce.date().optional(),
  phone: z.string().optional(),
  email: z.string().email("Email invalide").optional(),
  address: z.string().min(1, "L'adresse est requise"),
  maritalStatus: z.enum(["Single","Married","Divorced","Legally separated","Widowed"]).optional(),
  isUnder18: z.enum(["Yes", "No"]).optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactRelationship: z.string().optional(),
  emergencyContactNumber: z.string().optional(),
  familyDoctorName: z.string().optional(),
  familyDoctorPhone: z.string().optional(),
  preferredPharmacy: z.string().optional(),
  pharmacyPhone: z.string().optional(),
  reasonForRegistration: z.string().optional(),
  additionalNotes: z.string().optional(),
  takingMedications: z.string().optional(),
  medicationsList: z.string().optional(),
  insuranceCompany: z.string().optional(),
  insuranceID: z.string().optional(),
  policyHolderName: z.string().optional(),
  policyHolderDOB: z.coerce.date().optional(),
  height: z.number().positive("La taille doit être un nombre positif").optional(),
  weight: z.number().positive("Le poids doit être un nombre positif").optional(),
  bloodGroup: z.string().optional(),
});

export type Patient = z.infer<typeof PatientSchema>;
