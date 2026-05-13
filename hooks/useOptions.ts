// Hooks pour avoir toutes les options
import { useQuery } from "@tanstack/react-query";
import ProductQuery from "@/queries/productQuery";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";
const productQuery = new ProductQuery(baseURL);

export const useOptions = () => {
    return useQuery({
        queryKey: ['options'],
        queryFn: () => productQuery.getOptions(),
        staleTime: 1000 * 60 * 5,
        retry: 2,
    });
};
