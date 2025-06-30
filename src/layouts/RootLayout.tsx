import { AppSidebar } from "@/components/app-sidebar"
import MobileNav from "@/components/MobileNav"
import { SiteHeader } from "@/components/site-header"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"
import Toolbar from "@/components/Toolbar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Outlet } from "react-router"
const RootLayout = () => {
  return (
    // <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset>
            {/* <MobileNav /> */}
            <Toolbar />
            <Outlet />
            {/* <Hero /> */}
            <Toaster />
            {/* gamecard section */}
            {/* <section className="py-4 mx-auto max-w-[1200px] ">
                <div className="container flex flex-col gap-16 px-5 ">
                  <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 overflow-visible ">
                    {features.map(feature => (
                      <GameCard key={feature.id} feature={feature} />
                    ))}
                  </div>
                </div>
              </section> */}

          </SidebarInset>
        </div>
      </SidebarProvider>
    </div >
    // </ThemeProvider >
  )
}

export default RootLayout