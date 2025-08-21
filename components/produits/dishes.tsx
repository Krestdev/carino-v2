import React, { useState } from "react";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import ProductQuery from "@/queries/productQuery";
import { useQuery } from "@tanstack/react-query";
import Categories from "./categories";
import ProductComp from "../universal/ProductComp";
import { ProductData } from "@/types/types";
interface Props {
  products: ProductData[];
}
const Dishes = ({ products }: Props) => {
  return (
    <div className="  grid grid-cols-1   md:grid-cols-4  gap-5  w-full pt-7 pr-5 pb-7 pl-5 justify-center items-center    ">
      {products.map((value: ProductData, i: number) => {
        return (
          <div className=" ">
            <ProductComp produit={value} />
          </div>
        );
      })}
    </div>
  );
};

export default Dishes;
