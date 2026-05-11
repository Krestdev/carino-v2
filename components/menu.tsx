
import {
    LucideChefHat,
    LucideCircleChevronRight,
    LucideClock,
    LucideHome,
    LucideLogOut,
    LucideSquareMenu,
    LucideTable,
    LucideUser,
    LucideUtensilsCrossed
} from 'lucide-react';
import React from 'react';
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTrigger,
} from "@/components/ui/drawer";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import useStore from '@/context/store';

interface MenuProps {
    children?: React.ReactNode;
}

const MenuComp = ({ children }: MenuProps) => {
    const [open, setOpen] = React.useState(false);
    const { token, logout } = useStore();
    const isLogin = token !== null;
    const path = usePathname()

    const pages = [
        { name: "Accueil", link: "/", icon: <LucideHome /> },
        { name: "Catalogue", link: "/catalogue", icon: <LucideSquareMenu /> },
        { name: "Réserver", link: "/reservation", icon: <LucideTable /> },
        { name: "Profil", link: "/profil", icon: <LucideUser /> },
        { name: "Historique", link: "/historique", icon: <LucideClock /> },
        { name: "Carte Menu", link: "/telechargement/catalogue.pdf", icon: <LucideChefHat /> },
        { name: "Connexion", link: "/connexion", icon: <LucideUser /> },
        { name: "Inscription", link: "/inscription", icon: <LucideUser /> },
    ].filter(Boolean);

    const pagesLoggedIn = pages.filter(page => page.name !== "Connexion" && page.name !== "Inscription");
    const pagesLoggedOut = pages.filter(page => page.name !== "Profil" && page.name !== "Historique");

    return (
        <Drawer direction='right' open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                {children}
            </DrawerTrigger>
            <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader className='flex flex-row justify-between items-center'>
                        <Link href="/">
                            <img
                                src="Logo.svg"
                                alt="logo"
                                height={60}
                                width={60}
                                loading="eager"
                                className="rounded-full w-[46.79px] h-[46.79px] md:w-[60px] md:h-[60px]"
                            />
                        </Link>
                        <LucideCircleChevronRight onClick={() => setOpen(false)} className='cursor-pointer' />
                    </DrawerHeader>

                    <div className='flex flex-col p-5'>
                        {(isLogin ? pagesLoggedIn : pagesLoggedOut).map((page) => (
                            <Link onClick={() => setOpen(false)} key={page.name} href={page.link} className={`px-2 py-2 flex flex-row items-center justify-between ${path === page.link ? "bg-primary text-white" : ""}`}>
                                <div className="flex flex-row items-center gap-2">
                                    {page.icon}
                                    {page.name}
                                </div>
                            </Link>
                        ))}
                        {isLogin && <div onClick={logout} className="px-2 py-2 flex flex-row items-center gap-2 cursor-pointer">
                            <LucideLogOut />
                            {"Déconnection"}
                        </div>}
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    );
};

export default MenuComp;