// services/orders.ts
import { zeltyClient } from "@/lib/zelty";

export const getOrders = async () => {
    try {
        const res = await zeltyClient.get("/orders");
        return res.data;
    } catch (error: any) {
        console.error("Erreur Zelty:", error.response?.data || error.message);
        throw error;
    }
};

// Récupérer les commandes d'un utilisateur spécifique
export const getOrdersByUserId = async (userId: string) => {
    try {
        const res = await zeltyClient.get(`/orders?userId=${userId}`);
        return res.data;
    } catch (error: any) {
        console.error("Erreur Zelty:", error.response?.data || error.message);
        throw error;
    }
};