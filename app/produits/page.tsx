"use client";
import { Button } from "@/components/ui/button";
import ProductQuery from "@/queries/productQuery";
import UserQuery from "@/queries/userQueries";
import { useQuery } from "@tanstack/react-query";
import { headers } from "next/headers";
import React, { use } from "react";
import JsonView from "@uiw/react-json-view";
import Breadcumb from "@/components/produits/breadcumb";
import Categories from "@/components/produits/categories";
import Dishes from "@/components/produits/dishes";
import Hero from "@/components/produits/Hero";

const Page = () => {
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
    return (
      <>
        <Hero />
        {/*<JsonView value={productData.data.data[0]} />*/}
        {/* {productData.data.data.map((product: { name: string }) => (
            <p>{product.name}</p>
          ))} */}
        <div className=" pt-10 container mx-auto ">
          <Breadcumb />
          <Categories categories={categoryData.data.data} />
          <Dishes />
        </div>
      </>
    );
  }
};

export default Page;
