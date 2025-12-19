import * as z from "zod";

export const patientSignupSchema = z.object({ // Correction : z.object au lieu de z.z.object
  firstName: z
    .string()
    .min(2, "Le prénom doit contenir au moins 2 caractères")
    .max(50, "Le prénom est trop long"),

  lastName: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(50, "Le nom est trop long"),

  email: z
    .string()
    .email("Veuillez entrer une adresse email valide"),

  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Doit contenir au moins une majuscule")
    .regex(/[0-9]/, "Doit contenir au moins un chiffre"),

  confirmPassword: z.string(),

  idNumber: z
    .string()
    .min(5, "Le numéro d'identification (CNI/Passport) est requis"),

  // CORRECTION : On s'aligne sur le modèle Sequelize ('Male', 'Female', 'N/A')
  sex: z.enum(["Male", "Female", "N/A"], {
    errorMap: () => ({ message: "Veuillez sélectionner votre sexe" }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

export type PatientSignupValues = z.infer<typeof patientSignupSchema>;