"use client";

import { Categories, ProductData } from "@/types/types";
import React, { useEffect, useRef, useState } from "react";
import ProductComp from "./ProductComp";
import { Button } from "../ui/button";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
    products: ProductData[];
    category?: Categories;
    isLeft?: boolean;
};

const ProductCarousel = ({ products, category, isLeft = true }: Props) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [visibleCount, setVisibleCount] = useState(1);
    const autoScrollRef = useRef<NodeJS.Timeout | null>(null);

    // Détection du nombre d'éléments visibles (responsive)
    useEffect(() => {
        const updateVisible = () => {
            if (window.innerWidth >= 1024) setVisibleCount(4); // Desktop
            else if (window.innerWidth >= 768) setVisibleCount(2); // Tablette
            else setVisibleCount(1); // Mobile
        };
        updateVisible();
        window.addEventListener("resize", updateVisible);
        return () => window.removeEventListener("resize", updateVisible);
    }, []);

    // Fonction pour démarrer l'auto-scroll
    const startAutoScroll = () => {
        // Nettoyer l'intervalle existant
        if (autoScrollRef.current) {
            clearInterval(autoScrollRef.current);
        }

        // Démarrer un nouvel intervalle
        autoScrollRef.current = setInterval(() => {
            setCurrentPage(prev => {
                const nextPage = (prev + 1) % totalPages;
                scrollToPage(nextPage);
                return nextPage;
            });
        }, 4000);
    };

    // Auto-scroll
    useEffect(() => {
        startAutoScroll();
        return () => {
            if (autoScrollRef.current) {
                clearInterval(autoScrollRef.current);
            }
        };
    }, [products.length, visibleCount]);

    // Scroll vers une "page"
    const scrollToPage = (page: number) => {
        const container = scrollRef.current;
        if (!container) return;

        const itemWidth = container.firstElementChild?.clientWidth || 0;
        const gap = 20; 
        const scrollAmount = page * (itemWidth * visibleCount + gap);

        container.scrollTo({
            left: scrollAmount,
            behavior: "smooth",
        });
        setCurrentPage(page);

        startAutoScroll();
    };

        const goToNextPage = () => {
        const nextPage = (currentPage + 1) % totalPages;
        scrollToPage(nextPage);
    };

    const goToPrevPage = () => {
        const prevPage = (currentPage - 1 + totalPages) % totalPages;
        scrollToPage(prevPage);
    };

    // Gestion du scroll manuel
    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;

        const handleScroll = () => {
            const itemWidth = container.firstElementChild?.clientWidth || 0;
            const gap = 20;
            const scrollPos = container.scrollLeft;
            const pageWidth = itemWidth * visibleCount + gap;
            const newPage = Math.round(scrollPos / pageWidth);

            if (newPage !== currentPage) {
                setCurrentPage(newPage);
                startAutoScroll();
            }
        };

        container.addEventListener("scroll", handleScroll);
        return () => container.removeEventListener("scroll", handleScroll);
    }, [currentPage, visibleCount]);

    const totalPages = Math.ceil(products.length / visibleCount);

    return (
        <div className="hidden md:flex max-w-[1440px] w-full mx-auto flex-col gap-6">
            <div className={`w-full flex flex-col ${isLeft ? "md:flex-row" : "md:flex-row-reverse"} gap-4`}>
                {/* Bloc catégorie FIXE */}
                <div className="relative basis-[351px] shrink-0 aspect-square">
                    <div className="absolute inset-0 bg-black/70" />
                    {category?.image && (
                        <img
                            src={category.image}
                            alt={category.name}
                            className="w-full h-full object-cover"
                        />
                    )}
                    <div className="absolute bottom-0 left-0 w-full flex flex-col gap-4 p-7 items-center">
                        <p className="text-white text-[49px] font-bold uppercase">{category?.name}</p>
                        <p className="text-white line-clamp-2">
                            {category?.description}
                        </p>
                        <Button>
                            <ArrowUpRight />
                            {"Voir tout"}
                        </Button>
                    </div>
                </div>

                {/* Carousel PRODUITS */}
                <div
                    ref={scrollRef}
                    className="
                        flex flex-1 gap-5 px-4 
                        overflow-x-auto snap-x snap-mandatory
                        scrollbar-hide
                        [-ms-overflow-style:none]  
                        [scrollbar-width:none]
                    "
                >
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="
                                snap-start shrink-0 
                                w-full sm:w-[90%] 
                                md:w-1/2 
                                lg:w-1/4
                            "
                        >
                            <ProductComp produit={product} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Indicateurs (jetons) */}
            <div className="hidden md:flex items-center justify-center gap-2 mt-2">
                <Button
                    variant={"ghost"}
                    className="w-8 h-8"
                    onClick={goToPrevPage}
                >
                    <ChevronLeft />
                </Button>
                {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                        key={i}
                        onClick={() => scrollToPage(i)}
                        className={`w-3 h-3 rounded-full transition-colors ${i === currentPage ? "bg-black" : "bg-gray-400"
                            }`}
                    />
                ))}
                <Button
                    variant={"ghost"}
                    className="w-8 h-8"
                    onClick={goToNextPage}
                >
                    <ChevronRight />
                </Button>
            </div>
        </div>
    );
};

export default ProductCarousel;