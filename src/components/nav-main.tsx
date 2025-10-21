"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"

// Assurez-vous d'avoir ces composants dans votre projet:
// import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

// --- DÉBUT DES SIMULATIONS D'IMPORTATION ---
const Collapsible = (props: any) => <div {...props} />;
const CollapsibleContent = (props: any) => <div {...props} />;
const CollapsibleTrigger = (props: any) => <button {...props} />;
// --- FIN DES SIMULATIONS ---


import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"

export function NavMain({
    items,
}: {
    items: {
        title: string
        url: string
        icon?: LucideIcon
        isActive?: boolean
        items?: {
            title: string
            url: string
        }[]
    }[]
}) {
    return (
        <SidebarGroup>
            <SidebarMenu>
                {items.map((item) => {
                    const hasSubItems = item.items && item.items.length > 0;

                    if (!hasSubItems) {
                        return (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild tooltip={item.title} isActive={item.isActive}>
                                    {/* 🎯 Le lien a est essentiel pour la navigation */}
                                    <a href={item.url}>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    }

                    return (
                        <Collapsible
                            key={item.title}
                            asChild
                            defaultOpen={item.isActive}
                            className="group/collapsible"
                        >
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton tooltip={item.title}>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                        {/* Affiche la flèche UNIQUEMENT s'il y a des sous-menus */}
                                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {item.items?.map((subItem) => (
                                            <SidebarMenuSubItem key={subItem.title}>
                                                <SidebarMenuSubButton asChild>
                                                    {/* 🎯 Le lien a est essentiel pour la navigation */}
                                                    <a href={subItem.url}>
                                                        <span>{subItem.title}</span>
                                                    </a>
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