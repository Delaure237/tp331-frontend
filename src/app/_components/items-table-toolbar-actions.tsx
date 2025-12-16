"use client";

import * as React from "react";
import type { Table } from "@tanstack/react-table";
import { Download, Plus, FileText, File } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DeleteItemsDialog } from "./delete-item-dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ItemsTableToolbarActionsProps<T extends { id: string }> {
    table: Table<T>;
    /** Fonction d’export personnalisée, si non fournie, aucun bouton export n’est affiché */
    onExport?: (format: "pdf" | "csv") => void;
    /** Texte du fichier exporté, utilisé dans le bouton export (ex: "products") */
    exportFilename?: string;
    /** Fonction appelée après suppression avec succès */
    onDeleteSuccess?: () => void;
    /** Fonction appelée pour effectuer la suppression (obligatoire si on affiche DeleteItemsDialog) */
    deleteAction: (items: T[]) => Promise<{ error?: string; } | void>; // Type mis à jour pour correspondre à DeleteItemsDialog
    /** Fonction appelée lors du clic sur Add (optionnel) */
    onAdd?: () => void;
    /** Texte du bouton Add */
    addLabel?: string;
    /** Si true, affiche le bouton Add avec style vert pharmaceutique */
    showAddButton?: boolean;
    /** Optionnel : items sélectionnés à passer au dialogue suppression */
    selectedItems?: T[];
    /** NOUVEAU: Permet d'injecter des éléments React supplémentaires à la fin de la barre d'outils */
    additionalActions?: React.ReactNode;
}

export function ItemsTableToolbarActions<T extends { id: string }>({
    table,
    onExport,
    exportFilename = "export",
    onDeleteSuccess,
    deleteAction, // <-- Cette prop est maintenant utilisée
    onAdd,
    addLabel = "Add",
    showAddButton = false,
    selectedItems,
    additionalActions, // Récupère la nouvelle prop
}: ItemsTableToolbarActionsProps<T>) {
    const selected = selectedItems ?? table.getFilteredSelectedRowModel().rows.map((r) => r.original);

    return (
        <div className="flex items-center gap-2">
            {selected.length > 0 && (
                <DeleteItemsDialog
                    items={selected}
                    onSuccess={() => {
                        table.toggleAllRowsSelected(false);
                        onDeleteSuccess?.();
                    }}
                    // Correction: Passe la fonction deleteAction définie dans les props
                    deleteAction={deleteAction}
                />
            )}

            {showAddButton && onAdd && (
                <Button
                    onClick={onAdd}
                    variant="default"
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                    aria-label={addLabel}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    {addLabel}
                </Button>
            )}

            {onExport && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            aria-label={`Export ${exportFilename}`}
                            className="focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none"
                        >
                            <Download className="mr-2 h-4 w-4" />
                            Export
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="end"
                        className="bg-white border-none"
                    >
                        <DropdownMenuItem
                            onClick={() => onExport("pdf")}
                            className="cursor-pointer hover:bg-gray-100"
                        >
                            <FileText className="mr-2 h-4 w-4" />
                            Export to PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => onExport("csv")}
                            className="cursor-pointer hover:bg-gray-100"
                        >
                            <File className="mr-2 h-4 w-4" />
                            Export to CSV
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}

  
            {additionalActions}
        </div>
    );
}