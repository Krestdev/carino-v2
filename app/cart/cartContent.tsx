"use client";
import useStore from "@/context/store";
import React, { useEffect, useState } from "react";
import { ShoppingBasket, X } from "lucide-react";
import { XAF } from "@/lib/functions";
import EditProductDialog from "./editProductDialog";
//import Image from 'next/image';
import { cartItem } from "@/types/types";
import { Button } from "@/components/ui/button";

function CartContent() {
  const { cart, removeFromCart, totalPrice, DeliveryFees } = useStore();
  const [cartItems, setCartItems] = useState<cartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setCartItems(cart);
    setIsLoading(false);
  }, [cart]);

  return (
    <div className="flex flex-col gap-8 w-full max-w-[420px] p-5">
      <h6 className="text-xl font-semibold">Ma commande</h6>
      <div className="cartScroll overflow-auto p-2">
        {isLoading ? (
          <div>Loading...</div>
        ) : cartItems.length === 0 ? (
          <div>
            <ShoppingBasket size={48} className="text-gray-400" />
            <span className="py-3 text-2xl md:text-3xl text-gray-400">
              Votre panier est vide
            </span>
          </div>
        ) : (
          cartItems.map((cartItem, index) => (
            <div
              className={`flex px-4 py-5 justify-start gap-4 rounded-md ${
                index % 2 === 1 ? "bg-gray-200" : ""
              }`}
              key={index}
            >
              <div className="relative h-[100px] w-[100px] rounded-md flex shrink-0 overflow-clip">
                <img
                  src={cartItem.image}
                  alt={cartItem.nom}
                  /* width={150} height={100} */ className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col gap-3">
                <h4 className="cartItemTitle">
                  {cartItem.nom} {cartItem.qte > 1 && `(x${cartItem.qte})`}
                </h4>
                <div className="flex flex-wrap gap-2">
                  <p className="text-xl font-bold">
                    {XAF.format(cartItem.price)}
                  </p>
                  <EditProductDialog
                    nom={cartItem.nom}
                    qte={cartItem.qte}
                    id={cartItem.id}
                    itemId={cartItem.itemId}
                    optionsCurrent={cartItem.options}
                    image={cartItem.image}
                  />
                </div>
              </div>

              <Button
                size={"icon"}
                variant={"destructive"}
                className="w-4 h-4 rounded-full"
                onClick={(e) => {
                  e.preventDefault();
                  removeFromCart(cartItem.itemId);
                }}
              >
                <X size={16} />
              </Button>
            </div>
          ))
        )}
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="flex flex-col gap-3">
          <p className="font-xl flex gap-4 items-center">
            <span>Frais de livraison</span>
            <span className="text-2xl font-semibold">
              {XAF.format(DeliveryFees)}
            </span>
          </p>
          <p className="font-xl flex gap-4 items-center">
            <span>Total à payer</span>
            <span className="text-2xl font-bold">
              {XAF.format(totalPrice() + DeliveryFees)}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}

export default CartContent;
