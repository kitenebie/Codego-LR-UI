import { AxiosRequestConfig } from "axios";

export interface NotificationConfig {
  /** Show success notification */
  onSuccessNotification?: boolean;
  /** Success notification title */
  successNotifTitle?: string;
  /** Success notification content/message */
  successNotifContent?: string;
  /** Show error notification */
  onErrorNotification?: boolean;
  /** Error notification title */
  errorNotifTitle?: string;
  /** Error notification content/message */
  errorNotifContent?: string;
}

export interface RequestConfig<T = any> extends AxiosRequestConfig, NotificationConfig {
  data?: T;
  skipAuth?: boolean;
}