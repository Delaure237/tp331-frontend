// src/app/doctor/page.tsx
"use client";

import React from "react";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { DoctorsTable } from "@/app/_components/doctor/doctors-table";
import { DoctorProfileView } from "@/app/_components/doctor/doctor-profile-view";
import { DoctorRowData } from "@/app/_components/doctor/doctor-table-columns";
// J'ai ajusté les chemins d'importation des composants enfants

// Simuler les données (à remplacer par votre appel API)
const initialDoctorsData: DoctorRowData[] = [
    // Traduction de quelques départements pour l'exemple
    { id: "1", name: "Esther Howard", department: "Urologie", specialist: "Prostate", degree: "MBBS, MS", email: "esther@example.com", phone: "925-274 9000", joinDate: new Date('2018-06-01'), imageUrl: "/images/esther.jpg" },
    { id: "2", name: "Jenny Wilson", department: "Dentisterie", specialist: "Dentiste", degree: "BHMS, MS", email: "jenny@example.com", phone: "928-274 9012", joinDate: new Date('2019-03-11'), imageUrl: "/images/jenny.jpg" },
    { id: "3", name: "Mobert Eon", department: "Généraliste", specialist: "Maladies Générales", degree: "MBBS, MS", email: "mobert@example.com", phone: "725-274 9123", joinDate: new Date('2017-08-08'), imageUrl: "/images/mobert.jpg" },
    // Ajoutez plus de données si nécessaire pour le mock
];
const initialPageCount = 1; // Page Count pour la pagination simulée

export default function DoctorsPage() {
    const [activeTab, setActiveTab] = React.useState("all-doctors");
    const [selectedDoctor, setSelectedDoctor] = React.useState<DoctorRowData | null>(null);

    // Fonction pour sélectionner un docteur et changer d'onglet
    const handleDoctorSelect = React.useCallback((doctor: DoctorRowData) => {
        setSelectedDoctor(doctor);
        setActiveTab("doctor-profile");
    }, []);

    // Gère le changement d'onglet par l'utilisateur
    const handleTabChange = (value: string) => {
        setActiveTab(value);
        // Si l'utilisateur revient à "All Doctors", désélectionner le docteur
        if (value === "all-doctors") {
            setSelectedDoctor(null);
        }
    };

    return (
        <div className="p-4 md:p-6 lg:p-8 bg-white rounded-lg shadow-lg">
            <h1 className="text-2xl font-semibold mb-4 text-black">Gestion des Docteurs</h1>

            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                {/* Liste des Onglets */}
                <TabsList className="grid w-full md:w-auto grid-cols-2">
                    <TabsTrigger value="all-doctors">Tous les Docteurs</TabsTrigger>

                    {/* L'onglet Profile est actif si selectedDoctor est non null */}
                    <TabsTrigger
                        value="doctor-profile"
                        disabled={!selectedDoctor}
                        // La classe désactivée utilise "text-gray-400 cursor-not-allowed"
                        className={!selectedDoctor ? "text-gray-400 cursor-not-allowed" : ""}
                    >
                        Profil du Docteur
                    </TabsTrigger>
                </TabsList>

                {/* Contenu pour l'onglet Tous les Docteurs */}
                <TabsContent value="all-doctors" className="mt-4">
                    <DoctorsTable
                        data={initialDoctorsData}
                        pageCount={initialPageCount}
                        onDoctorSelect={handleDoctorSelect}
                    />
                </TabsContent>

                {/* Contenu pour l'onglet Profil du Docteur */}
                <TabsContent value="doctor-profile" className="mt-4">
                    {selectedDoctor ? (
                        <DoctorProfileView doctor={selectedDoctor} />
                    ) : (
                        <div className="p-6 text-gray-500 border border-dashed rounded-lg text-center">
                            Sélectionnez un docteur à partir de la liste ("Tous les Docteurs") ou utilisez l'action "View Profile" pour charger le profil ici.
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}