import CustomerServices from "@services/CustomerServices";
import { useState } from "react";
import { useRouter } from "next/router";

const useRegistration = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitHandler = async ({
    formData,
    step,
    path,
    payload,
    _id,
    data,
  }) => {
    setLoading(true);

    try {
      if (
        path == "step-Form-ParentDetails" ||
        path == "step-Form-ChildDetails" ||
        path == "step-Form-SubscriptionPlan" ||
        path == "step-Form-Renew-SubscriptionPlan"
      ) {
        const res = await CustomerServices.stepFormRegister({
          formData,
          step,
          path,
          payload,
          _id,
        });
        return res;

      } else if (path == "get-holiday-payments") {
        const res = await CustomerServices.getHolidayPayments(data);
        return res;
      } else if (path == "get-paid-holidays") {
        // New case for paid holidays API call
        const res = await CustomerServices.getPaidHolidays({ userId: _id });
        return res;
      } else if (path == "get-customer-form") {
        const res = await CustomerServices.getCustomerFormData(_id);
        return res;
      } else if (path == "get-Menu-Calendar") {
        const res = await CustomerServices.getMenuCalendar({ _id, path });
        return res;
      } else if (path == "save-meals") {
        const res = await CustomerServices.saveMenuCalendar({
          _id,
          path,
          data,
        });
        return res;
      } else if (path == "get-saved-meals") {
        const res = await CustomerServices.getSavedMeals({
          _id,
          path,
        });
        return res;
      } else if (path == "Step-Check") {
        const res = await CustomerServices.checkStep({
          _id,
          path,
        });
        console.log("====================================");
        console.log("Step Check Result:", res);
        console.log("====================================");
        return res;
      } else if (path == "delete-meal") {
        const res = await CustomerServices.deleteMeal(data);
        return res;
      }

    } catch (error) {
      setError(error);
      console.error("Error during registration:", error);
    }
  };

  return {
    submitHandler,
    error,
  };
};

export default useRegistration;
