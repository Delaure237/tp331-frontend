"use client" // 👈 AJOUTER CETTE DIRECTIVE POUR UTILISER useState

import { AppSidebar } from "@/components/app-sidebar"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
    useSidebar // 👈 IMPORTER useSidebar
} from "@/components/ui/sidebar"
import * as React from "react" // 👈 IMPORTER React

// On crée un composant client qui utilise le contexte de la sidebar
function DashboardContent() {
   
    const { open, setOpen } = useSidebar();

    // NOTE: Dans votre implémentation de SidebarProvider/useSidebar,
    // l'état `open` correspond à `!isCollapsed` (ou inversement si la logique est inversée).
    // Nous allons passer les fonctions du contexte de la sidebar.

    return (
        <>
            {/* L'état `open` de useSidebar correspond à isCollapsed=false si open=true. */}
            <AppSidebar isCollapsed={!open} setIsCollapsed={setOpen} />

            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 data-[orientation=vertical]:h-4"
                        />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="#">
                                        Building Your Application
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                        <div className="bg-muted/50 aspect-video rounded-xl" />
                        <div className="bg-muted/50 aspect-video rounded-xl" />
                        <div className="bg-muted/50 aspect-video rounded-xl" />
                    </div>
                    <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
                </div>
            </SidebarInset>
        </>
    );
}


export default function Page() {
    return (
        <SidebarProvider>
            {/* On rend DashboardContent, qui est un composant client
               et utilise useSidebar, à l'intérieur du provider. */}
            <DashboardContent />
        </SidebarProvider>
    )
}