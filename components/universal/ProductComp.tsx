import { ProductsData } from "@/types/types";
import React from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { LuPlus } from "react-icons/lu";
import { ProductData } from "@/types/types";
import React from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { LuPlus } from "react-icons/lu";
import AddDialog from "./AddDialog";

type Props = {
  produit: ProductsData;
};
  produit: ProductData;
};

const ProductComp = ({ produit }: Props) => {
  return (
    <div className="relative grid grid-cols-2 md:flex md:flex-col gap-3 md:gap-[22px] max-w-[350px] md:max-w-full w-full h-full bg-white shadow-[0_4px_4px_rgba(0,0,0,0.25)] border p-4">
      {produit.disable && (
        <Badge
          variant={"destructive"}
          className="absolute top-[25px] right-[25px] z-10"
        >
          {"Indisponible"}
        </Badge>
      )}
      {
        <img
          src={produit.image ? produit.image : "/images/imagePlaceholder.svg"}
          alt={produit.name}
          className={`md:max-w-[351px] aspect-[149/162] md:aspect-[4/3] md:h-auto object-cover ${
            produit.disable ? " grayscale-100 hover:grayscale-0" : ""
          }`}
        />
      }
      <div className="flex flex-col md:justify-between h-full justify-end">
        <div className="flex flex-col gap-2">
          <p className="text-[14px] font-bold uppercase">{produit.name}</p>
          <p className="text-[24px] font-bold">{`${produit.price} FCFA`}</p>
        </div>
        <Button
          disabled={produit.disable}
          className={`${
            produit.disable ? "bg-gray-300 cursor-not-allowed" : ""
          }`}
        >
          <LuPlus />
          {"Ajouter au panier"}
        </Button>
      </div>
    </div>
  );
};
  return (
    <div className="relative grid grid-cols-2 md:flex md:flex-col gap-3 md:gap-[22px] w-full md:max-w-[350px] h-full bg-white shadow-[0_4px_4px_rgba(0,0,0,0.25)] border border-gray-300 p-4">
      {produit.disable && (
        <Badge
          variant={"destructive"}
          className="absolute top-[25px] right-[25px] z-10"
        >
          {"Indisponible"}
        </Badge>
      )}
      {
        <img
          src={produit.image ? produit.image : "/images/imagePlaceholder.svg"}
          alt={produit.name}
          className="md:max-w-[351px] aspect-[149/162] md:aspect-[4/3] md:h-auto object-cover"
        />
      }
      <div className="flex flex-col md:justify-between h-full justify-end">
        <div className="flex flex-col gap-2">
          <p className="text-[14px] font-bold uppercase">{produit.name}</p>
          <p className="text-[24px] font-bold">{`${produit.price} FCFA`}</p>
        </div>
        <AddDialog id={0} name={produit.name} image={produit.image} description={produit.description} price={produit.price} cat={produit.cat} options={produit.options}>

          <Button
            disabled={produit.disable}
            className={`${produit.disable ? "bg-gray-300 cursor-not-allowed" : ""
              }`}
          >
            <LuPlus />
            {"Ajouter au panier"}
          </Button>
        </AddDialog>
      </div>
    </div>
  );
};

export default ProductComp;
export default ProductComp;
