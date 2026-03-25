export type ToastType = 'success' | 'error' | 'warning' | 'info';

export type ToastPayload = {
  type?: ToastType;
  title?: string;
  message: string;
  duration?: number;
  colors?: string[];
};
