import api from "@/providers/axios";
import {
  CategoryData,
  CategoryResponse,
  ProductsResponse,
} from "@/types/types";

export default class ProductQuery {
  route = "products";
  cRoute = "categories";

  getProductByName = async (product: string): Promise<ProductsResponse> => {
    return api.get(`/${product}`).then((res) => res.data);
  };
  getAllCategoryProducts = async (
    category: string
  ): Promise<ProductsResponse> => {
    return api.get(`/${category}/all/cat/product`).then((res) => res.data);
  };
  getAllProducts = async (): Promise<ProductsResponse> => {
    return api.get(`/${this.route}`).then((res) => res.data);
  };
  getCategories = (): Promise<CategoryResponse> => {
    return api.get(`/${this.cRoute}`).then((res) => res.data);
  };
}
