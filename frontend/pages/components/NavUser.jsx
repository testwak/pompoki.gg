"use client"

import {
    BadgeCheck,
    Bell,
    ChevronsUpDown,
    CreditCard,
    LogOut,
    Sparkles,
} from "lucide-react"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "./ui/avatar"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu"

import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "./ui/sidebar"

export function NavUser({ user, onLogout }) {
    const { isMobile } = useSidebar()

    return (
        <>
            <SidebarMenu>
                <SidebarMenuItem>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton
                                size="lg"
                                className="data-[state=open]:bg-brand-50 !px-2 !h-[45px] data-[state=open]:text-sidebar-accent-foreground md:h-8 md:p-0"
                            >
                                <Avatar className="h-8 w-8 rounded-2xl">
                                    <AvatarImage src={user.avatarURL} alt={user.username} />
                                    <AvatarFallback className="rounded-lg">Dummy</AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">@{user.username}</span>
                                    <span className="truncate text-xs">{user.globalname}</span>
                                </div>
                                <ChevronsUpDown className="ml-auto size-4" />
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg bg-brand-discord text-white border-2 border-brand-discord-50 shadow-xl"
                            side={isMobile ? "bottom" : "right"}
                            align="end"
                            sideOffset={5}
                        >
                            <DropdownMenuLabel className="p-0 font-normal">
                                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                    <Avatar className="h-8 w-8 rounded-lg">
                                        <AvatarImage src={user.avatarURL} alt={user.username} />
                                        <AvatarFallback className="rounded-lg">Dummy</AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-medium">@{user.username}</span>
                                        <span className="truncate text-xs">{user.globalname}</span>
                                    </div>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem>
                                    <Sparkles />
                                    Upgrade to Pro
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem>
                                    <BadgeCheck />
                                    Account
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <CreditCard />
                                    Billing
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Bell />
                                    Notifications
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={onLogout} className="hover:bg-brand-discord-75">
                                <LogOut />
                                Log out  
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarMenuItem>
            </SidebarMenu>
        </>
    )
}
