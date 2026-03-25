import React, { useState } from "react";
import axios from "axios";
import CryptoJS from "crypto-js";
import { Button } from "@mui/material";
import useRegistration from "@hooks/useRegistration";

const AddChildPayment = ({
  _id, // ✅ This is userId
  formData,
  subscriptionPlan, // ✅ This contains activeSubscription
  totalAmount,
  onError,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const { submitHandler } = useRegistration(); // ✅ to call backend API

  const ccavenueConfig = {
    merchant_id: "4381442",
    access_code: "AVRM80MF59BY86MRYB",
    working_key: "2A561B005709D8B4BAF69D049B23546B",
    redirect_url_live:
      "https://api.lunchbowl.co.in/api/ccavenue/response/addChildPayment",
    cancel_url_live:
      "https://api.lunchbowl.co.in/api/ccavenue/response/addChildPayment",
    currency: "INR",
    language: "EN",
    endpoint:
      "https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction",
  };

  const encrypt = (plainText, workingKey) => {
    const md5Hash = CryptoJS.MD5(CryptoJS.enc.Utf8.parse(workingKey));
    const key = CryptoJS.enc.Hex.parse(md5Hash.toString(CryptoJS.enc.Hex));
    const iv = CryptoJS.enc.Hex.parse("000102030405060708090a0b0c0d0e0f");
    const encrypted = CryptoJS.AES.encrypt(
      CryptoJS.enc.Utf8.parse(plainText),
      key,
      { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
    );
    return encrypted.ciphertext.toString();
  };

  const generateOrderId = () => `LB${Date.now()}${Math.floor(Math.random() * 1000)}`;

  const isDevLikeHost = () => {
    if (typeof window === "undefined") return false;
    const host = window.location.hostname;
    return host === "localhost" || host === "127.0.0.1" || host.startsWith("dev.") || host.includes("dev-");
  };

  const getPaymentBaseUrl = () => {
    if (typeof window !== "undefined") {
      const host = window.location.hostname;
      if (host === "localhost" || host === "127.0.0.1") return "http://localhost:5056";
      if (host.startsWith("dev.") || host.includes("dev-")) return "https://dev-api.lunchbowl.co.in";
    }
    return "https://api.lunchbowl.co.in";
  };

  const initiatePayment = async () => {
    setLoading(true);
    try {
      const orderId = generateOrderId();

      const userId = _id;
      const subscriptionId = subscriptionPlan?._id;

      if (!userId) throw new Error("User ID not provided");
      if (!subscriptionId) throw new Error("Subscription ID not found");

      // 🟢 Step 1: Fetch customer form data (for billing details)
      const response = await submitHandler({
        path: "get-customer-form",
        _id: userId,
      });

      if (!response?.success) {
        throw new Error(response?.message || "Failed to fetch user details for billing");
      }

      const { user, parentDetails } = response.data || {};
      console.log("🟢 Billing user data fetched:", { user, parentDetails });

      // 🟢 Step 2: Build payment info
      const paymentInfo = {
        orderId,
        transactionId: `TXN${Date.now()}`,
        subscriptionId,
        paymentAmount: totalAmount,
      };

      if (isDevLikeHost()) {
        // --- Local simulation ---
        const baseUrl = getPaymentBaseUrl();
        const response = await axios.post(`${baseUrl}/api/ccavenue/local-success/local-add-childPayment`, {
          userId,
          childrenData: formData,
          paymentInfo,
        });

        if (response.data.success) {
          onSuccess();
        } else {
          onError(response.data.message || "Local payment simulation failed");
        }
      } else {
        // --- Live payment flow ---
        const billingData = {
          billing_name: `${parentDetails?.fatherFirstName || user?.name || "Customer"} ${parentDetails?.fatherLastName || ""}`.trim(),
          billing_email: parentDetails?.email || user?.email || "no-email@example.com",
          billing_tel: parentDetails?.mobile || user?.phone || "0000000000",
          billing_address: parentDetails?.address || "Not Provided",
          billing_city: parentDetails?.city || "Chennai",
          billing_state: parentDetails?.state || "Tamil Nadu",
          billing_zip: parentDetails?.pincode || "600001",
          billing_country: parentDetails?.country || "India",
        };

        const paymentData = {
          merchant_id: ccavenueConfig.merchant_id,
          order_id: orderId,
          amount: totalAmount.toFixed(2),
          currency: ccavenueConfig.currency,
          redirect_url: ccavenueConfig.redirect_url_live,
          cancel_url: ccavenueConfig.cancel_url_live,
          language: ccavenueConfig.language,
          ...billingData,
          merchant_param1: userId,  // ✅ Customer ID
          merchant_param2: subscriptionId, // ✅ Subscription ID
          merchant_param3: btoa(JSON.stringify(formData)), // ✅ Children info encoded
        };

        const plainText = Object.entries(paymentData)
          .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
          .join("&");

        const encryptedData = encrypt(plainText, ccavenueConfig.working_key);

        // 🟢 Step 3: Create form and submit
        const form = document.createElement("form");
        form.method = "POST";
        form.action = ccavenueConfig.endpoint;
        form.style.display = "none";

        const createInput = (name, value) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = name;
          input.value = value;
          form.appendChild(input);
        };

        createInput("encRequest", encryptedData);
        createInput("access_code", ccavenueConfig.access_code);

        document.body.appendChild(form);
        form.submit();
      }
    } catch (err) {
      console.error("❌ Payment initiation error:", err);
      onError(err.message || "Payment initiation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={initiatePayment}
      disabled={loading}
      className="proceedbtn"
    >
      <span>{loading ? "Processing Payment..." : "Make Payment"}</span>
    </Button>
  );
};

export default AddChildPayment;
