import AxiosConfig from "@/providers/axios";
import api from "@/providers/axios";
import { AddressResponse, AddressData } from "@/types/types";
import { AxiosInstance } from "axios";

export default class TownQuery {
  route = "villes";
  api: AxiosInstance;

  constructor() {
    this.api = new AxiosConfig(false).api;
  }
  getTowns = async (): Promise<AddressData[]> => {
    return this.api.get(`${this.route}/`).then((res) => res.data);
  };
}
