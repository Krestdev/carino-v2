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

const Page = () => {
  const { baseURL } = useAppContext();
  const { user, token } = useStore();
  const router = useRouter();
  const userLogIn = new UserQuery(baseURL);
  const lieu = new TownQuery(baseURL);

  const userData = useQuery({
    queryKey: ["userInfo", user?.id],
    queryFn: () => userLogIn.allUsersOrders(user ? user.id : -1),
    enabled: !!user,
  });

  const townData = useQuery({
    queryKey: ["towns"],
    queryFn: () => lieu.getTowns(),
  });

  const [isHydrated, setIsHydrated] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (userData.isSuccess) {
      startTransition(() => {
        setShowContent(true);
      });
    }
  }, [userData.isSuccess]);

  if (!isHydrated || isPending || !showContent) {
    return <Loading />;
  }

  if (!token) {
    router.push("/");
    return null;
  }

  return userData.isSuccess ? (
    <div className="px-7 md:px-0 pt-24 pb-10 container mx-auto ">
      <div className="max-w-[1440px] w-full mx-auto flex flex-col gap-5">
        <Button onClick={() => redirect("/")} className="w-fit">
          <ArrowLeft />
          {"Retour a l'accueil"}
        </Button>
        <HistoryTable
          title={"Historique des commandes"}
          data={userData.data?.data}
          towns={townData.data?.data}
        />
      </div>
    </div>
  ) : (
    userData.isLoading && null
  );
};

export default Page;
