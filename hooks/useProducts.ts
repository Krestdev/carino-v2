// hooks/useProducts.ts
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { Products } from "@/types/types";
import axiosConfig from "@/api";

export const useProducts = () => {
    const axiosClient = axiosConfig()
  return useQuery({
    queryKey: ["produits"],
    queryFn: (): Promise<AxiosResponse<Products>> => {
      return axiosClient.get("/products");
    },
  });
};
