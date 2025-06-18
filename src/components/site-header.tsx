"use client"

import { SidebarIcon } from "lucide-react"
import { FaDiscord, FaGithub, FaXTwitter } from "react-icons/fa6";
import { IoIosNotifications } from "react-icons/io";

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useSidebar } from "@/components/ui/sidebar"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Link } from "react-router";

export function SiteHeader() {
    const { toggleSidebar } = useSidebar()

    return (
        <header className="bg-(--sidebar) sticky top-0 z-50 flex w-full items-center justify-between border-b">
            {/* <div>
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
            </div> */}
            <Button variant="ghost" size="lg" className="px-0 ml-3">
                <Link to="/">
                    <Avatar className="h-8 w-8 rounded-sm">
                        <AvatarImage src="https://github.com/evilrabbit.png" alt="User" />
                        <AvatarFallback>JS</AvatarFallback>
                    </Avatar>
                </Link>
            </Button>
            <div className="flex items-center gap-10 mr-4 h-(--header-height) justify-end">
                {/* <div className="flex flex-row gap-2">
                    <Button size="lg" variant="outline" asChild>
                        <h3 className="text-sm">₹ 5000</h3>
                    </Button>
                    <Button size="lg" variant="primary_button" asChild>
                        <h2>Cashout</h2>
                    </Button>
                    <Button size="lg" variant="destructive" asChild>
                        <h2>Deposit</h2>
                    </Button>
                </div> */}
                <div className="flex flex-row gap-2">
                    <Button size="lg" variant="outline" asChild>
                        <Link to="/notifications">
                            <IoIosNotifications />
                        </Link>
                    </Button>
                    <Button variant="ghost" size="lg" className="rounded-full px-0">
                        <Link to="/profile">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src="https://github.com/evilrabbit.png" alt="User" />
                                <AvatarFallback>JS</AvatarFallback>
                            </Avatar>
                        </Link>
                    </Button>
                </div>
            </div>
        </header >
    )
}
