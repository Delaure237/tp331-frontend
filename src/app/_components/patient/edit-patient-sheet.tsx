"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { toast } from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { updatePatientApi } from "@/api/patient-api";
import { UpdatePatientSchema, type UpdatePatient } from "@/schemas/patient-schema";

interface EditPatientSheetProps extends React.ComponentPropsWithRef<typeof Sheet> {
  patient: any | null;
  onUpdateSuccess?: () => void; // Ajouté pour le rafraîchissement UI
}

export function EditPatientSheet({ patient, onUpdateSuccess, ...props }: EditPatientSheetProps) {
  const queryClient = useQueryClient();

  const form = useForm<UpdatePatient>({
    resolver: zodResolver(UpdatePatientSchema),
    defaultValues: {
      id: "",
      patientFirstName: "",
      patientLastName: "",
      healthCareNumber: "",
      email: "",
      phone: "",
      address: "",
      sex: "Male",
    } as any,
  });

  React.useEffect(() => {
    if (patient) {
      form.reset({
        id: patient.patientId || patient.id,
        patientFirstName: patient.firstName || "",
        patientLastName: patient.lastName || "",
        healthCareNumber: patient.idNumber || "",
        email: patient.email || "",
        phone: patient.phone || "",
        address: patient.address || "",
        sex: patient.sex || "Male",
      });
    }
  }, [patient, form]);

  const { mutate, isPending } = useMutation({
    mutationFn: (data: UpdatePatient) => {
      const actualId = data.id || patient?.patientId || patient?.id;
      if (!actualId) throw new Error("Identifiant du patient manquant");

      const payload = {
        patientFirstName: data.patientFirstName,
        patientLastName: data.patientLastName,
        healthCareNumber: data.healthCareNumber,
        sex: data.sex,
        phone: data.phone,
        email: data.email,
        address: data.address
      };

      return updatePatientApi(actualId, payload);
    },
    onSuccess: async () => {
      // 1. Invalidation "fuzzy" pour toucher toutes les requêtes patients
      await queryClient.invalidateQueries({ queryKey: ["patients"], exact: false });

      toast.success("Informations mises à jour.");

      // 2. Déclencher le refresh du parent
      onUpdateSuccess?.();

      // 3. Fermer le volet
      props.onOpenChange?.(false);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || "Échec de la mise à jour.";
      toast.error(message);
    },
  });

  return (
    <Sheet {...props}>
      <SheetContent className="flex flex-col gap-6 sm:max-w-md bg-white p-6 overflow-y-auto border-none">
        <SheetHeader className="text-left">
          <SheetTitle className="lowercase text-xl font-bold">modifier le patient</SheetTitle>
          <SheetDescription className="text-[12px]">
            Modification du profil de {patient?.firstName} {patient?.lastName}.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => mutate(data))} className="space-y-4">
            <input type="hidden" {...form.register("id")} />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="patientFirstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[11px] font-bold lowercase">prénom</FormLabel>
                    <FormControl><Input className="text-[12px] bg-slate-50 border-none rounded-xl" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="patientLastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[11px] font-bold lowercase">nom</FormLabel>
                    <FormControl><Input className="text-[12px] bg-slate-50 border-none rounded-xl" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="healthCareNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[11px] font-bold lowercase">n° santé / id</FormLabel>
                  <FormControl><Input className="text-[12px] bg-slate-50 border-none rounded-xl" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[11px] font-bold lowercase">téléphone</FormLabel>
                    <FormControl><Input className="text-[12px] bg-slate-50 border-none rounded-xl" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sex"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[11px] font-bold lowercase">sexe</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="text-[12px] bg-slate-50 border-none rounded-xl">
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white border-none shadow-xl rounded-xl">
                        <SelectItem value="Male">masculin</SelectItem>
                        <SelectItem value="Female">féminin</SelectItem>
                        <SelectItem value="N/A">n/a</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[11px] font-bold lowercase">email</FormLabel>
                  <FormControl><Input className="text-[12px] bg-slate-50 border-none rounded-xl" type="email" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[11px] font-bold lowercase">adresse</FormLabel>
                  <FormControl><Input className="text-[12px] bg-slate-50 border-none rounded-xl" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SheetFooter className="pt-6 gap-2">
              <SheetClose asChild>
                <Button type="button" variant="ghost" className="flex-1 rounded-full text-[12px] lowercase hover:bg-slate-100">
                  annuler
                </Button>
              </SheetClose>
              <Button
                type="submit"
                disabled={isPending}
                className="flex-1 bg-[#058D66] hover:bg-[#047a58] rounded-full text-[12px] lowercase text-white shadow-lg shadow-[#058D66]/20"
              >
                {isPending && <Loader className="mr-2 size-4 animate-spin" />}
                enregistrer
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}