import React from "react";

// Les libellés des colonnes pour les rendez-vous
const COLUMNS_HEADERS = [
    "Patient",
    "Heure",
    "Service",
    "Statut",
    "Actions"
];

const AppointmentsTableHeader: React.FC = () => {

    return (
        // En-tête de table stylisé pour correspondre à la grille du corps
        <div className="w-full bg-gray-50 rounded-lg py-1 px-4 overflow-x-auto hidden sm:block">
            {/* Colonnes : Patient (2fr) | Heure (1fr) | Service (1fr) | Statut (1fr) | Actions (0.5fr) */}
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_0.5fr] gap-x-4 min-w-[700px] items-center">
                {COLUMNS_HEADERS.map((header) => (
                    <div key={header} className="text-xs font-semibold text-gray-500 text-left">
                        {header}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AppointmentsTableHeader;