// lib/axios.ts
import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
const baseURL2 = process.env.NEXT_PUBLIC_API_BASE_URL2 || "";

export default class AxiosConfig {
  public api: AxiosInstance;

  constructor(api: boolean = false) {
    console.log(baseURL, baseURL2);

    this.api = axios.create({
      baseURL: api ? baseURL2 : baseURL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });
    this.requestInterceptorSetup();
    this.responseInterceptorSetup();
  }

  // Request Interceptor: Add Authorization token if available
  requestInterceptorSetup = () => {
    // Request Interceptor: Add Authorization token if available
    this.api.interceptors.request.use(
      (config) => {
        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        console.error("Request setup error.");
        return Promise.reject(error);
      }
    );
  };

  // Response Interceptor: Global error handling
  responseInterceptorSetup = () => {
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        const { method, url } = response.config;
        const successMessageFromBackend = (response.data as any)?.message;

        const isMutation = ["POST", "PUT", "PATCH", "DELETE"].includes(
          method?.toUpperCase() || ""
        );

        if (isMutation && url) {
          // ✅ Extract the entity = first word after '/api/'
          const match = url.match(/\/api\/([^\/\?]+)/);
          let entity = match?.[1] || "Entity";

          // Capitalize and singularize
          entity =
            entity.charAt(0).toUpperCase() + entity.slice(1).replace(/s$/, "");

          const actionMap: Record<string, string> = {
            POST: "created",
            PUT: "updated",
            PATCH: "updated",
            DELETE: "deleted",
          };
          const action = actionMap[method?.toUpperCase() || ""] || "processed";

          const finalMessage =
            successMessageFromBackend || `${entity} ${action} successfully.`;

          console.log(finalMessage);
        }

        return response;
      },
      (error: AxiosError) => {
        const res = error.response;
        const message =
          (res?.data as any)?.message || "An unexpected error occurred.";

        if (res) {
          switch (res.status) {
            case 400:
              console.error(message);
              break;
            case 401:
              console.error(message || "Unauthorized. Please log in again.");
              break;
            case 403:
              console.error(message || "Access denied.");
              break;
            case 404:
              console.info(message || "Resource not found.");
              break;
            case 500:
              console.error(message || "Internal server error.");
              break;
            default:
              console.error(message);
          }
        } else if (error.request) {
          // toast.error(
          //   "No response from server. Check your internet connection."
          // );
        } else {
          console.error(`Error: ${error.message}`);
        }

        return Promise.reject(error);
      }
    );
  };
}
