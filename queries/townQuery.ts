import api from "@/providers/axios";

export default class TownQuery {
  route = "villes";
  getTowns = async () => {
    return api.get("/").then((res) => res.data);
  };
}
