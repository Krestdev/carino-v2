"use client"

import { ProdData, ProductOption } from "@/types/types";
import ProductCart from "../universal/ProductCart";

interface ProductGridProps {
    products: ProdData[];
    options: ProductOption[];
    mandatoryTag: number;
}

const ProductsGrid = ({ products, options, mandatoryTag }: ProductGridProps) => {
    return (
        products.length > 0 ?
            <div className="w-full md:px-4 sm:px-6 lg:px-8">
                <div className="w-full grid 
                    grid-cols-1 
                    sm:grid-cols-2 
                    lg:grid-cols-3
                    xl:grid-cols-4
                    gap-4 sm:gap-5 lg:gap-6
                    auto-rows-fr">
                    {products.map((product, ind) => (
                        <div key={ind} className="h-full">
                            <ProductCart produit={product} options={options} mandatoryTag={mandatoryTag} />
                        </div>
                    ))}
                </div>
            </div> :
            <div className="w-full flex flex-col gap-2 items-center justify-center min-h-[400px] py-12">
                <img
                    src="/empty2.webp"
                    alt="Panier vide"
                    className="w-[150px] h-[150px] sm:w-[180px] sm:h-[180px] lg:w-[200px] lg:h-[200px] object-contain"
                />
                <p className="text-sm sm:text-base text-[#9CA3AF] text-center">
                    {"Aucun produit trouvé"}
                </p>
            </div>
    );
};

export default ProductsGrid;