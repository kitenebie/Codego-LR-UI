import { axiosInstance } from "./axiosInstance";
import { RequestConfig } from "./types";

export const request = async <T = any, R = any>(
  config: RequestConfig<T>
): Promise<R> => {
  try {
    const response = await axiosInstance(config);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};