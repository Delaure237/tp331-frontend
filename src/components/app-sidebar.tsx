/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import * as React from "react"
import { Dispatch, SetStateAction } from "react"
import {
    LayoutGrid,
    Users,
    Calendar,
    CreditCard,
    MessageSquare,
    Settings,
    HelpCircle,
    FileText,
    BarChart3,
    UserCheck,
    Briefcase,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
// Assurez-vous d'avoir le composant NavUser:
// import { NavUser } from "@/components/nav-user"

// --- DÉBUT DES SIMULATIONS D'IMPORTATION ---
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const NavUser = (props: any) => (
    <div className="flex items-center gap-2">
        <img src={props.user.avatar} alt={props.user.name} className="size-8 rounded-full" />
        <div className="flex flex-col">
            <span className="font-semibold">{props.user.name}</span>
            <span className="text-xs text-gray-500">{props.user.email}</span>
        </div>
    </div>
);
// --- FIN DES SIMULATIONS ---


import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
    NavItemLabel,
} from "@/components/ui/sidebar"


export interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
    isCollapsed: boolean;
    setIsCollapsed: Dispatch<SetStateAction<boolean>>;
}

const data = {
    user: {
        name: "Fuad",
        email: "fuad@hospi-care.com",
        avatar: "/avatars/fuad.jpg", // Changez ceci si besoin
    },

    navMain: [
        { title: "Accueil", url: "/dashboard", icon: LayoutGrid, isActive: false, items: [] },
        // L'élément "Patients" est actif pour la surbrillance
        { title: "Patients", url: "/dashboard/patients", icon: Users, isActive: true, items: [] },
        { title: "Rendez-vous", url: "/dashboard/appointments", icon: Calendar, items: [] },
        { title: "Paiements", url: "/dashboard/payments", icon: CreditCard, items: [] },
        { title: "Messages", url: "/dashboard/messages", icon: MessageSquare, badge: 3, items: [] },
    ],

    navCatalog: [
        { title: "Docteurs", url: "/dashboard/doctors", icon: UserCheck, items: [] },
        { title: "Employés", url: "/dashboard/employees", icon: Briefcase, items: [] },
    ],

    navSettings: [
        { title: "Paramètres", url: "/dashboard/settings", icon: Settings, items: [] },
        { title: "Centre d'aide", url: "/dashboard/help", icon: HelpCircle, items: [] },
    ],
}


export function AppSidebar({ isCollapsed, setIsCollapsed, ...props }: AppSidebarProps) {
    return (
        <Sidebar>

            <SidebarHeader>
                 {/* Insérez le Logo ici */}
            </SidebarHeader>

            <SidebarContent>

                <NavItemLabel>PRINCIPAL</NavItemLabel>
                <NavMain items={data.navMain} />

                <NavItemLabel>CATALOGUE</NavItemLabel>
                <NavMain items={data.navCatalog} />

                <NavItemLabel>AIDE & PARAMÈTRES</NavItemLabel>
                <NavMain items={data.navSettings} />

            </SidebarContent>

            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    )
}