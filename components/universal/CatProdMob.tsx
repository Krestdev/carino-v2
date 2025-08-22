import { Categories, ProductData } from "@/types/types";
import React from "react";
import { Button } from "../ui/button";
import { ArrowUpRight } from "lucide-react";
import ProductGrid from "./ProductGrid";

type Props = {
  products: ProductData[];
  category?: Categories;
};

const CatProdMob = ({ products, category }: Props) => {
  return (
    <div className="flex md:hidden flex-col items-center justify-center w-full gap-4">
      <div className="relative w-full aspect-[4/3]">
        <div className="absolute inset-0 bg-black/50" />
        {category?.image && (
          <img
            src={category.image}
            alt={category.name}
            className="w-screen h-full object-cover"
          />
        )}
        <div className="absolute bottom-0 left-0 w-full flex flex-col gap-4 p-7 items-center ">
          <p className="text-white text-[40px] font-bold uppercase text-center">
            {category?.name}
          </p>
          <p className="text-white line-clamp-2">
            {category?.description
              ? category.description
              : "Nos menu pour vous tous les jours"}
          </p>
          <Button>
            <ArrowUpRight />
            {"Voir tout"}
          </Button>
        </div>
      </div>
      <ProductGrid products={products.slice(0, 4)} />
    </div>
  );
};

export default CatProdMob;
