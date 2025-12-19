import { z } from "zod";

export const bookingSchema = z.object({
  serviceId: z.string().uuid("Veuillez sélectionner un département"),
  operationId: z.string().uuid("Veuillez sélectionner un acte médical"),
  doctorId: z.string().uuid("Veuillez choisir un praticien"),
  appointmentDate: z.date({ required_error: "Veuillez choisir une date" }),
  timeSlot: z.string().min(1, "Veuillez choisir un créneau horaire"),
  fullName: z.string().min(3, "Nom complet requis"),
  email: z.string().email("Adresse email invalide"),
  phone: z.string().min(8, "Numéro de téléphone requis"),
  notes: z.string().optional(),

  paymentMethod: z.enum(['onsite', 'mobile', 'card'])
});

export type BookingFormData = z.infer<typeof bookingSchema>;