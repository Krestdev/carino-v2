import AxiosConfig from "@/providers/axios";
import api from "@/providers/axios";
import { AxiosInstance } from "axios";

export default class PromotionQuery {
  route = "promotion";
  api: AxiosInstance;

  constructor(baseURL: string) {
    this.api = new AxiosConfig(baseURL).api;
  }

  codeverify = async () => {
    return this.api.post(`${this.route}/codeverify`);
  };
  useCount = async () => {
    return this.api.post(`${this.route}/usecount`);
  };
  userList = async () => {
    return this.api.post(`${this.route}/userlist`);
  };
  lsit = async () => {
    return this.api.get(`${this.route}/list`);
  };
  create = async () => {
    return this.api.post(`${this.route}/create`);
  };
  update = async () => {
    return this.api.post(`${this.route}/update`);
  };
  delete = async () => {
    return this.api.post(`${this.route}/delete`);
  };
}
