/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFullServiceCatalogueApi } from "@/api/hospital-api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronsUpDown, Plus, X, Stethoscope, Activity, Loader2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const PREDEFINED_SERVICES = [
  { label: "Anesthésie-Réanimation", value: "Anesthésie-Réanimation" },
  { label: "Cardiologie", value: "Cardiologie" },
  { label: "Chirurgie Générale", value: "Chirurgie Générale" },
  { label: "Dermatologie", value: "Dermatologie" },
  { label: "Gastro-entérologie", value: "Gastro-entérologie" },
  { label: "Gynécologie-Obstétrique", value: "Gynécologie-Obstétrique" },
  { label: "Hématologie", value: "Hématologie" },
  { label: "Infectiologie", value: "Infectiologie" },
  { label: "Médecine Interne", value: "Médecine Interne" },
  { label: "Néphrologie", value: "Néphrologie" },
  { label: "Neurologie", value: "Neurologie" },
  { label: "Odontologie / Stomatologie", value: "Odontologie / Stomatologie" },
  { label: "Oncologie", value: "Oncologie" },
  { label: "Ophtalmologie", value: "Ophtalmologie" },
  { label: "ORL", value: "ORL" },
  { label: "Orthopédie", value: "Orthopédie" },
  { label: "Pédiatrie", value: "Pédiatrie" },
  { label: "Pneumologie", value: "Pneumologie" },
  { label: "Psychiatrie", value: "Psychiatrie" },
  { label: "Radiologie / Imagerie", value: "Radiologie / Imagerie" },
  { label: "Rhumatologie", value: "Rhumatologie" },
  { label: "Urgences", value: "Urgences" },
  { label: "Urologie", value: "Urologie" },
];

interface OpItem {
  name: string;
  price: number;
}

interface ServiceBuilderProps {
  initialData?: { name?: string; serviceName?: string; operations?: OpItem[] } | null;
  onSuccess?: () => void;
}

