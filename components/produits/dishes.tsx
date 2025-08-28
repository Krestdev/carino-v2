import React from "react";
import ProductComp from "../universal/ProductComp";
import { ProductsData } from "@/types/types";
interface Props {
  products: ProductsData[];
}
const Dishes = ({ products }: Props) => {
  return (
    <div className="grid grid-cols-1   md:grid-cols-4  gap-5  w-full pt-7 pr-5 pb-7 pl-5 justify-center items-center    ">
      {products.map((value: ProductsData, i: number) => {
        return (
          <div key={i} className=" ">
            <ProductComp produit={value} />
          </div>
        );
      })}
    </div>
  );
};

export default Dishes;
