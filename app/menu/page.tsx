"use client";
import Head from "@/components/universal/Head";
import { useAppContext } from "@/providers/appContext";
import ProductQuery from "@/queries/productQuery";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, useMemo, useCallback } from "react";
import Loading from "../loading";
import { Input } from "@/components/ui/input";
import Error from "@/components/universal/error";
import Categories from "@/components/Catalogue/Categories";
import ProductsGrid from "@/components/Catalogue/ProductsGrid";
import { CategoriesData, ProdData, ProductOption, ProductsData } from "@/types/types";
import CartItems from "@/components/Panier/CartItems";
import useStore from "@/context/store";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { XAF } from "@/lib/functions";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const MANDATORY_TAG = 316504;

const Page = () => {
    const [activeTab, setActiveTab] = useState<number>(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [openCart, setOpenCart] = useState(false);
    const { cart, emptyCart } = useStore()
    const router = useRouter();
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || ""
    const productService = useMemo(() => new ProductQuery(), [baseURL]);

    // Récupération des produits
    const {
        data: productsResponse,
        isLoading: isLoadingProducts,
        isError: isErrorProducts,
        error: productsError
    } = useQuery({
        queryKey: ["productFetchAll", baseURL],
        queryFn: () => productService.getAllProducts(),
        staleTime: 5 * 60 * 1000,
    });

    // Récupération des catégories
    const {
        data: categoriesResponse,
        isLoading: isLoadingCategories,
        isError: isErrorCategories,
        error: categoriesError
    } = useQuery({
        queryKey: ["categoryFetchAll", baseURL],
        queryFn: () => productService.getCategories(),
        staleTime: 5 * 60 * 1000,
    });

    const {
        data: optionsResponse,
        isLoading: isLoadingOptions,
        isError: isErrorOptions,
        error: optionsError
    } = useQuery({
        queryKey: ["optionFetchAll", baseURL],
        queryFn: () => productService.getOptions(),
        staleTime: 5 * 60 * 1000,
    });

    // Vérification et normalisation des options
    const safeOptions: ProductOption[] = useMemo(() => {
        if (!optionsResponse) return [];
        if (Array.isArray(optionsResponse)) return optionsResponse;
        if (typeof optionsResponse === 'object') {
            const anyResponse: ProductOption[] = optionsResponse;
            if (anyResponse && Array.isArray(anyResponse)) return anyResponse;
            return Object.values(optionsResponse).filter(v => Array.isArray(v))[0] as ProductOption[] || [];
        }
        return [];
    }, [optionsResponse]);

    // Extraire les données des réponses
    const products = useMemo(() => {
        let rawProducts: ProdData[] = [];
        if (Array.isArray(productsResponse)) {
            rawProducts = productsResponse;
        } else if (productsResponse && typeof productsResponse === 'object') {
            const anyResponse = productsResponse;
            rawProducts = anyResponse || [];
        }
        return rawProducts.filter((product: ProdData) =>
            !product.disable &&
            product.tags?.some(c => c === MANDATORY_TAG)
        );
    }, [productsResponse]);

    const allCategories = useMemo(() => {
        let rawCategories: CategoriesData[] = [];
        if (Array.isArray(categoriesResponse)) {
            rawCategories = categoriesResponse;
        } else if (categoriesResponse && typeof categoriesResponse === 'object') {
            const anyResponse: CategoriesData[] = categoriesResponse;
            rawCategories = anyResponse || [];
        }
        return rawCategories;
    }, [categoriesResponse]);

    const parentCategories = useMemo(() => {
        return allCategories.filter((category: CategoriesData) => !category.id_parent);
    }, [allCategories]);

    // Obtenir tous les IDs d'une catégorie et ses enfants récursivement
    const getCategoryFamilyIds = useCallback((parentId: number) => {
        let ids = [parentId];
        const children = allCategories.filter(c => c.id_parent === parentId);
        children.forEach(child => {
            ids = [...ids, ...getCategoryFamilyIds(child.id)];
        });
        return ids;
    }, [allCategories]);

    // Filtrer les produits par catégorie et par recherche
    const filterProducts = useMemo(() => {
        let filtered = [...products];

        // Filtrer par catégorie (tag)
        if (activeTab !== 0) {
            const familyIds = getCategoryFamilyIds(activeTab);
            filtered = filtered.filter((product) => {
                // Filtrer les tags pour exclure le tag MANDATORY_TAG (316504)
                // et s'assurer que les tags restants sont de vraies catégories
                const validCategoryTags = product.tags?.filter(tagId =>
                    tagId !== MANDATORY_TAG &&
                    allCategories.some(cat => cat.id === tagId)
                ) || [];

                // Vérifier si au moins un tag valide est dans la famille de catégories
                return validCategoryTags.some(tagId => familyIds.includes(tagId));
            });
        }

        // Filtrer par recherche
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase().trim();
            filtered = filtered.filter((product) =>
                product.name.toLowerCase().includes(term) ||
                product.description?.toLowerCase().includes(term) ||
                product.sku?.toLowerCase().includes(term)
            );
        }

        return filtered;
    }, [products, activeTab, searchTerm, getCategoryFamilyIds, allCategories]);

    const totalProductPerCategory = useMemo<{ categories: CategoriesData, total: number }[]>(() => {
        return parentCategories.filter(x => x.id !== 316504)
            .map((category) => {
                const familyIds = getCategoryFamilyIds(category.id);

                const total = products.filter((product: ProdData) => {
                    // Exclure le tag MANDATORY_TAG et vérifier que les tags sont des catégories valides
                    const validCategoryTags = product.tags?.filter(tagId =>
                        tagId !== MANDATORY_TAG &&
                        allCategories.some(cat => cat.id === tagId)
                    ) || [];

                    return validCategoryTags.some(tagId => familyIds.includes(tagId));
                }).length;

                return {
                    categories: category,
                    total
                };
            })
            .filter(item => item.total > 0);
    }, [parentCategories, getCategoryFamilyIds, products, allCategories]);

    // Gestion de la recherche avec debounce
    const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    }, []);

    // Gestion des erreurs
    if (isErrorProducts || isErrorCategories || isErrorOptions) {
        const errorMessage = productsError?.message || categoriesError?.message || optionsError?.message || "Erreur lors du chargement des données";
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
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <p className="text-gray-500">Aucun produit disponible</p>
            </div>
        );
    }

    return (
        <>
            <Head image="/catalog/catalog.webp" title="Catalogue" subTitle={"livraison & à emporter"} />
            <div className="flex flex-col gap-7 md:gap-12 px-7 py-12 md:py-24 max-w-[1440px] mx-auto">
                {/* Barre de recherche */}
                <div className="flex flex-col gap-1 max-w-[360px] w-full">
                    <p className="font-semibold text-[14px]">Recherche</p>
                    <Input
                        placeholder="Ex. Burger, Pizza, Cocktail..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="focus:ring-2 focus:ring-primary"
                    />
                    {searchTerm && (
                        <p className="text-sm text-gray-500 mt-1">
                            {filterProducts.length} résultat{filterProducts.length > 1 ? 's' : ''} trouvé{filterProducts.length > 1 ? 's' : ''}
                        </p>
                    )}
                </div>

                {/* Categories et produits avec sticky */}
                <div className="flex flex-col md:flex-row items-start justify-between gap-10">
                    {/* Categories sticky - se fixe à 96px du haut (top-24) */}
                    <div className="lg:sticky lg:top-24 self-start md:max-w-[260px] w-full">
                        <Categories
                            categories={totalProductPerCategory}
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                        />
                    </div>
                    <div className="flex md:hidden flex-col gap-3 w-full">
                        <p className="font-semibold font-general text-[20px] text-primary">
                            Panier
                        </p>

                        <Collapsible
                            open={openCart}
                            onOpenChange={setOpenCart}
                            className="w-full space-y-2"
                        >
                            {/* Le Trigger agit comme la barre d'un Select */}
                            <CollapsibleTrigger asChild>
                                <div className="h-12 w-full flex flex-row items-center gap-2.5 px-4 bg-[#F3F4F6] border-b border-[#4B5563] cursor-pointer active:bg-gray-200 transition-colors">
                                    <p className="text-[#111827] text-[14px] font-medium flex-1">
                                        {cart.length} Produit{cart.length > 1 ? 's' : ''} • {XAF.format(cart.reduce((acc, item) => acc + item.price * item.quantity, 0))}
                                    </p>
                                    {openCart ? (
                                        <ChevronUp className="w-5 h-5 text-gray-500" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-gray-500" />
                                    )}
                                </div>
                            </CollapsibleTrigger>

                            {/* Le contenu qui "s'ouvre" comme une liste de Select */}
                            <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                                <div className="bg-white rounded-b-lg p-2">
                                    <CartItems items={cart} title={false} />
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                        {
                            cart.length > 0 &&
                            <>
                                <Button onClick={() => router.push("/panier")}>
                                    {"Continuer"}
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                                <Button variant={"outline"} onClick={emptyCart}>
                                    {"Vider le panier"}
                                </Button>
                            </>
                        }
                    </div>
                    {/* ProductsGrid - reste scrollable normalement */}
                    <ProductsGrid products={filterProducts} options={safeOptions} mandatoryTag={MANDATORY_TAG} />

                    {/* CartItems sticky - se fixe à 96px du haut (top-24) */}
                    <div className="lg:sticky lg:top-24 self-start hidden md:flex flex-col gap-3 p-3 max-w-[260px] w-full">
                        <CartItems items={cart} width="max-w-[260px] w-full" />
                        {
                            cart.length > 0 &&
                            <>
                                <Button onClick={() => router.push("/panier")}>
                                    {"Continuer"}
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                                <Button variant={"outline"} onClick={emptyCart}>
                                    {"Vider le panier"}
                                </Button>
                            </>
                        }
                    </div>
                </div>
            </div>
        </>
    );
};

export default Page;