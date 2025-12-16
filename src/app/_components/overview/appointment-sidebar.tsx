"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight, User, Calendar as CalendarIcon } from 'lucide-react';
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Appointment } from "@/types/appointment";
import { MOCK_APPOINTMENTS } from "@/app/_utils/appointment-utils";
import { format, isSameDay, isPast } from 'date-fns';
import { fr } from 'date-fns/locale';

const DEFAULT_PATIENT_DETAILS = {
    dob: "N/A",
    height: "N/A",
    weight: "N/A",
};

interface AppointmentSidebarProps {
    className?: string;
}

const AppointmentSidebar: React.FC<AppointmentSidebarProps> = ({ className }) => {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [selectedPatientIndex, setSelectedPatientIndex] = useState(0);

    const appointmentsForSelectedDay = useMemo(() => {
        if (!selectedDate) return [];

        const filtered = MOCK_APPOINTMENTS.filter(appt => {
            const apptDate = new Date(); // Simulation

            return isSameDay(apptDate, selectedDate) &&
                   appt.status !== 'Complete' &&
                   appt.status !== 'Canceled';
        });
        return filtered;
    }, [selectedDate]);

    useEffect(() => {
        setSelectedPatientIndex(0);
    }, [selectedDate, appointmentsForSelectedDay.length]);

    const currentAppointment = appointmentsForSelectedDay[selectedPatientIndex];

    const handleNavigation = (direction: 'left' | 'right') => {
        if (appointmentsForSelectedDay.length === 0) return;

        const maxIndex = appointmentsForSelectedDay.length - 1;
        let newIndex = selectedPatientIndex;

        if (direction === 'right') {
            newIndex = (selectedPatientIndex + 1) % (maxIndex + 1);
        } else {
            newIndex = (selectedPatientIndex - 1 + (maxIndex + 1)) % (maxIndex + 1);
        }
        setSelectedPatientIndex(newIndex);
    };

    const renderPatientDetails = () => {
        if (!currentAppointment) {
            return (
                <div className="text-center py-8 text-gray-500">
                    Aucun rendez-vous en cours ou en attente ce jour.
                </div>
            );
        }

        const { patientName, patientAvatar, service } = currentAppointment;
        const patientDetails = {
            ...DEFAULT_PATIENT_DETAILS,
            dob: "10 October, 1996",
            height: "165 cm",
            weight: "54 kg"
        };

        return (
            <div className="flex flex-col items-center text-center p-4 pt-0 bg-white">
                <div className="flex items-center justify-between w-full mb-3">
                    <button
                        onClick={() => handleNavigation('left')}
                        disabled={appointmentsForSelectedDay.length <= 1}
                        className={`p-2 rounded-full transition-colors ${appointmentsForSelectedDay.length <= 1 ? 'text-gray-300' : 'text-indigo-600 hover:bg-indigo-50'}`}
                    >
                        <ChevronLeft size={20} />
                    </button>

                    <Avatar className="h-24 w-24 border-4 border-indigo-400/50 shadow-md">
                        <AvatarImage src={patientAvatar} alt={patientName} />
                        <AvatarFallback className="text-xl">{patientName.charAt(0)}</AvatarFallback>
                    </Avatar>

                    <button
                        onClick={() => handleNavigation('right')}
                        disabled={appointmentsForSelectedDay.length <= 1}
                        className={`p-2 rounded-full transition-colors ${appointmentsForSelectedDay.length <= 1 ? 'text-gray-300' : 'text-indigo-600 hover:bg-indigo-50'}`}
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>

                <CardTitle className="text-xl font-bold text-gray-800">{patientName}</CardTitle>
                <p className="text-sm text-gray-500 mb-6 font-semibold">Service: {service}</p>

                <Separator className="w-full bg-gray-200 my-4" />

                <h3 className="text-md font-semibold text-gray-700 w-full text-left mb-3 flex items-center gap-2">
                    <User size={18} /> Détails du Patient
                </h3>

                <div className="w-full space-y-2">
                    {[
                        { label: "D.O.B", value: patientDetails.dob },
                        { label: "Taille", value: patientDetails.height },
                        { label: "Poids", value: patientDetails.weight }
                    ].map((detail) => (
                        <div key={detail.label} className="flex justify-between text-sm">
                            <span className="font-normal text-gray-600">{detail.label}</span>
                            <span className="font-medium text-gray-800">{detail.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const isAppointmentDay = (day: Date) => {
        return !isPast(day) && (format(day, 'dd') % 2 === 0);
    };

    return (
        <Card className={cn("shadow-lg border-none h-full bg-white", className)}>
            <CardTitle className="text-lg font-semi-bold p-4 pb-2 flex items-center gap-2">
                <CalendarIcon size={20} className="text-gray-600 " /> Gestion des Rendez-vous
            </CardTitle>

            <CardContent className="p-2 flex flex-col items-center flex-grow">
                <div className="w-full flex justify-center">
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        locale={fr}
                        captionLayout="buttons"
                        className="rounded-md shadow p-1 w-full"

                        classNames={{
                            caption_label: "text-sm font-medium",
                            nav_button: "h-8 w-8",
                            months: "flex flex-col sm:flex-row gap-4",
                            month: "space-y-2",
                            day_label: "text-sm",
                            cell: "h-10 w-10 text-sm p-1 m-0",
                            day: "h-10 w-10 text-sm",
                            day_range_middle: "aria-selected:bg-gray-100 aria-selected:text-gray-900",
                            head_cell: "text-gray-500 rounded-md font-medium text-sm h-10 w-10",
                            row: "flex w-full mt-0",
                            day_selected: "bg-indigo-600 text-white hover:bg-indigo-600 hover:text-white focus:bg-indigo-600 focus:text-white",
                        }}
                        modifiers={{ appointment: isAppointmentDay }}
                        modifiersStyles={{
                            appointment: {
                                border: '1px solid #a785f8',
                            },
                        }}
                    />
                </div>

                <Separator className="w-[90%] bg-gray-200 my-4" />

                {renderPatientDetails()}
            </CardContent>
        </Card>
    );
};

export default AppointmentSidebar;
