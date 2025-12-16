// src/lib/data-table.ts
import type {
  ExtendedColumnFilter,
  FilterOperator,
  FilterVariant,
} from "@/types/data-table";
import type { Column } from "@tanstack/react-table";

import { dataTableConfig } from "@/config/data-table";

/**
 * Retourne les styles CSS communs pour une colonne épinglée (sticky) dans un tableau.
 *
 * @param column - La colonne concernée (de TanStack Table).
 * @param withBorder - Active ou non une bordure entre les colonnes épinglées et non épinglées.
 * @returns Un objet de styles React.CSSProperties à appliquer à la cellule.
 */
export function getCommonPinningStyles<TData>({
  column,
  withBorder = false,
}: {
  column: Column<TData>;
  withBorder?: boolean;
}): React.CSSProperties {
  const isPinned = column.getIsPinned();
  const isLastLeftPinnedColumn =
    isPinned === "left" && column.getIsLastColumn("left");
  const isFirstRightPinnedColumn =
    isPinned === "right" && column.getIsFirstColumn("right");

  return {
    // Ajoute une bordure visuelle à la dernière colonne épinglée à gauche ou à la première à droite
    boxShadow: withBorder
      ? isLastLeftPinnedColumn
        ? "-4px 0 4px -4px hsl(var(--border)) inset"
        : isFirstRightPinnedColumn
        ? "4px 0 4px -4px hsl(var(--border)) inset"
        : undefined
      : undefined,

    // Positionne la colonne à gauche ou à droite selon son type d'épinglage
    left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
    right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,

    // Donne une légère transparence aux colonnes épinglées pour un effet visuel
    opacity: isPinned ? 0.97 : 1,

    // Rend la colonne "sticky" si elle est épinglée
    position: isPinned ? "sticky" : "relative",

    // Définit un fond unifié (peut être personnalisé par thème)
    background: "hsl(var(--background))",

    // Fixe la largeur à celle calculée par la table
    width: column.getSize(),

    // Applique un z-index plus élevé pour les colonnes épinglées
    zIndex: isPinned ? 1 : 0,
  };
}

/**
 * Retourne la liste des opérateurs de filtre disponibles pour un type de filtre donné.
 *
 * @param filterVariant - Le type du champ à filtrer (text, number, boolean, etc.).
 * @returns Une liste d'opérateurs compatibles avec ce type.
 */
export function getFilterOperators(filterVariant: FilterVariant) {
  const operatorMap: Record<
    FilterVariant,
    { label: string; value: FilterOperator }[]
  > = {
    text: dataTableConfig.textOperators,
    number: dataTableConfig.numericOperators,
    range: dataTableConfig.numericOperators,
    date: dataTableConfig.dateOperators,
    dateRange: dataTableConfig.dateOperators,
    boolean: dataTableConfig.booleanOperators,
    select: dataTableConfig.selectOperators,
    multiSelect: dataTableConfig.multiSelectOperators,
  };

  const allOperators = operatorMap[filterVariant] ?? dataTableConfig.textOperators;

  // Filtre pour enlever les opérateurs indésirables
  return allOperators.filter(
    (operator) =>
      operator.value !== "isEmpty" &&
      operator.value !== "isNotEmpty" &&
      operator.value !== "inArray" &&
      operator.value !== "notInArray"
  );
}

/**
 * Retourne l'opérateur de filtre par défaut pour un type donné.
 *
 * @param filterVariant - Le type de filtre (text, number, etc.).
 * @returns L'opérateur à utiliser par défaut.
 */
export function getDefaultFilterOperator(filterVariant: FilterVariant) {
  const operators = getFilterOperators(filterVariant);

  // Si aucun opérateur n’est trouvé, on retourne "iLike" pour les textes, sinon "eq"
  return operators[0]?.value ?? (filterVariant === "text" ? "iLike" : "eq");
}

/**
 * Filtre les filtres valides, en retirant ceux sans valeur ou vides.
 *
 * @param filters - Liste des filtres appliqués.
 * @returns Une nouvelle liste contenant uniquement les filtres valides.
 */
export function getValidFilters<TData>(
  filters: ExtendedColumnFilter<TData>[],
): ExtendedColumnFilter<TData>[] {
  return filters.filter(
    (filter) =>
      // Les filtres isEmpty ou isNotEmpty sont toujours valides
      filter.operator === "isEmpty" ||
      filter.operator === "isNotEmpty" ||
      // Sinon, on vérifie que la valeur est bien définie
      (Array.isArray(filter.value)
        ? filter.value.length > 0
        : filter.value !== "" &&
          filter.value !== null &&
          filter.value !== undefined),
  );
}