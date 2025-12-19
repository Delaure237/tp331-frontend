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

import { updateDoctorApi } from "@/api/doctor-api";
import { UpdateDoctorSchema, type UpdateDoctor } from "@/schemas/doctor-schema";

interface EditDoctorSheetProps extends React.ComponentPropsWithRef<typeof Sheet> {
  doctor: any | null;
  onUpdateSuccess?: () => void;
}

export function EditDoctorSheet({ doctor, onUpdateSuccess, ...props }: EditDoctorSheetProps) {
  const queryClient = useQueryClient();

  const form = useForm<UpdateDoctor>({
    resolver: zodResolver(UpdateDoctorSchema),
    defaultValues: {
      id: "",
      firstName: "",
      lastName: "",
      specialty: "",
      email: "",
      phone: "",
    } as any,
  });

  // Synchronisation des données quand le docteur sélectionné change
  React.useEffect(() => {
    if (doctor) {
      form.reset({
        id: doctor.id || "",
        firstName: doctor.firstName || "",
        lastName: doctor.lastName || "",
        specialty: doctor.specialty || "",
        email: doctor.contactEmail || doctor.email || "",
        phone: doctor.contactPhone || doctor.phone || "",
      });
    }
  }, [doctor, form]);

  const { mutate, isPending } = useMutation({
    mutationFn: (data: UpdateDoctor) => {
      const actualId = data.id || doctor?.id;
      if (!actualId) throw new Error("Identifiant du docteur manquant");

      // Payload épuré pour le backend
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        specialty: data.specialty,
        phone: data.phone,
        email: data.email,
      };

      return updateDoctorApi(actualId, payload);
    },
    onSuccess: async () => {
      // Invalidation du cache pour rafraîchir la liste des docteurs
      await queryClient.invalidateQueries({ queryKey: ["doctors"], exact: false });

      toast.success("profil du docteur mis à jour.");

      onUpdateSuccess?.();
      props.onOpenChange?.(false);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || "échec de la mise à jour.";
      toast.error(message);
    },
  });

  return (
    <Sheet {...props}>
      <SheetContent className="flex flex-col gap-6 sm:max-w-md bg-white p-6 overflow-y-auto border-none">
        <SheetHeader className="text-left">
          <SheetTitle className="lowercase text-xl font-bold text-[#3E3E3E]">modifier le docteur</SheetTitle>
          <SheetDescription className="text-[12px] text-[#6F6F6F]">
            modification du profil du dr. {doctor?.firstName} {doctor?.lastName}.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => mutate(data))} className="space-y-4">
            <input type="hidden" {...form.register("id")} />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[11px] font-bold lowercase text-[#3E3E3E]">prénom</FormLabel>
                    <FormControl>
                      <Input className="text-[12px] bg-slate-50 border-none rounded-xl h-10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[11px] font-bold lowercase text-[#3E3E3E]">nom</FormLabel>
                    <FormControl>
                      <Input className="text-[12px] bg-slate-50 border-none rounded-xl h-10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="specialty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[11px] font-bold lowercase text-[#3E3E3E]">spécialité</FormLabel>
                  <FormControl>
                    <Input className="text-[12px] bg-slate-50 border-none rounded-xl h-10" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[11px] font-bold lowercase text-[#3E3E3E]">téléphone</FormLabel>
                    <FormControl>
                      <Input className="text-[12px] bg-slate-50 border-none rounded-xl h-10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[11px] font-bold lowercase text-[#3E3E3E]">email professionnel</FormLabel>
                    <FormControl>
                      <Input className="text-[12px] bg-slate-50 border-none rounded-xl h-10" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-8 flex flex-col gap-3 pt-6 border-t border-slate-100">
              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-[#058D66] hover:bg-[#047a58] rounded-full text-[12px] lowercase text-white h-11 shadow-lg shadow-[#058D66]/20 transition-all"
              >
                {isPending && <Loader className="mr-2 size-4 animate-spin" />}
                enregistrer les modifications
              </Button>
              <SheetClose asChild>
                <Button type="button" variant="ghost" className="w-full rounded-full text-[12px] lowercase text-[#6F6F6F]">
                  annuler
                </Button>
              </SheetClose>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}