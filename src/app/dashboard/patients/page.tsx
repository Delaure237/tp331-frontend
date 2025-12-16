'use client';

import React, { useState, useEffect } from "react";
import PatientStatCard from "@/components/stat-cards/patient-stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Search, PlusCircle } from "lucide-react";
import { PatientsTable } from "@/app/_components/patient/patients-table";
import { Patient } from "@/schemas/patient-schema";

// --- Mock Stats ---
const mockPatientStats = [
  { iconKey: "users", title: "Patients Totaux", count: 3500, period: "All Time", trend: "up", percentage: "+2.5", subtitle: "vs mois dernier", perspective: "Global" },
  { iconKey: "userPlus", title: "Nouveaux Patients (30J)", count: 125, period: "This month", trend: "up", percentage: "+15", subtitle: "vs mois dernier", perspective: "Acquisition" },
  { iconKey: "fileText", title: "Prescriptions en Cours", count: 480, period: "Today", trend: "down", percentage: "-0.8", subtitle: "vs hier", perspective: "Activité" },
  { iconKey: "clock", title: "Rendez-vous Aujourd'hui", count: 18, period: "Today", trend: "up", percentage: "+5", subtitle: "vs hier", perspective: "Planification" },
];

export default function PatientsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Exemple fetch mock ou API
  useEffect(() => {
    // Simuler fetch patients
    setPatients([
      { patientFirstName: "Eric", patientLastName: "Ngatchou", address: "Yaoundé", email: "eric@example.com", phone: "677000000", sex: "Male", dateOfBirth: new Date(), bloodGroup: "O+", height: 175, weight: 70 },
      { patientFirstName: "Marie", patientLastName: "Tchoumi", address: "Douala", email: "marie@example.com", phone: "699000000", sex: "Female", dateOfBirth: new Date(), bloodGroup: "A+", height: 165, weight: 60 },
    ]);
  }, []);

  const filteredPatients = patients.filter(
    (p) =>
      p.patientFirstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.patientLastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone?.includes(searchTerm)
  );

  const handleAddPatientSuccess = (newPatient: Patient) => {
    setPatients((prev) => [...prev, newPatient]);
  };

  return (
    <div className="flex flex-col gap-6 p-2 md:p-2">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Tableau de Bord Patients</h1>

      </div>

      <Separator />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {mockPatientStats.map((stat, idx) => (
          <PatientStatCard key={idx} {...stat} isPeriodSelectorVisible={true} />
        ))}
      </div>


      {/* Patients Table */}
      <div className="rounded-xl border-none bg-card text-card-foreground shadow-sm overflow-auto max-h-[70vh] ">
        {filteredPatients.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">Aucun patient trouvé.</div>
        ) : (
          <PatientsTable data={filteredPatients} />
        )}
      </div>

      {/* Add Patient Modal */}

    </div>
  );
}
