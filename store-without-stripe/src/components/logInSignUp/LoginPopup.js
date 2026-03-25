import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LogIn from "../../../public/LogInSignUp/LogIn.jpg";
import SignUpPopup from "./SignUpPopup";
import { useRouter } from "next/router";
import useLoginSubmit from "@hooks/useLoginSubmit";

const LoginPopup = ({ open, onClose }) => {
  const router = useRouter();
  const [otpSent, setOtpSent] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [otp, setOtp] = useState("");
  const [userOtp, setUserOtp] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [timer, setTimer] = useState(0);
  const [resendEnabled, setResendEnabled] = useState(false);
  const [message, setMessage] = useState(null);
  const [errors, setErrors] = useState({ mobileNumber: "", otp: "" });
  const otpRefs = useRef([]);
  const { submitHandler } = useLoginSubmit();
  const [loading, setLoading] = useState(false);


  // Countdown effect
  useEffect(() => {
    let interval;
    if (otpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setResendEnabled(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  // Utility method to set timer from backend expiresAt
  const startTimerFromExpiresAt = (expiresAt) => {
    const expiryDate = new Date(expiresAt);
    const now = new Date();
    const diffSeconds = Math.floor((expiryDate - now) / 1000);
    if (diffSeconds > 0) {
      setTimer(diffSeconds);
      setResendEnabled(false);
      setOtpSent(true);
    } else {
      setTimer(0);
      setResendEnabled(true);
    }
  };

  // Validation helpers
  const validateMobileNumber = (number) => /^[6-9]\d{9}$/.test(number);
  const validateOtp = (otp) => otp.length === 4 && /^\d+$/.test(otp);

  const handleSendOtp = async () => {
    if (!mobileNumber) {
      setErrors({ ...errors, mobileNumber: "Mobile number is required" });
      return;
    }
    if (!validateMobileNumber(mobileNumber)) {
      setErrors({
        ...errors,
        mobileNumber: "Please enter a valid 10-digit mobile number",
      });
      return;
    }
    try {
      setLoading(true);
      const res = await submitHandler({ phone: mobileNumber, path: "logIn" });
      console.log("sendOtp res:", res);

      if (res.success) {
        setLoading(false);
        setMessage({ type: "success", text: res.message || "OTP sent successfully!" });
        if (res.otp) setOtp(res.otp);
        if (res.expiresAt) startTimerFromExpiresAt(res.expiresAt);
      } else {
        setLoading(false);
        setMessage({ type: "error", text: res.message || "Failed to send OTP" });
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      setMessage({ type: "error", text: "Failed to send OTP. Please try again." });
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!validateMobileNumber(mobileNumber)) {
      setErrors({
        ...errors,
        mobileNumber: "Please enter a valid 10-digit mobile number",
      });
      return;
    }
    try {
      setLoading(true);
      const res = await submitHandler({ phone: mobileNumber, path: "logIn" });
      console.log("resendOtp res:", res);

      if (res.success) {
        setLoading(false);
        setMessage({ type: "success", text: res.message || "OTP resent successfully!" });
        if (res.otp) setOtp(res.otp);
        if (res.expiresAt) startTimerFromExpiresAt(res.expiresAt);
      } else {
        setMessage({ type: "error", text: res.message || "Failed to resend OTP" });
        setLoading(false);
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to resend OTP. Please try again." });
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!validateOtp(userOtp)) {
      setErrors({ ...errors, otp: "Please enter a valid 4-digit OTP" });
      return;
    }
    try {
      setLoading(true);
      const res = await submitHandler({
        otp: userOtp,
        phone: mobileNumber,
        path: "logIn-otp",
      });
      console.log("verifyOtp res:", res);

      if (res.success) {
        setLoading(false);
        setMessage({ type: "success", text: res.message || "OTP verified successfully!" });
      } else {
        setLoading(false);
        setMessage({ type: "error", text: res.message || "OTP verification failed" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error verifying OTP" });
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSignUp = () => setShowSignUp(false);

  const handleOtpChange = (index, value) => {
    if (value && !/^[0-9]$/.test(value)) return;
    const otpArray = userOtp.split("");
    otpArray[index] = value;
    setUserOtp(otpArray.join(""));
    if (errors.otp && otpArray.join("").length > 0) {
      setErrors({ ...errors, otp: "" });
    }
    if (value.length === 1 && index < otpRefs.current.length - 1) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, event) => {
    if (event.key === "Backspace" && index > 0 && event.target.value === "") {
      otpRefs.current[index - 1].focus();
    }
  };

  const handleMobileNumberChange = (e) => {
    const value = e.target.value;
    if (value && !/^[0-9]*$/.test(value)) return;
    setMobileNumber(value);
    if (errors.mobileNumber && value.length > 0) {
      setErrors({ ...errors, mobileNumber: "" });
    }
  };

  return (
    <>
      <Dialog
        className="compopups"
        open={open}
        onClose={() => {
          onClose();
          setOtpSent(false);
          setMobileNumber("");
          setUserOtp("");
          setErrors({ mobileNumber: "", otp: "" });
          setMessage(null);
        }}
        maxWidth="lg"
        fullWidth
        sx={{ "& .MuiDialog-paper": { height: "75vh" } }}
      >
        <Box className="flex relative h-full relative overflow-hidden logboxrow">
          <Box
            className="w-[50%] logbLcol"
            sx={{
              backgroundImage: `url(${LogIn.src})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <Box className="w-[50%] p-[2.5vw] self-center logboxcol logbRcol">
            <IconButton
              className="popClose"
              onClick={() => {
                onClose();
                setOtpSent(false);
                setMobileNumber("");
                setUserOtp("");
                setErrors({ mobileNumber: "", otp: "" });
                setMessage(null);
              }}
              sx={{ position: "absolute", top: 16, right: 16 }}
            >
              <CloseIcon />
            </IconButton>

            <div className="logboxInrow">
            <Box sx={{ textAlign: "left", marginBottom: "24px" }} className="poptitles">
              <Typography variant="h4" color="#000" sx={{ textTransform: "uppercase", marginBottom: "4px" }}>
                {otpSent ? "Enter OTP" : "Log In"}
              </Typography>
              {!otpSent && (
                <Typography variant="body2">
                  or{" "}
                  <Typography
                    component="span"
                    color="#FF6B00"
                    fontWeight="500"
                    sx={{ cursor: "pointer" }}
                    onClick={() => {
                      onClose();             // Close the LoginPopup
                      setShowSignUp(true);   // Open the SignUpPopup
                    }}
                  >
                    <strong>Sign Up</strong>
                  </Typography>
                </Typography>
              )}
              {otpSent && (
                <>
                  <Typography variant="body2" mt={1}>
                    We've sent an OTP to your phone number.
                  </Typography>
                  {otp && (
                    <Typography variant="body2" fontWeight="bold" mb={1} sx={{ color: "#FF6B00" }}>
                      Your OTP: {otp}
                    </Typography>
                  )}
                </>
              )}
            </Box>

            {otpSent ? (
              <>
                <div className="sendotpbox">
                  <Typography variant="h6" mb={1} sx={{ color: "#FF6B00" }}>
                    ONE TIME PASSWORD*
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2, mb: 1 }}>
                    {Array.from({ length: 4 }).map((_, index) => (
                      <TextField
                        key={index}
                        variant="outlined"
                        type="tel" 
                        size="small"
                        inputProps={{
                          maxLength: 1,
                          style: { textAlign: "center", fontSize: "24px" },
                        }}
                        sx={{ width: "56px" }}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        inputRef={(ref) => (otpRefs.current[index] = ref)}
                        error={!!errors.otp}
                      />
                    ))}
                  </Box>
                  {errors.otp && (
                    <Typography color="error" variant="caption" sx={{ mb: 2 }}>
                      {errors.otp}
                    </Typography>
                  )}
                  <Typography variant="body2" color="textSecondary" mb={2}>
                    Time remaining: {Math.floor(timer / 60)}:
                    {timer % 60 < 10 ? "0" : ""}
                    {timer % 60} minutes
                  </Typography>
                  <div className="resendbtn">
                    <Button
                        disabled={loading}
                      fullWidth
                      sx={{
                        backgroundColor: resendEnabled ? "#FF6B00" : "#e85f00",
                        color: "#fff",
                        "&:hover": { backgroundColor: "#e85f00" },
                      }}
                      onClick={resendEnabled ? handleResendOtp : handleVerifyOtp}
                    >
                      {resendEnabled ? "Resend OTP" : "Verify One Time Password"}
                    </Button>
                  </div>
                  <Typography
                    className="ephonenolink"
                    variant="body2"
                    onClick={() => setOtpSent(false)}
                  >
                    Edit phone number
                  </Typography>
                  {message && (
                    <Alert severity={message.type} sx={{ mt: 2, fontWeight: "bold", textAlign: "center" }}>
                      {message.text}
                    </Alert>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="loginfiledss">
                  <Typography variant="h6" mb={1} sx={{ color: "#FF6B00" }}>
                    MOBILE NUMBER*
                  </Typography>
                  <TextField
                    placeholder="Enter your Mobile Number"
                    fullWidth
                    variant="outlined"
                    size="small"
                    value={mobileNumber}
                    onChange={handleMobileNumberChange}
                    error={!!errors.mobileNumber}
                    helperText={errors.mobileNumber}
                    inputProps={{ maxLength: 10 }}
                    sx={{ mb: 2 }}
                  />
                  <Button
                    className="sotpbtn"
                    fullWidth
                        disabled={loading}
                    sx={{
                      backgroundColor: "#FF6B00",
                      color: "#fff",
                      fontWeight: "bold",
                      padding: "12px",
                      borderRadius: "4px",
                      "&:hover": { backgroundColor: "#e85f00" },
                    }}
                    onClick={handleSendOtp}
                  >
                    <span>Send One Time Password</span>
                  </Button>
                </div>
                {message && (
                  <Alert
                    severity={message.type}
                    sx={{ mt: 2, fontWeight: "bold", textAlign: "center" }}
                  >
                    {message.text}
                  </Alert>
                )}
              </>
            )}
            </div>

          </Box>
        </Box>
      </Dialog>

      <SignUpPopup open={showSignUp} onClose={handleCloseSignUp} />
    </>
  );
};

export default LoginPopup;
