// hooks/useProducts.ts
import ProductQuery from '@/queries/productQuery';
import { ReceiptProps } from '@/types/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
const productQuery = new ProductQuery();

// Clés de query pour le caching
export const queryKeys = {
    products: ['products'] as const,
    product: (name: string) => ['product', name] as const,
    categoryProducts: (category: string) => ['category', category, 'products'] as const,
    categories: ['categories'] as const,
};

// Hook pour récupérer tous les produits
export const useAllProducts = () => {
    return useQuery({
        queryKey: queryKeys.products,
        queryFn: () => productQuery.getAllProducts(),
    });
};

// Hook pour récupérer un produit par nom
export const useProductByName = (productName: string) => {
    return useQuery({
        queryKey: queryKeys.product(productName),
        queryFn: () => productQuery.getProductByName(productName),
        enabled: !!productName, // Ne s'exécute que si productName existe
    });
};

// Hook pour récupérer les produits par catégorie
export const useCategoryProducts = (category: string) => {
    return useQuery({
        queryKey: queryKeys.categoryProducts(category),
        queryFn: () => productQuery.getAllCategoryProducts(category),
        enabled: !!category,
    });
};

// Hook pour récupérer toutes les catégories
export const useCategories = () => {
    return useQuery({
        queryKey: queryKeys.categories,
        queryFn: () => productQuery.getCategories(),
    });
};

// Hook pour poster un ticket (mutation)
export const usePostTicket = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: ReceiptProps) => productQuery.postTicket(data),
        onSuccess: () => {
            // Invalider les queries si nécessaire après l'envoi du ticket
            queryClient.invalidateQueries({ queryKey: queryKeys.products });
            queryClient.invalidateQueries({ queryKey: queryKeys.categories });
            console.log('Ticket envoyé avec succès');
        },
        onError: (error: Error) => {
            console.error('Erreur lors de l\'envoi du ticket:', error);
        },
    });
};