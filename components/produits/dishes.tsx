import React from "react";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import ProductQuery from "@/queries/productQuery";
import { useQuery } from "@tanstack/react-query";
import Categories from "./categories";

const Dishes = () => {
  const product = new ProductQuery();
  const productData = useQuery({
    queryKey: ["productFetchAll"],
    queryFn: () => product.getAllProducts(),
  });
  if (productData.isLoading) {
    return <div>Loading...</div>;
  }
  if (productData.isError) {
    return <div>{productData.error?.message}</div>;
  }
  if (productData.isSuccess) {
    return (
      <div>
        {productData.data.data.slice(0, 12).map(
          (
            value: {
              image: string;
              name: string;
              description: string;
              price: number;
            },
            i: number
          ) => {
            return (
              <div key={i}>
                <div>
                  <img src={value.image} alt={value.name} />

                  <p>{value.name}</p>
                  <p>{value.description}</p>
                </div>
                <div>
                  <p>{value.price}</p>
                  <p>FCFA</p>
                </div>
                <Button>
                  <Plus color="white" />
                  {"Ajouter panier"}
                </Button>
              </div>
            );
          }
        )}
      </div>
    );
  }
};

export default Dishes;
