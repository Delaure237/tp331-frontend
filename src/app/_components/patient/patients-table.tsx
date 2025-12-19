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
import { deletePatientApi, createPatientApi } from "@/api/patient-api";
import { AddPatientModal } from "./add-patient-modal";
import { EditPatientSheet } from "./edit-patient-sheet";
import { PatientViewDialog } from "./patient-view-dialog"; // Import du nouveau composant
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Patient } from "@/schemas/patient-schema";

interface PatientsTableProps {
    data: PatientRowData[];
    pageCount: number;
    onAddPatientSuccess: () => void;
    onDeletePatientSuccess: () => void;
    onUpdatePatientSuccess: () => void;
}

export function PatientsTable({
    data,
    pageCount,
    onAddPatientSuccess,
    onDeletePatientSuccess,
    onUpdatePatientSuccess,
}: PatientsTableProps) {
    const queryClient = useQueryClient();
    const [rowAction, setRowAction] = React.useState<DataTableRowAction<PatientRowData> | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);

    const { mutate: addPatient, isPending: isAdding } = useMutation({
        mutationFn: (newPatient: Patient) => createPatientApi(newPatient),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["patients"], exact: false });
            toast.success("patient enregistré avec succès");
            setIsAddModalOpen(false);
            onAddPatientSuccess();
        },
        onError: (error: any) => {
            toast.error(error.message || "erreur lors de l'enregistrement");
        },
    });

    const columns = React.useMemo(() => getPatientsTableColumns({ setRowAction }), []);

    const { table, globalFilter, setGlobalFilterDebounced } = useDataTable<PatientRowData>({
        data: data || [],
        columns,
        pageCount,
        enableAdvancedFilter: false,
        initialState: { columnPinning: { right: ["actions"] } },
        getRowId: (row) => row.id,
        shallow: false,
        clearOnDefault: true,
    });

    const selectedItems = React.useMemo(
        () => table.getFilteredSelectedRowModel().rows?.map((r) => r.original) || [],
        [table]
    );

    async function deletePatients(items: PatientRowData[]) {
        try {
            await Promise.all(items.map((item) => deletePatientApi(item.id)));
            queryClient.invalidateQueries({ queryKey: ["patients"], exact: false });
            toast.success(`${items.length} patient(s) supprimé(s)`);
            table.toggleAllRowsSelected(false);
            onDeletePatientSuccess();
        } catch (error) {
            toast.error("Erreur lors de la suppression");
        }
    }

    return (
        <>
            <DataTable<PatientRowData>
                table={table}
                actionBar={
                    <div className="flex w-full flex-col gap-2">
                        <div className="flex w-full items-center justify-between">
                            <input
                                placeholder="rechercher par nom..."
                                value={(globalFilter as string) ?? ""}
                                onChange={(e) => setGlobalFilterDebounced(e.target.value)}
                                className="max-w-xs h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:ring-1 focus-visible:ring-[#058D66] outline-none"
                            />
                            <ItemsTableToolbarActions<PatientRowData>
                                table={table}
                                deleteAction={deletePatients}
                                onDeleteSuccess={() => {}}
                                onExport={() => {}}
                                exportFilename="patients"
                                onAdd={() => setIsAddModalOpen(true)}
                                addLabel="ajouter un patient"
                                showAddButton={true}
                                selectedItems={selectedItems}
                            />
                        </div>
                        <DataTableToolbar table={table} className="p-0" />
                    </div>
                }
            />

            {/* 1. Modal de Création */}
            <AddPatientModal
                isOpen={isAddModalOpen}
                isSubmitting={isAdding}
                onClose={() => setIsAddModalOpen(false)}
                onAddPatient={(data) => addPatient(data)}
            />

            {/* 2. Vue Détails Patient (Bento Grid) */}
            <PatientViewDialog
                open={rowAction?.variant === "view"}
                onOpenChange={(open) => !open && setRowAction(null)}
                patient={rowAction?.row.original ?? null}
            />

            {/* 3. Modification Patient */}
            <EditPatientSheet
                open={rowAction?.variant === "update"}
                onOpenChange={(open) => !open && setRowAction(null)}
                patient={rowAction?.row.original ?? null}
                onUpdateSuccess={onUpdatePatientSuccess}
            />

            {/* 4. Suppression Patient */}
            <DeleteItemsDialog
                open={rowAction?.variant === "delete"}
                onOpenChange={(open) => !open && setRowAction(null)}
                items={rowAction?.row.original ? [rowAction.row.original] : []}
                deleteAction={deletePatients}
                showTrigger={false}
                onSuccess={() => {
                    setRowAction(null);
                    onDeletePatientSuccess();
                }}
            />
        </>
    );
}