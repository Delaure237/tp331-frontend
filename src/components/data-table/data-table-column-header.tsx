"use client";

import type { Column } from "@tanstack/react-table";
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  EyeOff,
  X,
  Check,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { ColumnMeta } from "@/types/meta";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.ComponentProps<typeof DropdownMenuTrigger> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
  ...props
}: DataTableColumnHeaderProps<TData, TValue>) {
  const columnMeta = column.columnDef.meta as ColumnMeta | undefined;

  const showSorting =
    column.getCanSort() &&
    columnMeta &&
    (columnMeta.type === "text" ||
      columnMeta.type === "date" ||
      columnMeta.type === "number");

  const showStatusFilter =
    columnMeta?.type === "status" && Array.isArray(columnMeta.options);

  const showHideOption = column.getCanHide();

  if (!showSorting && !showStatusFilter && !showHideOption) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "-ml-1.5 flex h-8 items-center gap-1.5 rounded-md px-2 py-1.5 hover:bg-accent focus:outline-none focus:ring-1 focus:ring-ring data-[state=open]:bg-accent [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground",

          className
        )}
        {...props}
      >
        {title}
        {showSorting &&
          (column.getIsSorted() === "desc" ? (
            <ChevronDown />
          ) : column.getIsSorted() === "asc" ? (
            <ChevronUp />
          ) : (
            <ChevronsUpDown />
          ))}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-44">
        {showSorting && (
          <>
            <DropdownMenuCheckboxItem
              className="relative pr-8 pl-2 bg-white border-white"
              checked={column.getIsSorted() === "asc"}
              onClick={() => column.toggleSorting(false)}
            >
              <ChevronUp className="mr-2 h-4 w-4 text-muted-foreground" />
              Trier ascendant
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              className="relative pr-8 pl-2 bg-white border-none"
              checked={column.getIsSorted() === "desc"}
              onClick={() => column.toggleSorting(true)}
            >
              <ChevronDown className="mr-2 h-4 w-4 text-muted-foreground" />
              Trier descendant
            </DropdownMenuCheckboxItem>
            {column.getIsSorted() && (
              <DropdownMenuItem
                className="pl-2"
                onClick={() => column.clearSorting()}
              >
                <X className="mr-2 h-4 w-4 text-muted-foreground" />
                Réinitialiser le tri
              </DropdownMenuItem>
            )}
          </>
        )}

        {showStatusFilter &&
          columnMeta.options.map((status) => (
            <DropdownMenuCheckboxItem
              key={status}
              className="relative pr-8 pl-2 capitalize bg-white border-none"
              checked={
                // Tu peux ici connecter à un filtre global ou d'autres règles si besoin
                false
              }
              onClick={() => {
                // Implémenter la logique de filtrage ici si souhaité
              }}
            >
              <Check className="mr-2 h-4 w-4 text-muted-foreground" />
              {status}
            </DropdownMenuCheckboxItem>
          ))}

        {showHideOption && (
          <DropdownMenuCheckboxItem
            className="relative pr-8 pl-2 bg-white border-none"
            checked={!column.getIsVisible()}
            onClick={() => column.toggleVisibility(false)}
          >
            <EyeOff className="mr-2 h-4 w-4 text-muted-foreground" />
            Masquer la colonne
          </DropdownMenuCheckboxItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
