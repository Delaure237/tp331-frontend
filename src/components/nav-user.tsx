"use client"

import { BadgeCheck, Bell, ChevronsUpDown, LogOut } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"

export function NavUser() {
    const { isMobile, state } = useSidebar()
    const { authState, logout } = useAuth()
    const { user, isLoading } = authState

    const router = useRouter()
    const isCollapsed = state === "collapsed"

    if (isLoading) {
        return <div className="h-12 w-full animate-pulse bg-sidebar-accent/50 rounded-lg" />;
    }

    if (!user) {
        return (
            <div className="px-4 py-2 text-xs text-muted-foreground italic">
                Non connecté
            </div>
        )
    }

    const handleLogout = async () => {
        await logout();
        router.push("/login");
    };

    const profile = user.patientProfile;
    const fullName = profile
        ? `${profile.firstName} ${profile.lastName}`
        : (user.hospital?.hospitalName || user.email.split('@')[0]);

    const initials = profile
        ? `${profile.firstName[0] || ""}${profile.lastName[0] || ""}`.toUpperCase()
        : user.email[0].toUpperCase();

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-lg border">
                                <AvatarImage src={(user as any).avatar || ""} alt={fullName} />
                                {/* ✅ Avatar Rose ici (bg-pink-100 et texte rose) */}
                                <AvatarFallback className="rounded-lg bg-pink-100 text-pink-600 font-bold text-xs">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            {!isCollapsed && (
                                <div className="grid flex-1 text-left text-sm leading-tight ml-2">
                                    <span className="truncate font-semibold">{fullName}</span>
                                    <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                                </div>
                            )}
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        className="w-56 rounded-xl bg-white border-none shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] p-2"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={10}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-2 py-2 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    {/* ✅ Rappel du rose dans le menu ouvert */}
                                    <AvatarFallback className="rounded-lg bg-pink-100 text-pink-600">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">{fullName}</span>
                                    <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-gray-50" />
                        <DropdownMenuGroup>
                            <DropdownMenuItem className="cursor-pointer hover:bg-gray-50 rounded-md">
                                <BadgeCheck className="mr-2 h-4 w-4" /> Mon Profil
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer hover:bg-gray-50 rounded-md">
                                <Bell className="mr-2 h-4 w-4" /> Notifications
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator className="bg-gray-50" />
                        <DropdownMenuItem
                            onClick={handleLogout}
                            className="cursor-pointer text-destructive hover:bg-red-50 rounded-md"
                        >
                            <LogOut className="mr-2 h-4 w-4" /> Déconnexion
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}