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

const MANDATORY_TAG = 316504;
const FIRST_TAG_ID = 253199;

const Page = () => {
  const [activeTab, setActiveTab] = useState<number>(FIRST_TAG_ID);
  const [searchTerm, setSearchTerm] = useState("");
  const [openCart, setOpenCart] = useState(false);
  const { cart, emptyCart } = useStore();
  const router = useRouter();
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

  // Filtrer les produits par catégorie et par recherche
  const filterProducts = useMemo(() => {
    let filtered = [...products];

    // Filtrer par catégorie (tag)
    if (activeTab !== 0) {
      const familyIds = getCategoryFamilyIds(activeTab);
      filtered = filtered.filter((product) => {
        // Filtrer les tags pour exclure le tag MANDATORY_TAG (316504)
        // et s'assurer que les tags restants sont de vraies catégories
        const validCategoryTags =
          product.tags?.filter(
            (tagId) =>
              tagId !== MANDATORY_TAG &&
              allCategories.some((cat) => cat.id === tagId),
          ) || [];

        // Vérifier si au moins un tag valide est dans la famille de catégories
        return validCategoryTags.some((tagId) => familyIds.includes(tagId));
      });
    }

    // Filtrer par recherche
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(term) ||
          product.description?.toLowerCase().includes(term) ||
          product.sku?.toLowerCase().includes(term),
      );
    }

    return filtered;
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

  return (
    <div className="relative">
      <Head
        image="/catalog/catalog.webp"
        title="Catalogue"
        subTitle={"livraison & à emporter"}
      />
      <div className="flex flex-col gap-5 md:gap-12 px-7 pb-12 md:pb-24 py-5 max-w-360 mx-auto">
        {/* Barre de recherche */}
        <div className="flex flex-col gap-1 max-w-90 w-full ml-auto">
          <p className="hidden md:flex text-[14px]">Recherche</p>
          <div className="relative">
            <Input
              placeholder="Ex. Burger, Pizza, Cocktail..."
              value={searchTerm}
              onChange={handleSearch}
              className="focus:ring-2 focus:ring-primary"
            />
            <SearchIcon className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          {searchTerm && (
            <p className="text-sm text-gray-500 mt-1">
              {filterProducts.length} résultat
              {filterProducts.length > 1 ? "s" : ""} trouvé
              {filterProducts.length > 1 ? "s" : ""}
            </p>
          )}
        </div>

        {/* Categories et produits avec sticky */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-5 md:gap-0">
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
      {cart.length > 0 && (
        <Link href={"/panier"} className="sticky bottom-2 ml-auto mr-2 bg-accent shadow-lg rounded-full w-fit p-3 flex md:hidden flex-col">
          <ShoppingBasket className="text-white" />
          <p className="absolute text-white top-0 right-0 bg-primary rounded-full w-5 h-5 flex items-center justify-center">{cart.length}</p>
        </Link>
      )}
    </div>
  );
};

export default Page;
