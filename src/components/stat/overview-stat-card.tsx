"use client";

import React from "react";
// Utiliser TickCircle (coche) pour le statut positif comme dans l'image
import { TickCircle } from "iconsax-react";

interface OverviewStatCardProps {
  icon: React.ElementType;
  value: string;
  label: string;
  percentage: number;
  color: string; // Couleur de fond ferme (ex: #A785F8)
}

const OverviewStatCard: React.FC<OverviewStatCardProps> = ({
  icon: Icon,
  value,
  label,
  percentage,
  color,
}) => {

  const percentageText = `${Math.abs(percentage)}% of target`;

  return (
    <div className="flex items-center gap-4 py-4">

      {/* 1. Icon container - COULEUR FERME (OPAQUE) */}
      <div
        className="flex h-14 w-14 items-center justify-center rounded-full flex-shrink-0"
        // Le retrait du '33' rend le fond opaque
        style={{ backgroundColor: color }}
      >
        <Icon
          size="28"
          color="#FFFFFF" // ICÔNE BLANCHE
          variant="Bulk" // Variante 'Bulk' d'Iconsax semble correspondre au remplissage
        />
      </div>

      {/* 2. Details (Valeur, Label, Pourcentage) */}
      <div className="flex flex-col">
        {/* Value : plus grand pour l'accentuation */}
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>

        {/* Label : en dessous de la valeur */}
        <p className="text-base text-gray-500">{label}</p>

        {/* Percentage Indicator : statut en bas */}
        <div className="mt-1 flex items-center text-sm text-green-600">
          {/* Icône de coche verte */}
          <TickCircle size="16" className="mr-1 text-green-600" variant="Bold" />
          <span className="text-sm">{percentageText}</span>
        </div>
      </div>
    </div>
  );
};

export default OverviewStatCard;