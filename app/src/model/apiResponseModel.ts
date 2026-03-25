export interface ApiResponseModel {
  smsLogId?: any;
  success: boolean;
  message: string;
  token?: string;
  _id?: string;
  name?: string;
  email?: string;
  phone?: string;
  freeTrial?: boolean;
  error?: any;
  otp?: string
  data: any;
  role?: any;
}
