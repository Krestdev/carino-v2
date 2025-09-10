import AxiosConfig from "@/providers/axios";
import api from "@/providers/axios";
import { AddressResponse } from "@/types/types";
import { AxiosInstance } from "axios";

export default class TownQuery {
  route = "villes";
  api: AxiosInstance;

  constructor(baseURL: string) {
    this.api = new AxiosConfig(baseURL).api;
  }
  getTowns = async (): Promise<AddressResponse> => {
    return this.api.get(`${this.route}/`).then((res) => res.data);
  };
}
