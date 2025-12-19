"use client";

import React from "react";
import type { DataTableRowAction } from "@/types/data-table";
import { DataTable } from "@/components/data-table/data-table";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { DeleteItemsDialog } from "../delete-item-dialog";
import { ItemsTableToolbarActions } from "../items-table-toolbar-actions";
import { getDoctorsTableColumns, DoctorRowData } from "@/app/_components/doctor/doctor-table-columns";
import { toast } from "react-hot-toast";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { deleteDoctorApi, createDoctorApi } from "@/api/doctor-api";
import { Doctor } from "@/schemas/doctor.schema";
import { AddDoctorModal } from "./add-doctor-modal";
import { EditDoctorSheet } from "./edit-doctor-sheet";

interface DoctorsTableProps {
  data: DoctorRowData[];
  pageCount: number;
  onAddSuccess: () => void;
  onDeleteSuccess: () => void;
  onUpdateSuccess: () => void;
  // ✅ Ajout de la prop pour remonter la sélection au parent
  onDoctorSelect: (doctor: DoctorRowData) => void;
}

export function DoctorsTable({
  data,
  pageCount,
  onAddSuccess,
  onDeleteSuccess,
  onUpdateSuccess,
  onDoctorSelect, // ✅ Destructuration ici
}: DoctorsTableProps) {
  const queryClient = useQueryClient();
  const [rowAction, setRowAction] = React.useState<DataTableRowAction<DoctorRowData> | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);

  // ✅ Effet pour surveiller quand l'utilisateur clique sur "voir profil" (variant: "view")
  React.useEffect(() => {
    if (rowAction?.variant === "view" && rowAction.row.original) {
      onDoctorSelect(rowAction.row.original); // On envoie le docteur au parent
      setRowAction(null); // On reset l'action pour pouvoir recliquer plus tard
    }
  }, [rowAction, onDoctorSelect]);

  const { mutate: addDoctor, isPending: isAdding } = useMutation({
    mutationFn: (newDoctor: Doctor) => createDoctorApi(newDoctor),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"], exact: false });
      toast.success("docteur enregistré avec succès");
      setIsAddModalOpen(false);
      onAddSuccess();
    },
    onError: (error: any) => {
      toast.error(error.message || "erreur lors de l'enregistrement");
    },
  });

  const columns = React.useMemo(() => getDoctorsTableColumns({ setRowAction }), []);

  const { table, globalFilter, setGlobalFilterDebounced } = useDataTable<DoctorRowData>({
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

  async function deleteDoctors(items: DoctorRowData[]) {
    try {
      await Promise.all(items.map((item) => deleteDoctorApi(item.id)));
      queryClient.invalidateQueries({ queryKey: ["doctors"], exact: false });
      toast.success(`${items.length} docteur(s) supprimé(s)`);
      table.toggleAllRowsSelected(false);
      onDeleteSuccess();
    } catch (error) {
      toast.error("erreur lors de la suppression");
    }
  }

  return (
    <>
      <DataTable<DoctorRowData>
        table={table}
        actionBar={
          <div className="flex w-full flex-col gap-2">
            <div className="flex w-full items-center justify-between">
              <input
                placeholder="rechercher par nom ou spécialité..."
                value={(globalFilter as string) ?? ""}
                onChange={(e) => setGlobalFilterDebounced(e.target.value)}
                className="max-w-xs h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:ring-1 focus-visible:ring-[#058D66] outline-none lowercase"
              />
              <ItemsTableToolbarActions<DoctorRowData>
                table={table}
                deleteAction={deleteDoctors}
                onDeleteSuccess={() => {}}
                onExport={() => {}}
                exportFilename="docteurs"
                onAdd={() => setIsAddModalOpen(true)}
                addLabel="ajouter un docteur"
                showAddButton={true}
                selectedItems={selectedItems}
              />
            </div>
            <DataTableToolbar table={table} className="p-0" />
          </div>
        }
      />

      <AddDoctorModal
        isOpen={isAddModalOpen}
        isSubmitting={isAdding}
        onClose={() => setIsAddModalOpen(false)}
        onAddDoctor={(data) => addDoctor(data)}
      />

      <EditDoctorSheet
        open={rowAction?.variant === "update"}
        onOpenChange={(open) => !open && setRowAction(null)}
        doctor={rowAction?.row.original ?? null}
        onUpdateSuccess={onUpdateSuccess}
      />

      <DeleteItemsDialog
        open={rowAction?.variant === "delete"}
        onOpenChange={(open) => !open && setRowAction(null)}
        items={rowAction?.row.original ? [rowAction.row.original] : []}
        deleteAction={deleteDoctors}
        showTrigger={false}
        onSuccess={() => {
          setRowAction(null);
          onDeleteSuccess();
        }}
      />
    </>
  );
}