/* eslint-disable @typescript-eslint/no-unused-vars */
import { cartItem } from "@/types/types";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import NewTag from "../newTag";
import DelieveryForm from "./DelieveryForm";
import TakeawayForm from "./TakeawayForm";
import { Button } from "../ui/button";
import { LuX } from "react-icons/lu";
import { XAF } from "@/lib/functions";
import useStore from "@/context/store";
import EditProductDialog from "@/app/panier/editProductDialog";
import { ShoppingBasket } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CartTotal } from "@/lib/utils";

interface Props {
  items: cartItem[];
}

type deliveryMode = "takeAway" | "delivery";

const Panier = ({ items }: Props) => {
  const { removeFromCart, emptyCart, token } = useStore();
  const [deliveryMode, setDeliveryMode] = useState<deliveryMode>("delivery");
  const [postOrderStatus, setPostOrderStatus] = useState<boolean>(false);
  const [fees, setFees] = useState<number>(0);
  const pathname = usePathname();

  return items.length > 0 ? (
    <div className="grid grid-cols-1 @min-[760px]:grid-cols-2 justify-center gap-10 py-10 sm:py-14 lg:py-20">
      <div className="w-full flex flex-col gap-10">
        <div className="flex flex-col max-w-[495px] w-full gap-6">
        {token === null && <p className="text-red-500 w-full">🚨🚨 Veuillez vous <Link href={`/connexion?redirect=${encodeURIComponent(pathname)}`} className="italic text-blue-500 underline">{"connecter"}</Link> pour passer une commande.</p>}
          <h3>{"Paiement"}</h3>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">{"Mode de livraison"}</label>
            <Select value={deliveryMode} onValueChange={(e:deliveryMode)=>setDeliveryMode(e)}>
              <SelectTrigger className="w-full h-[60px]">
                <SelectValue placeholder="Selectionner un mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="takeAway">
                  <NewTag endNew={new Date(2025, 2, 31)}>{"À Emporter"}</NewTag>
                </SelectItem>
                <SelectItem value="delivery">
                  {"Livraison à domicile"}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {deliveryMode === "takeAway" ? (
          <TakeawayForm
            fees={fees}
            setFees={setFees}
            setPostOrderStatus={setPostOrderStatus}
          />
        ) : (
          <DelieveryForm
            fees={fees}
            setFees={setFees}
            setPostOrderStatus={setPostOrderStatus}
          />
        )}
        
      </div>
      <div className="flex flex-col gap-6 items-start justify-start max-w-[600px] w-full">
        <h3>{"Ma commande"}</h3>
          <Button onClick={emptyCart}>{"Vider le panier"}</Button>
        <div className="flex flex-col gap-4 max-h-[300px] overflow-auto">
          <div className="flex flex-col gap-4">
            {items.map((item, index) => (
              <div
                key={index}
                className={`flex flex-row gap-6 items-center justify-between w-full px-7 py-5 rounded-[20px] ${index % 2 === 0 && item.price !== 0
                    ? "bg-[#848484]/10"
                    : item.price === 0
                      ? "bg-green-500/10"
                      : "border border-[#848484]"
                  }`}
              >
                <div className="flex flex-row items-center justify-between w-full">
                  <div className="flex flex-row items-center gap-6">
                    <img
                      src={item.image ?? "/images/imagePlaceholder.svg"}
                      alt={item.nom}
                      className="w-20 h-20 rounded-[12px] object-cover"
                    />
                    <div className="flex flex-col gap-0">
                      <p className="text-[18px] font-bold">{`${item.nom}(x${item.qte})`}</p>
                      <p
                        className={`text-[18px] font-bold ${item.price === 0 ? "font-mono" : ""
                          }`}
                      >
                        {item.price === 0 ? "Gratuit" : XAF.format(item.price)}
                      </p>
                      {
                        !!item.originalPrice &&
                        <p className="text-sm line-through text-muted-foreground">{XAF.format(item.originalPrice)}</p> 
                      }
                    </div>
                  </div>
                  <div className="flex flex-col gap-6 items-end">
                    {item.price !== 0 && (
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          removeFromCart(item.itemId);
                        }}
                        className="bg-red-500 hover:bg-red-500/80 text-white rounded-[6px]"
                      >
                        <LuX />
                      </Button>
                    )}
                    <EditProductDialog
                      nom={item.nom}
                      qte={item.qte}
                      id={item.id}
                      itemId={item.itemId}
                      optionsCurrent={item.options}
                      image={item.image}
                    >
                      <Button
                        variant={"outline"}
                        className="border-black text-black rounded-[6px]"
                      >
                        {"Modifier"}
                      </Button>
                    </EditProductDialog>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3 w-full items-end">
          <div>
            <p className="text-[24px] font-normal text-end">
              {"Commande: "}
              <span className="text-[28px] font-bold">
                {XAF.format(CartTotal(items))}
              </span>
            </p>
            <p className="text-[24px] font-normal text-end">
              {"Frais de livraison: "}
              <span className="text-[28px] font-bold">{XAF.format(fees)}</span>
            </p>
          </div>
          <p className="text-[24px] font-normal text-end">
            {"TOTAL: "}
            <span className="text-[28px] font-bold">
              {XAF.format(CartTotal(items) + fees)}
            </span>
          </p>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex flex-col gap-6 items-center justify-center w-full py-20">
      <p className="text-[32px] font-bold">{"Votre panier est vide"}</p>
      <ShoppingBasket size={48} className="text-gray-400" />
    </div>
  );
};

export default Panier;
