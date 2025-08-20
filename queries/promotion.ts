import api from "@/providers/axios";

export default class PromotionQuery {
  route = "promotion";

  codeverify = async () => {
    return api.post(`${this.route}/codeverify`);
  };
  useCount = async () => {
    return api.post(`${this.route}/usecount`);
  };
  userList = async () => {
    return api.post(`${this.route}/userlist`);
  };
  lsit = async () => {
    return api.get(`${this.route}/list`);
  };
  create = async () => {
    return api.post(`${this.route}/create`);
  };
  update = async () => {
    return api.post(`${this.route}/update`);
  };
  delete = async () => {
    return api.post(`${this.route}/delete`);
  };
}
