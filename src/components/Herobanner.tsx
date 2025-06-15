import { Calendar } from "lucide-react";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { GameCard } from "./GameCard";

const features =
{
    id: "feature-1",
    title: "Game 1",
    description:
        "Clean and intuitive interface built with the latest design principles. Optimized for the best user experience.",
    image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg",
}

const Hero = () => {
    return (
        <section className="mx-auto md:min-w-2xl lg:min-w-4xl 2xl:min-w-5xl shadow-md ">
            <div className="container flex relative self-center">
                <img
                    src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg"
                    alt="placeholder"
                    className="mt-2 aspect-video max-h-[300px] w-full max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-4xl 2xl:max-w-5xl rounded-t-lg object-cover shadow-md"
                />
                <div className="absolute top-20 left-10 hidden md:block " >
                    <GameCard feature={features} />
                </div>
            </div>

        </section>
    );
};

export { Hero };
