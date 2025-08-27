import { Search } from "lucide-react"

import { Label } from "./ui/label"
import { SidebarInput } from "./ui/sidebar"

export function SearchForm({ ...props }) {
    return (
        <form {...props}>
            <div className="relative">
                <Label htmlFor="search" className="sr-only">
                    Search
                </Label>
                <SidebarInput
                    id="search"
                    placeholder="Search for something..."
                    className="h-9.5 pl-7 bg-brand-discord border-brand-discord-75"
                />
                <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
            </div>
        </form>
    )
}
