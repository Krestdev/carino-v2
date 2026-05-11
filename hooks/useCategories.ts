// hooks/useCategories.ts
import { useQuery } from '@tanstack/react-query';
import ProductQuery from '@/queries/productQuery';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
const productQuery = new ProductQuery(baseURL);

export const useCategories = () => {
    return useQuery({
        queryKey: ['categories'],
        queryFn: () => productQuery.getCategories(),
        staleTime: 1000 * 60 * 5,
        retry: 2,
    });
};