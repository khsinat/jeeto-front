
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { ThemeProvider } from "@/components/theme-provider"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { GameCard } from "./components/GameCard"
import { Hero } from "./components/Herobanner"
export const iframeHeight = "800px"
export const description = "A sidebar with a header and a search form."

const features = [
  {
    id: "feature-1",
    title: "Game 1",
    description:
      "Clean and intuitive interface built with the latest design principles. Optimized for the best user experience.",
    image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg",
  },

  {
    id: "feature-1",
    title: "Game 1",
    description:
      "Clean and intuitive interface built with the latest design principles. Optimized for the best user experience.",
    image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg",
  },
  {
    id: "feature-1",
    title: "Game 1",
    description:
      "Clean and intuitive interface built with the latest design principles. Optimized for the best user experience.",
    image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg",
  },
  {
    id: "feature-1",
    title: "Game 1",
    description:
      "Clean and intuitive interface built with the latest design principles. Optimized for the best user experience.",
    image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg",
  },
  {
    id: "feature-1",
    title: "Game 1",
    description:
      "Clean and intuitive interface built with the latest design principles. Optimized for the best user experience.",
    image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg",
  },
  {
    id: "feature-1",
    title: "Game 1",
    description:
      "Clean and intuitive interface built with the latest design principles. Optimized for the best user experience.",
    image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg",
  },
]


function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="[--header-height:calc(--spacing(14))]">
        <SidebarProvider className="flex flex-col">
          <SiteHeader />
          <div className="flex flex-1">
            <AppSidebar />
            <SidebarInset>
              <Hero />

              {/* gamecard section */}
              <section className="py-4 mx-auto max-w-[1200px] ">
                <div className="container flex flex-col gap-16 px-5 ">
                  <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 overflow-visible ">
                    {features.map(feature => (
                      <GameCard key={feature.id} feature={feature} />
                    ))}
                  </div>
                </div>
              </section>

            </SidebarInset>
          </div>
        </SidebarProvider>
      </div >
    </ThemeProvider >
  )
}

export default App
