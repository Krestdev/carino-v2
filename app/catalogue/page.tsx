"use client";
import Cataloguebreadcumb from "@/components/Catalogue/cataloguebreadcumb";
import ProductfilteredCarousel from "@/components/Catalogue/productfilteredCarousel";
import Head from "@/components/universal/Head";
import ProductQuery from "@/queries/productQuery";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, useTransition } from "react";
import Loading from "../loading";
import { useAppContext } from "@/providers/appContext";

const Page = () => {
  const [isPending, startTransition] = useTransition();
  const [showContent, setShowContent] = useState(false);
  const { baseURL } = useAppContext();

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

  if (isPending || !showContent) {
    return <Loading />;
  }

  if (productData.isSuccess && categoryData.isSuccess) {
    return (
      <>
        {/* <CatalogueHero /> */}
        <Head image="/images/catalog.jpg" title="Catalogue" />
        <div className="container mx-auto flex flex-col gap-4 ">
          <Cataloguebreadcumb />
          <h3>Catalogue</h3>

          <ProductfilteredCarousel
            product={productData.data.data}
            categories={categoryData.data.data}
          />
        </div>
      </>
    );
  }
};

export default Page;
