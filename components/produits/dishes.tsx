import React from "react";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import ProductQuery from "@/queries/productQuery";
import { useQuery } from "@tanstack/react-query";
import Categories from "./categories";
import ProductComp from "../universal/ProductComp";
import { ProductData } from "@/types/types";

const Dishes = () => {
  const product = new ProductQuery();
  const productData = useQuery({
    queryKey: ["productFetchAll"],
    queryFn: () => product.getAllProducts(),
  });
  if (productData.isLoading) {
    return <div>Loading...</div>;
  }
  if (productData.isError) {
    return <div>{productData.error?.message}</div>;
  }
  if (productData.isSuccess) {
    return (
      <div className="  grid grid-cols-1   md:grid-cols-4  gap-5  w-full pt-7 pr-5 pb-7 pl-5 justify-center items-center    ">
        {productData.data.data.map((value: ProductData, i: number) => {
          return (
            <div className=" ">
              <ProductComp produit={value} />
            </div>
          );
        })}
      </div>
    );
  }
};

export default Dishes;
