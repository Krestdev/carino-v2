import api from "@/providers/axios";

export default class PromotionQuery {
  route = "promotion";

  codeverify = async () => {
    api.post(`${this.route}/codeverify`);
  };
  useCount = async () => {
    api.post(`${this.route}/usecount`);
  };
  userList = async () => {
    api.post(`${this.route}/userlist`);
  };
  lsit = async () => {
    api.get(`${this.route}/list`);
  };
  create = async () => {
    api.post(`${this.route}/create`);
  };
  update = async () => {
    api.post(`${this.route}/update`);
  };
  delete = async () => {
    api.post(`${this.route}/delete`);
  };
}
