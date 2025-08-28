"use client";

import HistoryTable from "@/components/Historique/HistoryTable";
import { Button } from "@/components/ui/button";
import useStore from "@/context/store";
import UserQuery from "@/queries/userQueries";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";

const Page = () => {
  const { user, token } = useStore();
  const userHistory = new UserQuery();
  const userData = useQuery({
    queryKey: ["userInfo", user?.id],
    queryFn: () => userHistory.allUsersOrders(user ? user.id : -1),
    enabled: !!user,
  });

  if (!token) {
    redirect("/");
  }

  return userData.isSuccess ? (
    <div className="pt-24 pb-10">
      <div className="max-w-[1440px] w-full mx-auto flex flex-col gap-5">
        <Button onClick={() => redirect("/")} className="w-fit">
          <ArrowLeft />
          {"Retour a l'accueil"}
        </Button>
        <HistoryTable
          title={"Historique des commandes"}
          data={userData.data?.data}
        />
      </div>
    </div>
  ) : (
    userData.isLoading && null
  );
};

export default Page;
