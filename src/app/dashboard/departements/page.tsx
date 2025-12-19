/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getHospitalServicesApi, deleteOperationApi } from "@/api/hospital-api";
import { useAuth } from "@/context/auth-context";
import { Input } from "@/components/ui/input";
import { Search, Edit3, Settings2, LayoutGrid, Loader2, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ServiceBuilder from '@/components/services/service-builder';
import { DeleteItemsDialog } from '@/app/_components/delete-item-dialog';
import { toast } from 'sonner';

export default function DepartementsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingService, setEditingService] = useState<any>(null);
  const [itemToDelete, setItemToDelete] = useState<any>(null);

  const { authState } = useAuth();
  const queryClient = useQueryClient();

  // Extraction de l'ID hospital (adapté à votre auth-context)
  const hospitalId = authState.user?.hospitalId || (authState.user as any)?.hospital?.id;

  const { data: services, isLoading: isLoadingServices } = useQuery({
    queryKey: ['hospital-services', hospitalId],
    queryFn: () => getHospitalServicesApi(hospitalId as string),
    enabled: !!hospitalId,
  });

  const filteredServices = services?.filter((s: any) =>
    (s.name || s.serviceName)?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fonction de suppression passée au DeleteItemsDialog
  async function handleDelete(items: any[]) {
    const operation = items[0]; // On gère un seul item à la fois ici
    await deleteOperationApi(operation.id);
  }

  return (
    <div className="min-h-screen bg-white p-6 space-y-8">

      {/* 1. Dialogue d'édition / Ajout d'actes à un service existant */}
      <Dialog open={!!editingService} onOpenChange={() => setEditingService(null)}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl bg-white">
          <DialogHeader className="bg-[#1A1C21] p-4 text-white">
            <DialogTitle className="text-sm font-bold uppercase tracking-widest text-white">
              Gérer : {editingService?.name || editingService?.serviceName}
            </DialogTitle>
          </DialogHeader>
          <div className="p-0">
            <ServiceBuilder
              initialData={editingService}
              onSuccess={() => {
                setEditingService(null);
                queryClient.invalidateQueries({ queryKey: ['hospital-services'] });
              }}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* 2. Dialogue de confirmation de suppression (Déclenché par le X) */}
      <DeleteItemsDialog
        open={!!itemToDelete}
        onOpenChange={(open) => !open && setItemToDelete(null)}
        items={itemToDelete ? [itemToDelete] : []}
        showTrigger={false}
        getItemLabel={(op) => op.name}
        deleteAction={handleDelete}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['hospital-services'] });
        }}
      />

      {/* En-tête de page */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1C21] flex items-center gap-2">
            <Settings2 className="w-6 h-6 text-[#058D66]" /> Gestion des Départements
          </h1>
          <p className="text-sm text-muted-foreground">Configurez vos services et actes médicaux.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-6">
          {/* Barre de recherche */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Rechercher un service..."
              className="pl-10 h-10 bg-slate-50/50 focus-visible:ring-[#058D66]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Liste des services */}
          <ScrollArea className="h-[calc(100vh-280px)]">
            <div className="grid grid-cols-1 gap-4 pr-4">
              {isLoadingServices ? (
                <div className="flex flex-col items-center py-20">
                  <Loader2 className="animate-spin text-[#058D66] w-8 h-8" />
                  <p className="text-sm text-slate-500 mt-2">Chargement du catalogue...</p>
                </div>
              ) : (
                filteredServices?.map((service: any) => (
                  <div key={service.id} className="p-5 rounded-xl border border-slate-100 bg-white shadow-sm border-l-4 border-l-[#058D66] hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#058D66]/10 rounded-lg text-[#058D66]">
                          <LayoutGrid className="w-4 h-4" />
                        </div>
                        <h3 className="font-bold text-slate-800 uppercase text-xs tracking-widest">
                          {service.serviceName || service.name}
                        </h3>
                      </div>
                      <Button
                        onClick={() => setEditingService(service)}
                        variant="ghost"
                        size="sm"
                        className="text-[#058D66] hover:bg-[#058D66]/10 border border-[#058D66]/20"
                      >
                        <Edit3 className="w-4 h-4 mr-2" /> Ajouter des actes
                      </Button>
                    </div>

                    {/* Affichage des actes (Operations) */}
                    <div className="flex flex-wrap gap-2">
                      {service.operations?.length > 0 ? (
                        service.operations.map((op: any) => (
                          <div
                            key={op.id}
                            className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 group hover:border-red-200 transition-colors"
                          >
                            <span className="text-[11px] font-medium text-slate-600">{op.name}</span>
                            <div className="w-[1px] h-3 bg-slate-300" />
                            <span className="text-[11px] font-bold text-[#058D66]">
                              {Number(op.price).toLocaleString()} FCFA
                            </span>
                            {/* Le fameux bouton X */}
                            <button
                              onClick={() => setItemToDelete(op)}
                              className="ml-1 text-slate-400 hover:text-red-600 transition-colors p-0.5 rounded-full hover:bg-red-50"
                              title="Supprimer cet acte"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="text-[11px] text-slate-400 italic">Aucun acte configuré pour ce service.</p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Panneau latéral : Création de nouveau service */}
        <div className="w-full lg:w-[400px]">
          <div className="sticky top-6 space-y-4">
            <div className="bg-[#1A1C21] text-white p-4 rounded-t-xl">
              <h2 className="text-[11px] font-bold uppercase tracking-widest">Nouveau Département</h2>
            </div>
            <div className="border border-slate-100 rounded-b-xl bg-white shadow-sm overflow-hidden">
               <ServiceBuilder />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}