import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

//internal import

import { notifyError, notifySuccess } from "@utils/toast";
import CustomerServices from "@services/CustomerServices";

const useLoginSubmit = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const redirectUrl = useSearchParams().get("redirectUrl");

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // console.log("router", router.pathname === "/auth/signup");

  const submitHandler = async ({ firstName, lastName, email, password, phone, path, otp, freeTrialCheck }) => {
    setLoading(true);

    // console.log("submitHandler", phone);

    try {
      if (router.pathname === "/auth/signup") {
        // Custom sign-up method
        // console.log("Need to use custom sign-up method");

        // Call the sign-up API which also handles sending the email verification
        const res = await CustomerServices.verifyEmailAddress({
          name,
          email,
          password,
        });

        // console.log("res", res);
        notifySuccess(res.message);
        return setLoading(false);
      }
      if (path == "signUp" || path == "logIn") {
        try {
          const res = await CustomerServices.sendOtp({ email, mobile: phone, path });
          console.log("sendOtp response:", res);
          return res;
        } catch (error) {
          console.error("Error sending OTP:", error);
          notifyError(error?.response?.data?.message || error?.message);
          setLoading(false);
          return { success: false, message: error.response?.data?.message || "Failed to send OTP" };
        }
      } else if (path == "signUp-otp" || path == "logIn-otp") {
        try {
          const res = await CustomerServices.verifyOtp({ firstName, lastName, email, mobile: phone, otp, path, freeTrialCheck })
          if (res.success) {
            const targetUrl = res.freeTrialCheck ? "/free-trial" : "/user/DataRoutingPage";
            const loginResult = await signIn("credentials", {
              redirect: false,
              email: res.email, // or whatever your provider expects
              token: res.token, // pass the JWT token from backend
              name: res.name, // optionally any other info
              phone: res.phone, // pass the phone number
              freeTrial: res.freeTrial, // pass the free trial status
              _id: res._id,
              callbackUrl: targetUrl,
            });

            console.log("Login result:", loginResult);

            if (loginResult?.ok) {
              console.log("Login result------->:", loginResult);

              router.push(redirectUrl || targetUrl);
            } else {
              notifyError("Login failed");
            }
          } else {
            notifyError(res.message || "OTP verification failed");
          }

          setLoading(false);
          return res;
        } catch (error) {
          console.error("Error in OTP verification:", error);
          notifyError(error?.response?.data?.message || error?.message);
          setLoading(false);
          return { success: false, message: error.response?.data?.message || "Failed to verify OTP" };

        }

      } else if (router.pathname === "/auth/forget-password") {
        // Call the forget password API for reset password
        const res = await CustomerServices.forgetPassword({
          email,
        });

        // console.log("res", res);
        notifySuccess(res.message);
        return setLoading(false);
      } else if (router.pathname === "/auth/phone-signup") {
        const res = await CustomerServices.verifyPhoneNumber({
          phone,
        });
        notifySuccess(res.message);
        // console.log("sing up with phone", phone, "result", res);
        return setLoading(false);
      } else {
        // Login logic (no changes)
        const result = await signIn("credentials", {
          redirect: false,
          email,
          password,
          callbackUrl: "/user/dashboard",
        });

        // console.log("result", result);

        if (result?.error) {
          notifyError(result?.error);
          console.error("Error during sign-in:", result.error);
          setLoading(false);
        } else if (result?.ok) {
          const url = redirectUrl ? "/checkout" : result.url;
          router.push(url);
          setLoading(false);
        }
      }
    } catch (error) {
      // Catch any unexpected errors here (e.g., network issues, unexpected API failures)
      console.error(
        "Error in submitHandler:",
        error?.response?.data?.message || error?.message
      );
      setLoading(false);
      notifyError(error?.response?.data?.message || error?.message);
    }
  };

  return {
    register,
    errors,
    loading,
    control,
    handleSubmit,
    submitHandler,
  };
};

export default useLoginSubmit;
