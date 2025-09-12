import AxiosConfig from "@/providers/axios";
import api from "@/providers/axios";
import {
  CategoryData,
  CategoryResponse,
  ProductsResponse,
  ReceiptProps,
} from "@/types/types";
import axios, { AxiosInstance } from "axios";

export default class ProductQuery {
  route = "products";
  cRoute = "categories";
  api: AxiosInstance;

  constructor(baseURL: string) {
    this.api = new AxiosConfig(baseURL).api;
  }

  secondBaseURL = process.env.NEXT_PUBLIC_API;

  getProductByName = async (product: string): Promise<ProductsResponse> => {
    return this.api.get(`/products/${product}`).then((res) => res.data);
  };
  getAllCategoryProducts = async (
    category: string
  ): Promise<ProductsResponse> => {
    return this.api.get(`/${category}/all/cat/product`).then((res) => res.data);
  };
  getAllProducts = async (): Promise<ProductsResponse> => {
    return this.api.get(`/${this.route}`).then((res) => res.data);
  };
  getCategories = (): Promise<CategoryResponse> => {
    return this.api.get(`/${this.cRoute}`).then((res) => res.data);
  };
  postTicket = (data: ReceiptProps) => {
    return axios.post(`api/ticket`, data);
  };
}
