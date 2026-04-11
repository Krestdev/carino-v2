"use client";
import CategoryCarousel from "@/components/Home/CategoryCarousel";
import Hero from "@/components/Home/Hero";
import PubComp from "@/components/Home/PubComp";
import Reservation from "@/components/Home/Reservation";
import CatProdMob from "@/components/universal/CatProdMob";
import ProductCarousel from "@/components/universal/ProductCarousel";
import ProductQuery from "@/queries/productQuery";
import { Categories, ProductsData } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import Loading from "./loading";
import { useTransition, useState, useEffect } from "react";
import { useAppContext } from "@/providers/appContext";

export default function Home() {
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

  // Une fois les données prêtes, on déclenche la transition
  useEffect(() => {
    if (productData.isSuccess && categoryData.isSuccess) {
      startTransition(() => {
        setShowContent(true);
      });
    }
  }, [productData.isSuccess, categoryData.isSuccess]);

  if (productData.isLoading && categoryData.isLoading) {
    return <Loading />;
  }

  if (productData.isError && categoryData.isError) {
    return (
      <div>{productData.error?.message && categoryData.error?.message}</div>
    );
  }

  if (isPending || !showContent) {
    return <Loading />;
  }

  if (productData.isSuccess && categoryData.isSuccess) {
    // === Ton rendu principal une fois la transition finie ===
    const dailyMenu: ProductsData[] = productData.data.data.filter((product) =>
      product.cat?.some(
        (element) =>
          element.name?.toLocaleLowerCase().includes("suggestion") ||
          element.name?.toLocaleLowerCase() === "suggestions du chef"
      )
    );
    
    // Check if dailyMenu has items before accessing
    if (!dailyMenu.length) {
      return (
        <div className="overflow-clip">
          <Hero />
          <CategoryCarousel
            categories={categoryData.data.data.filter(
              (x: Categories) => x.id_parent === null
            )}
          />
          <Reservation />
        </div>
      );
    }
    
    const dailyCategory = categoryData.data.data.find(
      (category: Categories) => category.id === dailyMenu[0]?.cat?.[0]?.id
    );

    return (
      <div className="overflow-clip">
        <Hero />
        <div className="md:pt-6 container mx-auto ">
          {dailyMenu.length > 0 && dailyCategory && (
            <ProductCarousel products={dailyMenu} category={dailyCategory} />
          )}
        </div>
        {dailyMenu.length > 0 && dailyCategory && (
          <CatProdMob products={dailyMenu} category={dailyCategory} />
        )}
        <PubComp
          pub1={"/tempo/pub1.webp"}
          pub2={"/tempo/promo_pizza.webp"}
          pub3={"/tempo/pizza_marguerita.webp"}
        />
        <CategoryCarousel
          categories={categoryData.data.data.filter(
            (x: Categories) => x.id_parent === null
          )}
        />
        <Reservation />
      </div>
    );
  }
}