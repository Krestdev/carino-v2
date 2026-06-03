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
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { CircleUser, FileText, ForkKnife, History, Home, LucideMenu, ShoppingCart, Star } from "lucide-react";
import ReservationQuery from "@/queries/bookingsQuery";
import { useQuery } from "@tanstack/react-query";
import UserQuery from "@/queries/userQueries";
import Loading from "@/app/loading";
import Error from "./universal/error";
import { useState, useEffect } from "react";

const Header = () => {
  const { setOpenLogSign, user, logout } = useStore();
  const router = useRouter();
  const { token, cart } = useStore();
  const path = usePathname();
  const [open, setOpen] = useState(false);

  // Récupérer le profil complet de l'utilisateur depuis le serveur
  const userLogIn = new UserQuery();
  const userData = useQuery({
    queryKey: ["userInfo", user?.id],
    queryFn: () => userLogIn.profile(),
    enabled: !!user,
  });

  useEffect(() => {
    if (userData.isError) {
      logout();
    }
  }, [userData.isError, logout]);

  const reservation = new ReservationQuery();
  const bookingsQuery = useQuery({
    queryKey: ["bookings"],
    queryFn: () => reservation.getReservations().then((res) => res.items),
    // Ne pas exécuter la requête si l'utilisateur n'est pas admin
    enabled: !!token && (user?.role === "ADMIN" || user?.role === "MANAGER"),
  });

  // Vérification
  if (userData.isLoading || bookingsQuery.isLoading) {
    return <Loading />;
  }

  if (userData.isError || bookingsQuery.isError) {
    return <Error />;
  }

  const pendingBookings =
    bookingsQuery.data?.filter((booking) => booking.status === "Pending") || [];

  const links = [
    { icon: Home, name: "Accueil", href: "/" },
    { icon: ForkKnife, name: "Catalogue", href: "/catalogue" },
    { icon: FileText, name: "La carte", href: "/telechargement/catalogue.pdf" },
    !!token
      ? { icon: CircleUser, name: "Profil", href: "/profil" }
      : { icon: CircleUser, name: "Se connecter", href: "#" },
    { icon: History, name: "Historique", href: "/historique" },
    !!token
      ? { icon: ShoppingCart, name: "Panier", href: "/panier" }
      : { icon: ShoppingCart, name: "Panier", href: "#" },
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
              path === "/admin" && "text-[#FFC336]",
            )}
          >
            <span
              className={cn(
                "text-white",
                path === "/admin" && "text-[#FFC336]",
              )}
            >
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
          className={cn(
            "h-10 w-fit flex px-3 py-1 text-white",
            path === "/catalogue" && "text-[#FFC336]",
          )}
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
        className="hidden md:flex w-13 h-13 md:w-16 md:h-16 cursor-pointer object-contain"
        onClick={() => router.push("/")}
      />

      <div className="hidden md:flex flex-row gap-3 items-center justify-start w-full">
        <Link
          href={"/reservation"}
          className={cn(
            "h-10 w-fit flex px-3 py-1 text-white",
            path === "/reservation" && "text-[#FFC336]",
          )}
        >
          {"Réserver"}
        </Link>

        {!!token ? (
          <PopAccount>
            <Button
              className="text-white hover:bg-transparent hover:text-white"
              variant={"ghost"}
              size={"lg"}
            >
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
              path === "/connexion" && "text-[#FFC336]",
            )}
          >
            {"Connexion"}
          </Link>
        )}

        {user ? <Link
          href={"/panier"}
          className={cn(
            "h-10 w-fit flex px-3 py-1 text-white relative",
            path === "/panier" && "text-[#FFC336]",
          )}
        >
          <span
            className={cn("text-white", path === "/panier" && "text-[#FFC336]")}
          >
            {"Panier"}
          </span>
          {cart.length > 0 && (
            <span className="absolute -top-2 left-[70%] text-[12px] h-4 w-4 rounded-[2px] bg-[#FFC336] text-black font-medium leading-[100%] tracking-[0%] flex items-center justify-center">
              {cart.length}
            </span>
          )}
        </Link> :
          <Link
            href={"#"}
            onClick={() => setOpenLogSign(true)}
            className={cn(
              "h-10 w-fit flex px-3 py-1 text-white relative",
              path === "/connexion" && "text-[#FFC336]",
            )}
          >
            <span
              className={cn("text-white", path === "/panier" && "text-[#FFC336]")}
            >
              {"Panier"}
            </span>
            {cart.length > 0 && (
              <span className="absolute -top-2 left-[70%] text-[12px] h-4 w-4 rounded-[2px] bg-[#FFC336] text-black font-medium leading-[100%] tracking-[0%] flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </Link>
        }
        {/* Je vais afficher les point de fidélité bien stylé */}
        {token && (
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="rounded-full bg-[#FFC336]/10 p-2 group-hover:bg-[#FFC336]/20 transition-colors duration-300">
              <Star className="h-5 w-5 text-[#FFC336]" />
            </div>
            <div className="flex flex-col">
              <p className="text-xs text-muted-foreground">
                Points de fidélité
              </p>
              <p className="text-sm font-medium text-white">{`${userData.data?.loyalty ?? 0} Pts`}</p>
            </div>
          </div>
        )}
      </div>

      <div className="md:hidden w-full flex gap-7">
        <div className="w-full flex flex-row items-center justify-between px-7">
          <img
            src="/Logo.png"
            alt="logo"
            height={64}
            width={64}
            loading="eager"
            className="w-13 h-13 md:w-16 md:h-16 cursor-pointer object-contain"
            onClick={() => router.push("/")}
          />

          {/* Drawer */}
          <Drawer open={open} onOpenChange={setOpen} direction="left">
            <DrawerTrigger>
              <LucideMenu className="text-white" />
            </DrawerTrigger>
            <DrawerContent className="max-w-[50vw]">
              <DrawerHeader>
                <DrawerTitle className="flex flex-row w-full items-center justify-between">
                  <img
                    src="/Logo.png"
                    alt="logo"
                    height={64}
                    width={64}
                    loading="eager"
                    className="w-13 h-13 md:w-16 md:h-16 cursor-pointer object-contain"
                    onClick={() => router.push("/")}
                  />
                  <DrawerClose className="w-fit">
                    <LuX className="text-white" />
                  </DrawerClose>
                </DrawerTitle>
              </DrawerHeader>
              <div className="flex flex-col">
                {links.map((link) => (
                  <Button
                    key={link.name}
                    variant="ghost"
                    size="lg"
                    className={cn(
                      "h-13 w-fit flex px-3 py-1 text-white",
                      path === link.href && "text-[#FFC336]",
                    )}
                    onClick={() => {
                      setOpen(false);
                      link.name === "Panier" && !token
                        ? setOpenLogSign(true)
                        : router.push(link.href);
                      if (link.name === "Se connecter") {
                        setOpenLogSign(true);
                      }

                    }}
                  >
                    <link.icon className="h-4! w-4!" />
                    {link.name}
                  </Button>
                ))}
                {/* Ajout du lien Admin dans le drawer pour les admins */}
                {(user?.role === "ADMIN" || user?.role === "MANAGER") && (
                  <DrawerClose>
                    <Link
                      href={"/admin"}
                      className={cn(
                        "h-13 w-fit flex px-3 py-1 text-white relative",
                        path === "/admin" && "text-[#FFC336]",
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
