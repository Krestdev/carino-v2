"use client";

import { ArrowUpRight, Menu, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { LuCircleUser } from "react-icons/lu";
import { Button } from "./ui/button";
import PopAccount from "./Authentification/PopAccount";
import { usePathname, useRouter } from "next/navigation";
import useStore from "@/context/store";
import MenuComp from "./menu";
import { cn } from "@/lib/utils";

const Header = () => {

  const router = useRouter();
  const { token } = useStore();
  const isLogin = token !== null;

  const pathname = usePathname();
  const menuLinks = [
    { name: "Catalogue", path: "/catalogue" },
    { name: "Tous nos produits", path: "/produits" },
    { name: "Réserver", path: "/reservation" },
  ];

  const isActiveTab = (tab: string) => {
    return pathname === tab;
  };

  return (
    <div className="sticky top-0 z-50 mx-3">
      <div className="absolute bg-white/60 backdrop-blur-lg top-[10px] left-1/2 transform -translate-x-1/2 max-w-[1100px] w-full h-[60px] md:h-[70px] rounded-full flex items-center justify-between px-[10px] z-50">
        <div className="flex flex-row items-center gap-8">
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
          <div className="hidden md:flex flex-row items-center gap-0">
            {
              menuLinks.map((item)=>
              <Link key={item.name} href={item.path} >
                <Button variant={"navigation"} size={"lg"} className={cn(pathname === item.path && "font-semibold text-primary")}>{item.name}</Button>
              </Link>)
            }
            <Link target="_blank" href={"/telechargement/catalogue.pdf"}>
              <Button variant={"navigation"} size={"lg"}>
                {"Carte Menu"}
                <ArrowUpRight />
              </Button>
            </Link>
          </div>
        </div>
        {!isLogin ? (
          <div className="hidden md:flex flex-row gap-2 items-center">
            <Link href={"/connexion"}>
              <Button variant={"link"}>{"Connexion"}</Button>
            </Link>
            <Link href={"/inscription"}>
              <Button variant={"link"}>{"Inscription"}</Button>
            </Link>
            <Link href={"/panier"}>
              <Button className="bg-[#FFC336] hover:bg-[#FFC336]/90 text-black h-[54px] text-[20px]">
                <ShoppingCart />
                {"Panier"}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="hidden md:flex flex-row gap-2 items-center">
            <PopAccount>
              <Button variant={"secondary"} size={"lg"}>
                <LuCircleUser />
                {"Compte"}
              </Button>
            </PopAccount>
            <Link href={"/panier"}>
              <Button variant={"accent"} size={"lg"}>
                <ShoppingCart />
                {"Panier"}
              </Button>
            </Link>
          </div>
        )}
        <div className="md:hidden flex gap-2">
          <MenuComp>
            <Button variant={"outline"}>
              <Menu className="text-primary" />
            </Button>
          </MenuComp>
          <Button onClick={() => router.push("/panier")}>
            <ShoppingCart />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Header;
