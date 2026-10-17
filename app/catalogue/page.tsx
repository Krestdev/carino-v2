"use client";
import Categories from "@/components/Catalogue/Categories";
import ProductsGrid from "@/components/Catalogue/ProductsGrid";
import CartItems from "@/components/Panier/CartItems";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import Error from "@/components/universal/error";
import Head from "@/components/universal/Head";
import useStore from "@/context/store";
import { XAF } from "@/lib/functions";
import ProductQuery from "@/queries/productQuery";
import { CategoriesData, ProdData, ProductOption } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Search,
  SearchIcon,
  ShoppingBasket,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import Loading from "../loading";
import Link from "next/link";
import { useIsMobile } from "@/hooks/useIsMobile";

const MANDATORY_TAG = 316504;
const FIRST_TAG_ID = 253199;

const Page = () => {
  const [activeTab, setActiveTab] = useState<number>(FIRST_TAG_ID);
  const [searchTerm, setSearchTerm] = useState("");
  const [openCart, setOpenCart] = useState(false);
  const { cart, emptyCart } = useStore();
  const router = useRouter();
  const isMobile = useIsMobile();
  // const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  const productService = useMemo(() => new ProductQuery(), []);

  // Récupération des produits
  const {
    data: productsResponse,
    isLoading: isLoadingProducts,
    isError: isErrorProducts,
    error: productsError,
  } = useQuery({
    queryKey: ["productFetchAll"],
    queryFn: () => productService.getAllProducts(),
    staleTime: 5 * 60 * 1000,
  });

  // Récupération des catégories
  const {
    data: categoriesResponse,
    isLoading: isLoadingCategories,
    isError: isErrorCategories,
    error: categoriesError,
  } = useQuery({
    queryKey: ["categoryFetchAll"],
    queryFn: () => productService.getCategories(),
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: optionsResponse,
    isLoading: isLoadingOptions,
    isError: isErrorOptions,
    error: optionsError,
  } = useQuery({
    queryKey: ["optionFetchAll"],
    queryFn: () => productService.getOptions(),
    staleTime: 5 * 60 * 1000,
  });

  // Vérification et normalisation des options
  const safeOptions: ProductOption[] = useMemo(() => {
    if (!optionsResponse) return [];
    if (Array.isArray(optionsResponse)) return optionsResponse;
    if (typeof optionsResponse === "object") {
      const anyResponse: ProductOption[] = optionsResponse;
      if (anyResponse && Array.isArray(anyResponse)) return anyResponse;
      return (
        (Object.values(optionsResponse).filter((v) =>
          Array.isArray(v),
        )[0] as ProductOption[]) || []
      );
    }
    return [];
  }, [optionsResponse]);

  // Extraire les données des réponses
  const products = useMemo(() => {
    let rawProducts: ProdData[] = [];
    if (Array.isArray(productsResponse)) {
      rawProducts = productsResponse;
    } else if (productsResponse && typeof productsResponse === "object") {
      const anyResponse = productsResponse;
      rawProducts = anyResponse || [];
    }
    return rawProducts;
  }, [productsResponse]).filter((p) => p.tags.includes(MANDATORY_TAG));

  const allCategories = useMemo(() => {
    let rawCategories: CategoriesData[] = [];
    if (Array.isArray(categoriesResponse)) {
      rawCategories = categoriesResponse;
    } else if (categoriesResponse && typeof categoriesResponse === "object") {
      const anyResponse: CategoriesData[] = categoriesResponse;
      rawCategories = anyResponse || [];
    }
    return rawCategories;
  }, [categoriesResponse]);

  const parentCategories = useMemo(() => {
    return allCategories.filter(
      (category: CategoriesData) => !category.id_parent,
    );
  }, [allCategories]);

  // Obtenir tous les IDs d'une catégorie et ses enfants récursivement
  const getCategoryFamilyIds = useCallback(
    (parentId: number) => {
      let ids = [parentId];
      const children = allCategories.filter((c) => c.id_parent === parentId);
      children.forEach((child) => {
        ids = [...ids, ...getCategoryFamilyIds(child.id)];
      });
      return ids;
    },
    [allCategories],
  );

  // Filtrer les produits : la recherche porte sur TOUS les produits, quelle que soit
  // la catégorie sélectionnée ; sans recherche, on filtre par catégorie.
  const filterProducts = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (term) {
      return products.filter(
        (product) =>
          product.name.toLowerCase().includes(term) ||
          product.description?.toLowerCase().includes(term) ||
          product.sku?.toLowerCase().includes(term),
      );
    }

    if (activeTab === 0) return products;

    const familyIds = getCategoryFamilyIds(activeTab);
    return products.filter((product) => {
      // Exclure le tag MANDATORY_TAG et ne garder que les vraies catégories
      const validCategoryTags =
        product.tags?.filter(
          (tagId) =>
            tagId !== MANDATORY_TAG &&
            allCategories.some((cat) => cat.id === tagId),
        ) || [];

      return validCategoryTags.some((tagId) => familyIds.includes(tagId));
    });
  }, [products, activeTab, searchTerm, getCategoryFamilyIds, allCategories]);

  const totalProductPerCategory = useMemo<
    { categories: CategoriesData; total: number }[]
  >(() => {
    return parentCategories
      .filter((x) => x.id !== 316504)
      .map((category) => {
        const familyIds = getCategoryFamilyIds(category.id);

        const total = products.filter((product: ProdData) => {
          // Exclure le tag MANDATORY_TAG et vérifier que les tags sont des catégories valides
          const validCategoryTags =
            product.tags?.filter(
              (tagId) =>
                tagId !== MANDATORY_TAG &&
                allCategories.some((cat) => cat.id === tagId),
            ) || [];

          return validCategoryTags.some((tagId) => familyIds.includes(tagId));
        }).length;

        return {
          categories: category,
          total,
        };
      })
      .filter((item) => item.total > 0);
  }, [parentCategories, getCategoryFamilyIds, products, allCategories]);

  // Total product per tag
  const totalProductPerTag = useMemo<
    { category: CategoriesData; total: number }[]
  >(() => {
    return parentCategories
      .filter((x) => x.id !== 316504)
      .map((category) => {
        const familyIds = getCategoryFamilyIds(category.id);

        const total = products.filter((product: ProdData) => {
          // Exclure le tag MANDATORY_TAG et vérifier que les tags sont des catégories valides
          const validCategoryTags =
            product.tags?.filter(
              (tagId) =>
                tagId !== MANDATORY_TAG &&
                allCategories.some((cat) => cat.id === tagId),
            ) || [];

          return validCategoryTags.some((tagId) => familyIds.includes(tagId));
        }).length;

        return {
          category: category,
          total,
        };
      })
      .filter((item) => item.total > 0);
  }, [parentCategories, getCategoryFamilyIds, products, allCategories]);

  // Gestion de la recherche avec debounce
  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  // Gestion des erreurs
  if (isErrorProducts || isErrorCategories || isErrorOptions) {
    const errorMessage =
      productsError?.message ||
      categoriesError?.message ||
      optionsError?.message ||
      "Erreur lors du chargement des données";
    console.error("Error fetching data:", errorMessage);
    return <Error />;
  }

  // Gestion du chargement
  if (isLoadingProducts || isLoadingCategories || isLoadingOptions) {
    return <Loading />;
  }

  // Vérification des données
  if (!products.length && !isLoadingProducts) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100">
        <p className="text-gray-500">Aucun produit disponible</p>
      </div>
    );
  }

  const cartTotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  return (
    <div className="relative">
      <Head
        image="/catalog/catalog.webp"
        title="Catalogue"
        subTitle={"livraison & à emporter"}
        compact
      />
      <div className="flex flex-col gap-5 md:gap-12 px-7 pt-5 pb-28 md:pb-24 md:py-5 max-w-360 mx-auto">
        {/* Barre de recherche */}
        <div className="flex flex-col gap-1 max-w-90 w-full ml-auto">
          <p className="hidden md:flex text-[14px]">Recherche</p>
          <div className="relative">
            <Input
              placeholder={isMobile ? "Rechercher un produit" : "Ex. Burger, Pizza, Cocktail..."}
              value={searchTerm}
              onChange={handleSearch}
              className="focus:ring-2 focus:ring-primary"
            />
            <SearchIcon className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          {searchTerm.trim() && (
            <p className="text-sm text-gray-500 mt-1">
              {filterProducts.length} résultat
              {filterProducts.length > 1 ? "s" : ""} dans tous les produits
            </p>
          )}
        </div>

        {/* Catégories, panier et produits */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-8 md:gap-0">
          {/* Categories sticky - se fixe à 96px du haut (top-24) */}
          <div className="lg:sticky lg:top-24 self-start md:max-w-65 w-full">
            <Categories
              categories={totalProductPerCategory}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              totalProductPerTag={totalProductPerTag}
              firstTagId={FIRST_TAG_ID}
            />
          </div>

          {/* Panier (mobile) */}
          <div className="flex md:hidden flex-col gap-3 w-full rounded-xl border border-gray-200 bg-white p-4 shadow-lg">
            <p className="font-semibold font-general text-[15px] text-primary">
              Panier
            </p>

            <Collapsible
              open={openCart}
              onOpenChange={setOpenCart}
              className="w-full space-y-2"
            >
              <CollapsibleTrigger asChild>
                <div className="h-12 w-full flex flex-row items-center gap-2.5 px-4 rounded-md bg-[#F3F4F6] border-b border-[#4B5563] cursor-pointer active:bg-gray-200 transition-colors">
                  <p className="text-[#111827] text-[14px] font-medium flex-1">
                    {cart.length} Produit{cart.length > 1 ? "s" : ""} •{" "}
                    {XAF.format(cartTotal)}
                  </p>
                  {openCart ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </div>
              </CollapsibleTrigger>

              <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                <div className="bg-white border rounded-b-lg p-2">
                  <CartItems items={cart} title={false} />
                </div>
              </CollapsibleContent>
            </Collapsible>
            {cart.length > 0 && (
              <>
                <Button
                  size="lg"
                  className="w-full h-12 text-base font-semibold"
                  onClick={() => router.push("/panier")}
                >
                  {"Procéder au paiement"}
                  <ArrowRight className="w-5 h-5" />
                </Button>
                <Button variant={"outline"} onClick={emptyCart}>
                  {"Vider le panier"}
                </Button>
              </>
            )}
          </div>

          {/* ProductsGrid - reste scrollable normalement */}
          <ProductsGrid
            products={filterProducts}
            options={safeOptions}
            mandatoryTag={MANDATORY_TAG}
          />

          {/* CartItems sticky - se fixe à 96px du haut (top-24) */}
          <div className="lg:sticky lg:top-24 self-start hidden md:flex flex-col gap-3 p-3 max-w-75 w-full">
            <CartItems items={cart} width="max-w-[300px] w-full" />
            {cart.length > 0 && (
              <div>
                <Button onClick={() => router.push("/panier")}>
                  {"Procéder au paiement"}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Accès rapide au panier (mobile), fixe à l'écran */}
      {cart.length > 0 && (
        <Link
          href={"/panier"}
          className="fixed bottom-5 right-4 z-40 flex md:hidden items-center gap-2.5 rounded-full bg-accent px-5 py-3.5 text-base font-semibold text-white shadow-xl shadow-black/30 active:scale-95 transition-transform"
        >
          <ShoppingBasket className="size-6" />
          {"Votre panier"}
          <span className="absolute -top-1.5 -right-1 min-w-6 h-6 px-1.5 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center ring-2 ring-white">
            {cart.length}
          </span>
        </Link>
      )}
    </div>
  );
};

export default Page;
