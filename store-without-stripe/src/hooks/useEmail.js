import { useState } from "react";
import EmailService from "@services/EmailService";

const useEmail = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendEmail = async (emailData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await EmailService.sendFreeTrialEmail(emailData);
      setLoading(false);
      return response;
    } catch (err) {
      setError(err.message || "Failed to send email");
      setLoading(false);
      throw err;
    }
  };

  const sendSchoolEnquiryEmail = async (emailData) => {
    setLoading(true);
    setError(null);
    console.log("Sending school enquiry email with data:", emailData);

    try {
      const response = await EmailService.sendSchoolEnquiryEmail(emailData);
      console.log("School enquiry response:", response);

      setLoading(false);
      return response;
    } catch (err) {
      setError(err.message || "Failed to send school enquiry");
      setLoading(false);
      throw err;
    }
  };

  const sendNutritionEnquiryEmail = async (emailData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await EmailService.sendNutritionEnquiryEmail(emailData);
      setLoading(false);
      return response;
    } catch (err) {
      setError(err.message || "Failed to send nutrition enquiry");
      setLoading(false);
      throw err;
    }
  };

  const sendGetInTouchEmail = async (emailData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await EmailService.sendGetInTouchEmail(emailData);
      setLoading(false);
      return response;
    } catch (err) {
      setError(err.message || "Failed to send get-in-touch enquiry");
      setLoading(false);
      throw err;
    }
  };

  const sendContactUsEmail = async (emailData) => {
    console.log("Sending contact us email with data:", emailData);

    setLoading(true);
    setError(null);
    try {
      const response = await EmailService.sendContactUsEmail(emailData);
      setLoading(false);
      return response;
    } catch (err) {
      setError(err.message || "Failed to send contact us message");
      setLoading(false);
      throw err;
    }
  };

  return { sendEmail, sendSchoolEnquiryEmail, sendNutritionEnquiryEmail, sendGetInTouchEmail, sendContactUsEmail, loading, error };
};

export default useEmail;
