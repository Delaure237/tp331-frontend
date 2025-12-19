"use client"

import * as React from "react"
import {
    LayoutGrid, Users, Calendar, CreditCard, MessageSquare,
    Settings, HelpCircle, UserCheck, Briefcase, Building2,
    FileText, Loader2
} from "lucide-react"
import { usePathname } from "next/navigation"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/auth-context"
import {
    Sidebar, SidebarContent, SidebarFooter, SidebarHeader,
    SidebarRail, NavItemLabel, SidebarTrigger, useSidebar,
} from "@/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname();
    const { state } = useSidebar();
    const { authState, getRole } = useAuth();
    const isCollapsed = state === "collapsed";

    // Utilisation de la fonction de normalisation du rôle
    const role = getRole();
    const userRole = role ? role.toLowerCase() : "";
    const isLoading = authState.isLoading;

    const navigation = {
        navMain: [
            { title: "Accueil", url: "/dashboard/overview", icon: LayoutGrid, roles: ["hospital admin", "doctor", "patient"] },
            { title: "Patients", url: "/dashboard/patients", icon: Users, roles: ["hospital admin", "doctor"] },
            { title: "Rendez-vous", url: "/dashboard/appointments", icon: Calendar, roles: ["hospital admin", "doctor"] },
            { title: "Mes Rendez-vous", url: "/dashboard/my-appointments", icon: Calendar, roles: ["patient"] },
            { title: "Prendre RDV", url: "/dashboard/patients/appointment-booking", icon: Calendar, roles: ["patient"] },
            { title: "Mes Documents", url: "/dashboard/documents", icon: FileText, roles: ["patient"] },
            { title: "Paiements", url: "/dashboard/paiements", icon: CreditCard, roles: ["hospital admin"] },
        ],
        navCatalog: [
            { title: "Docteurs", url: "/dashboard/doctors", icon: UserCheck, roles: ["hospital admin", "doctor"] },

            { title: "Départements", url: "/dashboard/departements", icon: Building2, roles: ["hospital admin"] },
        ],
        navSettings: [
            { title: "Paramètres", url: "/dashboard/settings", icon: Settings, roles: ["hospital admin", "doctor", "patient"] },
            { title: "Centre d'aide", url: "/dashboard/help", icon: HelpCircle, roles: ["hospital admin", "doctor", "patient"] },
        ],
    }

    const filterByRole = (items: any[]) => {
        if (!userRole) return [];
        return items.filter(item => item.roles.includes(userRole));
    }

    const mainItems = filterByRole(navigation.navMain);
    const catalogItems = filterByRole(navigation.navCatalog);
    const settingsItems = filterByRole(navigation.navSettings);

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <div className={cn(
                    "flex items-center gap-2 px-2 transition-all duration-200",
                    isCollapsed ? "justify-center py-2" : "justify-between py-1.5"
                )}>
                    {!isCollapsed && (
                        <span className="font-bold text-lg tracking-tight text-[#058D66]"> HospiCare </span>
                    )}
                    <SidebarTrigger />
                </div>
            </SidebarHeader>

            <SidebarContent>
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center p-8">
                        <Loader2 className="h-6 w-6 animate-spin text-[#058D66]" />
                    </div>
                ) : (
                    <>
                        {mainItems.length > 0 && (
                            <div className="mt-2">
                                <NavItemLabel>PRINCIPAL</NavItemLabel>
                                <NavMain items={mainItems} pathname={pathname} />
                            </div>
                        )}
                        {catalogItems.length > 0 && (
                            <div className="mt-4">
                                <NavItemLabel>CATALOGUE</NavItemLabel>
                                <NavMain items={catalogItems} pathname={pathname} />
                            </div>
                        )}
                        {settingsItems.length > 0 && (
                            <div className="mt-4">
                                <NavItemLabel>AIDE & PARAMÈTRES</NavItemLabel>
                                <NavMain items={settingsItems} pathname={pathname} />
                            </div>
                        )}
                        {!isLoading && mainItems.length === 0 && (
                            <div className="p-4 text-xs text-center text-slate-400">
                                Aucun accès trouvé pour le rôle : "{role}"
                            </div>
                        )}
                    </>
                )}
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}