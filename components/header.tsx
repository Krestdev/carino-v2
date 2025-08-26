"use client";

import { ArrowUpRight, Menu, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { LuCircleUser } from "react-icons/lu";
import { Button } from "./ui/button";
import PopAccount from "./Authentification/PopAccount";
import { usePathname } from "next/navigation";
import useStore from "@/context/store";

const Header = () => {

  const {token} = useStore();
  const isLogin = token !== null;
  
  const pathname = usePathname();

  const isActiveTab = (tab: string) => {
    return pathname === tab;
  };

  return (
    <div className="sticky top-0 z-50 mx-3">
      <div className="absolute bg-white/60 backdrop-blur-lg top-[10px] left-1/2 transform -translate-x-1/2 max-w-[1100px] w-full h-[60px] md:h-[70px] rounded-full flex justify-between px-[10px] z-50">
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
          <div className="hidden md:flex flex-row items-center gap-2">
            <Link href={"/catalogue"} className={isActiveTab("/catalogue") ? "border-b-2 border-black" : ""}>
              <Button variant={"link"}>{"Catalogue"}</Button>
            </Link>
            <Link href={"/produits"} className={isActiveTab("/produits") ? "border-b-2 border-black" : ""}>
              <Button variant={"link"}>{"À Emporter"}</Button>
            </Link>
            <Link href={"/reservation"} className={isActiveTab("/reservation") ? "border-b-2 border-black" : ""}>
              <Button variant={"link"}>{"Réserver"}</Button>
            </Link>
            <Link target="_blank" href={"/telechargement/catalogue.pdf"}>
              <Button variant={"link"}>
                <ArrowUpRight />
                {"Carte Menu"}
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
              <Button variant={"outline"} className="text-black border-black h-[54px] text-[20px]">
                <LuCircleUser />
                {"compte"}
              </Button>
            </PopAccount>
            <Link href={"/panier"}>
              <Button className="bg-[#FFC336] hover:bg-[#FFC336]/90 text-black h-[54px] text-[20px]">
                <ShoppingCart />
                {"Panier"}
              </Button>
            </Link>
          </div>
        )}
        <div className="md:hidden flex gap-2">
          <Button variant={"outline"}>
            <Menu />
          </Button>
          <Button>
            <ShoppingCart />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Header;
