import { axiosInstance } from "./axiosInstance";
import { useToast } from "@/src/components/ui/notification";

type ToastFn = ReturnType<typeof useToast>["toast"]
let toastFn: ToastFn | null = null;

export const setToastFunction = (fn: ToastFn) => {
  toastFn = fn;
};

export const setupInterceptors = () => {
  // Request interceptor
  axiosInstance.interceptors.request.use(
    (config: any) => {
      const token = localStorage.getItem("token");

      if (token && !config.skipAuth) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor
  axiosInstance.interceptors.response.use(
    (response) => {
      const config = response.config as any;
      
      // Show success toast if enabled
      if (config.onSuccessNotification && toastFn) {
        toastFn({
          variant: "success",
          title: config.successNotifTitle || "Success",
          description: config.successNotifContent || "Operation completed successfully",
        });
      }
      
      return response;
    },
    (error) => {
      const config = error.config as any;
      
      // Show error toast if enabled
      if (config?.onErrorNotification && toastFn) {
        toastFn({
          variant: "error",
          title: config.errorNotifTitle || "Error",
          description: config.errorNotifContent || error.response?.data?.message || "Something went wrong",
        });
      }
      
      if (error.response?.status === 401) {
        console.warn("Unauthorized - redirect login");
      }

      return Promise.reject(error);
    }
  );
};