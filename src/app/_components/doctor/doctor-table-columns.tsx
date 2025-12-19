"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
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

// Type aligné sur le backend (HospitalDoctor avec jointure User)
export type DoctorRowData = any;

interface GetDoctorColumnsProps {
  setRowAction: React.Dispatch<
    React.SetStateAction<DataTableRowAction<DoctorRowData> | null>
  >;
}

const labels = {
  selectAll: "tout sélectionner",
  selectRow: "sélectionner la ligne",
  doctor: "docteur",
  specialty: "spécialité",
  contact: "contact",
  joinDate: "adhésion",
  actions: "actions",
  view: "voir profil",
  edit: "modifier",
  delete: "supprimer",
  openMenu: "ouvrir le menu",
};

export function getDoctorsTableColumns({
  setRowAction,
}: GetDoctorColumnsProps): ColumnDef<DoctorRowData>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label={labels.selectAll}
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
      accessorFn: (row) => `${row.firstName} ${row.lastName}`,
      id: "fullName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={labels.doctor} />
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
                dr. {first} {last}
              </span>
              <span className="text-[11px] text-[#86909C] lowercase truncate">
                {row.original.contactEmail || row.original.email || "aucun email"}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "specialty",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={labels.specialty} />
      ),
      cell: ({ row }) => (
        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#058D66]/10 text-[#058D66] capitalize">
          {row.original.specialty || "généraliste"}
        </div>
      ),
    },
    {
      accessorKey: "contactPhone",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={labels.contact} />
      ),
      cell: ({ row }) => (
        <div className="text-[12px] text-[#3E3E3E] tabular-nums font-medium">
          {row.original.contactPhone || row.original.phone || "—"}
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={labels.joinDate} />
      ),
      cell: ({ row }) => (
        <div className="text-[12px] text-[#86909C] lowercase">
          {new Date(row.original.createdAt).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
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
          <DropdownMenuContent
            align="end"
            className="w-48 bg-white border-none shadow-2xl rounded-2xl p-1.5"
          >
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