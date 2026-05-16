// queries/productQuery.ts
import { api1 } from "@/providers/axios";
import { CategoriesData, OptionValue, ProdData, ProductOption, ProductsResponse, ReceiptProps } from "@/types/types";
import type { AxiosInstance } from "axios";

export default class ProductQuery {
  private route = "catalog/dishes";
  private cRoute = "catalog/tags";
  private oRoute = "catalog/options";
  private api: AxiosInstance;

  constructor() {
    this.api = api1;
  }

  getProductByName = async (product: string): Promise<ProductsResponse> => {
    const res = await this.api.get(`${this.route}/${product}`);
    return res.data;
  };

  getAllCategoryProducts = async (
    category: string
  ): Promise<ProductsResponse> => {
    const res = await this.api.get(`${this.route}?tag=${category}`);
    return res.data;
  };

  getAllProducts = async (): Promise<ProdData[]> => {
    const res = await this.api.get(`${this.route}`);
    return res.data;
  };

  getCategories = async (): Promise<CategoriesData[]> => {
    const res = await this.api.get(`${this.cRoute}`);
    return res.data;
  };

  getOptions = async (): Promise<ProductOption[]> => {
    const res = await this.api.get(`${this.oRoute}`);
    return res.data;
  };

  getProductsOptions = async (ids: number[]): Promise<OptionValue[]> => {
    const res = await this.api.get(`${this.route}/options/${ids.join(",")}`);
    return res.data;
  }

  postTicket = async (data: ReceiptProps) => {
    const res = await fetch("/api/ticket", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(error || "Erreur lors de l'envoi du ticket");
    }

    return res.json();
  };
}