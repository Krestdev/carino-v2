"use client";

import Link from "next/link";
import { LuCircleUser, LuX } from "react-icons/lu";
import { Button } from "./ui/button";
import PopAccount from "./Authentification/PopAccount";
import { usePathname, useRouter } from "next/navigation";
import useStore from "@/context/store";
import { cn } from "@/lib/utils";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { ChevronDown, LucideMenu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import ReservationQuery from "@/queries/bookingsQuery";
import { useQuery } from "@tanstack/react-query";

const Header = () => {
  const { setOpenLogSign, user } = useStore();
  const router = useRouter();
  const { token, cart } = useStore();
  const path = usePathname();

  const baseURL2 = process.env.NEXT_PUBLIC_API_BASE_URL2;
  const reservation = new ReservationQuery(baseURL2 || '');
  const bookingsQuery = useQuery({
    queryKey: ["bookings"],
    queryFn: () => reservation.getReservations().then((res) => res.items),
    // Ne pas exécuter la requête si l'utilisateur n'est pas admin
    enabled: !!token && (user?.role === "ADMIN" || user?.role === "MANAGER"),
  });

  const pendingBookings = bookingsQuery.data?.filter((booking) => booking.status === "Pending") || [];

  const links = [
    { name: "Accueil", href: "/" },
    { name: "Catalogue", href: "/catalogue" },
    { name: "Menus", href: "/menu" },
    { name: "La carte", href: "/telechargement/catalogue.pdf" },
    !!token
      ? { name: "Profil", href: "/profil" }
      : { name: "Se connecter", href: "#" },
    { name: "Panier", href: "/panier" },
  ];

  return (
    <div className="md:flex sticky top-0 z-50 flex flex-row items-center gap-6 h-20 bg-primary">
      <div className="hidden md:flex flex-row gap-3 items-center justify-end w-full">
        {/* Section Admin - uniquement pour les admins */}
        {(user?.role === "ADMIN" || user?.role === "MANAGER") && (
          <Link
            href={"/admin"}
            className={cn(
              "h-10 w-fit flex px-3 py-1 text-white relative",
              path === "/admin" && "text-[#FFC336]"
            )}
          >
            <span className={cn("text-white", path === "/admin" && "text-[#FFC336]")}>
              {"Admin"}
            </span>
            {pendingBookings.length > 0 && (
              <span className="absolute -top-2 left-[70%] text-[12px] h-5 w-5 rounded-full bg-red-500 text-white font-medium flex items-center justify-center">
                {pendingBookings.length}
              </span>
            )}
          </Link>
        )}

        <Link
          href={"/catalogue"}
          className={cn("h-10 w-fit flex px-3 py-1 text-white", path === "/catalogue" && "text-[#FFC336]")}
        >
          {"Catalogue"}
        </Link>

        <Link
          target="_blank"
          href={"/telechargement/catalogue.pdf"}
          className="h-10 w-fit flex px-3 py-1 text-white"
        >
          {"La carte"}
        </Link>
      </div>

      <img
        src="/Logo.png"
        alt="logo"
        height={64}
        width={64}
        loading="eager"
        className="hidden md:flex w-13 h-13 md:w-16 md:h-16 cursor-pointer"
        onClick={() => router.push("/")}
      />

      <div className="hidden md:flex flex-row gap-3 items-center justify-start w-full">
        <Link
          href={"/reservation"}
          className={cn(
            "h-10 w-fit flex px-3 py-1 text-white",
            path === "/reservation" && "text-[#FFC336]"
          )}
        >
          {"Réserver"}
        </Link>

        {!!token ? (
          <PopAccount>
            <Button className="text-white hover:bg-transparent hover:text-white" variant={"ghost"} size={"lg"}>
              <LuCircleUser />
              {"Compte"}
            </Button>
          </PopAccount>
        ) : (
          <Link
            href={"#"}
            onClick={() => setOpenLogSign(true)}
            className={cn(
              "h-10 w-fit flex px-3 py-1 text-white",
              path === "/connexion" && "text-[#FFC336]"
            )}
          >
            {"Connexion"}
          </Link>
        )}

        <Link
          href={"/panier"}
          className={cn(
            "h-10 w-fit flex px-3 py-1 text-white relative",
            path === "/panier" && "text-[#FFC336]"
          )}
        >
          <span className={cn("text-white", path === "/panier" && "text-[#FFC336]")}>
            {"Panier"}
          </span>
          {cart.length > 0 && (
            <span className="absolute -top-2 left-[70%] text-[12px] h-4 w-4 rounded-[2px] bg-[#FFC336] text-black font-medium leading-[100%] tracking-[0%] flex items-center justify-center">
              {cart.length}
            </span>
          )}
        </Link>
      </div>

      <div className="md:hidden w-full flex gap-7">
        <div className="w-full flex flex-row items-center justify-between px-7">
          <img
            src="/Logo.png"
            alt="logo"
            height={64}
            width={64}
            loading="eager"
            className="w-13 h-13 md:w-16 md:h-16 cursor-pointer"
            onClick={() => router.push("/")}
          />

          {/* Drawer */}
          <Drawer direction="left">
            <DrawerTrigger>
              <LucideMenu className="text-white" />
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader className="flex flex-row w-full items-center justify-between">
                <img
                  src="/Logo.png"
                  alt="logo"
                  height={64}
                  width={64}
                  loading="eager"
                  className="w-13 h-13 md:w-16 md:h-16 cursor-pointer"
                  onClick={() => router.push("/")}
                />
                <DrawerClose className="w-fit">
                  <LuX className="text-white" />
                </DrawerClose>
              </DrawerHeader>
              <div className="flex flex-col">
                {links.map((link) => (
                  <DrawerClose key={link.name}>
                    <Link
                      href={link.href}
                      className={cn(
                        "h-13 w-fit flex px-3 py-1 text-white",
                        path === link.href && "text-[#FFC336]"
                      )}
                      onClick={() => {
                        if (link.name === "Se connecter") {
                          setOpenLogSign(true);
                        }
                      }}
                    >
                      {link.name}
                    </Link>
                  </DrawerClose>
                ))}
                {/* Ajout du lien Admin dans le drawer pour les admins */}
                {(user?.role === "ADMIN" || user?.role === "MANAGER") && (
                  <DrawerClose>
                    <Link
                      href={"/admin"}
                      className={cn(
                        "h-13 w-fit flex px-3 py-1 text-white relative",
                        path === "/admin" && "text-[#FFC336]"
                      )}
                    >
                      {"Admin"}
                      {pendingBookings.length > 0 && (
                        <span className="ml-2 text-[12px] h-5 w-5 rounded-full bg-red-500 text-white font-medium flex items-center justify-center">
                          {pendingBookings.length}
                        </span>
                      )}
                    </Link>
                  </DrawerClose>
                )}
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </div>
  );
};

export default Header;