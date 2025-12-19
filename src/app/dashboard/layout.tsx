"use client"

import { AppSidebar } from "@/components/app-sidebar"
import * as React from "react"
import { usePathname } from "next/navigation"
import { ChevronRight } from "lucide-react"
import { useMemo } from "react"

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { SidebarInset } from "@/components/ui/sidebar"
import { NavUser } from "@/components/nav-user" // On importe notre composant NavUser

interface LayoutProps {
    children: React.ReactNode;
}

/**
 * DashboardContent : Gère l'en-tête (Header) et la zone de contenu.
 */
function DashboardContent({ children }: LayoutProps) {
    const pathname = usePathname();

    const getBreadcrumbItems = useMemo(() => {
        return () => {
            const pathSegments = pathname.split('/').filter(Boolean).filter(segment => segment !== 'dashboard');
            const breadcrumbs = [
                <React.Fragment key="dashboard-root">
                    <BreadcrumbItem><BreadcrumbLink href="/dashboard">Tableau de Bord</BreadcrumbLink></BreadcrumbItem>
                </React.Fragment>
            ];
            let currentPath = "/dashboard";
            pathSegments.forEach((segment, index) => {
                currentPath += `/${segment}`;
                const isLast = index === pathSegments.length - 1;
                const displaySegment = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
                breadcrumbs.push(<BreadcrumbSeparator key={`separator-${index}`}><ChevronRight className="size-3" /></BreadcrumbSeparator>);
                if (isLast) {
                    breadcrumbs.push(<BreadcrumbItem key={segment}><BreadcrumbPage>{displaySegment}</BreadcrumbPage></BreadcrumbItem>);
                } else {
                    breadcrumbs.push(<BreadcrumbItem key={segment} className="hidden md:block"><BreadcrumbLink href={currentPath}>{displaySegment}</BreadcrumbLink></BreadcrumbItem>);
                }
            });
            if (pathSegments.length === 0) {
                return (<BreadcrumbList><BreadcrumbItem><BreadcrumbPage>Tableau de Bord</BreadcrumbPage></BreadcrumbItem></BreadcrumbList>);
            }
            return <BreadcrumbList>{breadcrumbs}</BreadcrumbList>;
        };
    }, [pathname]);

    return (
        <SidebarInset className="relative flex flex-col flex-1 overflow-hidden bg-[#f4f8ff]">

            {/* Header avec Breadcrumb à gauche et NavUser à droite */}
            <header className="sticky top-0 z-10 flex shrink-0 items-center justify-between bg-white/80 backdrop-blur-md border-b border-gray-100 h-16 px-6">
                <Breadcrumb>
                    {getBreadcrumbItems()}
                </Breadcrumb>

                {/* Profil Utilisateur en position Trailing (droite) */}
                <div className="flex items-center gap-4">
                    <NavUser />
                </div>
            </header>

            {/* main */}
            <main className="flex-1 overflow-y-auto max-w-full p-0">
                <div className="max-w-7xl mx-auto w-full px-4 py-4">
                    {children}
                </div>
            </main>
        </SidebarInset>
    )
}

/**
 * Layout du Dashboard : Conteneur racine Flex principal.
 */
export default function DashboardLayout({ children }: LayoutProps) {
    return (
        <div className="flex w-full h-full overflow-hidden">
            <AppSidebar />
            <DashboardContent>{children}</DashboardContent>
        </div>
    );
}