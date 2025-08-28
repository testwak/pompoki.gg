// @ts-nocheck

import { Button } from "./ui/button"
import { Separator } from "./ui/separator"
import { SidebarTrigger } from "./ui/sidebar"
import { SearchForm } from "./SearchForm"

export function SiteHeader(user) {
    const handleLogin = () => {
        // Redirect to Discord OAuth
        window.location.href = `${process.env.FRONTEND_URL}/auth/login`
    }
    return (
        <header className="flex h-15 shrink-0 text-lg items-center gap-2 border-b border-brand-discord-50 text-white transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) bg-brand md:rounded-t-xl md:bg-brand-discord">
            <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                <SidebarTrigger />
                <Separator
                    orientation="vertical"
                    className="mx-2 data-[orientation=vertical]:h-4"
                />
                <h1 className="text-white font-medium">Dashboard</h1>
                <div className="ml-auto flex items-center gap-2">
                    <SearchForm className="w-full sm:ml-auto sm:w-auto" />
                    <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
                        <a
                            href="https://discord.gg/pompoki"
                            rel="noopener noreferrer"
                            target="_blank"
                            className="dark:text-foreground hover:text-white/60"
                        >
                            Support Server
                        </a>
                    </Button>

                    {!user && <Button 
                        onClick={handleLogin}
                        className="text-white bg-brand active:bg-brand/50 hover:bg-brand/70">
                        Login
                    </Button>}
                </div>
            </div>
        </header>
    )
}
