import { Link } from "react-router";
interface MenuItem {
    title: string;
    links: {
        text: string;
        url: string;
    }[];
}

interface Footer2Props {
    logo?: {
        url: string;
        src: string;
        alt: string;
        title: string;
    };
    tagline?: string;
    menuItems?: MenuItem[];
    copyright?: string;
    bottomLinks?: {
        text: string;
        url: string;
    }[];
}

const Footer = ({
    logo = {
        src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/block-1.svg",
        alt: "amazing games",
        title: "JeetoAi.com",
        url: "/",
    },
    tagline = "Amazing games you will love to play",
    menuItems = [
        {
            title: "Product",
            links: [
                { text: "Overview", url: "#" },
                { text: "Pricing", url: "#" },
                { text: "Marketplace", url: "#" },
                { text: "Features", url: "#" },
                { text: "Integrations", url: "#" },
                { text: "Pricing", url: "#" },
            ],
        },
        {
            title: "Company",
            links: [
                { text: "FAQ", url: "/FAQ" },
                { text: "Team", url: "#" },
                { text: "Blog", url: "#" },
                { text: "Terms & Conditions", url: "/terms&conditions" },
                { text: "Contact", url: "/help" },
                { text: "Privacy", url: "/privacypolicy" },
            ],
        },
        {
            title: "Resources",
            links: [
                { text: "Help", url: "/help" },
                { text: "Sales", url: "#" },
                { text: "Advertise", url: "#" },
            ],
        },
        {
            title: "Social",
            links: [
                { text: "Twitter", url: "#" },
                { text: "Instagram", url: "#" },
                { text: "LinkedIn", url: "#" },
            ],
        },
    ],
    copyright = "© 2025 Jeeto Ai. All rights reserved.",
    bottomLinks = [
        { text: "Terms and Conditions", url: "/termsandconditions" },
        { text: "Privacy Policy", url: "/privacypolicy" },
    ],
}: Footer2Props) => {
    return (
        <section className="py-7 mx-10 mb-15">
            <div className="container">
                <footer>
                    <div className="grid grid-cols-2 gap-5 lg:grid-cols-6">
                        <div className="col-span-2 mb-8 lg:mb-0">
                            <div className="flex items-center gap-2 lg:justify-start">
                                <Link to="/">
                                    <img
                                        src={logo.src}
                                        alt={logo.alt}
                                        title={logo.title}
                                        className="h-10"
                                    />
                                </Link>
                                <p className="text-xl font-semibold">{logo.title}</p>
                            </div>
                            <p className="mt-4 font-bold">{tagline}</p>
                        </div>
                        {menuItems.map((section, sectionIdx) => (
                            <div key={sectionIdx}>
                                <h3 className="mb-4 font-bold">{section.title}</h3>
                                <ul className="space-y-4 text-muted-foreground">
                                    {section.links.map((link, linkIdx) => (
                                        <li
                                            key={linkIdx}
                                            className="font-medium hover:text-primary"
                                        >
                                            <Link to={link.url}>{link.text}</Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                    <div className="mt-24 flex flex-col justify-between gap-4 border-t pt-8 text-sm font-medium text-muted-foreground md:flex-row md:items-center">
                        <p>{copyright}</p>
                        <ul className="flex gap-4">
                            {bottomLinks.map((link, linkIdx) => (
                                <li key={linkIdx} className="underline hover:text-primary">
                                    <Link to={link.url}>{link.text}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </footer>
            </div>
        </section>
    );
};

export default Footer;
