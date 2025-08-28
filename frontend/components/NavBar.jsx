// @ts-nocheck

import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    DropdownItem,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    Avatar,
} from "@heroui/react";
import { useRouter } from 'next/router'

import Link from 'next/link'

export default function NavBar({ onLogout, user }) {
    const router = useRouter()
    const routerPathName = router.pathname

    return (
        <Navbar className="bg-brand py-1" isBordered>
            <NavbarBrand>
                <Avatar 
                    src="pompoki-icon.gif"
                    size="md"
                    radius="sm"
                />
                <p className="text-white font-discord tracking-wide ml-1.5">POMPOKI Dashboard</p>
            </NavbarBrand>

            {onLogout && (
                <NavbarContent justify="end" className="hidden sm:flex gap-4 text-white justify-self-start">
                    <NavbarItem className="hover:text-white/70">
                        <Link href="/dashboard">
                            Home
                        </Link>
                    </NavbarItem>
                    <NavbarItem className="hover:text-white/70">
                        <Link href="/card_collection">
                            Card Collection
                        </Link>
                    </NavbarItem>
                    <NavbarItem className="hover:text-white/70">
                        <Link href="#">
                            Doc
                        </Link>
                    </NavbarItem>
                </NavbarContent>
            )}

            <NavbarContent justify="end">
                <Dropdown placement="bottom-end">
                    {onLogout ? (
                        <DropdownTrigger>
                            <Avatar
                                isBordered
                                as="button"
                                classNames={{
                                    base: "ring-2 ring-white ring-offset-3 ring-offset-brand",
                                    img: "object-cover"
                                  }}                   
                                name={user?.username || "Null"}
                                size="md"
                                
                                src={user?.avatarURL || "https://cdn.discordapp.com/embed/avatars/0.png"}
                            />
                        </DropdownTrigger>
                    ) : (
                        <Avatar
                            
                            className="transition-transform"
                            name="Null"
                            size="md"
                            src="https://cdn.discordapp.com/embed/avatars/0.png"
                        />
                    )}

                    {onLogout && (
                        <DropdownMenu aria-label="Profile Actions" className="">
                            <DropdownItem key="profile" className="h-14 gap-2">
                                <p className="font-semibold">Signed in as</p>
                                <p className="font-semibold">{user?.username || "Unknown"}</p>
                            </DropdownItem>
                            <DropdownItem key="settings">
                                <Link href="/settings">My Settings</Link>
                            </DropdownItem>
                            <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
                            <DropdownItem key="logout" color="danger" onPress={onLogout}>
                                Log Out
                            </DropdownItem>
                        </DropdownMenu>
                    )}
                </Dropdown>
            </NavbarContent>
        </Navbar>
    );
}
