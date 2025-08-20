import api from "@/providers/axios";

export default class ProductQuery {
  route = "products";
  cRoute = "categories";

  getProductById = async (product: string) => {
    return api.get(`/${product}`).then((res) => res.data);
  };
  getAllCategoryProducts = async (category: string) => {
    return api.get(`/${category}/all/cat/product`).then((res) => res.data);
  };
  getAllProducts = async () => {
    return api.get(`/${this.route}`).then((res) => res.data);
  };
  getCategories = () => {
    return api.get(`/${this.cRoute}`).then((res) => res.data);
  };
}
