"use client";

import axiosConfig from "@/api";
import HistoryTable from "@/components/Historique/HistoryTable";
import ProfilComp from "@/components/Profil/ProfilComp";
import { Button } from "@/components/ui/button";
import useStore from "@/context/store";
import UserQuery from "@/queries/userQueries";
import { PreviousOrders } from "@/types/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";

const Page = () => {
  const { user, token } = useStore();
  const userLogIn = new UserQuery();
  const userData = useQuery({
    queryKey: ["userInfo", user?.id],
    queryFn: () => userLogIn.allUsersOrders(user ? user.id : -1),
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
        <ProfilComp orders={userData.data} />
        <HistoryTable
          title={"Dernieres Commandes"}
          data={userData.data.data.slice(-5)}
        />
      </div>
    </div>
  ) : (
    userData.isLoading && null
  );
};

export default Page;
