import requests from "./httpServices";

const EmailService = {
  sendFreeTrialEmail: async (body) => {
    // The full API path used directly in requests.post
    return requests.post("/admin/free-trial-enquiry", body);
  },

  sendSchoolEnquiryEmail: async (body) => {
    console.log("EmailService - Sending school enquiry email with body:", body);

    return requests.post("/admin/get-school-enquiry", body);
  },

  sendNutritionEnquiryEmail: async (body) => {
    // New API method for nutrition enquiry
    return requests.post("/admin/talk-nutrition", body);
  },

  sendGetInTouchEmail: async (body) => {
    // New API call for Get In Touch form
    return requests.post("/admin/get-in-touch", body);
  },

  sendContactUsEmail: async (body) => {

    return requests.post("/admin/contact-us", body);
  },


};

export default EmailService;
