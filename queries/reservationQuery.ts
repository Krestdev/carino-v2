import AxiosConfig from "@/providers/axios";
import api from "@/providers/axios";
import { ReservationData, ReservationResponse } from "@/types/types";
import { AxiosInstance } from "axios";

export default class ReservationQuery {
  route = "reservations";
  api: AxiosInstance;

  constructor(baseURL: string) {
    this.api = new AxiosConfig(baseURL).api;
  }

  getUserReservations = async (id: number): Promise<ReservationResponse[]> => {
    return this.api.get(`/${id}`).then((res) => res.data);
  };
  createReservation = async (
    data: ReservationData
  ): Promise<ReservationResponse> => {
    return this.api.post(`/${this.route}`, data).then((res) => res.data);
  };
  updateReservation = (data: ReservationData): Promise<ReservationResponse> => {
    return this.api.put(`/${this.route}`, data).then((res) => res.data);
  };
}
