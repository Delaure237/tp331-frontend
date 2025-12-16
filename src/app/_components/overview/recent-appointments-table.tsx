"use client";

import React from 'react';
import { MoreVertical } from "lucide-react";
import AppointmentsTableHeader from "@/app/_components/overview/appointments-table-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAppointmentStatusBadge, MOCK_APPOINTMENTS } from "@/app/_utils/appointment-utils";
import { Appointment } from "@/types/appointment";

// Composant PatientCell inchangé...

const RecentAppointmentsTable: React.FC = () => {
    const appointments: Appointment[] = MOCK_APPOINTMENTS;
    const isLoading = false; // Simulation

    return (
        <Card className="shadow-lg border-none bg-white">
            <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
                <CardTitle className="text-lg font-semi-bold">Rendez-vous Récent</CardTitle>
                <div className="text-sm text-gray-500 space-x-2">
                    <span>20 January</span>
                    <span className="font-semibold text-gray-700 border p-1 rounded-md">Weekly</span>
                </div>
            </CardHeader>

            <CardContent className="p-4 pt-0">
                <div className="w-full overflow-x-auto">

                    <AppointmentsTableHeader />

                    <div className="flex flex-col">
                        {appointments.map((appt: Appointment) => (
                            <div
                                key={appt.patientId}
                                className="grid grid-cols-[2fr_1fr_1fr_1fr_0.5fr] gap-x-4 items-center px-4 py-3 text-sm text-gray-800
                                           border-t border-gray-100 hover:bg-gray-50 min-w-[700px]"
                            >
                                {/* Colonne 1: Patient */}
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={appt.patientAvatar} alt={appt.patientName} />
                                        <AvatarFallback>{appt.patientName.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="font-medium text-gray-800">{appt.patientName}</div>
                                </div>

                                {/* Colonne 2: Time Slot */}
                                <div className="text-gray-600 font-medium">{appt.timeSlot}</div>

                                {/* Colonne 3: Service */}
                                <div className="text-gray-500 text-xs font-semibold">{appt.service}</div>

                                {/* Colonne 4: Status (Badge) */}
                                <div>{getAppointmentStatusBadge(appt.status)}</div>

                                {/* Colonne 5: Actions */}
                                <div className="flex justify-end pr-2">
                                    <button className="text-gray-400 hover:text-gray-700">
                                        <MoreVertical size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default RecentAppointmentsTable;