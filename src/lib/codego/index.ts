import { request } from "./request";
import { setupInterceptors, setToastFunction } from "./interceptors";
import { RequestConfig, NotificationConfig } from "./types";

setupInterceptors();

export const api = {
  get: <R = any>(url: string, config?: RequestConfig) =>
    request<null, R>({ method: "GET", url, ...config }),

  post: <T = any, R = any>(url: string, data?: T, config?: RequestConfig<T>) =>
    request<T, R>({ method: "POST", url, data, ...config }),

  put: <T = any, R = any>(url: string, data?: T, config?: RequestConfig<T>) =>
    request<T, R>({ method: "PUT", url, data, ...config }),

  patch: <T = any, R = any>(url: string, data?: T, config?: RequestConfig<T>) =>
    request<T, R>({ method: "PATCH", url, data, ...config }),

  delete: <R = any>(url: string, config?: RequestConfig) =>
    request<null, R>({ method: "DELETE", url, ...config }),
};

export type { RequestConfig, NotificationConfig };
export { setToastFunction };
export { CodegoApiProvider } from "./provider";