import { Hero } from "@/components/Herobanner"
import { GameCard } from "@/components/GameCard"
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


const Home = () => {
    return (
        <>
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
        </>
    )
}

export default Home