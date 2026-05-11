// services/villes.ts
import { yaoundeAddresses } from "../data";

export const getVilles = async () => {
    try {
        return yaoundeAddresses;
    } catch (error: any) {
        console.error("Erreur Zelty:", error.response?.data || error.message);
        throw error;
    }
};