import { Categories, ProductData } from "@/types/types";
import React from "react";
import Category from "../produits/categories";
import ProductCarousel from "../universal/ProductCarousel";
type Props = {
  product: ProductData[];
  categories: Categories[];
};

const ProductfilteredCarousel = ({ product, categories }: Props) => {
  const categoryList = categories.filter(
    (x: Categories) => x.id_parent === null
  );
  return (
    <>
      {categoryList.map((category, i: number) => {
        const isLeft = i % 2 === 0;
        return (
          <ProductCarousel
            key={i}
            products={product.filter((product) =>
              product.cat.some(
                (x) => x.id === category.id || x.id_parent === category.id
              )
            )}
            category={category}
            isLeft={isLeft}
          />
        );
      })}
    </>
  );
};

export default ProductfilteredCarousel;
