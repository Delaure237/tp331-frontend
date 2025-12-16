"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import Link from "next/link"

// Les imports des composants UI sont maintenus
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"

// Définition de l'interface pour le typage correct des éléments de navigation
interface NavItem {
    title: string
    url: string
    icon?: LucideIcon
    badge?: number
    items?: NavItem[] // Les sous-éléments
}

export function NavMain({
    items,
    pathname, // Prop reçue depuis AppSidebar pour l'état actif
}: {
    items: NavItem[]
    pathname: string
}) {
    // Logique pour déterminer si un élément est actif (correspondance exacte ou sous-route)
    const checkIsActive = (url: string) => {
        // Cas spécifique de l'Accueil (racine) : doit être une correspondance exacte.
        if (url === '/dashboard') {
            return pathname === url;
        }

        // Pour toutes les autres routes : correspondance exacte ou sous-route.
        return pathname === url || pathname.startsWith(`${url}/`);
    }

    return (
        <SidebarGroup>
            <SidebarMenu>
                {items.map((item) => {
                    const hasSubItems = item.items && item.items.length > 0;
                    const itemIsActive = checkIsActive(item.url);

                    if (!hasSubItems) {
                        return (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild tooltip={item.title} isActive={itemIsActive}>
                                    <Link href={item.url}>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                        {/* Vous pouvez ajouter ici item.badge si nécessaire */}
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    }

                    // Logique pour les éléments avec sous-menus (Collapsible)
                    const parentShouldBeOpen = itemIsActive || item.items?.some(subItem => checkIsActive(subItem.url));

                    return (
                        <Collapsible
                            key={item.title}
                            asChild
                            defaultOpen={parentShouldBeOpen} // Ouvrir par défaut si un enfant est actif
                            className="group/collapsible"
                        >
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton tooltip={item.title} isActive={parentShouldBeOpen}>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {item.items?.map((subItem) => (
                                            <SidebarMenuSubItem key={subItem.title}>
                                                <SidebarMenuSubButton asChild isActive={checkIsActive(subItem.url)}>
                                                    <Link href={subItem.url}>
                                                        <span>{subItem.title}</span>
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        ))}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    )
                })}
            </SidebarMenu>
        </SidebarGroup>
    )
}