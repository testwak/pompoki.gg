"use client"
// @ts-nocheck

import * as React from "react"
import {
    IconCamera,
    IconChartBar,
    IconDashboard,
    IconDatabase,
    IconFileAi,
    IconFileDescription,
    IconFileWord,
    IconFolder,
    IconHelp,
    IconInnerShadowTop,
    IconListDetails,
    IconReport,
    IconSearch,
    IconSettings,
    IconUsers,
    IconCardsFilled,
    IconCarambolaFilled,
    IconAlbum,
    IconShoppingBag,
    IconHistory,
} from "@tabler/icons-react"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "./ui/avatar"

import { NavMain } from "./NavMain"
import { NavOther } from "./NavOther"
import { NavUser } from "./NavUser"
import { NavSecondary } from "./NavSecondary"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "./ui/sidebar"

import Image from "next/image"

export function AppSidebar({ user, onLogout, ...props }) {
    const data = {
        navMain: [
            {
                title: "Home",
                url: "/dashboard",
                icon: IconDashboard,
            },
            {
                title: "Card Collection",
                url: "/card_collection",
                icon: IconCardsFilled,
            },
            {
                title: "Battlepass",
                url: "/battlepass",
                icon: IconCarambolaFilled,
            },
        ],
        
        navSecondary: [
            {
                title: "Settings",
                url: "/settings",
                icon: IconSettings,
            },
            {
                title: "Get Help",
                url: "#",
                icon: IconHelp,
            },
            {
                title: "Search",
                url: "#",
                icon: IconSearch,
            },
        ],
        other: [
            {
                name: "My Album",
                url: "#",
                icon: IconAlbum,
            },
            {
                name: "Marketplace",
                url: "#",
                icon: IconShoppingBag,
            },
            {
                name: "My History",
                url: "#",
                icon: IconHistory,
            },
        ],
    }

    return (
        <Sidebar collapsible="icon" {...props} className="bg-brand text-white">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            icon={
                                <span className="flex items-center justify-center w-8 h-8">
                                <Image
                                    src="/pompoki-icon.gif"
                                    className="h-full w-full rounded-lg object-cover"
                                    alt="Card Collection"
                                    height={100}
                                    width={100}
                                    unoptimized
                                />
                                </span>
                            }
                            asChild
                            className="data-[slot=sidebar-menu-button]:!p-0 flex items-center gap-2"
                        >
                            <Image
                                src="/pompoki-icon.gif"
                                className="h-8 w-8 rounded-lg object-cover"
                                alt="Card Collection"
                                height={100}
                                width={100}
                                unoptimized
                            />
                            <span className="text-white font-discord tracking-wide">POMPOKI Dashboard</span>
                            
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                {/*<NavOther items={data.other} />*/}
                {/*<NavSecondary items={data.navSecondary} className="mt-auto" />*/}
            </SidebarContent>
            <SidebarFooter>
                {user !== null && <NavUser user={user} onLogout={onLogout} />}
            </SidebarFooter>
        </Sidebar>
    )
}
