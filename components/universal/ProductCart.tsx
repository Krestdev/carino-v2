import { ProdData, ProductOption } from "@/types/types";
import AddDialog from "./AddDialog";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { LuPlus } from "react-icons/lu";

type Props = {
    produit: ProdData;
    options: ProductOption[];
};

const ProductCart = ({ produit, options }: Props) => {

    return (
        <div className="grid grid-cols-4 md:flex md:flex-col gap-2.5 w-full">
            {produit.disable && (
                <Badge
                    variant={"destructive"}
                    className="absolute top-[25px] right-[25px] z-10"
                >
                    {"Indisponible"}
                </Badge>
            )}

            <img
                src={produit.image ? produit.image : "/images/imagePlaceholder.svg"}
                alt={produit.name}
                className="md:max-w-[300px] aspect-square h-auto object-cover cursor-pointer"
            />
            <div className="col-span-3 flex flex-row items-center md:max-w-[300px]">
                <div className="flex flex-1 flex-col">
                    <p className="text-[16px] font-semibold uppercase line-clamp-2">{produit.name}</p>
                    <p className="text-[14px] text-[#89590C] font-semibold">{`${produit.price} FCFA`}</p>
                </div>
                <AddDialog options={options} product={produit}>
                    <Button
                        disabled={produit.disable}
                        className={`w-10 h-10 p-0 ${produit.disable ? "bg-gray-300 cursor-not-allowed" : "bg-[#FFC336] hover:bg-[#FFC336]/90 hover:text-none"
                            }`}
                    >
                        <LuPlus className="w-6 h-6 text-black" />
                    </Button>
                </AddDialog>
            </div>
        </div>
    );
};

export default ProductCart;
