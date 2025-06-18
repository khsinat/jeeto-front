"use client"

import * as React from "react"
import {
    BookOpen,
    Bot,
    Command,
    Frame,
    Map,
    PieChart,
    Settings2,
    SquareTerminal,
    GalleryVerticalEnd,
    AudioWaveform
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail
} from "@/components/ui/sidebar"
import { TeamSwitcher } from "./team-switcher"

const data = {
    user: {
        name: "Jeeto Ai",
        email: "mail@jeetoai.com",
        avatar: "/avatars/shadcn.jpg",
    },
    teams: [
        {
            name: "Jeeto Ai",
            logo: GalleryVerticalEnd,
            plan: "Enterprise",
        },
        {
            name: "Jeeto Ai",
            logo: AudioWaveform,
            plan: "Startup",
        },
        {
            name: "Jeeto Ai",
            logo: Command,
            plan: "Free",
        },
    ],
    navMain: [
        {
            title: "All Games",
            url: "#",
            icon: SquareTerminal,
            isActive: true,
            // items: [
            //     {
            //         title: "History",
            //         url: "#",
            //     },
            //     {
            //         title: "Starred",
            //         url: "#",
            //     },
            //     {
            //         title: "Settings",
            //         url: "#",
            //     },
            // ],
        },
        {
            title: "Casino",
            url: "#",
            icon: Bot,
            // items: [
            //     {
            //         title: "Genesis",
            //         url: "#",
            //     },
            //     {
            //         title: "Explorer",
            //         url: "#",
            //     },
            //     {
            //         title: "Quantum",
            //         url: "#",
            //     },
            // ],
        },
        {
            title: "Sports bet",
            url: "#",
            icon: BookOpen,
            // items: [
            //     {
            //         title: "Introduction",
            //         url: "#",
            //     },
            //     {
            //         title: "Get Started",
            //         url: "#",
            //     },
            //     {
            //         title: "Tutorials",
            //         url: "#",
            //     },
            //     {
            //         title: "Changelog",
            //         url: "#",
            //     },
            // ],
        },
        {
            title: "Settings",
            url: "#",
            icon: Settings2,
            items: [
                {
                    title: "General",
                    url: "#",
                },
                {
                    title: "Team",
                    url: "#",
                },
                {
                    title: "Billing",
                    url: "#",
                },
                {
                    title: "Limits",
                    url: "#",
                },
            ],
        },
    ],
    projects: [
        {
            name: "Promotions",
            url: "#",
            icon: Frame,
        },
        {
            name: "Affiliate",
            url: "#",
            icon: PieChart,
        },
        {
            name: "Explore",
            url: "#",
            icon: Map,
        },
    ],
}


// export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
//     return (
//         <Sidebar
//             className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
//             {...props}
//         >
//             <SidebarHeader>
//                 <SidebarMenu>
//                     <SidebarMenuItem>
//                         <SidebarMenuButton size="lg" asChild>
//                             <a href="#">
//                                 <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
//                                     <Command className="size-4" />
//                                 </div>
//                                 <div className="grid flex-1 text-left text-sm leading-tight">
//                                     <span className="truncate font-medium">Acme Inc</span>
//                                     <span className="truncate text-xs">Enterprise</span>
//                                 </div>
//                             </a>
//                         </SidebarMenuButton>
//                     </SidebarMenuItem>
//                 </SidebarMenu>
//             </SidebarHeader>
//             <SidebarContent>
//                 <NavMain items={data.navMain} />
//                 <NavProjects projects={data.projects} />
//                 <NavSecondary items={data.navSecondary} className="mt-auto" />
//             </SidebarContent>
//             <SidebarFooter>
//                 <NavUser user={data.user} />
//             </SidebarFooter>
//         </Sidebar>
//     )
// }
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar className="top-(--header-height) h-[calc(100svh-var(--header-height))]!" collapsible="icon" {...props}>
            {/* <SidebarHeader> */}
            {/* <TeamSwitcher teams={data.teams} /> */}
            {/* </SidebarHeader> */}
            <SidebarContent>
                <NavMain items={data.navMain} />
                <NavProjects projects={data.projects} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
