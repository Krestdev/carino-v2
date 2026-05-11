"use client"

import { Categories, OptionData, OptionValue, ProdData, ProductOption, ProductsData } from "@/types/types";
import ProductCart from "../universal/ProductCart";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
    products: ProdData[];
    options: ProductOption[];
};

const Suggestion = ({ products, options }: Props) => {
    const router = useRouter();
    return (
        <div className="max-w-[1280px] w-full mx-auto flex flex-col items-center gap-7 md:gap-12 px-7 py-12 md:py-24">
            <div className="flex flex-col items-center gap-1 max-w-[768px] w-full">
                <h4 className="uppercase">{"Le goût du jour"}</h4>
                <h2>{"Suggestions du Chef"}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                {products.slice(0, 4).map((product, index) => (
                    <div key={index}>
                        <ProductCart produit={product} options={options} />
                    </div>
                ))}

            </div>
            <Button onClick={() => router.replace("/catalogue")} className="bg-primary">
                {"Voir tous les plats"}
                <ArrowRight />
            </Button>
        </div>
    );
}

export default Suggestion;