"use client";

import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { PlusCircle, Image as ImageIcon } from "lucide-react";

export default function CreateServiceForm() {
  return (
    <div className="max-w-md mx-auto space-y-5 p-2 animate-in fade-in duration-500">
      {/* en-tête minimaliste */}
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-[#3E3E3E] tracking-tight">nouveau service</h2>
        <p className="text-[12px] text-[#6F6F6F]">configurez un nouveau soin ou une consultation.</p>
      </div>

      <div className="space-y-4">
        {/* nom du service */}
        <div className="grid gap-1.5">
          <Label htmlFor="name" className="text-[12px] text-[#3E3E3E] font-semibold">nom du service</Label>
          <Input
            id="name"
            placeholder="ex: blanchiment dentaire"
            className="h-9 rounded-lg border-[#86909C]/40 focus:ring-[#058D66] text-[13px]"
          />
        </div>

        {/* catégorie et prix sur la même ligne pour gagner de l'espace */}
        <div className="grid grid-cols-2 gap-3">
          <div className="grid gap-1.5">
            <Label className="text-[12px] text-[#3E3E3E] font-semibold">catégorie</Label>
            <Select>
              <SelectTrigger className="h-9 border-[#86909C]/40 text-[13px]">
                <SelectValue placeholder="choisir" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dentaire">dentaire</SelectItem>
                <SelectItem value="general">général</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="price" className="text-[12px] text-[#3E3E3E] font-semibold">prix (fcfa)</Label>
            <Input
              id="price"
              type="number"
              placeholder="0"
              className="h-9 border-[#86909C]/40 text-[13px]"
            />
          </div>
        </div>

        {/* durée du service */}
        <div className="grid gap-1.5">
          <Label className="text-[12px] text-[#3E3E3E] font-semibold">durée estimée</Label>
          <Select>
            <SelectTrigger className="h-9 border-[#86909C]/40 text-[13px]">
              <SelectValue placeholder="sélectionner la durée" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">30 minutes</SelectItem>
              <SelectItem value="60">1 heure</SelectItem>
              <SelectItem value="90">1 heure 30</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* description */}
        <div className="grid gap-1.5">
          <Label htmlFor="desc" className="text-[12px] text-[#3E3E3E] font-semibold">description</Label>
          <Textarea
            id="desc"
            placeholder="décrivez brièvement le service..."
            className="min-h-[80px] rounded-lg border-[#86909C]/40 text-[12px] resize-none"
          />
        </div>

        {/* zone d'upload minimaliste */}
        <div className="grid gap-1.5">
          <Label className="text-[12px] text-[#3E3E3E] font-semibold">icône ou image</Label>
          <div className="border-2 border-dashed border-[#86909C]/30 rounded-lg p-4 flex flex-col items-center justify-center bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer group">
            <ImageIcon className="w-6 h-6 text-[#6F6F6F] group-hover:text-[#058D66] mb-1" />
            <span className="text-[11px] text-[#6F6F6F]">cliquer pour ajouter un visuel</span>
          </div>
        </div>
      </div>

      {/* action bouton */}
      <div className="pt-2">
        <Button className="w-full h-10 bg-[#058D66] hover:opacity-90 text-white rounded-full font-medium text-[14px] flex gap-2">
          <PlusCircle className="w-4 h-4" />
          créer le service
        </Button>
      </div>
    </div>
  );
}