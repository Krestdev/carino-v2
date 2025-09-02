import api from "@/providers/axios";
import { AddressResponse } from "@/types/types";

export default class TownQuery {
  route = "villes";
  getTowns = async (): Promise<AddressResponse> => {
    return api.get(`${this.route}/`).then((res) => res.data);
  };
}