export default function ServiceBuilder({ initialData, onSuccess }: ServiceBuilderProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [serviceName, setServiceName] = useState("");
  const [operations, setOperations] = useState<OpItem[]>([]);
  const [newOpName, setNewOpName] = useState("");
  const [newOpPrice, setNewOpPrice] = useState("");

  // Synchronisation avec les données initiales (Mode Edition/Ajout)
  useEffect(() => {
    if (initialData) {
      setServiceName(initialData.serviceName || initialData.name || "");
      // Pragmatique : on vide la liste temporaire locale pour n'envoyer que les NOUVEAUX actes à ajouter
      setOperations([]);
    } else {
      setServiceName("");
      setOperations([]);
    }
  }, [initialData]);

  const mutation = useMutation({
    mutationFn: (data: { name: string, operations: OpItem[] }) => createFullServiceCatalogueApi(data),
    onSuccess: () => {
      toast.success(initialData ? "Nouveaux actes ajoutés !" : "Service créé avec succès !");

      // Reset si c'est une création pure, sinon on ferme via onSuccess
      if (!initialData) {
        setServiceName("");
        setOperations([]);
      }

      queryClient.invalidateQueries({ queryKey: ['hospital-services'] });
      if (onSuccess) onSuccess();
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour du catalogue.");
    }
  });

  const addOperationToQueue = () => {
    if (!newOpName.trim() || !newOpPrice) {
      toast.error("Veuillez renseigner le nom et le prix de l'acte.");
      return;
    }

    // Vérifier si l'acte n'est pas déjà dans la liste temporaire
    if (operations.some(op => op.name.toLowerCase() === newOpName.toLowerCase())) {
        toast.error("Cet acte est déjà dans votre liste d'ajout.");
        return;
    }

    setOperations([...operations, { name: newOpName.trim(), price: Number(newOpPrice) }]);
    setNewOpName("");
    setNewOpPrice("");
  };

  const removeOperationFromQueue = (index: number) => {
    setOperations(operations.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!serviceName) {
      toast.error("Veuillez sélectionner un département.");
      return;
    }
    if (operations.length === 0) {
      toast.error("Ajoutez au moins un acte médical.");
      return;
    }
    mutation.mutate({ name: serviceName, operations });
  };

  return (
    <div className="space-y-6 p-5 bg-white rounded-xl">
      {/* SECTION 1: SELECTION DU SERVICE */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-[#058D66]">
          <Stethoscope className="w-4 h-4" />
          <Label className="text-[11px] font-bold uppercase tracking-wider">Département / Service</Label>
        </div>

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild disabled={!!initialData}>
            <Button
              variant="outline"
              role="combobox"
              className={cn(
                "w-full justify-between font-normal border-slate-200 h-11",
                !!initialData && "bg-slate-50 opacity-100 cursor-not-allowed"
              )}
            >
              {serviceName || "Sélectionner un service..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[350px] p-0 bg-white shadow-xl border-slate-200">
            <Command>
              <CommandInput placeholder="Rechercher un service..." className="h-10" />
              <CommandList>
                <CommandEmpty>Aucun service trouvé.</CommandEmpty>
                <CommandGroup>
                  {PREDEFINED_SERVICES.map((s) => (
                    <CommandItem
                      key={s.value}
                      value={s.value}
                      onSelect={(val) => {
                        setServiceName(val);
                        setOpen(false);
                      }}
                      className="cursor-pointer"
                    >
                      <Check className={cn("mr-2 h-4 w-4", serviceName === s.value ? "opacity-100" : "opacity-0")} />
                      {s.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {initialData && <p className="text-[10px] text-slate-400">Le nom du service ne peut pas être modifié en mode ajout.</p>}
      </div>

      {/* SECTION 2: AJOUT D'ACTES */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-2 text-[#058D66]">
          <Activity className="w-4 h-4" />
          <Label className="text-[11px] font-bold uppercase tracking-wider">Nouveaux Actes & Tarifs</Label>
        </div>

        <div className="grid gap-2">
          <Input
            value={newOpName}
            onChange={(e) => setNewOpName(e.target.value)}
            placeholder="Nom de l'acte (ex: IRM du genou)"
            className="h-10 text-[13px] bg-slate-50 border-slate-200"
          />
          <div className="flex gap-2">
            <Input
              type="number"
              value={newOpPrice}
              onChange={(e) => setNewOpPrice(e.target.value)}
              placeholder="Prix (FCFA)"
              className="h-10 text-[13px] bg-slate-50 border-slate-200"
            />
            <Button
                onClick={addOperationToQueue}
                type="button"
                size="icon"
                className="h-10 w-10 bg-[#1A1C21] hover:bg-black shrink-0"
            >
              <Plus className="w-4 h-4 text-white" />
            </Button>
          </div>
        </div>

        {/* LISTE TEMPORAIRE DES ACTES À ENREGISTRER */}
        <div className="flex flex-wrap gap-2 mt-4 min-h-[40px]">
          {operations.length === 0 && <p className="text-[12px] text-slate-400 italic">Aucun acte ajouté à la liste...</p>}
          {operations.map((op, i) => (
            <Badge
              key={i}
              variant="secondary"
              className="pl-3 pr-1 py-1.5 gap-2 bg-[#058D66]/5 border-none text-[#058D66] rounded-lg"
            >
              <span className="text-[11px] font-bold">{op.name} • {Number(op.price).toLocaleString()} FCFA</span>
              <button
                onClick={() => removeOperationFromQueue(i)}
                className="hover:bg-[#058D66]/10 p-0.5 rounded-full transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* BOUTON DE SOUMISSION */}
      <Button
        onClick={handleSubmit}
        disabled={mutation.isPending || !serviceName || operations.length === 0}
        className="w-full h-12 bg-[#058D66] hover:bg-[#047a57] text-white font-bold text-[13px] rounded-xl mt-4 shadow-lg shadow-[#058D66]/20 transition-all"
      >
        {mutation.isPending ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          initialData ? "CONFIRMER L'AJOUT D'ACTES" : "ENREGISTRER LE SERVICE"
        )}
      </Button>
    </div>
  );
}