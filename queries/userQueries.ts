import AxiosConfig from "@/providers/axios";
import api from "@/providers/axios";
import { Order, UserLogin, UserOrdersResponse } from "@/types/types";
import { AxiosInstance } from "axios";

type UserRegister = {
  email: string;
  password: string;
  name: string;
  confirm_password: string;
  phone: string;
};

type UserLoginIn = {
  email: string;
  password: string;
};

export default class UserQuery {
  route = "/auth";
  route1 = "/users";
  api: AxiosInstance;

  constructor(baseURL: string) {
    this.api = new AxiosConfig(baseURL).api;
  }

  getUserById = async (id: number) => {
    return this.api.get(`${this.route1}/${id}`).then((res) => res.data);
  };
  login = async (data: UserLoginIn): Promise<UserLogin> => {
    return this.api.post(`${this.route}/login`, data).then((res) => res.data);
  };
  logout = async () => {
    return this.api.post(`${this.route}/logout`).then((res) => res.data);
  };
  register = async (data: UserRegister) => {
    return this.api
      .post(`${this.route}/register`, data)
      .then((res) => res.data);
  };
  PlaceOrder = async (data: Order) => {
    return this.api.post(`${this.route}/orders`, data).then((res) => res.data);
  };
  allUsersOrders = async (id: number): Promise<UserOrdersResponse> => {
    return this.api
      .get(`${this.route}/${id}/all/user/orders`)
      .then((res) => res.data);
  };
  status = async (ref: string) => {
    return this.api
      .get(`${this.route}/${ref}/check/status/transaction`)
      .then((res) => res.data);
  };
  product = async () => {
    return this.api
      .get(`${this.route}/:category/all/cat/product`)
      .then((res) => res.data);
  };
}
