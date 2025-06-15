import { ArrowRight } from "lucide-react";

interface Feature {
    id: string;
    title: string;
    description: string;
    image: string;
}

interface Feature72Props {
    heading?: string;
    description?: string;
    linkUrl?: string;
    linkText?: string;
    features?: Feature[];
}

const GameCard = (
    { feature }
        : { feature: Feature }) => {
    return (
        <div
            key={feature.id}
            className="border-border flex flex-col flex-initial overflow-clip rounded-xl border bg-(--game-card) relative transition-transform hover:scale-105 shadow-md "
        >
            <div className="flex flex-initial ">
                <img
                    src={feature.image}
                    alt={feature.title}
                    className="aspect-3/2 w-full h-32 object-cover object-center"
                />
            </div>
            <div className="absolute w-9 h-9 top-26 left-4 bg-red-200 rounded-xl border-border border-b-blue-400"></div>
            <div className="px-1 py-1 md:px-1 md:py-1 lg:px-1 lg:py-1">
                <h2 className="mb-3  pt-3 text-lg font-semibold md:mb-4 md:text-sm lg:mb-6 text-center">
                    {feature.title}
                </h2>
            </div>
        </div>
    );
};

export { GameCard };