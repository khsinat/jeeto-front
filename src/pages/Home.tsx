import { Hero } from "@/components/Herobanner"
import { GameCard } from "@/components/GameCard"
import { Button } from "@/components/ui/button"
import { Link } from "react-router"
import Footer from "@/components/Footer"
import { SonnerDemo } from "@/components/sonnerdemo"
import { account } from "@/lib/appwrite"
// import { getCurrentUser } from "@/lib/appwrite"
import { useState } from "react"
const features = [
    {
        id: "feature-1",
        title: "Game 1",
        description:
            "Clean and intuitive interface built with the latest design principles. Optimized for the best user experience.",
        image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg",
    },

    {
        id: "feature-2",
        title: "Game 1",
        description:
            "Clean and intuitive interface built with the latest design principles. Optimized for the best user experience.",
        image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg",
    },
    {
        id: "feature-3",
        title: "Game 1",
        description:
            "Clean and intuitive interface built with the latest design principles. Optimized for the best user experience.",
        image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg",
    },
    {
        id: "feature-4",
        title: "Game 1",
        description:
            "Clean and intuitive interface built with the latest design principles. Optimized for the best user experience.",
        image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg",
    },
    {
        id: "feature-5",
        title: "Game 1",
        description:
            "Clean and intuitive interface built with the latest design principles. Optimized for the best user experience.",
        image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg",
    },
    {
        id: "feature-6",
        title: "Game 1",
        description:
            "Clean and intuitive interface built with the latest design principles. Optimized for the best user experience.",
        image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg",
    },
]


const Home = () => {
    return (
        <>
            <Hero />
            <Button asChild>
                <Link to="/game/hello" className="mx-auto mt-4">
                    <span className="text-md font-bold">Explore Games</span></Link>
            </Button>
            <SonnerDemo />
            {/* gamecard section */}
            <section className="py-4 mx-auto max-w-[1200px] mb-20">
                <div className="container flex flex-col gap-16 px-5 ">
                    <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 overflow-visible ">
                        {features.map(feature => (
                            <GameCard key={feature.id} feature={feature} />
                        ))}
                    </div>
                </div>
            </section>
            <Footer />
        </>
    )
}

export default Home