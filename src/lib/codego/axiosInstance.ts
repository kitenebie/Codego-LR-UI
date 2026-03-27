import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Auto-detect FormData and remove Content-Type so the browser sets
// the correct multipart/form-data boundary automatically.
axiosInstance.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }
  return config;
});