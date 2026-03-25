import React, { useState, useEffect } from "react";
import { Box, Button, Typography, LinearProgress } from "@mui/material";
import { useRouter } from "next/router";
import CryptoJS from "crypto-js";
import useRegistration from "@hooks/useRegistration";
import stepFour from "../../../public/profileStepImages/stepFour.png";
import axios from "axios";

const PaymentStep = ({ prevStep, _id }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { submitHandler } = useRegistration();
  const [isLocalhost, setIsLocalhost] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const host = window.location.hostname;
      // Enable simulate button on localhost and dev domains
      if (host === "localhost" || host === "127.0.0.1" || host.startsWith("dev.") || host.includes("dev-")) {
        setIsLocalhost(true);
      }
    }
  }, []);

  // Decide which API base to use for local-payment simulation
  const getPaymentBaseUrl = () => {
    if (typeof window !== "undefined") {
      const host = window.location.hostname; // hostname excludes port
      if (host === "localhost" || host === "127.0.0.1") return "http://localhost:5056";
      if (host.startsWith("dev.") || host.includes("dev-")) return "https://dev-api.lunchbowl.co.in";
    }
    return "https://api.lunchbowl.co.in";
  };

  const simulatePaymentSuccess = async ({ userId, orderId, transactionId }) => {
    try {
      const baseUrl = getPaymentBaseUrl();
      const response = await axios.post(`${baseUrl}/api/ccavenue/local-success`, {
        userId,
        orderId,
        transactionId,
      });
      return response.data; // Axios parses the response automatically
    } catch (error) {
      // Provide a consistent error object
      return {
        success: false,
        message: error?.response?.data?.message || "Local payment failed",
        error: error,
      };
    }
  };

  const ccavenueConfig = {
    merchant_id: "4381442",
    access_code: "AVRM80MF59BY86MRYB",
    working_key: "2A561B005709D8B4BAF69D049B23546B",
    redirect_url: "https://api.lunchbowl.co.in/api/ccavenue/response",
    cancel_url: "https://api.lunchbowl.co.in/api/ccavenue/response",
    currency: "INR",
    language: "EN",
    endpoint:
      "https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction",
  };

  // Exact implementation matching Node.js crypto
  const encrypt = (plainText, workingKey) => {
    try {
      // Step 1: Create MD5 hash of working key
      const md5Hash = CryptoJS.MD5(CryptoJS.enc.Utf8.parse(workingKey));

      // Step 2: Convert to binary-like format (WordArray)
      const key = CryptoJS.enc.Hex.parse(md5Hash.toString(CryptoJS.enc.Hex));

      // Step 3: Create IV (same as in Node.js code)
      const iv = CryptoJS.enc.Hex.parse("000102030405060708090a0b0c0d0e0f");

      // Step 4: Encrypt using AES-128-CBC
      const encrypted = CryptoJS.AES.encrypt(
        CryptoJS.enc.Utf8.parse(plainText),
        key,
        {
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
        }
      );

      // Return as hex string (to match Node.js implementation)
      return encrypted.ciphertext.toString();
    } catch (err) {
      console.error("Encryption error:", err);
      throw new Error("Payment encryption failed");
    }
  };

  const generateOrderId = () =>
    `LB${Date.now()}${Math.floor(Math.random() * 1000)}`;

  const initiatePayment = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch form data
      const response = await submitHandler({
        path: "get-customer-form",
        _id,
      });

      if (!response?.success) {
        throw new Error(response?.message || "Failed to fetch form data");
      }

      const { subscriptionPlan, user, parentDetails } = response.data || {};
      if (!subscriptionPlan || !user) {
        throw new Error("Required data missing in response");
      }

      // Prepare payment data
      const orderId = generateOrderId();
      const paymentData = {
        merchant_id: ccavenueConfig.merchant_id,
        order_id: orderId,
        amount: subscriptionPlan.price.toFixed(2),
        // amount: "1.00", // For testing purposes, always charge ₹1
        currency: ccavenueConfig.currency,
        redirect_url: ccavenueConfig.redirect_url,
        cancel_url: ccavenueConfig.cancel_url,
        language: ccavenueConfig.language,
        billing_name: (user?.name || "Customer").substring(0, 50),
        billing_email: (user?.email || "no-email@example.com").substring(0, 50),
        billing_tel: (user?.phone || "0000000000").substring(0, 20),
        billing_address: (parentDetails?.address || "Not Provided").substring(0, 100),
        billing_city: (parentDetails?.city || "Chennai").substring(0, 50),
        billing_state: (parentDetails?.state || "Tamil Nadu").substring(0, 50),
        billing_zip: (parentDetails?.pincode || "600001").substring(0, 10),
        billing_country: (parentDetails?.country || "India").substring(0, 50),
        merchant_param1: _id,
        merchant_param2: subscriptionPlan.planId,
        merchant_param3: orderId,
      };

      // Create request string
      const plainText = Object.entries(paymentData)
        .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
        .join("&");

      // Encrypt using the exact method
      const encryptedData = encrypt(plainText, ccavenueConfig.working_key);

      // Submit to CCAvenue via hidden form
      const form = document.createElement("form");
      form.method = "POST";
      form.action = ccavenueConfig.endpoint;
      form.style.display = "none";

      const addInput = (name, value) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        input.value = value;
        form.appendChild(input);
      };

      addInput("encRequest", encryptedData);
      addInput("access_code", ccavenueConfig.access_code);

      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      console.error("Payment error:", err);
      setError(err.message || "Payment initiation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      className="subplnBoxss"
      sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: { xs: "column", md: "row" },
        gap: 2,
      }}
    >
      {/* Image Side */}
      <Box
        className="spboximg"
        sx={{
          width: { xs: "100%", md: "45%" },
          backgroundImage: `url(${stepFour.src})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          backgroundPosition: "center",
          minHeight: 500,
        }}
      />
      <Box className="spboxCont" sx={{ width: { xs: "100%", md: "55%" } }}>
        {loading && <LinearProgress sx={{ mb: 3 }} />}
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <div className="steptitles">
          <h3>Complete Payment</h3>
          <h6>Secure payment via CCAvenue</h6>
          <p>
            We have curated our payment system with the finest level of security ensuring a smooth and dependable experience.
          </p>
        </div>
        <Box className="subbtnrow" sx={{ display: "flex", gap: 3 }}>
          <Button className="backbtn" variant="outlined" onClick={prevStep}>
            <span className="nextspan">Back</span>
          </Button>
          <Button
            className="nextbtn Proceedbtn widthautobtn"
            variant="contained"
            onClick={initiatePayment}
            disabled={loading}
            sx={{ bgcolor: "#FF6A00", "&:hover": { bgcolor: "#E55C00" } }}
          >
            <span className="nextspan">Proceed to Payment</span>
          </Button>

          {isLocalhost && (
            <Button
              className="nextbtn Proceedbtn widthautobtn"
              variant="contained"
              color="secondary"
              disabled={loading}
              onClick={async () => {
                setLoading(true);
                setError(null);
                const orderId = generateOrderId();
                const result = await simulatePaymentSuccess({
                  userId: _id,
                  orderId,
                  transactionId: "LOCAL_TXN",
                });
                setLoading(false);
                if (result.success) {
                  router.push("/user/menuCalendarPage");
                } else {
                  setError(result.message || "Local payment simulation failed");
                }
              }}
              sx={{ bgcolor: "#1976d2", "&:hover": { bgcolor: "#1565c0" } }}
            >
              Simulate Payment Success (Local)
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default PaymentStep;
