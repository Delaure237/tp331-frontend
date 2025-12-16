"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Hospital } from 'lucide-react';

const SURVEY_DATA = [
    { date: "15 Jul", "Nouveaux Patients": 30, "Anciens Patients": 50 },
    { date: "16 Jul", "Nouveaux Patients": 50, "Anciens Patients": 70 },
    { date: "17 Jul", "Nouveaux Patients": 40, "Anciens Patients": 60 },
    { date: "18 Jul", "Nouveaux Patients": 70, "Anciens Patients": 90 },
    { date: "19 Jul", "Nouveaux Patients": 55, "Anciens Patients": 75 },
];

// Utilisation d'une fonction fléchée implicite pour compacter
const SurveyChart = () => (
    <Card className="shadow-lg border-none bg-white">
        <div className="p-3">
            <CardTitle className="text-lg font-semi-bold p-4 pb-2 flex items-center gap-2">
                <Hospital size={20} className="text-gray-600 " /> Enquête Hospitalière</CardTitle>
        </div>
        {/* Hauteur réduite à h-72 pour la compaction */}
        <CardContent className="h-72 pb-1">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={SURVEY_DATA} margin={{ top: 0, right: 5, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
                    <XAxis dataKey="date" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ background: 'white', border: '1px solid #ccc', borderRadius: '4px', fontSize: 10 }}/>
                    <Legend wrapperStyle={{ fontSize: 9, paddingTop: 5 }} layout="horizontal" align="center" verticalAlign="bottom" />
                    <Bar dataKey="Nouveaux Patients" fill="#A785F8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Anciens Patients" fill="#85C7F8" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </CardContent>
    </Card>
);

export default SurveyChart;