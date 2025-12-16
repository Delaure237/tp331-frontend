"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

const diseaseData = [
    { name: "Grippe", value: 35, color: "#A785F8" },
    { name: "Pneumonie", value: 45, color: "#85C7F8" },
    { name: "Rhumes", value: 20, color: "#F8C785" },
];

const COLORS = diseaseData.map(d => d.color);


const DiseaseChart = () => {
    return (
        <Card className = "bg-white">
            <CardHeader>
                <CardTitle className='text-lg font-semi-bold'> Maladies Courantes</CardTitle>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={diseaseData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        >
                            {diseaseData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value, name) => [`${value} cas`, name]}
                            contentStyle={{ background: 'white', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                        <Legend layout="horizontal" align="center" verticalAlign="bottom" iconType="circle" />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export default DiseaseChart;