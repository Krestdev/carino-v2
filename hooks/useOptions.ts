// Hooks pour avoir toutes les options
import { useQuery } from "@tanstack/react-query";
import ProductQuery from "@/queries/productQuery";

const productQuery = new ProductQuery();

export const useOptions = () => {
    return useQuery({
        queryKey: ['options'],
        queryFn: () => productQuery.getOptions(),
        staleTime: 1000 * 60 * 5,
        retry: 2,
    });
};
