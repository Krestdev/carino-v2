// hooks/useCategories.ts
import { useQuery } from '@tanstack/react-query';
import ProductQuery from '@/queries/productQuery';

const productQuery = new ProductQuery();

export const useCategories = () => {
    return useQuery({
        queryKey: ['categories'],
        queryFn: () => productQuery.getCategories(),
        staleTime: 1000 * 60 * 5,
        retry: 2,
    });
};