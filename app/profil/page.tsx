"use client";

import HistoryTable from "@/components/Historique/HistoryTable";
import ProfilComp from "@/components/Profil/ProfilComp";
import { Button } from "@/components/ui/button";
import useStore from "@/context/store";
import UserQuery from "@/queries/userQueries";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState, useTransition } from "react";
import { useAppContext } from "@/providers/appContext";
import TownQuery from "@/queries/townQuery";

const Page = () => {
  const { baseURL } = useAppContext();
  const { user, token } = useStore();
  const router = useRouter();
  const userLogIn = new UserQuery(baseURL);
  const lieu = new TownQuery(baseURL);

  const townData = useQuery({
    queryKey: ["towns"],
    queryFn: () => lieu.getTowns(),
  });

  const userData = useQuery({
    queryKey: ["userInfo", user?.id],
    queryFn: () => userLogIn.allUsersOrders(user ? user.id : -1),
    enabled: !!user,
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

  return (
    <div className="px-7 pt-24 pb-10">
      <AnimatePresence mode="wait">
        {userData.isSuccess && (
          <div className="max-w-[1440px] w-full mx-auto flex flex-col gap-5">
            <Button onClick={() => router.push("/")} className="w-fit">
              <ArrowLeft />
              {"Retour à l'accueil"}
            </Button>
            <ProfilComp orders={userData.data} />
            <HistoryTable
              title={"Dernières Commandes"}
              data={userData.data.data.slice(-5)}
              towns={townData.data?.data}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Page;
