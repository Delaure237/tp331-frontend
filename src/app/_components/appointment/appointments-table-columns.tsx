"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableRowAction } from "@/types/data-table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

/* ---------------------------------------------
   Types et interface pour Appointment
--------------------------------------------- */
export interface AppointmentRowData {
  id: string; // appointmentId
  patientName: string;
  type: string;
  dateTime: Date;
  status: "Confirmed" | "Pending" | "Canceled" | "Late";
}

interface GetAppointmentsColumnsProps {
  setRowAction: React.Dispatch<React.SetStateAction<DataTableRowAction<AppointmentRowData> | null>>;
}

/* ---------------------------------------------
   Labels FR
--------------------------------------------- */
const labels = {
  selectall: "Tout sélectionner",
  selectRow: "Sélectionner la ligne",
  appointmentId: "ID Rendez-vous",
  patientName: "Nom du Patient",
  type: "Type",
  dateTime: "Date & Heure",
  status: "Statut",
  actions: "Actions",
  view: "Voir",
  edit: "Modifier",
  delete: "Supprimer",
  openMenu: "Ouvrir le menu",
};

/* ---------------------------------------------
   Fonction de génération des colonnes
--------------------------------------------- */
export function getAppointmentsTableColumns({ setRowAction }: GetAppointmentsColumnsProps): ColumnDef<AppointmentRowData>[] {
  return [
    {
      accessorKey: "id",
      id: "appointmentId",
      header: ({ column }) => <DataTableColumnHeader column={column} title={labels.appointmentId} />,
      cell: ({ row }) => <div className="font-normal">{row.original.id}</div>,
    },
    {
      accessorKey: "patientName",
      id: "patientName",
      header: ({ column }) => <DataTableColumnHeader column={column} title={labels.patientName} />,
      cell: ({ row }) => <div className="font-normal">{row.original.patientName}</div>,
    },
    {
      accessorKey: "type",
      id: "type",
      header: ({ column }) => <DataTableColumnHeader column={column} title={labels.type} />,
      cell: ({ row }) => <div className="font-normal">{row.original.type}</div>,
    },
    {
      accessorKey: "dateTime",
      id: "dateTime",
      header: ({ column }) => <DataTableColumnHeader column={column} title={labels.dateTime} />,
      cell: ({ row }) => (
        <div className="font-normal">
          {row.original.dateTime ? new Date(row.original.dateTime).toLocaleString() : "-"}
        </div>
      ),
    },
    {
      accessorKey: "status",
      id: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title={labels.status} />,
      cell: ({ row }) => {
        const statusColor = {
          Confirmed: "bg-green-100 text-green-700",
          Pending: "bg-yellow-100 text-yellow-700",
          Canceled: "bg-red-100 text-red-700",
          Late: "bg-orange-100 text-orange-700",
        }[row.original.status] || "bg-gray-100 text-gray-700";

        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
            {row.original.status}
          </span>
        );
      },
    },
    {
      id: "actions",
      size: 40,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-label={labels.openMenu} variant="ghost" className="flex h-8 w-8 p-0">
              {/* Tu peux mettre une icône de menu */}
              <Pencil className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onSelect={() => setRowAction({ row, variant: "view" })}>
              <Eye className="mr-2 h-4 w-4" /> {labels.view}
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setRowAction({ row, variant: "update" })}>
              <Pencil className="mr-2 h-4 w-4" /> {labels.edit}
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setRowAction({ row, variant: "delete" })}>
              <Trash2 className="mr-2 h-4 w-4" /> {labels.delete}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
}
