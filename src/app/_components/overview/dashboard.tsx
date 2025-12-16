// src/app/_components/dashboard.tsx
// N'a pas besoin de "use client" s'il n'y a pas d'interactivité directe ici
import SurveyChart from "./hopital_survey_chart";
import DiseaseChart from "./hopital_disease_chart";
import CalendarView from "./calendar_view";
import OverviewStats from "./overview/overview-stats"; // Réutilisation des stats créées précédemment

const Dashboard = () => {
    return (
        <div className="p-4 md:p-4 space-y-2">
            {/* 1. Zone des Stats KPI (réutilisation) */}
            <OverviewStats />

            {/* 2. Zone des Graphiques et Calendrier (Grid Layout) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 ga2">
                {/* Les deux graphiques prennent deux tiers de l'espace sur grand écran */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <SurveyChart />
                    <DiseaseChart />
                </div>

                {/* Le calendrier prend un tiers de l'espace */}
                <div className="lg:col-span-1">
                    <CalendarView />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;