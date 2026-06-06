"use client";

import {
    Categories,
    OptionData,
    OptionValue,
    ProdData,
    ProductOption,
    ProductsData,
} from "@/types/types";
import ProductCart from "../universal/ProductCart";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { XAF } from "@/lib/functions";
import AddDialog from "../universal/AddDialog";
import { LuPlus } from "react-icons/lu";

type Props = {
    products: ProdData[];
    options: ProductOption[];
};

const Suggestion = ({ products, options }: Props) => {
    const router = useRouter();
    return (
        <div className="max-w-[1280px] w-full mx-auto flex flex-col items-center gap-7 md:gap-12 px-7 py-7 md:py-30">
            <div className="flex flex-col items-center gap-1 max-w-3xl w-full">
                <h4 className="uppercase">{"Le goût du jour"}</h4>
                <h2>{"Suggestions du Chef"}</h2>
            </div>
            <div className="max-w-[768px] w-full flex flex-col md:gap-12 gap-4">
                {products.map((product, index) => {
                    return (
                        <div key={index} className="flex flex-row gap-2 items-start">
                            <div className="flex-1 flex flex-col">
                                <div className="flex gap-2 md:gap-5 items-center">
                                    <p className="text-[12px] md:text-[18px] md:font-semibold text-[#111827] first-letter:uppercase lowercase">
                                        {product.name}
                                    </p>
                                    <div className="bg-accent h-px flex-1 w-full" />
                                    <p className="text-[12px] md:text-[18px] md:font-semibold text-[#111827]">
                                        {XAF.format(product.price)}
                                    </p>
                                </div>
                                <p className="text-accent text-[12px] ">
                                    {product.description}
                                </p>
                            </div>
                            <AddDialog options={options} product={product}>
                                {/* Je veux que le bouton soit disabled si le produit n'a pas MANDATORY_TAG */}
                                <Button
                                    disabled={product.disable}
                                    className={`h-6 w-6 p-0 bg-primary opacity-90 hover:bg-accent hover:text-black`}
                                >
                                    <LuPlus className="w-6 h-6 text-white" />
                                </Button>
                            </AddDialog>
                        </div>
                    );
                })}
            </div>
            <Button
                onClick={() => router.replace("/catalogue")}
                className="bg-primary"
            >
                {"Voir la carte"}
                <ArrowRight />
            </Button>
        </div>
    );
};

export default Suggestion;
