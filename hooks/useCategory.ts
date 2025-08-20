// hooks/useCategories.ts
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { CategoryData } from "@/types/types";
import axiosConfig from "@/api";

export const useCategories = () => {
    const axiosClient = axiosConfig()
  return useQuery({
    queryKey: ["produits"],
    queryFn: (): Promise<AxiosResponse<CategoryData>> => {
      return axiosClient.get("/categories");
    },
  });
};
