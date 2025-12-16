// src/hooks/use-data-table.ts
"use client";

import {
    type ColumnFiltersState,
    type PaginationState,
    type RowSelectionState,
    type SortingState,
    type TableOptions,
    type TableState,
    type Updater,
    type VisibilityState,
    getCoreRowModel,
    getFacetedMinMaxValues,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {
    type Parser,
    type UseQueryStateOptions,
    parseAsArrayOf,
    parseAsInteger,
    parseAsString,
    useQueryState,
    useQueryStates,
} from "nuqs";
import * as React from "react";

import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { getSortingStateParser } from "@/lib/parsers";
import type { ExtendedColumnSort } from "@/types/data-table";

const PAGE_KEY = "page";
const PER_PAGE_KEY = "perPage";
const SORT_KEY = "sort";
// 🚨 CORRECTION CLÉ : Utiliser le pipe (|) comme séparateur pour éviter les conflits avec la virgule (,) dans l'URL.
const ARRAY_SEPARATOR = "|";
const DEBOUNCE_MS = 300;
const THROTTLE_MS = 50;

interface UseDataTableProps<TData>
    extends Omit<
        TableOptions<TData>,
        | "state"
        | "pageCount"
        | "getCoreRowModel"
        | "manualFiltering"
        | "manualPagination"
        | "manualSorting"
    >,
    Required<Pick<TableOptions<TData>, "pageCount">> {
    initialState?: Omit<Partial<TableState>, "sorting"> & {
        sorting?: ExtendedColumnSort<TData>[];
    };
    history?: "push" | "replace";
    debounceMs?: number;
    throttleMs?: number;
    clearOnDefault?: boolean;
    enableAdvancedFilter?: boolean;
    scroll?: boolean;
    shallow?: boolean;
    startTransition?: React.TransitionStartFunction;
}

export function useDataTable<TData>(props: UseDataTableProps<TData>) {
    const {
        columns,
        pageCount = -1,
        initialState,
        history = "replace",
        debounceMs = DEBOUNCE_MS,
        throttleMs = THROTTLE_MS,
        clearOnDefault = false,
        enableAdvancedFilter = false,
        scroll = false,
        shallow = true,
        startTransition,
        ...tableProps
    } = props;

    const queryStateOptions = React.useMemo<
        Omit<UseQueryStateOptions<string>, "parse">
    >(
        () => ({
            history,
            scroll,
            shallow,
            throttleMs,
            debounceMs,
            clearOnDefault,
            startTransition,
        }),
        [
            history,
            scroll,
            shallow,
            throttleMs,
            debounceMs,
            clearOnDefault,
            startTransition,
        ],
    );

    const [rowSelection, setRowSelection] = React.useState<RowSelectionState>(
        initialState?.rowSelection ?? {},
    );
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>(initialState?.columnVisibility ?? {});

    const [page, setPage] = useQueryState(
        PAGE_KEY,
        parseAsInteger.withOptions(queryStateOptions).withDefault(1),
    );
    const [perPage, setPerPage] = useQueryState(
        PER_PAGE_KEY,
        parseAsInteger
            .withOptions(queryStateOptions)
            .withDefault(initialState?.pagination?.pageSize ?? 10),
    );

    const [globalFilter, setGlobalFilter] = useQueryState(
        "q",
        parseAsString.withOptions(queryStateOptions),
    );

    const setGlobalFilterDebounced = useDebouncedCallback((value: string | null) => {
        setGlobalFilter(value);
    }, 500);

    const pagination: PaginationState = React.useMemo(() => {
        return {
            pageIndex: page - 1,
            pageSize: perPage,
        };
    }, [page, perPage]);

    const onPaginationChange = React.useCallback(
        (updaterOrValue: Updater<PaginationState>) => {
            if (typeof updaterOrValue === "function") {
                const newPagination = updaterOrValue(pagination);
                void setPage(newPagination.pageIndex + 1);
                void setPerPage(newPagination.pageSize);
            } else {
                void setPage(updaterOrValue.pageIndex + 1);
                void setPerPage(updaterOrValue.pageSize);
            }
        },
        [pagination, setPage, setPerPage],
    );

    const columnIds = React.useMemo(() => {
        return new Set(
            columns.map((column) => column.id).filter(Boolean) as string[],
        );
    }, [columns]);

    const [sorting, setSorting] = useQueryState(
        SORT_KEY,
        getSortingStateParser<TData>(columnIds)
            .withOptions(queryStateOptions)
            .withDefault(initialState?.sorting ?? []),
    );

    const onSortingChange = React.useCallback(
        (updaterOrValue: Updater<SortingState>) => {
            if (typeof updaterOrValue === "function") {
                const newSorting = updaterOrValue(sorting);
                setSorting(newSorting as ExtendedColumnSort<TData>[]);
            } else {
                setSorting(updaterOrValue as ExtendedColumnSort<TData>[]);
            }
        },
        [sorting, setSorting],
    );

    const filterableColumns = React.useMemo(() => {
        return columns.filter((column) => column.enableColumnFilter);
    }, [columns]);

    const filterParsers = React.useMemo(() => {
        return filterableColumns.reduce<
            Record<string, Parser<string> | Parser<string[]>>
        >((acc, column) => {
            // Le type `multiSelect` est implicitement défini par la présence de `meta.options`
            if (column.meta?.options) {
                acc[column.id ?? ""] = parseAsArrayOf(
                    parseAsString,
                    // Utilise la constante ARRAY_SEPARATOR qui est maintenant "|"
                    ARRAY_SEPARATOR,
                ).withOptions(queryStateOptions);
            } else {
                acc[column.id ?? ""] = parseAsString.withOptions(queryStateOptions);
            }
            return acc;
        }, {});
    }, [filterableColumns, queryStateOptions]);

    const [filterValues, setFilterValues] = useQueryStates(filterParsers);

    const debouncedSetFilterValues = useDebouncedCallback(
        (values: typeof filterValues) => {
            // On réinitialise la page à 1 à chaque changement de filtre
            void setPage(1);
            void setFilterValues(values);
        },
        debounceMs,
    );

    // L'état des filtres TanStack est DÉRIVÉ de l'état de l'URL (filterValues)
    const columnFilters: ColumnFiltersState = React.useMemo(() => {
        return Object.entries(filterValues).reduce<ColumnFiltersState>(
            (filters, [key, value]) => {
                if (value !== null) {
                    // TanStack Table attend un tableau de valeurs pour les filtres facettés/multi-sélection.
                    // nuqs gère l'encodage/décodage de '|' automatiquement ici.
                    const processedValue = Array.isArray(value) ? value : [value];

                    filters.push({
                        id: key,
                        value: processedValue,
                    });
                }
                return filters;
            },
            [],
        );
    }, [filterValues]);

    const onColumnFiltersChange = React.useCallback(
        (updaterOrValue: Updater<ColumnFiltersState>) => {
            // Utilise la fonction de mise à jour de TanStack pour obtenir le prochain état souhaité
            const nextFilters =
                typeof updaterOrValue === "function"
                    ? updaterOrValue(columnFilters)
                    : updaterOrValue;

            const filterUpdates = nextFilters.reduce<
                Record<string, string | string[] | null>
            >((acc, filter) => {
                if (filterableColumns.find((column) => column.id === filter.id)) {

                    let valueToSet: string | string[] | null;

                    if (Array.isArray(filter.value)) {
                        // Si le tableau est vide, on doit le mettre à null pour l'enlever de l'URL
                        valueToSet = (filter.value as string[]).length > 0 ? (filter.value as string[]) : null;
                    } else {
                        // Si c'est un filtre simple, on le passe comme string
                        valueToSet = filter.value as string | null;
                    }

                    acc[filter.id] = valueToSet;
                }
                return acc;
            }, {});

            // Ajout des filtres qui ont été supprimés (pour les mettre à null dans l'URL)
            columnFilters.forEach((prevFilter) => {
                if (!nextFilters.some((filter) => filter.id === prevFilter.id)) {
                    filterUpdates[prevFilter.id] = null;
                }
            });

            // Envoie la mise à jour des filtres de l'URL
            debouncedSetFilterValues(filterUpdates);

        },
        [debouncedSetFilterValues, filterableColumns, columnFilters],
    );

    const table = useReactTable({
        ...tableProps,
        columns,
        initialState,
        pageCount,
        state: {
            pagination,
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
            globalFilter,
        },
        defaultColumn: {
            ...tableProps.defaultColumn,
            enableColumnFilter: false,
        },
        onGlobalFilterChange: (updaterOrValue) => {
            const newValue = typeof updaterOrValue === 'function'
                ? updaterOrValue(globalFilter)
                : updaterOrValue;
            setGlobalFilterDebounced(newValue as string | null);
        },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onPaginationChange,
        onSortingChange,
        onColumnFiltersChange,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getFacetedMinMaxValues: getFacetedMinMaxValues(),
        manualPagination: true,
        manualSorting: true,
        manualFiltering: true,
    });

    return { table, shallow, debounceMs, throttleMs, globalFilter, setGlobalFilterDebounced, filterValues };
}