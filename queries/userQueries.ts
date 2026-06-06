import AxiosConfig from "@/providers/axios";
import { checkTransactionStatus, MyOrdersResponse, Order, OrdersData, Retry, User, UserLogin, UserOrdersResponse, UserRegistration } from "@/types/types";
import { AxiosInstance } from "axios";

export default class UserQuery {
  route = "/auth";
  route1 = "/orders";
  route2 = "/payments";
  api: AxiosInstance;

  constructor() {
    this.api = new AxiosConfig(true).api;
  }

  login = async (data: any): Promise<any> => {
    return this.api.post(`${this.route}/login`, data).then((res) => res.data);
  };
  logout = async () => {
    return this.api.post(`${this.route}/logout`).then((res) => res.data);
  };
  register = async (data: UserRegistration) => {
    return this.api
      .post(`${this.route}/register`, data)
      .then((res) => res.data);
  };
  profile = async (): Promise<User> => {
    return this.api.get(`${this.route}/profile`).then((res) => res.data);
  };
  forgotPassword = async (data: { email: string }): Promise<void> => {
    return this.api.post(`${this.route}/forgot-password`, data).then((res) => res.data);
  };
  resetPassword = async (data: { token: string, newPassword: string }): Promise<{ message: string; mail: string }> => {
    return this.api.post(`${this.route}/reset-password`, data).then((res) => res.data);
  };
  changePassword = async (data: { oldPassword: string, newPassword: string }): Promise<void> => {
    return this.api.post(`${this.route}/change-password`, data).then((res) => res.data);
  };

  // orders
  getAllUsers = async (): Promise<User[]> => {
    return this.api.get(`${this.route}/users/get-all`).then((res) => res.data);
  };
  getMine = async (): Promise<UserOrdersResponse> => {
    return this.api.get(`${this.route1}/my-orders`).then((res) => res.data);
  };
  getOne = async (id: string): Promise<MyOrdersResponse> => {
    return this.api.get(`${this.route1}/${id}`).then((res) => res.data);
  };

  createOrder = async (data: Order): Promise<{ order: OrdersData, payment: { status: string, vendor_reference: string } }> => {
    return this.api.post(`${this.route1}`, data).then((res) => res.data);
  };

  updateOrder = async (id: number, data: Partial<Order>): Promise<UserOrdersResponse> => {
    return this.api.put(`${this.route1}/${id}`, data).then((res) => res.data);
  };

  deleteOrder = async (id: number): Promise<UserOrdersResponse> => {
    return this.api.delete(`${this.route1}/${id}`).then((res) => res.data);
  };

  status = async (ref: string): Promise<checkTransactionStatus> => {
    return this.api
      .get(`${this.route2}/status?vendor_reference=${ref}`)
      .then((res) => res.data);
  };
  retryPaiement = async (data: Retry): Promise<checkTransactionStatus> => {
    return this.api.post(`${this.route2}/retry`, data).then((res) => res.data);
  };
}