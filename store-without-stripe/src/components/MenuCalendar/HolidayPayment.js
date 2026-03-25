import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  LinearProgress,
} from "@mui/material";
import CryptoJS from "crypto-js";
import { useSession } from "next-auth/react";
import useRegistration from "@hooks/useRegistration";

const HolidayPayment = ({
  open,
  onClose,
  selectedDate,
  childrenData = [],
  currentPlanId, // ✅ Current active planId from MenuCalendar
  onSuccess,
}) => {
  const { data: session } = useSession();
  const _id = session?.user?.id;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { submitHandler } = useRegistration();

  // ✅ Always attach current planId to each child entry
  const childrenDataWithPlan = childrenData.map((child) => ({
    ...child,
    planId: currentPlanId || child.planId || "UNKNOWN_PLAN",
    mealDate: selectedDate,
  }));

  const totalAmount = childrenData.length * 200;
  const orderId = `LB-HOLIDAY-${Date.now()}`;

  // ✅ CCAvenue Config
  const ccavenueConfig = {
    merchant_id: "4381442",
    access_code: "AVRM80MF59BY86MRYB",
    working_key: "2A561B005709D8B4BAF69D049B23546B",
    redirect_url:
      "https://api.lunchbowl.co.in/api/ccavenue/response/holiydayPayment",
    cancel_url: "https://api.lunchbowl.co.in/api/ccavenue/response",
    currency: "INR",
    language: "EN",
    endpoint:
      "https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction",
  };

  // ✅ AES-128-CBC Encryption (same as Node.js backend)
  const encrypt = (plainText, workingKey) => {
    const md5Hash = CryptoJS.MD5(CryptoJS.enc.Utf8.parse(workingKey));
    const key = CryptoJS.enc.Hex.parse(md5Hash.toString(CryptoJS.enc.Hex));
    const iv = CryptoJS.enc.Hex.parse("000102030405060708090a0b0c0d0e0f");

    const encrypted = CryptoJS.AES.encrypt(
      CryptoJS.enc.Utf8.parse(plainText),
      key,
      {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );

    return encrypted.ciphertext.toString();
  };

  // ✅ UTF-8 Safe Base64 Encode
  const encodeBase64 = (str) => {
    try {
      return btoa(unescape(encodeURIComponent(str)));
    } catch (err) {
      console.error("Base64 encoding failed:", err);
      return "";
    }
  };

  const initiatePayment = async () => {
    if (!_id) {
      setError("User not logged in. Please login to continue.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // ✅ Fetch billing details
      const response = await submitHandler({
        path: "get-customer-form",
        _id,
      });

      if (!response?.success) {
        throw new Error(response?.message || "Failed to fetch user data");
      }

      const { user, parentDetails } = response.data || {};
      if (!user) throw new Error("User data missing in API response");

      console.log("🧾 Sending holiday payment data:", {
        userId: _id,
        currentPlanId,
        childrenDataWithPlan,
      });

      // ✅ Prepare Payment Payload
      const paymentData = {
        merchant_id: ccavenueConfig.merchant_id,
        order_id: orderId,
        amount: totalAmount.toFixed(2),
        //amount: "1.00", // ⚠️ For testing; use totalAmount.toFixed(2) for live
        currency: ccavenueConfig.currency,
        redirect_url: ccavenueConfig.redirect_url,
        cancel_url: ccavenueConfig.cancel_url,
        language: ccavenueConfig.language,

        billing_name: (user?.name || "Holiday Meal").substring(0, 50),
        billing_email: (user?.email || "no-email@lunchbowl.in").substring(0, 50),
        billing_tel: (user?.phone || "0000000000").substring(0, 20),
        billing_address: (parentDetails?.address || "Holiday Meal Booking").substring(0, 100),
        billing_city: (parentDetails?.city || "Chennai").substring(0, 50),
        billing_state: (parentDetails?.state || "Tamil Nadu").substring(0, 50),
        billing_zip: (parentDetails?.pincode || "600001").substring(0, 10),
        billing_country: (parentDetails?.country || "India").substring(0, 50),

        // ✅ Custom parameters for backend processing
        merchant_param1: _id, // userId
        merchant_param2: selectedDate, // selected date
        merchant_param3: encodeBase64(JSON.stringify(childrenDataWithPlan)), // includes planId
        merchant_param4: "HOLIDAY_PAYMENT",
      };

      // ✅ Convert to query string
      const plainText = Object.entries(paymentData)
        .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
        .join("&");

      // ✅ Encrypt using AES (matches backend)
      const encryptedData = encrypt(plainText, ccavenueConfig.working_key);

      // ✅ Submit to CCAvenue
      const form = document.createElement("form");
      form.method = "POST";
      form.action = ccavenueConfig.endpoint;
      form.style.display = "none";

      const inputEnc = document.createElement("input");
      inputEnc.type = "hidden";
      inputEnc.name = "encRequest";
      inputEnc.value = encryptedData;
      form.appendChild(inputEnc);

      const inputAccess = document.createElement("input");
      inputAccess.type = "hidden";
      inputAccess.name = "access_code";
      inputAccess.value = ccavenueConfig.access_code;
      form.appendChild(inputAccess);

      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      console.error("💥 Payment error:", err);
      setError(err.message || "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      className="holidaypaysec"
    >
      <DialogTitle>Confirm Holiday Payment</DialogTitle>
      <DialogContent dividers>
        {loading && <LinearProgress sx={{ mb: 2 }} />}
        <Typography gutterBottom>
          You're booking <b>{childrenData.length}</b> meal
          {childrenData.length > 1 ? "s" : ""} for <b>{selectedDate}</b>.
        </Typography>
        <Typography fontWeight="bold" sx={{ mb: 1 }}>
          Total: ₹{totalAmount}
        </Typography>
        {error && (
          <Typography color="error" fontSize="0.85rem">
            {error}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={initiatePayment}
          sx={{ bgcolor: "#f97316", "&:hover": { bgcolor: "#ea620a" } }}
          disabled={loading}
        >
          Pay ₹{totalAmount}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HolidayPayment;
