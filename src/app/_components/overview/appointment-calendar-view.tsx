"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from 'date-fns/locale';

const appointments = [
    new Date(2025, 11, 15),
    new Date(2025, 11, 18),
    new Date(2025, 11, 22),
    new Date(2025, 11, 25), // Nouvelles données
    new Date(2025, 11, 28),
];

const isAppointmentDay = (day: Date) => {
    return appointments.some(apptDate =>
        format(apptDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
    );
};

const CalendarView = () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date());

    return (
        <Card className="shadow-lg border-none">
            <div className="p-4">
                <CardTitle>📅 Rendez-vous</CardTitle>
            </div>
            {/* La hauteur de la CardContent peut être réduite ou ajustée par le contenu */}
            <CardContent className="flex justify-center p-2 pt-0">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    locale={fr}
                    className="rounded-md shadow"
                   
                    modifiers={{ appointment: isAppointmentDay }}
                    modifiersStyles={{
                        appointment: {
                            fontWeight: 'bold',
                            backgroundColor: '#eef2ff',
                            borderRadius: '50%',
                            border: '1px solid #a785f8',
                        },
                    }}
                />
            </CardContent>
        </Card>
    );
};

export default CalendarView;