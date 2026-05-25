import { api2 } from "@/providers/axios";
import { AddressData } from "@/types/types";
import { AxiosInstance } from "axios";

export default class TownQuery {
  route = "ville";
  api: AxiosInstance;

  constructor() {
    this.api = api2;
  }
  getTowns = async (): Promise<AddressData[]> => {
    return this.api.get(`${this.route}`).then((res) => res.data);
  };
}
