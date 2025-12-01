"use client";
import Breadcumb from "@/components/produits/breadcumb";
import DishGrid from "@/components/produits/dishGrid";
import Head from "@/components/universal/Head";
import ProductQuery from "@/queries/productQuery";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, useTransition } from "react";
import Loading from "../loading";
import { useAppContext } from "@/providers/appContext";
import NavigationBreadcrumb from "@/components/breadcrumb-item";

const Page = () => {
  const { baseURL } = useAppContext();

  const [isPending, startTransition] = useTransition();
  const [showContent, setShowContent] = useState(false);

  const product = new ProductQuery(baseURL);
  const productData = useQuery({
    queryKey: ["productFetchAll"],
    queryFn: () => product.getAllProducts(),
  });
  const categoryData = useQuery({
    queryKey: ["categoryFetchAll"],
    queryFn: () => product.getCategories(),
  });

  useEffect(() => {
    if (productData.isSuccess && categoryData.isSuccess) {
      startTransition(() => {
        setShowContent(true);
      });
    }
  }, [productData.isSuccess, categoryData.isSuccess]);

  if (productData.isError && categoryData.isError) {
    return (
      <div>{productData.error?.message && categoryData.error?.message}</div>
    );
  }

  if (isPending || !showContent) {
    return <Loading />;
  }

  if (productData.isSuccess && categoryData.isSuccess) {
    return (
      <>
        {/* <Hero /> */}
        <Head image="/images/catalog.jpg" title="Tous nos Produits" />
        <div className=" pt-10 container mx-auto ">
          <NavigationBreadcrumb className="mt-5 mb-2"/>
          <DishGrid
            categories={categoryData.data.data}
            dishes={productData.data.data.filter(x => x.price > 500)}
          />
        </div>
      </>
    );
  }
};

export default Page;
