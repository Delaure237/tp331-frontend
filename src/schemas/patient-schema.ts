import { z } from "zod";

export const PatientSchema = z.object({
  id: z.string().optional(),
  // Informations de base
  patientFirstName: z.string().min(2, "Le prénom est requis"),
  patientLastName: z.string().min(2, "Le nom de famille est requis"),
  healthCareNumber: z.string().min(1, "Le numéro d'identification est requis"),

  // Paramètres vitaux/démographiques
  sex: z.enum(["Male", "Female", "N/A"], {
    required_error: "Le sexe est requis",
  }),
  dateOfBirth: z.preprocess((arg) => {
    if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
  }, z.date().optional().nullable()),

  // Coordonnées
  phone: z.string().min(5, "Un numéro de téléphone valide est requis").optional().nullable(),
  email: z.string().email("Email invalide").optional().or(z.literal("")).nullable(),
  address: z.string().optional().nullable(),

  // Status (Optionnel pour le formulaire, géré souvent par le backend)
  status: z.enum(["Active", "Non-Active", "New Patient"]).default("New Patient"),
});

// Schéma pour l'édition : nécessite l'ID
export const UpdatePatientSchema = PatientSchema.extend({
  id: z.string({ required_error: "L'identifiant est requis pour la mise à jour" }),
});

export type Patient = z.infer<typeof PatientSchema>;
export type UpdatePatient = z.infer<typeof UpdatePatientSchema>;