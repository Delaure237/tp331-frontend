import OverviewStats from "@/app/_components/overview/overview-stats";
import SurveyChart from "@/app/_components/overview/hopital-survey-chart";
import DepartmentChart from "@/app/_components/overview/hopital-department-chart";
import RecentAppointmentsTable from "@/app/_components/overview/recent-appointments-table";
import AppointmentSidebar from "@/app/_components/overview/appointment-sidebar";

const Overview = () => {
    return (
      // Page principale avec marges réduites
      <div className="min-h-screen p-2 md:p-4 space-y-4 flex flex-col">

        {/* 1. Statistiques KPI (Cartes) */}
        <OverviewStats />

        {/* 2. Contenu Principal: Graphiques, Tableau et Sidebar (Grid Layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-grow">

            {/* Colonne Gauche (Graphiques + Tableau - 2/3) */}
            <div className="lg:col-span-2 flex flex-col space-y-4">

                {/* Ligne des Graphiques (Grid 2 colonnes) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SurveyChart />
                    <DepartmentChart />
                </div>

                {/* Tableau des Rendez-vous Récents */}
                <RecentAppointmentsTable />

            </div>

            {/* Colonne Droite (Sidebar - 1/3) */}
            <div className="lg:col-span-1 h-full">
                <AppointmentSidebar className="h-full" />
            </div>

        </div>

      </div>
    );
};

export default Overview;
