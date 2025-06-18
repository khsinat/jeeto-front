import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router";


import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import GeneratedForm from "@/components/BetUI";
interface About3Props {
    title?: string;
    description?: string;
    mainImage?: {
        src: string;
        alt: string;
    };
    secondaryImage?: {
        src: string;
        alt: string;
    };
    breakout?: {
        src: string;
        alt: string;
        title?: string;
        description?: string;
        buttonText?: string;
        buttonUrl?: string;
    };
    companiesTitle?: string;
    companies?: Array<{
        src: string;
        alt: string;
    }>;
    achievementsTitle?: string;
    achievementsDescription?: string;
    achievements?: Array<{
        label: string;
        value: string;
    }>;
}

const defaultCompanies = [
    {
        src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-1.svg",
        alt: "Arc",
    },
    {
        src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-2.svg",
        alt: "Descript",
    },
    {
        src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-3.svg",
        alt: "Mercury",
    },
    {
        src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-4.svg",
        alt: "Ramp",
    },
    {
        src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-5.svg",
        alt: "Retool",
    },
    {
        src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-6.svg",
        alt: "Watershed",
    },
];

const defaultAchievements = [
    { label: "Companies Supported", value: "300+" },
    { label: "Projects Finalized", value: "800+" },
    { label: "Happy Customers", value: "99%" },
    { label: "Recognized Awards", value: "10+" },
];

const GamePage = ({
    title = "About Us",
    description = "Shadcnblocks is a passionate team dedicated to creating innovative solutions that empower businesses to thrive in the digital age.",
    mainImage = {
        src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg",
        alt: "placeholder",
    },
    secondaryImage = {
        src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-2.svg",
        alt: "placeholder",
    },
    breakout = {
        src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/block-1.svg",
        alt: "logo",
        title: "Hundreds of blocks at Shadcnblocks.com",
        description:
            "Providing businesses with effective tools to improve workflows, boost efficiency, and encourage growth.",
        buttonText: "Discover more",
        buttonUrl: "https://shadcnblocks.com",
    },
    companiesTitle = "Valued by clients worldwide",
    companies = defaultCompanies,
    achievementsTitle = "Our Achievements in Numbers",
    achievementsDescription = "Providing businesses with effective tools to improve workflows, boost efficiency, and encourage growth.",
    achievements = defaultAchievements,
}: About3Props = {}) => {
    return (
        <section className="py-4 mx-6">
            <div className="container">
                <img
                    src={mainImage.src}
                    alt={mainImage.alt}
                    className="size-full max-h-[620px] rounded-xl object-cover lg:col-span-2"
                />
                <GeneratedForm />
                {/* <div className="grid gap-4 lg:grid-cols-3 mt-3">
                    <div className="flex flex-col gap-2 md:flex-row lg:flex-col">
                        <Textarea className="w-full h-full max-w-[400px]" />
                        <div className="flex flex-col justify-between gap-2 rounded-xl bg-muted p-3 md:w-1/2 lg:w-auto">
                            <Dialog>
                                <form className="mx-auto">
                                    <DialogTrigger asChild>
                                        <Button variant="primary_button">Enter the Challenge Now!</Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>Pay Entry Fees</DialogTitle>
                                            <DialogDescription>
                                                To participate in this game, you need to pay an entry fee. Please enter the following amount
                                            </DialogDescription>
                                        </DialogHeader>

                                        <DialogFooter>
                                            <DialogClose asChild>
                                                <Button variant="outline">Cancel</Button>
                                            </DialogClose>
                                            <Button type="submit">Continue</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </form>
                            </Dialog>
                        </div>
                    </div>

                </div> */}


            </div>
        </section>
    );
};

export default GamePage;
