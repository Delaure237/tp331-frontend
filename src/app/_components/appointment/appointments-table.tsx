"use client";

import React, { useState, useEffect } from "react";
import type { DataTableRowAction } from "@/types/data-table";
import { DataTable } from "@/components/data-table/data-table";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { DeleteItemsDialog } from "../delete-item-dialog";
import { ItemsTableToolbarActions } from "../items-table-toolbar-actions";
import { getAppointmentsTableColumns, AppointmentRowData } from "@/app/_components/appointment/appointments-table-columns";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";

/* ---------------------------------------------
   Mock API Actions (à remplacer par vrai backend)
--------------------------------------------- */
async function deleteAppointmentsByIds(ids: string[]) {
  // Simule suppression
  return new Promise<void>((resolve) => setTimeout(resolve, 300));
}

async function exportAppointments(format: "pdf" | "csv") {
  console.log(`Export ${format} lancé`);
  return new Promise<void>((resolve) => setTimeout(resolve, 300));
}

/* ---------------------------------------------
   Modal d'ajout fictif (mock)
--------------------------------------------- */
function AddAppointmentModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-md">
        <h2 className="text-lg font-semibold mb-4">Ajouter un rendez-vous (mock)</h2>
        <Button onClick={onClose}>Fermer</Button>
      </div>
    </div>
  );
}

/* ---------------------------------------------
   Composant principal
--------------------------------------------- */
interface AppointmentsTableProps {
  data: AppointmentRowData[];
  pageCount: number;
  onAddAppointmentSuccess?: () => void;
  onDeleteAppointmentSuccess?: () => void;
}

export function AppointmentsTable({
  data,
  pageCount,
  onAddAppointmentSuccess,
  onDeleteAppointmentSuccess,
}: AppointmentsTableProps) {
  const [rowAction, setRowAction] = useState<DataTableRowAction<AppointmentRowData> | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const columns = React.useMemo(
    () => getAppointmentsTableColumns({ setRowAction }),
    []
  );

  const safeData = data || [];

  const { table, globalFilter, setGlobalFilterDebounced } = useDataTable<AppointmentRowData>({
    data: safeData,
    columns,
    pageCount,
    enableAdvancedFilter: false,
    initialState: {
      columnPinning: { right: ["actions"] },
    },
    getRowId: (row) => row.id,
    shallow: false,
    clearOnDefault: true,
  });

  const selectedItems = React.useMemo(
    () => table.getFilteredSelectedRowModel().rows?.map((r) => r.original) || [],
    [table]
  );

  /* ---------------------------------------------
     Actions globales
  --------------------------------------------- */
  async function deleteSelectedAppointments(items: AppointmentRowData[]) {
    try {
      const ids = items.map((i) => i.id);
      await deleteAppointmentsByIds(ids);
      onDeleteAppointmentSuccess?.();
      toast.success("Rendez-vous supprimés avec succès.");
      table.toggleAllRowsSelected(false);
    } catch (err) {
      console.error(err);
      toast.error("Échec de la suppression.");
    }
  }

  function onExport(format: "pdf" | "csv") {
    exportAppointments(format)
      .then(() => toast.success(`Export vers ${format.toUpperCase()} lancé`))
      .catch(() => toast.error("Échec de l'export"));
  }

  const onAdd = () => setIsAddModalOpen(true);
  const handleModalClose = () => {
    setIsAddModalOpen(false);
    onAddAppointmentSuccess?.();
  };

  return (
    <>
      <DataTable<AppointmentRowData>
        table={table}
        actionBar={
          <div className="flex w-full flex-col gap-2">
            <div className="flex w-full items-center justify-between">
              {/* Recherche globale */}
              <input
                placeholder="Rechercher par patient..."
                value={(globalFilter as string) ?? ""}
                onChange={(e) => setGlobalFilterDebounced(e.target.value)}
                className="max-w-xs h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />

              {/* Actions globales */}
              <ItemsTableToolbarActions<AppointmentRowData>
                table={table}
                deleteAction={deleteSelectedAppointments}
                onDeleteSuccess={() => {}}
                onExport={onExport}
                exportFilename="appointments"
                onAdd={onAdd}
                addLabel="Ajouter un rendez-vous"
                showAddButton={true}
                selectedItems={selectedItems}
              />
            </div>

            {/* Filtres simples */}
            <DataTableToolbar table={table} className="p-0" />
          </div>
        }
      />

      {/* Modal d'ajout */}
      <AddAppointmentModal isOpen={isAddModalOpen} onClose={handleModalClose} />

      {/* Dialogue suppression ligne */}
      <DeleteItemsDialog
        open={rowAction?.variant === "delete"}
        onOpenChange={(open) => {
          if (!open) setRowAction(null);
        }}
        items={rowAction?.row.original ? [rowAction.row.original] : []}
        deleteAction={deleteSelectedAppointments}
        showTrigger={false}
        onSuccess={() => {
          toast.success("Rendez-vous supprimé avec succès");
          table.toggleAllRowsSelected(false);
          onDeleteAppointmentSuccess?.();
        }}
      />
    </>
  );
}
