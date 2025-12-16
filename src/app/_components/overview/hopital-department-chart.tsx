"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Building2 } from 'lucide-react';

const DEPARTMENT_DATA = [
    { name: "Chirurgie", value: 35, color: "#A785F8" },
    { name: "Pédiatrie", value: 45, color: "#85C7F8" },
    { name: "Urgence", value: 20, color: "#F8C785" },
    { name: "Radiologie", value: 15, color: "#85F8A0" },
    { name: "Cardiologie", value: 10, color: "#F88599" },
];

const COLORS = DEPARTMENT_DATA.map(d => d.color);

const DepartmentChart = () => (
    <Card className="shadow-lg border-none bg-white">
        <div className="p-4">
            <CardTitle className="text-lg font-semi-bold p-4 pb-2 flex items-center gap-2"> <Building2 size={20} className="text-gray-600 " />Départements (Visites)
                 </CardTitle>
        </div>
        <CardContent className="h-80 flex items-center justify-center pt-0">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={DEPARTMENT_DATA}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="45%" // Légèrement remonté pour la légende
                        outerRadius={90}
                        labelLine={false}
                        label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                    >
                        {DEPARTMENT_DATA.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${value} visites`, name]}/>
                    <Legend
                        layout="horizontal"
                        align="center"
                        verticalAlign="bottom"
                        iconType="circle"
                        wrapperStyle={{ fontSize: 10, paddingTop: 10 }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </CardContent>
    </Card>
);

export default DepartmentChart;