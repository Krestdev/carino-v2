"use client";

import Dishes from "@/components/produits/dishes";
import Head from "@/components/universal/Head";
import ProductQuery from "@/queries/productQuery";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";

const Category = ({ id }: { id: number }) => {
  const product = new ProductQuery();
  const productData = useQuery({
    queryKey: ["productFetchAll"],
    queryFn: () => product.getAllProducts(),
  });
  const categoryData = useQuery({
    queryKey: ["categoryFetchAll"],
    queryFn: () => product.getCategories(),
  });

  if (productData.isLoading && categoryData.isLoading) {
    return <div>Loading...</div>;
  }
  if (productData.isError && categoryData.isError) {
    return (
      <div>{productData.error?.message && categoryData.error?.message}</div>
    );
  }
  if (productData.isSuccess && categoryData.isSuccess) {
    const category = categoryData.data.data.find((x) => x.id == id);

    const filteredProducts = productData.data.data.filter((product) =>
      product.cat.some((x) => x.id == id || x.id_parent == id)
    );
    return (
      <>
        <Head
          image={category?.image ?? "/images/catalog.jpg"}
          title={category?.name}
        />
        <div className="container mx-auto">
          <div className="flex gap-2 border-b-[1px]  border-b-[#D9D9D9] pt-3 pr-5 pb-3 pl-5 ">
            <p className="text-orange-300">
              <Link href="/">Home</Link>
            </p>
            <ChevronRight className="text-orange-300" />
            <Link className="text-orange-300" href="/catalogue">
              Catalogue
            </Link>
            <ChevronRight />
            <p>{category?.name}</p>
          </div>
          <Dishes products={filteredProducts} />
        </div>
      </>
    );
  }
};

export default Category;
