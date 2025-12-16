// src/components/doctors/doctor-profile-view.tsx
"use client";

import { generateAvatarProps } from "@/app/_lib/generate-avatar-profile";
import { Card } from "@/components/ui/card";
import { Mail, Phone, Calendar, Building2, GraduationCap } from "lucide-react";
import Image from "next/image";
// CORRECTION : Changement de l'import relatif à l'alias @/
import { DoctorRowData } from "@/app/doctor/doctor-table-columns";


interface DoctorProfileViewProps {
    doctor: DoctorRowData;
}

// Composant pour l'affichage de l'Avatar ou de l'Avatar Généré
const DoctorAvatar = ({ doctor }: { doctor: DoctorRowData }) => {
    // Si doctor.name n'est pas défini, generateAvatarProps renvoie des valeurs par défaut
    const { initials, bgColorClass } = generateAvatarProps(doctor.name);

    if (doctor.imageUrl) {
        return (
            <Image
                src={doctor.imageUrl}
                alt={doctor.name}
                width={96}
                height={96}
                // Bordure subtile et taille standard pour l'image
                className="rounded-full object-cover h-24 w-24 shadow-md border border-gray-100"
            />
        );
    }

    return (
        // Style ajusté : H-28 w-28, texte 4xl, shadow-inner, bordures douces
        <div
            className={`h-28 w-28 rounded-full flex items-center justify-center text-white text-4xl font-semibold shadow-inner ${bgColorClass} ring-4 ring-indigo-50 border border-gray-100`}
        >
            {initials}
        </div>
    );
};

export function DoctorProfileView({ doctor }: DoctorProfileViewProps) {
    if (!doctor || !doctor.id) { // Ajout d'une vérification plus stricte
        return <div className="p-6 text-gray-500">Sélectionnez un docteur pour voir son profil.</div>;
    }

    return (
        // Bordure de la carte rendue plus subtile : border-gray-200
        <Card className="shadow-lg p-6 bg-white border border-gray-200">
            {/* Section Haut de Profil */}
            <div className="flex flex-col items-center text-center space-y-4 mb-8">
                <DoctorAvatar doctor={doctor} />
                <h2 className="text-2xl font-bold text-gray-800">{doctor.name}</h2>
                <p className="text-md text-indigo-600 font-semibold">{doctor.specialist}</p>
            </div>

            {/* Section Informations Détaillées (Minimaliste et Traduit) */}
            {/* Bordure de séparation rendue plus subtile : border-gray-200 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8 border-t border-gray-200 pt-6">

                {/* Email */}
                <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-gray-500 mt-1 flex-shrink-0" />
                    <div>
                        <p className="text-xs text-gray-500">E-mail</p>
                        <p className="font-medium text-gray-700">{doctor.email}</p>
                    </div>
                </div>

                {/* Téléphone */}
                <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-gray-500 mt-1 flex-shrink-0" />
                    <div>
                        <p className="text-xs text-gray-500">Téléphone</p>
                        <p className="font-medium text-gray-700">{doctor.phone}</p>
                    </div>
                </div>

                {/* Diplôme */}
                <div className="flex items-start space-x-3">
                    <GraduationCap className="h-5 w-5 text-gray-500 mt-1 flex-shrink-0" />
                    <div>
                        <p className="text-xs text-gray-500">Diplôme</p>
                        <p className="font-medium text-gray-700">{doctor.degree}</p>
                    </div>
                </div>

                {/* Département */}
                <div className="flex items-start space-x-3">
                    <Building2 className="h-5 w-5 text-gray-500 mt-1 flex-shrink-0" />
                    <div>
                        <p className="text-xs text-gray-500">Département</p>
                        <p className="font-medium text-gray-700">{doctor.department}</p>
                    </div>
                </div>

                {/* Date d'Adhésion */}
                <div className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-gray-500 mt-1 flex-shrink-0" />
                    <div>
                        <p className="text-xs text-gray-500">Date d'Adhésion</p>
                        <p className="font-medium text-gray-700">{new Date(doctor.joinDate).toLocaleDateString('fr-FR')}</p>
                    </div>
                </div>

            </div>
        </Card>
    );
}