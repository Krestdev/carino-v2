// lib/zelty.ts
import axios from "axios";

export const zeltyClient = axios.create({
    baseURL: "https://api.zelty.fr/2.10/",
    headers: {
        Authorization: `Bearer ${process.env.ZELTY_TOKEN}`,
        "Content-Type": "application/json",
    },
});

// Helper function to recursively divide prices by 100
const transformPrices = (data: any): any => {
    if (data === null || typeof data !== "object") return data;
    if (Array.isArray(data)) return data.map(transformPrices);

    const transformed: any = {};
    for (const key in data) {
        let value = data[key];
        if (
            typeof value === "number" &&
            (key.toLowerCase().includes("price") ||
                key.toLowerCase().includes("amount") ||
                key === "fees" ||
                key === "prix_total")
        ) {
            transformed[key] = value / 100;
        } else if (typeof value === "object") {
            transformed[key] = transformPrices(value);
        } else {
            transformed[key] = value;
        }
    }
    return transformed;
};

zeltyClient.interceptors.response.use((response) => {
    if (response.data) {
        response.data = transformPrices(response.data);
    }
    return response;
});