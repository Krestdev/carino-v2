import AxiosConfig from "@/providers/axios";
import { ReservationData, ReservationResponse } from "@/types/types";
import { AxiosInstance } from "axios";

export default class ReservationQuery {
  route = "/bookings";
  api: AxiosInstance;

  constructor() {
    this.api = new AxiosConfig(true).api;
  }

  getReservations = async (): Promise<{ items: ReservationData[] }> => {
    return this.api.get(`${this.route}/admin/all`).then((res) => res.data);
  };
  // Get mine reservations
  getMineReservations = async (): Promise<{ items: ReservationData[] }> => {
    return this.api.get(`${this.route}/my-bookings`).then((res) => res.data);
  };
  // Create a reservation
  createReservation = async (
    data: Omit<ReservationData, "id" | "uuid" | "remote_id" | "created_at" | "arrived_at" | "closed_at" | "status" | "cancel_reason" | "src" | "final_price" | "table" | "id_command" | "">
  ): Promise<Omit<ReservationData, "id" | "uuid" | "remote_id" | "created_at" | "arrived_at" | "closed_at" | "status" | "cancel_reason" | "src" | "final_price" | "table" | "id_command" | "">> => {
    return this.api.post(`${this.route}`, data).then((res) => res.data);
  };
  updateReservation = (data: Partial<ReservationData>): Promise<ReservationResponse> => {
    return this.api.put(`${this.route}`, data).then((res) => res.data);
  };
  // Confirm a reservation
  confirmReservation = (uuid: string): Promise<void> => {
    return this.api.patch(`${this.route}/${uuid}/validate`).then((res) => res.data);
  };
  // Reject a reservation
  rejectReservation = (uuid: string): Promise<void> => {
    return this.api.patch(`${this.route}/${uuid}/cancel`).then((res) => res.data);
  };
  // Complete a reservation
  completeReservation = (uuid: string): Promise<void> => {
    return this.api.patch(`${this.route}/${uuid}/complete`).then((res) => res.data);
  };
  // Settle a reservation
  settleReservation = (uuid: string): Promise<void> => {
    return this.api.patch(`${this.route}/${uuid}/settle`).then((res) => res.data);
  };
}