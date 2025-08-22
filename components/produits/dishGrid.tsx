import { Categories, ProductData } from "@/types/types";
import React, { useState } from "react";
import Category from "./categories";
import Dishes from "./dishes";
interface Props {
  dishes: ProductData[];
  categories: Categories[];
}

const DishGrid = ({ dishes, categories }: Props) => {
  // list of filtered dishes
  const [filteredItems, setfilteredItems] = useState(dishes);

  // takes a category id an filter all products having a category with the same id. NB a product has many categories
  function handleFilter(filterId: number) {
    if (filterId === -1) {
      setfilteredItems(dishes);
    } else {
      const filteredProducts = dishes.filter((product) =>
        product.cat.some((x) => x.id === filterId)
      );
      setfilteredItems(filteredProducts);
    }
  }

  return (
    <>
      <Category
        categories={categories.filter((x) => x.id_parent == null)}
        handleFilter={handleFilter}
      />
      <Dishes products={filteredItems} />
    </>
  );
};

export default DishGrid;
