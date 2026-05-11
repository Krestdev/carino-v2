import AxiosConfig from "@/providers/axios";
import api from "@/providers/axios";
import { ReservationData, ReservationResponse } from "@/types/types";
import { AxiosInstance } from "axios";

export default class ReservationQuery {
  route = "/bookings";
  api: AxiosInstance;

  constructor(baseURL: string) {
    this.api = new AxiosConfig(baseURL).api;
  }

  // Get all reservations
  getReservations = async (): Promise<ReservationData[]> => {
    return this.api.get(`${this.route}`).then((res) => res.data);
  };
  // Create a reservation
  createReservation = async (
    data: Omit<ReservationData, "id" | "remote_id" | "created_at" | "arrived_at" | "closed_at" | "status" | "cancel_reason" | "src" | "final_price" | "table" | "id_command" | "">
  ): Promise<Omit<ReservationData, "id" | "remote_id" | "created_at" | "arrived_at" | "closed_at" | "status" | "cancel_reason" | "src" | "final_price" | "table" | "id_command" | "">> => {
    return this.api.post(`${this.route}`, data).then((res) => res.data);
  };
  updateReservation = (data: ReservationData): Promise<ReservationResponse> => {
    return this.api.put(`${this.route}`, data).then((res) => res.data);
  };
}