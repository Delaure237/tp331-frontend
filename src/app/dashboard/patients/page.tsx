"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { PatientsTable } from "@/app/_components/patient/patients-table";
import PatientStatCard, { PatientPeriod } from "@/components/stat-cards/patient-stat-card";
import { getPatientsApi, getPatientStatsApi } from "@/api/patient-api";

export default function PatientsPage() {
    const searchParams = useSearchParams();
    const [period, setPeriod] = useState<PatientPeriod>("thisMonth");
    const [forceRefresh, setForceRefresh] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [patients, setPatients] = useState({ data: [], pageCount: 0 });
    const [stats, setStats] = useState<any[]>([]);

    const page = parseInt(searchParams.get("page") ?? "1");
    const perPage = parseInt(searchParams.get("perPage") ?? "10");
    const name = searchParams.get("name") || undefined;

    // Cette fonction inverse le booléen pour déclencher le useEffect
    const handleRefresh = () => setForceRefresh(prev => !prev);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [patientsRes, statsRes] = await Promise.all([
                    getPatientsApi({ page, limit: perPage, search: name }),
                    getPatientStatsApi(period)
                ]);
                setPatients({
                    data: patientsRes.patients || [],
                    pageCount: Math.ceil((patientsRes.total || 0) / perPage),
                });
                setStats(statsRes || []);
            } catch (err) {
                console.error("Fetch error:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [searchParams, forceRefresh, page, perPage, name, period]);

    return (
        <div className="flex flex-col gap-8 p-6 min-h-screen bg-[#F9FAFB]">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-semibold text-[#3E3E3E] lowercase">tableau de bord patients</h1>
                <p className="text-sm text-gray-500">Gérez vos dossiers patients et suivez les indicateurs clés.</p>
            </div>

            <Separator />

            {/* Section Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
                {stats.map((stat, idx) => (
                    <div key={idx} className="flex h-full">
                        <PatientStatCard
                            {...stat}
                            period={period}
                            onPeriodChange={setPeriod}
                            isPeriodSelectorVisible={true}
                            className="w-full h-full shadow-sm border-gray-100"
                        />
                    </div>
                ))}
            </div>

            {/* Section Table */}
            <div className="flex-1 rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden mt-2">
                {isLoading && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50">
                        <Loader2 className="h-8 w-8 animate-spin text-[#058D66]" />
                    </div>
                )}
                <PatientsTable
                    data={patients.data}
                    pageCount={patients.pageCount}
                    onAddPatientSuccess={handleRefresh}
                    onDeletePatientSuccess={handleRefresh}
                    onUpdatePatientSuccess={handleRefresh} 
                />
            </div>
        </div>
    );
}