"use client";

import React, { useState, useEffect } from "react";
import AppointmentStatCard from "@/components/stat-cards/appointment-stat-card";
import { Separator } from "@/components/ui/separator";
import { AppointmentsTable } from "@/app/_components/appointment/appointments-table";
import { AppointmentRowData } from "@/app/_components/appointment/appointments-table-columns";

// --- Mock Stats pour les cards ---
const mockAppointmentStats = [
    { iconKey: "confirmed", title: "Rendez-vous Confirmés", count: 42, period: "Aujourd'hui", trend: "up", percentage: 12, subtitle: "vs hier", perspective: "Confirmation" },
    { iconKey: "pending", title: "En Attente", count: 18, period: "Cette semaine", trend: "stable", percentage: 0, subtitle: "vs semaine dernière", perspective: "Files d'attente" },
    { iconKey: "canceled", title: "Annulés", count: 6, period: "Ce mois", trend: "down", percentage: -4, subtitle: "vs mois dernier", perspective: "Annulations" },
    { iconKey: "late", title: "Retards", count: 3, period: "Aujourd'hui", trend: "up", percentage: 5, subtitle: "vs hier", perspective: "Ponctualité" },
];

// --- Mock Data pour la table ---
const mockAppointments: AppointmentRowData[] = [
    { id: "APPT001", patientName: "Eric Ngatchou", type: "Consultation", dateTime: new Date(), status: "Confirmed" },
    { id: "APPT002", patientName: "Marie Tchoumi", type: "Vaccination", dateTime: new Date(), status: "Pending" },
    { id: "APPT003", patientName: "Paul Etoundi", type: "Consultation", dateTime: new Date(), status: "Canceled" },
    { id: "APPT004", patientName: "Anne Fotso", type: "Contrôle", dateTime: new Date(), status: "Late" },
];

export default function AppointmentPage() {
    const [selectedPeriod, setSelectedPeriod] = useState("Aujourd'hui");
    const [appointments, setAppointments] = useState<AppointmentRowData[]>([]);

    // Simuler fetch
    useEffect(() => {
        setAppointments(mockAppointments);
    }, []);

    const handleAddAppointmentSuccess = (newAppointment: AppointmentRowData) => {
        setAppointments((prev) => [...prev, newAppointment]);
    };

    const handleDeleteAppointmentSuccess = () => {
        // Ici tu peux re-fetch ou mettre à jour la liste
    };

    return (
        <div className="flex flex-col gap-6 p-4 w-full h-full ">

     <h2 className= "font-bold  text-2xl">Gestion  des Rendez vous</h2>
  

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                {mockAppointmentStats.map((stat, i) => (
                    <AppointmentStatCard
                        key={i}
                        {...stat}
                        onPeriodChange={(p) => setSelectedPeriod(p)}
                        isPeriodSelectorVisible={true}
                    />
                ))}
            </div>

            {/* Table des rendez-vous */}
            <div className="rounded-xl border-none bg-card text-card-foreground shadow-sm overflow-auto max-h-[70vh]">
                {appointments.length === 0 ? (
                    <div className="p-6 text-center text-muted-foreground">Aucun rendez-vous trouvé.</div>
                ) : (
                    <AppointmentsTable
                        data={appointments}
                        pageCount={1}
                        onAddAppointmentSuccess={handleAddAppointmentSuccess}
                        onDeleteAppointmentSuccess={handleDeleteAppointmentSuccess}
                    />
                )}
            </div>

        </div>
    );
}
