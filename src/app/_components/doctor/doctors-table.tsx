// src/components/doctors/doctors-table.tsx
"use client";

import React from "react";
import type { DataTableRowAction } from "@/types/data-table";
import { DataTable } from "@/components/data-table/data-table";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { ItemsTableToolbarActions } from "../items-table-toolbar-actions";
import { getDoctorsTableColumns, DoctorRowData } from "@/app/_components/doctor/doctor-table-columns";
import { toast } from "react-hot-toast";

// --- Mock Data & API Calls (À remplacer par votre backend réel) ---
const MOCK_DATA: DoctorRowData[] = [
    { id: "1", name: "Esther Howard", department: "Urology", specialist: "Prostate", degree: "MBBS, MS", email: "esther@example.com", phone: "925-274 9000", joinDate: new Date('2018-06-01'), imageUrl: "/images/esther.jpg" },
    { id: "2", name: "Jenny Wilson", department: "Dental", specialist: "Dentist", degree: "BHMS, MS", email: "jenny@example.com", phone: "928-274 9012", joinDate: new Date('2019-03-11'), imageUrl: "/images/jenny.jpg" },
    // ... autres données simulées ...
];

async function deleteDoctorsByIds(ids: string[]): Promise<void> {
    console.log("Deleting doctors:", ids);
    // Simuler l'appel API
    await new Promise(resolve => setTimeout(resolve, 500));
}

function exportDoctors(format: "pdf" | "csv") {
    console.log("Exporting doctors in", format);
}
// ------------------------------------------------------------------

interface DoctorsTableProps {
    data: DoctorRowData[];
    pageCount: number;
    onDoctorSelect: (doctor: DoctorRowData) => void;
}

export function DoctorsTable({ data, pageCount, onDoctorSelect }: DoctorsTableProps) {
    // Définir une action de ligne, principalement pour 'view' ou 'delete'
    const [rowAction, setRowAction] = React.useState<DataTableRowAction<DoctorRowData> | null>(null);

    const columns = React.useMemo(
        () => getDoctorsTableColumns({ setRowAction }),
        []
    );

    const safeData = data || MOCK_DATA; // Utiliser Mock Data si data est vide

    const { table, globalFilter, setGlobalFilterDebounced } = useDataTable<DoctorRowData>({
        data: safeData,
        columns,
        pageCount,
        enableAdvancedFilter: false,
        initialState: {
            columnPinning: { right: ["actions"] },
        },
        getRowId: (originalRow) => originalRow.id,
        shallow: false,
        clearOnDefault: true,
    });

    // Écoute des actions de ligne (pour la navigation vers le profil)
    React.useEffect(() => {
        if (rowAction && rowAction.variant === "view") {
            onDoctorSelect(rowAction.row.original);
            setRowAction(null); // Réinitialiser l'action
        }
        // Gérer delete si nécessaire ici...
    }, [rowAction, onDoctorSelect]);

    const selectedItems = React.useMemo(
        () => table.getFilteredSelectedRowModel().rows?.map((r) => r.original) || [],
        [table]
    );

    async function deleteDoctors(items: DoctorRowData[]) {
        try {
            const idsToDelete = items.map((item) => item.id);
            await deleteDoctorsByIds(idsToDelete);
            toast.success("Doctor(s) deleted successfully.");
            table.toggleAllRowsSelected(false);
            // Recharger les données si nécessaire
        } catch (error) {
            toast.error("Failed to delete doctor(s).");
            console.error("Failed to delete doctors:", error);
        }
    }

    function onExport(format: "pdf" | "csv") {
        try {
            exportDoctors(format);
            toast.success(`Exportation vers ${format.toUpperCase()} initiée avec succès.`);
        } catch (error) {
            toast.error("Failed to initiate export.");
            console.error("Error exporting doctors:", error);
        }
    }

    // --- À faire : Ajouter une modale AddDoctor ici ---
    const onAdd = () => toast.success("Ouvrir la modale d'ajout de docteur...");
    // ----------------------------------------------------

    return (
        <DataTable<DoctorRowData>
            table={table}
            actionBar={
                <div className="flex w-full flex-col gap-2 p-4">
                    <div className="flex w-full items-center justify-between">
                        {/* Recherche globale */}
                        <input
                            placeholder="Rechercher par nom..."
                            value={(globalFilter as string) ?? ""}
                            onChange={(event) => setGlobalFilterDebounced(event.target.value)}
                            className="max-w-xs h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        />

                        {/* Actions globales (Add, Delete, Export) */}
                        <ItemsTableToolbarActions<DoctorRowData>
                            table={table}
                            deleteAction={deleteDoctors}
                            // onDeleteSuccess={onDeleteSuccess} // La suppression est gérée dans deleteDoctors pour la démo
                            onExport={onExport}
                            exportFilename="doctors"
                            onAdd={onAdd}
                            addLabel="Add Doctor"
                            showAddButton={true}
                            selectedItems={selectedItems}
                            // additionalActions peut être utilisé ici si d'autres boutons sont nécessaires
                        />
                    </div>

                    {/* Filtres simples */}
                    <DataTableToolbar table={table} className="p-0" />
                </div>
            }
        />
    );
}