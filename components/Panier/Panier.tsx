/* eslint-disable @typescript-eslint/no-unused-vars */

import useStore from "@/context/store";
import { XAF } from "@/lib/functions";
import { CartTotal } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import DelieveryForm from "./DelieveryForm";
import TakeawayForm from "./TakeawayForm";
import { ApplyPromotions } from "../universal/promotions";
import { cartItem, deliveryMode, ProductOption } from "@/types/types";
import CartItems from "./CartItems";
import { useQuery } from "@tanstack/react-query";
import ProductQuery from "@/queries/productQuery";
import Loading from "@/app/loading";
import Error from "../universal/error";
import { ShoppingBasket } from "lucide-react";


const Panier = () => {
  const baseCart = useStore(s => s.cart);
  const [cart, setCart] = useState<Array<cartItem>>([]);
  const [deliveryMode, setDeliveryMode] = useState<deliveryMode>("delivery");
  const [postOrderStatus, setPostOrderStatus] = useState<boolean>(false);
  const [fees, setFees] = useState<number>(0);

  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  const productService = useMemo(() => new ProductQuery(baseURL), [baseURL]);
  const {
    data: produits,
    isLoading: isLoadingProducts,
    isError: isErrorProducts
  } = useQuery({
    queryKey: ["productFetchAll", baseURL],
    queryFn: () => productService.getAllProducts(),
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: optionsResponse,
    isLoading: isLoadingOptions,
    isError: isErrorOptions
  } = useQuery({
    queryKey: ["optionFetchAll", baseURL],
    queryFn: () => productService.getOptions(),
    staleTime: 5 * 60 * 1000,
  });

  // Vérification et normalisation des options
  const safeOptions: ProductOption[] = useMemo(() => {
    if (!optionsResponse) return [];
    if (Array.isArray(optionsResponse)) return optionsResponse;
    if (typeof optionsResponse === 'object') {
      const anyResponse: ProductOption[] = optionsResponse;
      if (anyResponse && Array.isArray(anyResponse)) return anyResponse;
      return Object.values(optionsResponse).filter(v => Array.isArray(v))[0] as ProductOption[] || [];
    }
    return [];
  }, [optionsResponse]);

  useEffect(() => {
    if (baseCart) {
      setCart(ApplyPromotions(baseCart));
    }
  }, [baseCart]);

  if (isLoadingProducts || isLoadingOptions) {
    return <Loading />
  }

  if (isErrorProducts || isErrorOptions) {
    return <Error />
  }

  return cart.length > 0 ? (
    <div className="w-full grid grid-cols-1 @min-[760px]:grid-cols-3 gap-10 py-10 sm:py-14 lg:py-20">
      <div className="col-span-2 flex flex-col gap-10">
        {deliveryMode === "takeaway" ? (
          <TakeawayForm
            fees={fees}
            setFees={setFees}
            setPostOrderStatus={setPostOrderStatus}
            cart={cart}
            deliveryMode={deliveryMode}
            setDeliveryMode={setDeliveryMode}
          />
        ) : (
          <DelieveryForm
            fees={fees}
            setFees={setFees}
            setPostOrderStatus={setPostOrderStatus}
            cart={cart}
            deliveryMode={deliveryMode}
            setDeliveryMode={setDeliveryMode}
          />
        )}
      </div>
      <div className="flex flex-col gap-3 p-3">
        <CartItems products={produits} items={cart} options={safeOptions} />
        <div className="flex flex-col">
          <p className="text-[14px] font-semibold text-[#4B5563]">{"Sous-total"}</p>
          <p className="text-[16px] text-primary font-medium font-general">{XAF.format(CartTotal(cart))}</p>
        </div>
        <div className="flex flex-col">
          <p className="text-[14px] font-semibold text-[#4B5563]">{"Livraison"}</p>
          <p className="text-[16px] text-primary font-medium font-general">{fees === 0 ? "N/A" : XAF.format(fees)}</p>
        </div>
        <div className="flex flex-col">
          <p className="text-[14px] font-semibold text-[#4B5563]">{"Total"}</p>
          <p className="text-[20px] text-[#29235C] font-semibold font-general">{XAF.format(CartTotal(cart) + fees)}</p>
        </div>
      </div>
      {/* <div className="flex flex-col gap-6 items-start justify-start max-w-[600px] w-full">
        <h3>{"Ma commande"}</h3>
        <Button onClick={emptyCart}>{"Vider le panier"}</Button>
        <div className="flex flex-col gap-4 max-h-[300px] overflow-auto">
          <div className="flex flex-col gap-4">
            {cart.map((item, index) => (
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
                {XAF.format(CartTotal(cart))}
              </span>
            </p>
            {
              deliveryMode === "delivery" &&
              <p className="text-[24px] font-normal text-end">
                {"Frais de livraison: "}
                <span className="text-[28px] font-bold">{XAF.format(fees)}</span>
              </p>}
          </div>
          <p className="text-[24px] font-normal text-end">
            {"TOTAL: "}
            <span className="text-[28px] font-bold">
              {XAF.format(CartTotal(cart) + fees)}
            </span>
          </p>
        </div>
      </div> */}
    </div>
  ) : (
    <div className="flex flex-col gap-6 items-center justify-center w-full py-20">
      <p className="text-[32px] font-bold">{"Votre panier est vide"}</p>
      <ShoppingBasket size={48} className="text-gray-400" />
    </div>
  );
};

export default Panier;
