import requests from "./httpServices";

const CustomerServices = {
  loginCustomer: async (body) => {
    return requests.post("/customer/login", body);
  },

  verifyEmailAddress: async (body) => {
    return requests.post("/customer/verify-email", body);
  },
  verifyPhoneNumber: async (body) => {
    return requests.post("/customer/verify-phone", body);
  },

  registerCustomer: async (token, body) => {
    return requests.post(`/customer/register/${token}`, body);
  },

  signUpWithOauthProvider: async (body) => {
    return requests.post(`/customer/signup/oauth`, body);
  },

  signUpWithProvider(token, body) {
    return requests.post(`/customer/signup/${token}`, body);
  },

  forgetPassword: async (body) => {
    return requests.put("/customer/forget-password", body);
  },

  resetPassword: async (body) => {
    return requests.put("/customer/reset-password", body);
  },

  changePassword: async (body) => {
    return requests.post("/customer/change-password", body);
  },

  updateCustomer: async (id, body) => {
    return requests.put(`/customer/${id}`, body);
  },

  getShippingAddress: async ({ userId = "" }) => {
    return requests.get(`/customer/shipping/address/${userId}`);
  },

  addShippingAddress: async ({ userId = "", shippingAddressData }) => {
    return requests.post(
      `customer/shipping/address/${userId}`,
      shippingAddressData
    );
  },

  sendOtp: async (body) => {
    return requests.post("/customer/sendOtp", body);
  },

  verifyOtp: async (body) => {
    return requests.post("/customer/verifyOtp", body);
  },

  stepFormRegister: async (body) => {
    return requests.post("/customer/stepForm-Register", body);
  },

  checkStep: async (body) => {
    return requests.post("/customer/Step-Check", body);
  },

  getMenuCalendar: async (body) => {
    return requests.post("/customer/get-Menu-Calendar", body);
  },

  saveMenuCalendar: async (body) => {
    return requests.post("/customer/save-Menu-Calendar", body);
  },

  getSavedMeals: async (body) => {
    return requests.post("/customer/get-saved-meals", body);
  },

  getHolidayPayments: async (body) => {
  return requests.post("/ccavenue/holiday-payments", body);
},

  getPaidHolidays: async (body) => {
    return requests.post("/customer/get-paid-holidays", body);
  },

  getCustomerFormData: async (id) => {
    return requests.get(`/customer/form/${id}`);
  },

  deleteMeal: async (body) => {
    // return requests.post("/customer/delete-meal", body);
    // console.log("Deleting meal with data:", body);
    return requests.post("/customer/delete-meal", body);
  },

};

export default CustomerServices;
