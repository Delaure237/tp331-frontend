"use client";

import React from "react";
import type { DataTableRowAction } from "@/types/data-table";
import { DataTable } from "@/components/data-table/data-table";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { DeleteItemsDialog } from "../delete-item-dialog";
import { ItemsTableToolbarActions } from "../items-table-toolbar-actions";
import { getPatientsTableColumns, PatientRowData } from "@/app/_components/patient/patient-table-columns";
import { toast } from "react-hot-toast";
import { deletePatientsByIds, exportPatients } from "@/api/patients-api";
import { AddPatientModal } from "./add-patient-modal";
import { Button } from "@/components/ui/button"; // Importation nécessaire pour le bouton View
import { Eye } from "lucide-react"; // Importation de l'icône Eye pour le bouton View

interface PatientsTableProps {
    data: PatientRowData[];
    pageCount: number;
    onAddPatientSuccess: () => void;
    onDeletePatientSuccess: () => void;
}

export function PatientsTable({
    data,
    pageCount,
    onAddPatientSuccess,
    onDeletePatientSuccess,
}: PatientsTableProps) {
    const [rowAction, setRowAction] = React.useState<DataTableRowAction<PatientRowData> | null>(null);
    const [isAddPatientModalOpen, setIsAddPatientModalOpen] = React.useState(false);

    const columns = React.useMemo(
        () => getPatientsTableColumns({ setRowAction }),
        []
    );

    const safeData = data || [];

    const { table, globalFilter, setGlobalFilterDebounced } = useDataTable<PatientRowData>({
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

    const selectedItems = React.useMemo(
        () => table.getFilteredSelectedRowModel().rows?.map((r) => r.original) || [],
        [table]
    );

    async function deletePatients(items: PatientRowData[]) {
        try {
            const idsToDelete = items.map((item) => item.id);
            await deletePatientsByIds(idsToDelete);
            onDeletePatientSuccess();
        } catch (error) {
            console.error("Failed to delete patients:", error);
        }
    }

    function onDeleteSuccess() {
        toast.success("Patient(s) deleted successfully.");
        table.toggleAllRowsSelected(false);
        onDeletePatientSuccess();
    }

    function onExport(format: "pdf" | "csv") {
        try {
            exportPatients(format);
            toast.success(`Exportation vers ${format.toUpperCase()} initiée avec succès.`);
        } catch (error) {
            toast.error("Failed to initiate export.");
            console.error("Error exporting patients:", error);
        }
    }

    const onAdd = () => setIsAddPatientModalOpen(true);
    const handleModalClose = () => {
        setIsAddPatientModalOpen(false);
        onAddPatientSuccess();
    };

    // Nouvelle fonction: Gérer l'action de "View" (visualiser)
    const onSingleView = () => {
        if (selectedItems.length === 1) {
            const selectedRow = table.getRow(selectedItems[0].id);
            if (selectedRow) {
                setRowAction({ row: selectedRow, variant: "view" });
            }
        } else {
            toast.error("Veuillez sélectionner un seul patient à visualiser.");
        }
    };

    // Création du bouton View pour l'injection via additionalActions
    const viewButton = (
        <Button
            variant="outline"
            size="sm"
            aria-label="View selected patient"
            onClick={onSingleView}
            // Le bouton est actif uniquement si UN seul élément est sélectionné
            disabled={selectedItems.length !== 1}
            className="focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none"
        >
            <Eye className="mr-2 h-4 w-4" />
            View
        </Button>
    );

    return (
        <>
            <DataTable<PatientRowData>
                table={table}
                actionBar={
                    <div className="flex w-full flex-col gap-2">
                        <div className="flex w-full items-center justify-between">
                            {/* Recherche globale */}
                            <input
                                placeholder="Rechercher par nom..."
                                value={(globalFilter as string) ?? ""}
                                onChange={(event) => setGlobalFilterDebounced(event.target.value)}
                                className="max-w-xs h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            />

                            {/* Actions globales (Add, Delete, Export, View) */}
                            <ItemsTableToolbarActions<PatientRowData>
                                table={table}
                                deleteAction={deletePatients}
                                onDeleteSuccess={onDeleteSuccess}
                                onExport={onExport}
                                exportFilename="patients"
                                onAdd={onAdd}
                                addLabel="Add a patient"
                                showAddButton={true}
                                selectedItems={selectedItems}
                                // Injection du bouton View pour qu'il soit sur la même ligne
                                additionalActions={viewButton}
                            />
                        </div>

                        {/* Filtres simples */}
                        <DataTableToolbar table={table} className="p-0" />
                    </div>
                }
            />

            {/* Modale d'ajout de patient */}
            <AddPatientModal
                isOpen={isAddPatientModalOpen}
                onClose={handleModalClose}
            />

            {/* Dialogue de suppression d'une ligne spécifique */}
            <DeleteItemsDialog
                open={rowAction?.variant === "delete"}
                onOpenChange={(open) => {
                    if (!open) setRowAction(null);
                }}
                items={rowAction?.row.original ? [rowAction.row.original] : []}
                deleteAction={deletePatients}
                showTrigger={false}
                onSuccess={onDeleteSuccess}
            />

            {/* Si View est une modale/un tiroir, vous devrez le gérer ici via rowAction?.variant === "view" */}
            {/* Par exemple:
            <ViewPatientDrawer
                open={rowAction?.variant === "view"}
                onOpenChange={(open) => { if (!open) setRowAction(null); }}
                patient={rowAction?.row.original}
            />
            */}
        </>
    );
}