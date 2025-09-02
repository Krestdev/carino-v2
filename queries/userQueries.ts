import api from "@/providers/axios";
import { Order, UserLogin, UserOrdersResponse } from "@/types/types";

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

  getUserById = async (id: number) => {
    return api.get(`${this.route1}/${id}`).then((res) => res.data);
  };
  login = async (data: UserLoginIn): Promise<UserLogin> => {
    return api.post(`${this.route}/login`, data).then((res) => res.data);
  };
  logout = async () => {
    return api.post(`${this.route}/logout`).then((res) => res.data);
  };
  register = async (data: UserRegister) => {
    return api.post(`${this.route}/register`, data).then((res) => res.data);
  };
  PlaceOrder = async (data: Order) => {
    console.log(data);
    return api.post(`${this.route}/orders`, data).then((res) => res.data);
  };
  allUsersOrders = async (id: number): Promise<UserOrdersResponse> => {
    return api
      .get(`${this.route}/${id}/all/user/orders`)
      .then((res) => res.data);
  };
  status = async (ref: string) => {
    return api
      .get(`${this.route}/${ref}/check/status/transaction`)
      .then((res) => res.data);
  };
  product = async () => {
    return api
      .get(`${this.route}/:category/all/cat/product`)
      .then((res) => res.data);
  };
}
