import { api1, api2 } from "@/providers/axios";
import { AddtressData } from "@/types/types";
import { AxiosInstance } from "axios";

export default class TownQuery {
  route = "villes";
  api: AxiosInstance;

  constructor() {
    this.api = api1;
  }
  getTowns = async (): Promise<AddtressData[]> => {
    return this.api.get(`${this.route}/`).then((res) => res.data);
  };
}
