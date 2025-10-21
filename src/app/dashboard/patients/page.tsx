// app/dashboard/patients/page.tsx
import { Button } from "@/components/ui/button" 
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Search, PlusCircle } from "lucide-react"
import * as React from "react"



export default function PatientsPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">

      {/* 1. En-tête de la page */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Liste des Patients</h1>
        <Button size="sm" className="h-8 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Ajouter Patient
          </span>
        </Button>
      </div>

      <Separator />

      {/* 2. Barre de recherche et filtres */}
      <div className="flex items-center gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher par nom, ID ou tél..."
            className="w-full rounded-lg bg-background pl-8"
          />
        </div>
        {/* Vous pouvez ajouter des filtres ici (ex: un composant Select pour le statut) */}
        {/* <SelectFilter /> */}
      </div>

      {/* 3. Contenu principal : Tableau des Patients */}
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
        {/* Ici, vous inséreriez le composant qui affiche le tableau.
          Pour l'instant, c'est un simple placeholder.
        */}
        <div className="p-6 h-[70vh] flex items-center justify-center text-muted-foreground">
          {/* <PatientsTable /> */}
          Tableau des patients à implémenter ici.
        </div>
      </div>

    </div>
  )
}