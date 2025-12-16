"use client";

import { type Table as TanstackTable, flexRender } from "@tanstack/react-table";
import type * as React from "react";

import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { getCommonPinningStyles } from "@/lib/data-table";
import { cn } from "@/lib/utils";

interface DataTableProps<TData> extends React.ComponentProps<"div"> {
    table: TanstackTable<TData>;
    actionBar?: React.ReactNode;
    noResultsMessage?: string;
    isLoading?: boolean;
}

export function DataTable<TData>({
    table,
    actionBar,
    children,
    className,
    noResultsMessage = "No results.",

    ...props
}: DataTableProps<TData>) {

    return (
        <div
            className={cn("flex w-full flex-col gap-2.5 overflow-auto", className)}
            {...props}
        >
            {children}

            <div className="rounded-md bg-white shadow-sm flex flex-col relative min-h-[300px]">
                {actionBar && (
                    <div className="flex items-center justify-between p-4">
                        {actionBar}
                    </div>
                )}

                <div className="relative w-full overflow-auto">
                    {/* ⭐ LOADER RETIRÉ : C'est ce bloc qui causait le problème de fluidité lors de la saisie */}
                    {/*
                    {isLoading && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70">
                            <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                    )}
                    */}
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow
                                    key={headerGroup.id}
                                    className="border-b border-gray-300"
                                >
                                    {headerGroup.headers.map((header) => (
                                        <TableHead
                                            key={header.id}
                                            colSpan={header.colSpan}
                                            style={{
                                                ...getCommonPinningStyles({ column: header.column }),
                                            }}
                                            className="text-gray-700 font-medium py-3"
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef.header,
                                                      header.getContext(),
                                                  )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>

                        <TableBody>
                            {/* 🛑 CORRECTION : Ajout du chaînage optionnel '?' pour prévenir le crash si .rows est undefined/null */}
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                        className="group relative cursor-pointer border-b border-gray-200 hover:bg-gray-100 data-[state=selected]:bg-muted"
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell
                                                key={cell.id}
                                                style={{
                                                    ...getCommonPinningStyles({ column: cell.column }),
                                                }}
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={table.getAllColumns().length}
                                        className="h-24 text-center"
                                    >
                                        {noResultsMessage}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div className="border-t border-gray-200" />

                <div className="p-4">
                    <DataTablePagination table={table} />
                </div>
            </div>
        </div>
    );
}