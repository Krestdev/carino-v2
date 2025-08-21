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
        <div className="bg-[url('/images/catalog.jpg')] bg-cover w-full h-screen flex justify-center items-center ">
          <h1 className="text-white">Tout nos Produits</h1>
        </div>
        {/*<JsonView value={productData.data.data[0]} />*/}
        {/* {productData.data.data.map((product: { name: string }) => (
            <p>{product.name}</p>
          ))} */}
        <div>
          <Breadcumb />
          <Categories />
          <Dishes />

          <p>{productData.data.data[2].name}</p>
          <p>{productData.data.data[2].price}</p>
        </div>

        <img
          src={productData.data.data[2].image}
          alt={productData.data.data[2].name}
        />
      </>
    );
  }
};

export default Page;
