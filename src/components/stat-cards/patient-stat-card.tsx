"use client";
import React from "react";
import {
    TrendingUp,
    TrendingDown,
    LucideIcon,
    Users,
    Heart,
    ListChecks,
    Clock,
    UserPlus,
    FileText
} from "lucide-react";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// Types
type TrendType = "up" | "down" | "stable";
type PatientIconKey =
    | "users"
    | "heart"
    | "listChecks"
    | "clock"
    | "userPlus"
    | "fileText";

type PatientPeriod =
    | "Today"
    | "This week"
    | "This month"
    | "Last month"
    | "This year";

type PatientStatCardProps = {
    iconKey: PatientIconKey;
    title: string;
    count: number | string;
    trend: TrendType;
    percentage: number | string;
    period: PatientPeriod;
    subtitle: string;
    perspective: string;
    isLoading?: boolean;
    onPeriodChange: (value: PatientPeriod) => void;
    isPeriodSelectorVisible?: boolean;
};

// Mapping icônes
const icons: Record<PatientIconKey, LucideIcon> = {
    users: Users,
    heart: Heart,
    listChecks: ListChecks,
    clock: Clock,
    userPlus: UserPlus,
    fileText: FileText,
};

export default function PatientStatCard({
    iconKey,
    title,
    count,
    trend,
    percentage,
    period,
    subtitle,
    perspective,
    onPeriodChange,
    isLoading,
    isPeriodSelectorVisible = true,
}: PatientStatCardProps) {

    const Icon = icons[iconKey];

    const periodLabels: Record<PatientPeriod, string> = {
        Today: "Today",
        "This week": "This week",
        "This month": "This Month",
        "Last month": "Last Month",
        "This year": "This Year",
    };

    return (
        <div className="p-3 rounded-2xl shadow-md bg-white hover:bg-gray-50 transition-colors">

            {/* Ligne 1 : Titre/Icône + Select */}
            <div className="flex items-center justify-between pb-2">
                <div className="flex items-center space-x-2">
                    <Icon className="h-5 w-5 text-gray-900" />
                    <p className="text-sm font-medium text-gray-900">{title}</p>
                </div>

                {isPeriodSelectorVisible && (
                    <Select
                        onValueChange={(v: PatientPeriod) => onPeriodChange(v)}
                        value={period}
                    >
                        <SelectTrigger className="w-[120px] h-8 text-xs">
                            <SelectValue placeholder="Select Period" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.entries(periodLabels).map(([key, label]) => (
                                <SelectItem key={key} value={key}>
                                    {label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            </div>

            {/* Ligne 2 : Count + Trend */}
            <div className="flex items-center justify-between mt-2">
                <p className="text-2xl font-bold">{isLoading ? "..." : count}</p>

                <div className="flex mt-1">
                    <div
                        className={`flex items-center rounded-2xl w-17 p-1 justify-center ${
                            trend === "up"
                                ? "text-green-500 bg-green-200"
                                : trend === "down"
                                ? "text-red-500 bg-red-200"
                                : "text-gray-500 bg-gray-200"
                        }`}
                    >
                        {trend === "up" ? (
                            <TrendingUp size={14} />
                        ) : trend === "down" ? (
                            <TrendingDown size={14} />
                        ) : (
                            <TrendingUp size={14} className="text-gray-500" />
                        )}

                        <span className="text-sm ml-1">{percentage + "%"}</span>
                    </div>
                </div>
            </div>

            {/* Ligne 3 : Subtitle & Perspective */}
            <div className="flex items-center mt-2">
                <p className="text-sm text-gray-500 mr-1">{subtitle}</p>
                <p className="text-sm text-gray-900 font-medium">{perspective}</p>
            </div>
        </div>
    );
}
