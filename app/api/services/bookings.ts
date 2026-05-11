// services/reservations.ts
import { zeltyClient } from "@/lib/zelty";
import { ReservationData } from "@/types/types";

// Get
export const getReservations = async () => {
    try {
        const res = await zeltyClient.get("/bookings");
        return res.data
    } catch (error: any) {
        console.error("Erreur Zelty reservations:", error.response?.data || error.message);
        throw error;
    }
};

// Post
export const postReservation = async (data: ReservationData) => {
    try {
        const res = await zeltyClient.post("/bookings", data);
        return res.data
    } catch (error: any) {
        console.error("Erreur Zelty reservations:", error.response?.data || error.message);
        throw error;
    }
};

// Update
export const putReservation = async (data: ReservationData) => {
    try {
        const res = await zeltyClient.put("/bookings", data);
        return res.data
    } catch (error: any) {
        console.error("Erreur Zelty reservations:", error.response?.data || error.message);
        throw error;
    }
};