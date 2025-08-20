import api from "@/providers/axios";

export default class ProductQuery {
  route = "products";
  cRoute = "categories";

  getProductById = async (product: string) => {
    api.get(`/${product}`).then((res) => res.data);
  };
  getAllCategoryProducts = async (category: string) => {
    api.get(`/${category}/all/cat/product`).then((res) => res.data);
  };
  getAllProducts = async () => {
    api.get(`/`).then((res) => res.data);
  };
  getCategories = () => {
    api.get(`/${this.cRoute}`).then((res) => res.data);
  };
}
