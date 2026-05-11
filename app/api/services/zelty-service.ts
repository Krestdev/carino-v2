// app/api/services/zelty-service.ts
import axios from "axios";

export const zeltyClient = axios.create({
    baseURL: process.env.ZELTY_API_URL || "https://api.zelty.fr/2.10",
    headers: {
        Authorization: `Bearer ${process.env.ZELTY_TOKEN}`,
        "Content-Type": "application/json",
        Accept: "application/json",
    },
    timeout: 10000, // 10 secondes timeout
});

// Intercepteur pour debug
zeltyClient.interceptors.request.use((config) => {
    console.log(`📤 Zelty Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
});

zeltyClient.interceptors.response.use(
    (response) => {
        console.log(`✅ Zelty Success: ${response.config.url}`);
        return response;
    },
    (error) => {
        console.error(`❌ Zelty Error:`, {
            url: error.config?.url,
            status: error.response?.status,
            message: error.response?.data?.message || error.message,
            data: error.response?.data,
        });
        return Promise.reject(error);
    }
);