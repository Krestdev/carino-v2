import api from "@/providers/axios";

export default class TownQuery {
  route = "villes";
  getTowns = async () => {
    api.get("/").then((res) => res.data);
  };
}
