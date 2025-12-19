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
  FileText,
  AlertCircle
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type PatientPeriod =
  | "today"
  | "thisWeek"
  | "thisMonth"
  | "lastMonth"
  | "thisYear";

type TrendType = "up" | "down" | "stable";

type PatientIconKey =
  | "users"
  | "heart"
  | "listChecks"
  | "clock"
  | "userPlus"
  | "fileText";

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

const icons: Record<string, LucideIcon> = {
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
  const Icon = icons[iconKey] || AlertCircle;

  const periodLabels: Record<PatientPeriod, string> = {
    today: "Aujourd'hui",
    thisWeek: "Cette semaine",
    thisMonth: "Ce mois-ci",
    lastMonth: "Mois dernier",
    thisYear: "Cette année",
  };

  // Nettoyage pragmatique des données d'affichage
  const cleanPercentage = String(percentage).replace('%', '');
  const isZero = cleanPercentage === "0" || cleanPercentage === "-0";
  const displayPercentage = isZero ? "0" : cleanPercentage;

  return (
    <div className="p-3 rounded-2xl shadow-md bg-white hover:bg-gray-50 transition-colors border border-gray-100">
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
            <SelectTrigger className="w-[140px] h-8 text-xs">
              {/* Utilisation du label correspondant à la valeur sélectionnée */}
              <SelectValue>{periodLabels[period]}</SelectValue>
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

      <div className="flex items-center justify-between mt-2">
        <p className="text-2xl font-bold">{isLoading ? "..." : count}</p>
        <div className="flex mt-1">
          <div
            className={`flex items-center rounded-2xl px-2 py-1 justify-center ${
              isZero
                ? "text-gray-500 bg-gray-100"
                : trend === "up"
                ? "text-green-600 bg-green-100"
                : "text-red-600 bg-red-100"
            }`}
          >
            {!isZero && (trend === "up" ? <TrendingUp size={14} /> : <TrendingDown size={14} />)}
            <span className="text-sm font-semibold ml-1">{displayPercentage}%</span>
          </div>
        </div>
      </div>

      <div className="flex items-center mt-2">
        <p className="text-xs text-gray-500 mr-1">{subtitle}</p>
        <p className="text-xs text-gray-900 font-medium">{perspective}</p>
      </div>
    </div>
  );
}