/* eslint-disable @next/next/no-img-element */
"use client"

import * as React from "react"
import {
    LayoutGrid,
    Users,
    Calendar,
    CreditCard,
    MessageSquare,
    Settings,
    HelpCircle,
    UserCheck,
    Briefcase,
} from "lucide-react"
import { usePathname } from "next/navigation"

import { NavMain } from "@/components/nav-main"
import { cn } from "@/lib/utils"


interface NavUserProps {
    user: {
        name: string;
        email: string;
        avatar: string;
    };
}

const NavUser: React.FC<NavUserProps> = ({ user }) => (
    <div className="flex items-center gap-2">
        <img src={user.avatar} alt={user.name} className="size-8 rounded-full" />
        {/* Le texte est caché en mode collapse */}
        <div className="flex flex-col group-data-[state=collapsed]/sidebar-wrapper:hidden">
            <span className="font-semibold">{user.name}</span>
            <span className="text-xs text-gray-500">{user.email}</span>
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
    SidebarTrigger, // Composant Trigger importé
    useSidebar, // useSidebar importé pour l'état
} from "@/components/ui/sidebar"


// ✅ CORRECTION: Utilisation du type Props du composant Sidebar
export type AppSidebarProps = React.ComponentProps<typeof Sidebar>

const data = {
    user: {
        name: "Fuad",
        email: "fuad@hospi-care.com",
        avatar: "/avatars/fuad.jpg",
    },

    navMain: [
        { title: "Accueil", url: "/dashboard/overview", icon: LayoutGrid, items: [] },
        { title: "Patients", url: "/dashboard/patients", icon: Users, items: [] },
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


// La fonction ne reçoit plus les props d'état manuellement
export function AppSidebar(props: AppSidebarProps) {
    const pathname = usePathname();
    // L'état est géré par le contexte du SidebarProvider
    const { state } = useSidebar();
    const isCollapsed = state === "collapsed";

    return (
        // Les props restantes (variant, side, collapsible, etc.) sont passées ici
        <Sidebar {...props}>

            {/* Intégration du Trigger dans l'en-tête */}
            <SidebarHeader>
                {/* 1. Logo/Titre: Rendu conditionnel pour l'état réduit */}
                <div className={cn("flex items-center gap-2 transition-opacity duration-200", isCollapsed && "opacity-0 w-0 h-0 overflow-hidden")}>
                    <span className="font-bold text-lg">HospiCare</span>
                </div>

                {/* 2. Bouton de Collapse: Toujours visible */}
                <SidebarTrigger />
            </SidebarHeader>

            <SidebarContent>
                <NavItemLabel>PRINCIPAL</NavItemLabel>
                <NavMain items={data.navMain} pathname={pathname} />

                <NavItemLabel>CATALOGUE</NavItemLabel>
                <NavMain items={data.navCatalog} pathname={pathname} />

                <NavItemLabel>AIDE & PARAMÈTRES</NavItemLabel>
                <NavMain items={data.navSettings} pathname={pathname} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    )
}