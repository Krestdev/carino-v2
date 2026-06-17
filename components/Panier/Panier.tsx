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

  const productService = useMemo(() => new ProductQuery(), [baseURL]);
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
    <div className="w-full grid grid-cols-1 @min-[760px]:grid-cols-3 gap-10 py-5 sm:py-14 lg:py-10">
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
      <div className="flex flex-col gap-1 w-full">
        <div className="border border-gray-200 rounded-2xl p-4 shadow-md max-w-90 w-full mx-auto">
          <CartItems products={produits} items={cart} options={safeOptions} showTotal={false} isCart={true} width="max-w-[300px] w-full" />
          {/* <div className="flex flex-col mt-3">
          <p className="text-[12px] text-[#4B5563]">{"Sous-total"}</p>
          <p className="text-[14px] text-primary font-medium font-general">{XAF.format(CartTotal(cart))}</p>
        </div> */}
          <div className="flex flex-row items-center justify-between mt-3">
            <p className="text-[14px] text-[#4B5563]">{"Livraison"}</p>
            <p className="text-[14px] text-primary font-medium font-general">{fees === 0 ? "Aucun frais" : XAF.format(fees)}</p>
          </div>
          <div className="flex flex-row items-center justify-between">
            <p className="text-[14px] text-[#4B5563]">{"Total"}</p>
            <p className="text-[14px] text-[#29235C] font-semibold font-general">{XAF.format(CartTotal(cart) + fees)}</p>
          </div>
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
