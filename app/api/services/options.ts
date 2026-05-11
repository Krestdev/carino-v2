// services/categories.ts
import { zeltyClient } from "@/lib/zelty";

export const getOptions = async () => {
    try {
        const res = await zeltyClient.get("/catalog/options");
        return res.data
    } catch (error: any) {
        console.error("Erreur Zelty categories:", error.response?.data || error.message);
        throw error;
    }
};