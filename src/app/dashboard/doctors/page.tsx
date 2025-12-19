"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { DoctorsTable } from "@/app/_components/doctor/doctors-table";
import { DoctorProfileView } from "@/app/_components/doctor/doctor-profile-view";
import { DoctorRowData } from "@/app/_components/doctor/doctor-table-columns";
import { getDoctorsApi } from "@/api/doctor-api";

export default function DoctorsPage() {
    const searchParams = useSearchParams();

    // États pour la data et les vues
    const [activeTab, setActiveTab] = useState("all-doctors");
    const [selectedDoctor, setSelectedDoctor] = useState<DoctorRowData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [forceRefresh, setForceRefresh] = useState(false);

    // États pour l'API (On garde uniquement les docteurs)
    const [doctors, setDoctors] = useState({ data: [], pageCount: 0 });

    // Paramètres de l'URL pour la pagination et recherche
    const page = parseInt(searchParams.get("page") ?? "1");
    const perPage = parseInt(searchParams.get("perPage") ?? "10");
    const search = searchParams.get("name") || undefined;

    const handleRefresh = () => setForceRefresh(prev => !prev);

    // Sélection d'un docteur pour le profil
    const handleDoctorSelect = React.useCallback((doctor: DoctorRowData) => {
        setSelectedDoctor(doctor);
        setActiveTab("doctor-profile");
    }, []);

    // Chargement des données (Uniquement la liste des docteurs)
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // On appelle uniquement getDoctorsApi
                const doctorsRes = await getDoctorsApi({ page, limit: perPage, search });

                setDoctors({
                    data: doctorsRes.doctors || [],
                    pageCount: Math.ceil((doctorsRes.total || 0) / perPage),
                });
            } catch (err) {
                console.error("Erreur lors du chargement des docteurs:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [page, perPage, search, forceRefresh]); // Dépendances nettoyées

    return (
        <div className="flex flex-col gap-8 p-6 min-h-screen bg-[#F9FAFB]">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-semibold text-[#3E3E3E] lowercase">gestion des docteurs</h1>
                <p className="text-sm text-gray-500">Gérez votre personnel médical et consultez leurs profils.</p>
            </div>

            <Separator />

            {/* Note: Section Stats supprimée car non utilisée et source d'erreurs 500 */}

            {/* Onglets et Table */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 relative overflow-hidden">
                {isLoading && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-[1px]">
                        <Loader2 className="h-8 w-8 animate-spin text-[#058D66]" />
                    </div>
                )}

                <Tabs value={activeTab} onValueChange={(v) => {
                    setActiveTab(v);
                    if (v === "all-doctors") setSelectedDoctor(null);
                }} className="w-full">

                    <TabsList className="bg-slate-50 p-1 mb-6">
                        <TabsTrigger value="all-doctors" className="lowercase">tous les docteurs</TabsTrigger>
                        <TabsTrigger
                            value="doctor-profile"
                            disabled={!selectedDoctor}
                            className="lowercase"
                        >
                            profil détaillé
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="all-doctors" className="border-none p-0 outline-none">
                        <DoctorsTable
                            data={doctors.data}
                            pageCount={doctors.pageCount}
                            onAddSuccess={handleRefresh}
                            onDeleteSuccess={handleRefresh}
                            onUpdateSuccess={handleRefresh}
                            onDoctorSelect={handleDoctorSelect}
                        />
                    </TabsContent>

                    <TabsContent value="doctor-profile" className="border-none p-0 outline-none">
                        {selectedDoctor ? (
                            <DoctorProfileView doctor={selectedDoctor} />
                        ) : (
                            <div className="py-20 text-center text-gray-400 text-sm lowercase italic">
                                sélectionnez un docteur dans la liste pour voir son profil
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}