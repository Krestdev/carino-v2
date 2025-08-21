import api from "@/providers/axios";
import { cartItem } from "@/types/types";

type UserRegister = {
  email: string;
  password: string;
  name: string;
  confirm_password: string;
  phone: string;
};

type UserLogin = {
  email: string;
  password: string;
};

type Order = {
  phone: string;
  total_amount: number;
  user: number;
  Address: string;
  commande: cartItem[];
};

export default class UserQuery {
  route = "/auth";
  route1 = "/users";

  getUserById = async (id: number) => {
    return api.get(`${this.route1}/${id}`).then((res) => res.data);
  };
  login = async (data: UserLogin) => {
    return api.post(`${this.route}/login`, data).then((res) => res.data);
  };
  logout = async () => {
    return api.post(`${this.route}/logout`).then((res) => res.data);
  };
  register = async (data: UserRegister) => {
    return api.post(`${this.route}/register`).then((res) => res.data);
  };
  orders = async (data: Order) => {
    return api.post(`${this.route}/orders`, data).then((res) => res.data);
  };
  allUsers = async (id: number) => {
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
