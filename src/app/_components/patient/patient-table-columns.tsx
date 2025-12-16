// src/app/_components/patient-table-columns.tsx
"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil, Trash2, Ellipsis } from "lucide-react";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableRowAction } from "@/types/data-table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export interface PatientRowData {
  id: string;
  name: string;
  imageUrl?: string;
  lastVisit: Date;
  nextVisit: Date;
  recentDoctor?: string;
  recentTopic?: string;
}

interface GetPatientsColumnsProps {
  setRowAction: React.Dispatch<React.SetStateAction<DataTableRowAction<PatientRowData> | null>>;
}

const labels = {
  selectall: "Select all",
  selectRow: "Select row",
  image: "Image",
  name: "Name",
  lastVisit: "Last Visit",
  nextVisit: "Next Visit",
  recentDoctor: "Recent Doctor",
  recentTopic: "Recent Topic",
  actions: "Actions",
  view: "View",
  edit: "Edit",
  delete: "Delete",
  openMenu: "Open menu",
};

export function getPatientsTableColumns({ setRowAction }: GetPatientsColumnsProps): ColumnDef<PatientRowData>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label={labels.selectall}
            className="cursor-pointer h-5 w-5"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label={labels.selectRow}
            className="cursor-pointer h-5 w-5"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
      size: 40,
    },
    {
      accessorKey: "imageUrl",
      id: "image",
      header: ({ column }) => <DataTableColumnHeader column={column} title={labels.image} />,
      cell: ({ row }) => {
        const src = row.original.imageUrl ?? "https://placehold.co/40x40/cccccc/000000?text=No+Image";
        return (
          <div className="flex items-center justify-center w-10 h-10 overflow-hidden rounded-md flex-shrink-0">
            <Image
              src={src}
              alt={row.original.name ?? "Patient image"}
              width={40}
              height={40}
              className="object-contain w-full h-full"
            />
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
      size: 70,
    },
    {
      accessorKey: "name",
      id: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title={labels.name} />,
      cell: ({ row }) => <div className="truncate font-normal">{row.original.name}</div>,
    },
    {
      accessorKey: "lastVisit",
      id: "lastVisit",
      header: ({ column }) => <DataTableColumnHeader column={column} title={labels.lastVisit} />,
      cell: ({ row }) => (
        <div className="font-normal">{row.original.lastVisit ? new Date(row.original.lastVisit).toLocaleDateString() : "-"}</div>
      ),
    },
    {
      accessorKey: "nextVisit",
      id: "nextVisit",
      header: ({ column }) => <DataTableColumnHeader column={column} title={labels.nextVisit} />,
      cell: ({ row }) => (
        <div className="font-normal">{row.original.nextVisit ? new Date(row.original.nextVisit).toLocaleDateString() : "-"}</div>
      ),
    },
    {
      accessorKey: "recentDoctor",
      id: "recentDoctor",
      header: ({ column }) => <DataTableColumnHeader column={column} title={labels.recentDoctor} />,
      cell: ({ row }) => <div className="font-normal">{row.original.recentDoctor ?? "-"}</div>,
    },
    {
      accessorKey: "recentTopic",
      id: "recentTopic",
      header: ({ column }) => <DataTableColumnHeader column={column} title={labels.recentTopic} />,
      cell: ({ row }) => <div className="font-normal">{row.original.recentTopic ?? "-"}</div>,
    },
    {
      id: "actions",
      size: 40,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-label={labels.openMenu} variant="ghost" className="flex h-8 w-8 p-0">
              <Ellipsis className="h-4 w-4" />
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
