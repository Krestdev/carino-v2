"use client";

import { Button } from "@/components/ui/button";
import useStore from "@/context/store";
import UserQuery from "@/queries/userQueries";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState, useTransition } from "react";
import { XAF } from "@/lib/functions";
import Error from "@/components/universal/error";
import ViewOrderDialog from "@/components/Historique/ViewOrderDialog";
import TownQuery from "@/queries/townQuery";
import { OrdersData } from "@/types/types";

const Page = () => {
  const { user, token } = useStore();
  const router = useRouter();
  const userLogIn = new UserQuery();
  const lieu = new TownQuery();

  // Récupérer le profil complet de l'utilisateur depuis le serveur
  const userData = useQuery({
    queryKey: ["userInfo", user?.id],
    queryFn: () => userLogIn.profile(),
    enabled: !!user,
  });

  const orderData = useQuery({
    queryKey: ["myOrders"],
    queryFn: () => userLogIn.getMine(),
    enabled: !!user,
  });

  const townData = useQuery({
    queryKey: ["towns"],
    queryFn: () => lieu.getTowns(),
  });

  const [selectedOrder, setSelectedOrder] = useState<OrdersData | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleViewOrder = (order: OrdersData) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedOrder(null);
  };

  const [isHydrated, setIsHydrated] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (userData.isSuccess && orderData.isSuccess) {
      startTransition(() => {
        setShowContent(true);
      });
    }
  }, [userData.isSuccess, orderData.isSuccess]);

  if (!isHydrated || isPending || !showContent || userData.isLoading || orderData.isLoading) {
    return <Loading />;
  }

  if (!token || !user) {
    router.push("/");
    return null;
  }

  if (userData.isError || orderData.isError) {
    return <Error />;
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
            <div className="flex flex-col gap-7 px-7 py-12">
              <div className="flex flex-col gap-7">
                <p className="text-[24px] font-semibold font-general">{"Informations personnelles"}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 px-5 py-8 bg-[#FFFBF3]">
                  <div className="flex flex-col gap-1">
                    <p className="text-[14px] text-[#4B5563] uppercase">{"Nom"}</p>
                    <p className="text-[#111827] font-semibold">{userData.data.fname ?? "N/A"}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-[14px] text-[#4B5563] uppercase">{"Adresse mail"}</p>
                    <p className="text-[#111827] font-semibold">{userData.data.mail ?? "N/A"}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-[14px] text-[#4B5563] uppercase">{"Téléphone"}</p>
                    <p className="text-[#111827] font-semibold">{userData.data.phone ?? "N/A"}</p>
                  </div>
                  {/* <div className="flex flex-col gap-1">
                    <p className="text-[14px] text-[#4B5563] uppercase">{"Né le"}</p>
                    <p className="text-[#111827] font-semibold">{userData.data.birthday ?? "N/A"}</p>
                  </div> */}
                  {orderData.data?.data && orderData.data.data.length > 0 &&
                    <div className="flex flex-col gap-1">
                      <p className="text-[14px] text-[#4B5563] uppercase">{"Derniere commande"}</p>
                      <p className="text-[#111827] font-semibold">{new Date(orderData.data?.data?.[0].registration!).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false,
                      }) ?? "N/A"}</p>
                    </div>}
                  <div className="flex flex-col gap-1">
                    <p className="text-[14px] text-[#4B5563] uppercase">{"Point de fidélité"}</p>
                    <p className="text-[#111827] font-semibold">{`${userData.data.loyalty ?? 0} Pts`} </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-7">
                <p className="text-[24px] font-semibold font-general">{"Historique des commandes"}</p>
                <div className="grid grid-cols-1 overflow-auto w-full">
                  <div className="grid grid-cols-4 px-5 py-2">
                    <div className="flex flex-col gap-0.5">
                      <p className="text-[#111827] text-[14px] font-semibold max-w-[200px] truncate">{"Référence"}</p>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <p className="text-[#111827] text-[14px] font-semibold">{"Date"}</p>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <p className="text-[#111827] text-[14px] font-semibold">{"Total"}</p>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <p className="text-[#111827] text-[14px] font-semibold">{"Statut"}</p>
                    </div>
                  </div>
                  {
                    orderData.data?.data?.map((order, index) => {
                      return (
                        <div key={index} className={`grid grid-cols-4 px-5 py-2 ${index % 2 === 0 ? "bg-muted" : ""}`}>
                          <div className="flex flex-col gap-0.5">
                            <p className="text-[#111827] text-[14px] max-w-[200px] truncate">{"cmd-" + order.uuid}</p>
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <p className="text-[#111827] text-[14px]">{new Date(order.registration).toLocaleString()}</p>
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <p className="text-[#111827] text-[14px]">{XAF.format(order.total)}</p>
                          </div>
                           <div className="flex flex-col gap-0.5">
                            <Button variant="outline" onClick={() => handleViewOrder(order)}>
                              {"Voir la commande"}
                            </Button>
                          </div>
                        </div>
                      )
                    })
                  }
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
      {selectedOrder && (
        <ViewOrderDialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          order={selectedOrder}
          towns={townData.data}
        />
      )}
    </div>
  );
};

export default Page;
