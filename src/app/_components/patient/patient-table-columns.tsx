"use client";

import * as React from "react";
import type { Patient as PatientType } from "@/schemas/patient-schema";
import type { ColumnDef } from "@tanstack/react-table";
import { Ellipsis, Pencil, Trash2, Eye, User } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableRowAction } from "@/types/data-table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

// On définit PatientRowData pour inclure les champs réels renvoyés par l'API (idNumber au lieu de healthCareNumber)
export type PatientRowData = any;

interface GetPatientsColumnsProps {
  setRowAction: React.Dispatch<
    React.SetStateAction<DataTableRowAction<PatientRowData> | null>
  >;
}

const labels = {
  selectall: "Tout sélectionner",
  selectRow: "Sélectionner la ligne",
  name: "Patient",
  healthNumber: "N° Santé",
  sex: "Sexe",
  phone: "Téléphone",
  actions: "Actions",
  view: "Voir détails",
  edit: "Modifier",
  delete: "Supprimer",
  openMenu: "Ouvrir le menu",
};

export function getPatientsTableColumns({
  setRowAction,
}: GetPatientsColumnsProps): ColumnDef<PatientRowData>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label={labels.selectall}
            className="cursor-pointer h-5 w-5 border-2 border-[#058D66] data-[state=checked]:bg-[#058D66] data-[state=checked]:text-white rounded-md"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label={labels.selectRow}
            className="cursor-pointer h-5 w-5 border-2 border-[#058D66] data-[state=checked]:bg-[#058D66] data-[state=checked]:text-white rounded-md"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
      size: 40,
    },
    {
      accessorFn: (row) => `${row.firstName} ${row.lastName}`, // Changé pour correspondre au backend
      id: "fullName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={labels.name} />
      ),
      cell: ({ row }) => {
        const first = row.original.firstName || "";
        const last = row.original.lastName || "";
        const initials = `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();

        return (
          <div className="flex items-center gap-3 py-1">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F1F5F9] border border-[#86909C]/20 shadow-sm">
              <span className="text-[12px] font-bold text-[#64748B] tracking-tighter">
                {initials || <User className="h-4 w-4" />}
              </span>
            </div>

            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-[#3E3E3E] capitalize truncate leading-none mb-1">
                {first} {last}
              </span>
              <span className="text-[11px] text-[#86909C] lowercase truncate">
                {row.original.email || "aucun email"}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "idNumber", // CORRECTION CRUCIALE : correspond au backend
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={labels.healthNumber} />
      ),
      cell: ({ row }) => (
        <div className="font-medium text-[#3E3E3E] tabular-nums tracking-tight">
          {row.original.idNumber || "—"}
        </div>
      ),
    },
    {
      accessorKey: "sex",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={labels.sex} />
      ),
      cell: ({ row }) => {
        const sex = row.original.sex;
        const displaySex = {
            'Male': 'masculin',
            'Female': 'féminin',
            'N/A': 'n/a'
        }[sex as 'Male' | 'Female' | 'N/A'] || 'n/a';

        return (
          <span className="text-[12px] text-[#3E3E3E] lowercase">
            {displaySex}
          </span>
        );
      },
    },
    {
      accessorKey: "phone",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={labels.phone} />
      ),
      cell: ({ row }) => (
        <div className="text-[12px] text-[#3E3E3E] tabular-nums italic">
          {row.original.phone || "-"}
        </div>
      ),
    },
    {
      id: "actions",
      size: 40,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex h-8 w-8 p-0 hover:bg-[#F1F5F9] text-[#86909C]"
            >
              <Ellipsis className="h-4 w-4" />
              <span className="sr-only">{labels.openMenu}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-white border-none shadow-2xl rounded-2xl p-1.5">
            <DropdownMenuItem
              className="flex items-center gap-2.5 px-3 py-2.5 cursor-pointer hover:bg-[#F1F5F9] rounded-xl text-[12px] text-[#3E3E3E] transition-colors"
              onSelect={() => setRowAction({ row, variant: "view" })}
            >
              <Eye className="h-4 w-4 text-blue-500" />
              {labels.view}
            </DropdownMenuItem>

            <DropdownMenuItem
              className="flex items-center gap-2.5 px-3 py-2.5 cursor-pointer hover:bg-[#F1F5F9] rounded-xl text-[12px] text-[#3E3E3E] transition-colors"
              onSelect={() => setRowAction({ row, variant: "update" })}
            >
              <Pencil className="h-4 w-4 text-[#058D66]" />
              {labels.edit}
            </DropdownMenuItem>

            <DropdownMenuSeparator className="my-1 bg-gray-100" />

            <DropdownMenuItem
              className="flex items-center gap-2.5 px-3 py-2.5 cursor-pointer hover:bg-red-50 text-red-600 rounded-xl text-[12px] transition-colors"
              onSelect={() => setRowAction({ row, variant: "delete" })}
            >
              <Trash2 className="h-4 w-4" />
              {labels.delete}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
}