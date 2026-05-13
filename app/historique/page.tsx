"use client";

import HistoryTable from "@/components/Historique/HistoryTable";
import { Button } from "@/components/ui/button";
import useStore from "@/context/store";
import UserQuery from "@/queries/userQueries";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import Loading from "../loading";
import { useAppContext } from "@/providers/appContext";
import TownQuery from "@/queries/townQuery";
import HistoryBooking from "@/components/Historique/HistoryBooking";
import ReservationQuery from "@/queries/bookingsQuery";

const Page = () => {
  const { baseURL } = useAppContext();
  const baseURL2 = process.env.NEXT_PUBLIC_API_BASE_URL2;
  const { user, token } = useStore();
  const router = useRouter();
  const userLogIn = new UserQuery(baseURL2 || '');
  const reservation = new ReservationQuery(baseURL2 || '');
  const lieu = new TownQuery(baseURL || '');
  const [tab, setTab] = useState("commande");

  const userData = useQuery({
    queryKey: ["userInfo", user?.id],
    queryFn: () => userLogIn.getMine(),
    enabled: !!user,
  });

  const townData = useQuery({
    queryKey: ["towns"],
    queryFn: () => lieu.getTowns(),
  });

  const reservationData = useQuery({
    queryKey: ["reservations"],
    queryFn: () => reservation.getMineReservations(),
    enabled: !!user,
  });

  const [isHydrated, setIsHydrated] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (userData.isSuccess || reservationData.isSuccess) {
      startTransition(() => {
        setShowContent(true);
      });
    }
  }, [userData.isSuccess, reservationData.isSuccess]);

  if (!isHydrated || isPending || !showContent) {
    return <Loading />;
  }

  console.log(reservationData.data);

  if (!token) {
    router.push("/");
    return null;
  }

  return userData.isSuccess ? (
    <div className="px-7 py-10">
      <div className="max-w-[1440px] w-full mx-auto flex flex-col gap-5">
        <Button onClick={() => redirect("/")} className="w-fit">
          <ArrowLeft />
          {"Retour a l'accueil"}
        </Button>
        <div className="flex flex-row items-center">
          <Button
            className={`${tab === "commande" ? "" : "text-black bg-transparent hover:bg-gray-50 border"} `}
            onClick={() => setTab("commande")}
          >
            {"Commandes"}
          </Button>
          <Button
            className={`${tab === "reservation" ? "" : "text-black bg-transparent hover:bg-gray-50 border"} `}
            onClick={() => setTab("reservation")}
          >
            {"Reservations"}
          </Button>
        </div>
        {tab === "commande" ?
          <HistoryTable
            title={"Historique des commandes"}
            data={userData.data?.data}
            towns={townData.data}
          />
          :
          <HistoryBooking
            title={"Historique des réservations"}
            data={reservationData.data?.items.reverse()!}
          />}
      </div>
    </div>
  ) : (
    userData.isLoading && null
  );
};

export default Page;
