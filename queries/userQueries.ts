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

export default class User {
  route = "/auth";
  route1 = "/users";

  getUserById = async (id: number) => {
    api.get(`${this.route1}/${id}`).then((res) => res.data);
  };
  login = async (data: UserLogin) => {
    api.post(`${this.route}/login`, data).then((res) => res.data);
  };
  logout = async () => {
    api.post(`${this.route}/logout`).then((res) => res.data);
  };
  register = async (data: UserRegister) => {
    api.post(`${this.route}/register`).then((res) => res.data);
  };
  orders = async (data: Order) => {
    api.post(`${this.route}/orders`, data).then((res) => res.data);
  };
  allUsers = async () => {
    api
      .get(`${this.route}/:id([0-9]+)/all/user/orders`)
      .then((res) => res.data);
  };
  status = async () => {
    api
      .get(`${this.route}/:ref/check/status/transaction`)
      .then((res) => res.data);
  };
  product = async () => {
    api.get(`${this.route}/:category/all/cat/product`).then((res) => res.data);
  };
}
