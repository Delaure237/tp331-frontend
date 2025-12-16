// src/app/doctor/doctor-table-columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2, Eye, Ellipsis } from "lucide-react";
import Image from "next/image";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableRowAction } from "@/types/data-table";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { generateAvatarProps } from "@/app/_lib/generate-avatar-profile";


// Définition de la structure des données pour un docteur
export interface DoctorRowData {
    id: string;
    name: string;
    department: string;
    specialist: string;
    degree: string;
    email: string;
    phone: string;
    joinDate: Date;
    imageUrl?: string;
}

interface GetDoctorColumnsProps {
    setRowAction: React.Dispatch<React.SetStateAction<DataTableRowAction<DoctorRowData> | null>>;
}

const labels = {
    selectAll: "Sélectionner tout",
    selectRow: "Sélectionner la ligne",
    doctor: "Docteur",
    department: "Département",
    specialist: "Spécialiste",
    degree: "Diplôme",
    email: "E-mail",
    phone: "Téléphone",
    joinDate: "Date d'Adhésion",
    actions: "Actions",
    view: "Voir Profil",
    edit: "Modifier",
    delete: "Supprimer",
    openMenu: "Ouvrir menu",
};

export function getDoctorsTableColumns({ setRowAction }: GetDoctorColumnsProps): ColumnDef<DoctorRowData>[] {
    return [
        // Colonne Checkbox (Sélection)
        {
            id: "select",
            header: ({ table }) => (
                <div className="flex items-center justify-center">
                    <Checkbox
                        checked={table.getIsAllPageRowsSelected()}
                        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                        aria-label={labels.selectAll}
                        className="cursor-pointer h-4 w-4"
                    />
                </div>
            ),
            cell: ({ row }) => (
                <div className="flex items-center justify-center">
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label={labels.selectRow}
                        className="cursor-pointer h-4 w-4"
                    />
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
            size: 40,
        },
        // Colonne Docteur (Image + Nom)
        {
            accessorKey: "name",
            id: "doctor",
            header: ({ column }) => <DataTableColumnHeader column={column} title={labels.doctor} />,
            cell: ({ row }) => {
                const { initials, bgColorClass } = generateAvatarProps(row.original.name);
                return (
                    <div className="flex items-center gap-3 min-w-[150px]">
                        {row.original.imageUrl ? (
                            <Image
                                src={row.original.imageUrl}
                                alt={row.original.name}
                                width={40}
                                height={40}
                                // Bordure subtile pour l'image
                                className="rounded-full object-cover h-10 w-10 flex-shrink-0 border border-gray-100"
                            />
                        ) : (
                            // Avatar généré en cas d'absence d'image
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-semibold text-white flex-shrink-0 ${bgColorClass}`}>
                                {initials}
                            </div>
                        )}
                        <div className="truncate font-medium">{row.original.name}</div>
                    </div>
                );
            },
        },
        // Colonnes simples (Traduites)
        {
            accessorKey: "department",
            header: ({ column }) => <DataTableColumnHeader column={column} title={labels.department} />,
            cell: ({ row }) => <div className="truncate">{row.original.department}</div>,
        },
        {
            accessorKey: "specialist",
            header: ({ column }) => <DataTableColumnHeader column={column} title={labels.specialist} />,
            cell: ({ row }) => <div className="truncate">{row.original.specialist}</div>,
        },
        {
            accessorKey: "degree",
            header: ({ column }) => <DataTableColumnHeader column={column} title={labels.degree} />,
            cell: ({ row }) => <div className="truncate">{row.original.degree}</div>,
        },
        {
            accessorKey: "email",
            header: ({ column }) => <DataTableColumnHeader column={column} title={labels.email} />,
            cell: ({ row }) => <div className="truncate">{row.original.email}</div>,
        },
        {
            accessorKey: "phone",
            header: ({ column }) => <DataTableColumnHeader column={column} title={labels.phone} />,
            cell: ({ row }) => <div className="truncate">{row.original.phone}</div>,
        },
        {
            accessorKey: "joinDate",
            header: ({ column }) => <DataTableColumnHeader column={column} title={labels.joinDate} />,
            cell: ({ row }) => <div className="font-normal">{new Date(row.original.joinDate).toLocaleDateString('fr-FR')}</div>,
        },
        // Colonne Action (Menu déroulant - Traduit)
        {
            id: "actions",
            size: 40,
            cell: ({ row }) => (
                <div className="flex justify-end">
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
                </div>
            ),
        },
    ];
}