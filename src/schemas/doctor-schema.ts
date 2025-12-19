import { z } from "zod";

export const DoctorSchema = z.object({
  id: z.string().optional(),

  // Informations de base
  firstName: z.string().min(2, "Le prénom est requis"),
  lastName: z.string().min(2, "Le nom de famille est requis"),
  specialty: z.string().min(2, "La spécialité est requise"),

  // Coordonnées (Indispensables pour les externes, optionnelles si liées à un User)
  phone: z.string().min(5, "Un numéro de téléphone valide est requis").optional().nullable(),
  email: z.string().email("Email invalide").optional().or(z.literal("")).nullable(),

  // Liaison avec le compte utilisateur (null pour les intervenants externes)
  userId: z.string().uuid("ID utilisateur invalide").optional().nullable(),

  // ID de l'hôpital (souvent injecté par le contexte)
  hospitalId: z.string().uuid().optional(),
});

// Schéma pour l'édition : nécessite l'ID
export const UpdateDoctorSchema = DoctorSchema.extend({
  id: z.string({ required_error: "L'identifiant est requis pour la mise à jour" }),
});

export type Doctor = z.infer<typeof DoctorSchema>;
export type UpdateDoctor = z.infer<typeof UpdateDoctorSchema>;