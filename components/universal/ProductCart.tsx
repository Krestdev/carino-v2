import { ProdData, ProductOption } from "@/types/types";
import AddDialog from "./AddDialog";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { LuPlus } from "react-icons/lu";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

type Props = {
  produit: ProdData;
  options: ProductOption[];
  mandatoryTag: number;
};

const ProductCart = ({ produit, options, mandatoryTag }: Props) => {
  return (
    <div className="grid grid-cols-4 md:flex md:flex-col gap-2.5 w-full">
      <div className="relative">
        {produit.disable && (
          <Badge
            variant={"destructive"}
            className="absolute bottom-2 left-2 z-10"
          >
            {"Indisponible"}
          </Badge>
        )}

        <img
          src={produit.image ? produit.image : "/images/imagePlaceholder.svg"}
          alt={produit.name}
          className="md:max-w-[300px] w-full aspect-square h-auto object-cover cursor-pointer"
        />
      </div>
      <div className="col-span-3 flex flex-row items-start md:max-w-[300px]">
        <div className="flex flex-1 flex-col">
          <p className="text-[16px] font-semibold lowercase first-letter:uppercase line-clamp-2">
            {produit.name}
          </p>
          <p className="text-[14px] text-[#89590C] font-semibold">{`${produit.price} FCFA`}</p>
        </div>
        {produit.disable ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button className="w-10 h-10 p-0 bg-gray-300 hover:bg-gray-300 cursor-not-allowed">
                <LuPlus className="w-6 h-6 text-black" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-center max-w-[200px]">
                {"Ce produit est en rupture de stock"}
              </p>
            </TooltipContent>
          </Tooltip>
        ) : !produit.tags?.some((c) => c === mandatoryTag) ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button className="w-10 h-10 p-0 bg-gray-300 hover:bg-gray-300 cursor-not-allowed">
                <LuPlus className="w-6 h-6 text-black" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-center">
                {"Ce produit n'est disponible qu'au restaurant"}
              </p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <AddDialog options={options} product={produit}>
            {/* Je veux que le bouton soit disabled si le produit n'a pas MANDATORY_TAG */}
            <Button disabled={produit.disable} className={`w-10 h-10 p-0`}>
              <LuPlus className="w-6 h-6 text-white" />
            </Button>
          </AddDialog>
        )}
      </div>
    </div>
  );
};

export default ProductCart;
