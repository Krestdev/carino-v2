import { ProductsData } from "@/types/types";
import React from "react";
import ProductComp from "./ProductComp";

type Props = {
  products: ProductsData[];
};

const ProductGrid = ({ products }: Props) => {
  return (
    <div className="max-w-[1440px] w-full mx-auto flex flex-col gap">
      <div className="w-full flex flex-row">
        <div className="w-fit grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 items-center justify-center gap-5 px-4">
          {products.map((product) => (
            <ProductComp key={product.id} produit={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;
