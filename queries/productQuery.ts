import api from "@/providers/axios";
import { ProductData, Products } from "@/types/types";

export default class ProductQuery {
  route = "products";
  cRoute = "categories";

  getProductById = async (product: string) => {
    return api.get(`/${product}`).then((res) => res.data);
  };
  getAllCategoryProducts = async (category: string) => {
    return api.get(`/${category}/all/cat/product`).then((res) => res.data);
  };
  getAllProducts = async (): Promise<Products> => {
    return api.get(`/${this.route}`).then((res) => res.data);
  };
  getCategories = () => {
    return api.get(`/${this.cRoute}`).then((res) => res.data);
  };
}
