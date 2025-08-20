import { Categories, ProductData } from "@/types/types";
import React from "react";
import ProductComp from "./ProductComp";
import { Button } from "../ui/button";
import { ArrowUpRight } from "lucide-react";

type Props = {
  products: ProductData[];
  isCategory?: boolean;
  category?: Categories;
};

const ProductGrid = ({ products, isCategory, category }: Props) => {
  console.log(category?.image, isCategory);

  return (
    <div className="max-w-[1440px] w-full mx-auto flex flex-col gap">
      <div className="w-full flex flex-row">
        {isCategory === true && (
          <div className="relative max-w-[351px] w-full aspect-square">
            <div className="absolute inset-0 bg-black/70" />
            {category?.image && (
              <img
                src={category.image}
                alt={category.name}
                className="max-w-[351px] w-full aspect-square h-auto object-cover"
              />
            )}
            <div className="absolute bottom-0 left-0 w-full flex flex-col gap-4 p-7 items-center">
              <h4 className="text-white">{category?.name}</h4>
              <p className="text-white line-clamp-2">{category?.description}</p>
              <Button>
                <ArrowUpRight />
                {"Voi'r tout"}
              </Button>
            </div>
          </div>
        )}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 px-4">
          {(isCategory ? products.slice(0, 4) : products).map((product) => (
            <ProductComp key={product.id} produit={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;
