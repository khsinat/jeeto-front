"use client"

import { SidebarIcon } from "lucide-react"
import { FaDiscord, FaGithub, FaXTwitter } from "react-icons/fa6";

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useSidebar } from "@/components/ui/sidebar"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"

export function SiteHeader() {
    const { toggleSidebar } = useSidebar()

    return (
        <header className="bg-(--header-background) sticky top-0 z-50 flex w-full items-center justify-between border-b">
            <div>
                <div className="flex h-(--header-height) w-full items-center gap-2 px-2">
                    <Button
                        className="h-8 w-8"
                        variant="ghost"
                        size="icon"
                        onClick={toggleSidebar}
                    >
                        <SidebarIcon />
                    </Button>
                    <Separator orientation="vertical" className="mr-2 h-4" />

                </div>
            </div>
            <div className="flex flex-row  overflow-clip items-center border-3 rounded-xl ">
                <span className="text-sm  mx-4 text-(--header-text) rounded-l-xl font-bold flex-initial ">
                    ₹ 5000
                </span>
                <Button variant={'primary_button'} className="h-10 w-20 rounded-l-none rounded-r-none border-t-0 border-b-0" >
                    <span className="text-md font-bold">Deposit</span>
                </Button>
                <Button variant={'outline'} className="h-10 w-20 rounded-r-md rounded-l-none border-none">
                    <span className="text-md">Cashout</span>
                </Button>
            </div>
            <div className="flex items-center gap-1 mr-4">
                <Button size="lg" variant="outline" asChild>
                    <a
                        href="https://x.com/shadcnblocks"
                        target="_blank"
                        className="size-10"
                    >
                        <FaXTwitter />
                    </a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                    <a
                        href="https://github.com/shadcnblocks"
                        target="_blank"
                        className="size-10"
                    >
                        <FaGithub />
                    </a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                    <a
                        href="https://shadcnblocks.com"
                        target="_blank"
                        className="size-10"
                    >
                        <FaDiscord />
                    </a>
                </Button>
            </div>

        </header>
    )
}
