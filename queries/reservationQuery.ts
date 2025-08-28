import api from "@/providers/axios";
import { ReservationData, ReservationResponse } from "@/types/types";

export default class ReservationQuery {
  route = "reservations";

  getUserReservations = async (id: number): Promise<ReservationResponse[]> => {
    return api.get(`/${id}`).then((res) => res.data);
  };
  createReservation = async (
    data: ReservationData
  ): Promise<ReservationResponse> => {
    return api.post(`/${this.route}`, data).then((res) => res.data);
  };
  updateReservation = (data: ReservationData): Promise<ReservationResponse> => {
    return api.put(`/${this.route}`, data).then((res) => res.data);
  };
}
