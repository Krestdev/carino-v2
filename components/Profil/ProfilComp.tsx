import useStore from "@/context/store";
import { PreviousOrders, UserOrdersResponse } from "@/types/types";
import { redirect } from "next/navigation";
import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { LuSquarePen } from "react-icons/lu";

const ProfilComp = ({ orders }: { orders: UserOrdersResponse }) => {
  const { user, token } = useStore();

  if (!token) {
    redirect("/");
  }

  const lastOrder = orders.data[0];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
      <div className="w-full h-auto flex flex-col bg-[#E4E4E7]">
        <div className="bg-primary w-full p-5">
          <h3 className="text-white">{"Apercu"}</h3>
        </div>
        <div className="flex flex-col gap-2 p-5">
          <div>
            <p className="text-[12px] font-semibold">{"Commandes"}</p>
            <p className="text-[12px]">{orders.data.length}</p>
          </div>
          <div>
            <p className="text-[12px] font-semibold">{"Points de fidelités"}</p>
            <p className="text-[12px]">{`${user?.loyalty} pts`}</p>
          </div>
          <div>
            <p className="text-[12px] font-semibold">{"Dernieres commandes"}</p>
            <p className="text-[12px]">
              {lastOrder.created_at.toString().slice(0, 10)}
            </p>
          </div>
        </div>
      </div>
      <div className="w-full h-auto flex flex-col bg-[#E4E4E7]">
        <div className="bg-primary w-full p-5">
          <h3 className="text-white">{"Information personnelle"}</h3>
        </div>
        <div className="flex flex-col gap-2 p-5">
          <div>
            <p className="text-[12px] font-semibold">{"Nom"}</p>
            <p className="text-[12px]">{user?.name}</p>
          </div>
          <div>
            <div>
              <p className="text-[12px] font-semibold">{"Email"}</p>
              <p className="text-[12px]">{user?.email}</p>
            </div>
            <div>
              <p className="text-[12px] font-semibold">{"Tel"}</p>
              <p className="text-[12px]">{user?.phone}</p>
            </div>
            <div className="flex flex-row items-end justify-between max-w-[291px]">
              <div>
                <p className="text-[12px] font-semibold">{"Mot de passe"}</p>
                <Input
                  placeholder="****"
                  className="border-black w-[124px] rounded-[12px]"
                />
              </div>
              <Button
                variant={"outline"}
                className="border-black text-black rounded-[12px]"
              >
                <LuSquarePen />
                {"Modifier"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilComp;
