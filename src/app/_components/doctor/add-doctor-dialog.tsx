// src/components/doctors/add-doctor-dialog.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DoctorSchema, DoctorFormValues } from "@/schemas/doctor-schema";
import { specialties, departments } from "@/data/doctor-lists";
import {
    PlusCircle, Loader2, User, Mail, Phone, Link, // Nouvelles icônes de base
    Stethoscope, Building2, GraduationCap, Calendar,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarComponent } from "@/components/ui/calendar"; // Renommé pour éviter conflit
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";


interface AddDoctorDialogProps {
    onDoctorAdded?: (newDoctor: DoctorFormValues & { id: string }) => void;
}

// Fonction utilitaire pour encapsuler l'Input avec une icône
const IconInputWrapper = ({ children, Icon }: { children: React.ReactNode, Icon: React.ElementType }) => (
    <div className="relative flex items-center">
        {/* L'icône est positionnée de manière absolue dans le champ */}
        <Icon className="absolute left-3 h-4 w-4 text-gray-400" />
        {children}
    </div>
);


export function AddDoctorDialog({ onDoctorAdded }: AddDoctorDialogProps) {
    const form = useForm<DoctorFormValues>({
        resolver: zodResolver(DoctorSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            imageUrl: "",
            specialist: "",
            department: "",
            degree: "",
            // La date par défaut peut être "undefined" si on veut que l'utilisateur la choisisse
            joinDate: new Date(),
        },
    });

    const isLoading = form.formState.isSubmitting;

    async function onSubmit(values: DoctorFormValues) {
        console.log("Données envoyées pour l'ajout du docteur:", values);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            alert(`Docteur ${values.name} ajouté avec succès!`);
            form.reset();
            // NOTE: Pour fermer la fenêtre modale après le reset,
            // il faudrait gérer l'état d'ouverture du Dialog via un `useState` externe.
        } catch (error) {
            console.error("Erreur lors de l'ajout:", error);
            alert("Erreur lors de l'ajout du docteur.");
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700 text-white shadow-md">
                    <PlusCircle className="mr-2 h-4 w-4" /> Ajouter Docteur
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[850px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-gray-800">Ajouter un Nouveau Docteur</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                            {/* BLOC 1 : Informations de Base et Contact */}
                            <div className="space-y-4 p-4 border border-gray-100 rounded-lg shadow-sm">
                                <h3 className="font-semibold text-lg text-indigo-600 border-b pb-2">1. Informations Personnelles</h3>

                                {/* Nom Complet */}
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nom Complet</FormLabel>
                                            <FormControl>
                                                <IconInputWrapper Icon={User}>
                                                    {/* Ajout de la classe `pl-10` pour laisser de la place à l'icône */}
                                                    <Input placeholder="Esther Howard" {...field} className="pl-10" />
                                                </IconInputWrapper>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Email */}
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Adresse E-mail</FormLabel>
                                            <FormControl>
                                                <IconInputWrapper Icon={Mail}>
                                                    <Input placeholder="esther@example.com" type="email" {...field} className="pl-10" />
                                                </IconInputWrapper>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Téléphone */}
                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Téléphone</FormLabel>
                                            <FormControl>
                                                <IconInputWrapper Icon={Phone}>
                                                    <Input placeholder="725-274-9000" type="tel" {...field} className="pl-10" />
                                                </IconInputWrapper>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* URL Image */}
                                <FormField
                                    control={form.control}
                                    name="imageUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>URL de l'Image (Optionnel)</FormLabel>
                                            <FormControl>
                                                <IconInputWrapper Icon={Link}>
                                                    <Input placeholder="https://lien-vers-l-image" {...field} className="pl-10" />
                                                </IconInputWrapper>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* BLOC 2 : Informations Professionnelles */}
                            <div className="space-y-4 p-4 border border-gray-100 rounded-lg shadow-sm">
                                <h3 className="font-semibold text-lg text-indigo-600 border-b pb-2">2. Carrière & Spécialisation</h3>

                                {/* Spécialiste (Dropdown Select) */}
                                <FormField
                                    control={form.control}
                                    name="specialist"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Spécialiste</FormLabel>
                                            <div className="relative flex items-center">
                                                <Stethoscope className="absolute left-3 h-4 w-4 text-gray-400 pointer-events-none" />
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        {/* Ajout de la classe `pl-10` pour l'icône */}
                                                        <SelectTrigger className="pl-10">
                                                            <SelectValue placeholder="Sélectionner la spécialité" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {specialties.map((specialty) => (
                                                            <SelectItem key={specialty.value} value={specialty.value}>
                                                                {specialty.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Département (Dropdown Select) */}
                                <FormField
                                    control={form.control}
                                    name="department"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Département</FormLabel>
                                            <div className="relative flex items-center">
                                                <Building2 className="absolute left-3 h-4 w-4 text-gray-400 pointer-events-none" />
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="pl-10">
                                                            <SelectValue placeholder="Sélectionner le département" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {departments.map((dept) => (
                                                            <SelectItem key={dept.value} value={dept.value}>
                                                                {dept.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Diplôme (Degree) */}
                                <FormField
                                    control={form.control}
                                    name="degree"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Diplôme</FormLabel>
                                            <FormControl>
                                                <IconInputWrapper Icon={GraduationCap}>
                                                    <Input placeholder="MBBS, MS" {...field} className="pl-10" />
                                                </IconInputWrapper>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Date d'Adhésion (Calendar Popover) */}
                                <FormField
                                    control={form.control}
                                    name="joinDate"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Date d'Adhésion</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <div className="relative flex items-center">
                                                            <Calendar className="absolute left-3 h-4 w-4 text-gray-400 pointer-events-none" />
                                                            <Button
                                                                variant={"outline"}
                                                                className={cn(
                                                                    "w-full justify-start text-left font-normal pl-10",
                                                                    !field.value && "text-muted-foreground"
                                                                )}
                                                                disabled={isLoading}
                                                            >
                                                                {field.value ? (
                                                                    format(field.value, "PPP", { locale: fr })
                                                                ) : (
                                                                    <span>Choisir une date</span>
                                                                )}
                                                            </Button>
                                                        </div>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <CalendarComponent
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        disabled={(date) =>
                                                            date > new Date() || date < new Date("1900-01-01")
                                                        }
                                                        initialFocus
                                                        locale={fr}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                            </div>
                        </div>

                        <DialogFooter className="pt-4">
                            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700">
                                {isLoading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                )}
                                {isLoading ? "Ajout en cours..." : "Confirmer l'Ajout"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}