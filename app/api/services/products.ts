// services/products.ts
import { zeltyClient } from "@/lib/zelty";

export const getProducts = async () => {
    try {
        const res = await zeltyClient.get("/catalog/dishes");
        return res.data;
    } catch (error: any) {
        console.error("Erreur Zelty produit:", error.response?.data || error.message);
        throw error;
    }
};