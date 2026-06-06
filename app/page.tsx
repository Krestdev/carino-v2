// app/page.tsx ou app/home/page.tsx (selon votre structure)
"use client";

import Hero from "@/components/Home/Hero";
import Suggestion from "@/components/Home/Suggestion";
import About from "@/components/Home/About";
import Promo from "@/components/Home/Promo";
import Galerie from "@/components/Home/Galerie";
import Reviews from "@/components/Home/Reviews";
import CallToAct from "@/components/Home/CallToAct";
import Loading from "./loading";
import ErrorComponent from "@/components/universal/error";
import { useAllProducts } from "@/hooks/useProducts";
import { useMemo } from "react";
import { useCategories } from "@/hooks/useCategories";
import { useOptions } from "@/hooks/useOptions";
import { ProductOption } from "@/types/types";

export default function Home() {
  const MANDATORY_TAG = 316504;
  const {
    data: productsData,
    isLoading: isLoadingProducts,
    isError: isErrorProducts
  } = useAllProducts();

  const {
    data: categoriesData,
    isLoading: isLoadingCategories,
    isError: isErrorCategories
  } = useCategories();

  const {
    data: optionsData,
    isLoading: isLoadingOptions,
    isError: isErrorOptions
  } = useOptions();

  // Mémorisation du calcul des suggestions du chef
  const dailyCategory = useMemo(() => {
    if (!categoriesData) return null;

    return categoriesData.find((categorie) =>
      categorie.name.toLowerCase().includes("suggestion") ||
      categorie.name.toLowerCase().includes("suggestions du chef")
    ) || null;
  }, [categoriesData]);

  // Mémorisation de la catégorie correspondante
  const dailyProducts = useMemo(() => {
    if (!productsData || !dailyCategory) return [];
    return productsData.filter((product) =>
      product.tags?.includes(dailyCategory.id)
    );
  }, [productsData, dailyCategory]);

  // Vérification et normalisation des options
  const safeOptions: ProductOption[] = useMemo(() => {
    if (!optionsData) return [];
    if (Array.isArray(optionsData)) return optionsData;
    if (typeof optionsData === 'object') {
      return Object.values(optionsData);
    }
    return [];
  }, [optionsData]);

  // Gestion des erreurs
  if (isErrorProducts || isErrorCategories || isErrorOptions) {
    return <ErrorComponent />;
  }

  // Gestion du chargement
  if (isLoadingProducts || isLoadingCategories || isLoadingOptions) {
    return <Loading />;
  }

  return (
    <div className="overflow-clip">
      <Hero />
      {dailyProducts.length > 0 && safeOptions.length > 0 && (
        <Suggestion products={dailyProducts} options={safeOptions} />
      )}
      <About />
      <Promo />
      <Galerie />
      <Reviews />
      <CallToAct />
    </div>
  );
}