// hooks/useBooking.ts
import { useQuery } from "@tanstack/react-query";
import { ReservationData, ReservationResponse } from "@/types/types";
import { zeltyClient } from "@/lib/zelty";

export const getReservations = async (): Promise<ReservationResponse[]> => {
    const response = await fetch("/api/bookings");
    if (!response.ok) {
        throw new Error("Failed to fetch reservations");
    }
    return response.json();
};

// Get reservations by userId
export const useUserReservations = (userId: number) => {
    return useQuery({
        queryKey: ['reservations', userId],
        queryFn: async () => {
            const res = await zeltyClient.get(`/api/bookings`);
            const reservations = res.data;
            return reservations.filter((reservation: ReservationData) =>
                reservation.id_customer === userId
            );
        },
        enabled: !!userId, // Ne s'exécute que si userId existe
    });
};

// create reservation
export const createReservation = async (data: ReservationData) => {
    try {
        const response = await zeltyClient.post("/api/bookings", data);
        return response.data;
    } catch (error: any) {
        console.error("Erreur Zelty reservations:", error.response?.data || error.message);
        throw error;
    }
};

// update reservation
export const updateReservation = async (data: ReservationData) => {
    try {
        const response = await zeltyClient.put("/api/bookings", data);
        return response.data;
    } catch (error: any) {
        console.error("Erreur Zelty reservations:", error.response?.data || error.message);
        throw error;
    }
};
