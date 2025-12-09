"use client"
// @ts-nocheck

import { IconCirclePlusFilled, IconMail, IconAlertSquareRounded } from "@tabler/icons-react"
import Link from "next/link"

import { Button } from "./ui/button"
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "./ui/sidebar"

export function NavMain({ items }) {
    return (
        <SidebarGroup>
            <SidebarGroupContent className="flex flex-col gap-2">
                <SidebarMenu>
                    <SidebarMenuItem className="flex items-center gap-2">
                        {/*<SidebarMenuButton
                            tooltip="Quick Create"
                            className="bg-brand-discord-50 hover:bg-brand-discord/90 hover:text-white active:bg-brand-discord/50 active:text-white min-w-8 duration-200 ease-linear"
                        >
                            <IconCirclePlusFilled />
                            <span>Quick Create</span>
                        </SidebarMenuButton>
                        <Button
                            size="icon"
                            className="size-8 group-data-[collapsible=icon]:opacity-0 bg-brand-discord border-brand-discord-50"
                            variant="outline"
                        >
                            <IconAlertSquareRounded />
                            <span className="sr-only">How it works?</span>
                        </Button>*/}
                    </SidebarMenuItem>
                </SidebarMenu>
                <SidebarMenu>
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title} className="hover:bg-brand-50 hover:rounded-md">
                            <Link href={item.url}>
                                <SidebarMenuButton tooltip={item.title}>
                                    {item.icon && <item.icon />}
                                    {item.title}
                                </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}
