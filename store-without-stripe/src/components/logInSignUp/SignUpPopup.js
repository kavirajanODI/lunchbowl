import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Dialog,
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  IconButton,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import SignUpImage from "../../../public/LogInSignUp/signuppopimg.jpg";
import useLoginSubmit from "@hooks/useLoginSubmit";
import useSMS from "@hooks/useSMS";
import { Checkbox, FormControlLabel } from "@mui/material";
import LoginPopup from "./LoginPopup";


const SignUpPopup = ({ open, onClose, freeTrial }) => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
  });
  const [otpSent, setOtpSent] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const [otp, setOtp] = useState("");
  const [userOtp, setUserOtp] = useState("");
  const [timer, setTimer] = useState(0);
  const [resendEnabled, setResendEnabled] = useState(false);
  const [message, setMessage] = useState(null);
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
    otp: "",
  });
  const otpRefs = useRef([]);
  const { submitHandler } = useLoginSubmit();
  const [loading, setLoading] = useState(false);
  const { sendOTPSMS, sendSignupConfirmationSMS, isSending: isSendingSMS } = useSMS();
  const [acceptTerms, setAcceptTerms] = useState(false);


  // Countdown effect
  useEffect(() => {
    let interval;
    if (otpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(interval);
            setResendEnabled(true);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  // Utility to start timer from backend expiresAt
  const startTimerFromExpiresAt = (expiresAt) => {
    const expiryDate = new Date(expiresAt);
    const now = new Date();
    const diffSeconds = Math.floor((expiryDate.getTime() - now.getTime()) / 1000);
    if (diffSeconds > 0) {
      setTimer(diffSeconds);
      setResendEnabled(false);
      setOtpSent(true);
    } else {
      setTimer(0);
      setResendEnabled(true);
    }
  };

  // Validation functions
  const validateName = (name) => {
    return name.trim().length >= 1 && /^[a-zA-Z]+$/.test(name.trim());
  };

  const validateMobile = (mobile) => /^[6-9]\d{9}$/.test(mobile);

  const validateEmail = (email) => {
    const trimmedEmail = email.trim();
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);
  };

  const validateOtp = (otp) => otp.length === 4 && /^\d+$/.test(otp);

  const validateForm = () => {
    const newErrors = {
      firstName: !form.firstName.trim()
        ? "First name is required"
        : !validateName(form.firstName)
          ? "Minimum 1 letters, no numbers/special chars"
          : "",

      lastName: !form.lastName.trim()
        ? "Last name is required"
        : !validateName(form.lastName)
          ? "Minimum 1 letters, no numbers/special chars"
          : "",

      mobile: !form.mobile.trim()
        ? "Mobile number is required"
        : !validateMobile(form.mobile.trim())
          ? "Please enter a valid number"
          : "",

      email: !form.email.trim()
        ? "Email is required"
        : !validateEmail(form.email.trim())
          ? "Please enter a valid email"
          : "",
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };
  const handleSendOtp = async () => {
    if (validateForm()) {
      try {
        setLoading(true);
        const res = await submitHandler({ email: form.email, phone: form.mobile, path: "signUp" });
        console.log("sendOtp response:", res);

        if (res.success) {
          setLoading(false);
          setMessage({ type: "success", text: res.message || "OTP sent successfully!" });
          if (res.otp) setOtp(res.otp); // store otp if needed
          if (res.expiresAt) startTimerFromExpiresAt(res.expiresAt);

          if (process.env.NEXT_PUBLIC_SMS_ENABLED === "true" && res.otp) {
            try {
              await sendOTPSMS(form.mobile, res.otp);
            } catch {
              setMessage({ type: "error", text: "Failed to send SMS OTP" });
            }
          }
        } else {
          setLoading(false);
          setMessage({ type: "error", text: res.message || "Failed to send OTP" });
        }
      } catch (error) {
        setMessage({ type: "error", text: "Something went wrong while sending OTP" });
        console.error("Error sending OTP:", error);
        setLoading(false);
      }
    }
  };

  const handleResendOtp = async () => {
    if (!validateMobile(form.mobile)) {
      setErrors({
        ...errors,
        mobile: "Please enter a valid 10-digit mobile number",
      });
      return;
    }
    try {
      setLoading(true);
      const res = await submitHandler({ phone: form.mobile, path: "signUp" });
      console.log("resendOtp response:", res);

      if (res.success) {
        setLoading(false);
        setMessage({ type: "success", text: res.message || "OTP resent successfully!" });
        if (res.otp) setOtp(res.otp); // store otp if needed
        if (res.expiresAt) startTimerFromExpiresAt(res.expiresAt);

        if (process.env.NEXT_PUBLIC_SMS_ENABLED === "true" && res.otp) {
          try {
            await sendOTPSMS(form.mobile, res.otp);
          } catch {
            setMessage({ type: "error", text: "Failed to send SMS OTP" });
          }
        }
      } else {
        setLoading(false);
        setMessage({ type: "error", text: res.message || "Failed to resend OTP" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Something went wrong while resending OTP" });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!validateOtp(userOtp)) {
      setErrors({ ...errors, otp: "Please enter a valid 4-digit OTP" });
      return;
    } else {
      setLoading(true);
      const res = await submitHandler({
        otp: userOtp,
        phone: form.mobile,
        path: "signUp-otp",
        email: form.email,
        firstName: form.firstName,
        lastName: form.lastName,
        freeTrialCheck: freeTrial,
      });
      console.log("verifyOtp---->", res);

      if (res.success) {
        setLoading(false);
        setMessage({ type: "success", text: res.message || "OTP verified successfully!" });
      } else {
        setLoading(false);
        setMessage({ type: "error", text: res.message || "OTP verification failed" });
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "mobile" && value && !/^[0-9]*$/.test(value)) return;
    if (
      (name === "firstName" || name === "lastName") &&
      value &&
      !/^[a-zA-Z ]*$/.test(value)
    )
      return;

    setForm({ ...form, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleOtpChange = (index, value) => {
    if (value && !/^[0-9]$/.test(value)) return;
    const otpArray = userOtp.split("");
    otpArray[index] = value;
    const newOtp = otpArray.join("");
    setUserOtp(newOtp);
    if (errors.otp && newOtp.length > 0) {
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

  const renderLabel = (label) => (
    <Typography
      component="label"
      sx={{
        fontSize: "12px",
        fontWeight: "bold",
        textTransform: "uppercase",
        display: "inline-block",
        mb: 0.5,
        color: "#FF6B00",
      }}
    >
      {label}
      <Typography component="span" sx={{ color: "#FF6B00" }}>
        *
      </Typography>
    </Typography>
  );

  return (
    <>
      <Dialog
        open={open}
        onClose={() => {
          onClose();
          setOtpSent(false);
          setForm({ firstName: "", lastName: "", mobile: "", email: "" });
          setUserOtp("");
          setErrors({ firstName: "", lastName: "", mobile: "", email: "", otp: "" });
          setMessage(null);
          setAcceptTerms(false);
        }}
        className="compopups"
        maxWidth="lg"
        fullWidth
        sx={{ "& .MuiDialog-paper": { height: "75vh" } }}
      >
        <Box className="flex relative h-full relative overflow-hidden signboxrow">
          <Box
            className="w-[50%] signbLcol"
            sx={{
              backgroundImage: `url(${SignUpImage.src})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          <Box
            className="w-[50%] p-[2.5vw] self-center signboxcol signbRcol"
            sx={{
              bgcolor: "#fff",
            }}
          >
            <IconButton
              className="popClose"
              onClick={() => {
                onClose();
                setOtpSent(false);
                setForm({ firstName: "", lastName: "", mobile: "", email: "" });
                setUserOtp("");
                setErrors({ firstName: "", lastName: "", mobile: "", email: "", otp: "" });
                setMessage(null);
              }}
              sx={{ position: "absolute", top: 16, right: 16 }}
            >
              <CloseIcon />
            </IconButton>

            <div className="signboxInrow">
              <div className="poptitles">
                <Typography variant="h4" sx={{ textTransform: "uppercase", mb: 1 }}>
                  {otpSent ? "Enter OTP" : "Sign Up"}
                </Typography>
              </div>
              {otpSent ? (
                <>
                  <div className="sendotpbox">
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      We've sent an OTP to your mobile number.
                    </Typography>

                    <Typography variant="h6" mb={1} sx={{ color: "#FF6B00" }}>
                      ONE TIME PASSWORD*
                    </Typography>
                    <Box sx={{ display: "flex", gap: 2, mb: 1 }}>
                      {Array.from({ length: 4 }).map((_, index) => (
                        <TextField
                          key={index}
                          variant="outlined"
                          size="small"
                          type="tel" 
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
                      {resendEnabled ? (
                        <Button
                          fullWidth
                          disabled={loading}
                          sx={{
                            backgroundColor: "#FF6B00",
                            color: "#fff",
                            "&:hover": { backgroundColor: "#e85f00" },
                          }}
                          onClick={handleResendOtp}
                        >
                          Resend OTP
                        </Button>
                      ) : (
                        <Button
                          fullWidth
                          disabled={loading}
                          sx={{
                            backgroundColor: "#FF6B00",
                            color: "#fff",
                            "&:hover": { backgroundColor: "#e85f00" },
                          }}
                          onClick={handleVerifyOtp}
                        >
                          Verify One Time Password
                        </Button>
                      )}
                    </div>
                    <Typography
                      className="ephonenolink"
                      variant="body2"
                      sx={{
                        mb: 3,
                        color: "#FF6B00",
                        textDecoration: "underline",
                        cursor: "pointer",
                        "&:hover": {
                          opacity: 0.8,
                        },
                      }}
                      onClick={() => setOtpSent(false)}
                    >
                      Edit phone number
                    </Typography>
                    {message && (
                      <Alert
                        severity={message.type}
                        sx={{ mt: 2, fontWeight: "bold", textAlign: "center" }}
                      >
                        {message.text}
                      </Alert>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="loginfiledss">
                    {/* Name Fields */}
                    <Box sx={{ display: "flex", gap: 2, mb: 1 }} className="sfrmrow">
                      <Box sx={{ flex: 1 }} className="sfrmcol">
                        {renderLabel("First Name")}
                        <TextField
                          name="firstName"
                          placeholder="Enter your First Name"
                          variant="outlined"
                          size="small"
                          fullWidth
                          value={form.firstName}
                          onChange={handleChange}
                          error={!!errors.firstName}
                          helperText={errors.firstName}
                          inputProps={{ maxLength: 30 }}
                        />
                      </Box>
                      <Box sx={{ flex: 1 }} className="sfrmcol">
                        {renderLabel("Last Name")}
                        <TextField
                          name="lastName"
                          placeholder="Enter your Last Name"
                          variant="outlined"
                          size="small"
                          fullWidth
                          value={form.lastName}
                          onChange={handleChange}
                          error={!!errors.lastName}
                          helperText={errors.lastName}
                          inputProps={{ maxLength: 30 }}
                        />
                      </Box>
                    </Box>
                    <Box className="sfrmrow">
                      <Box sx={{ mb: 1 }} className="sfrmcol">
                        {renderLabel("Mobile Number")}
                        <TextField
                          name="mobile"
                          placeholder="Enter your Mobile Number"
                          variant="outlined"
                          size="small"
                          fullWidth
                          value={form.mobile}
                          onChange={handleChange}
                          error={!!errors.mobile}
                          helperText={errors.mobile}
                          inputProps={{ maxLength: 10 }}
                        />
                      </Box>
                    </Box>
                    <Box className="sfrmrow">
                      <Box sx={{ mb: 2 }} className="sfrmcol">
                        {renderLabel("Email")}
                        <TextField
                          name="email"
                          placeholder="Enter your Email"
                          variant="outlined"
                          size="small"
                          fullWidth
                          value={form.email}
                          onChange={handleChange}
                          error={!!errors.email}
                          helperText={errors.email}
                        />
                      </Box>
                    </Box>

                      {/* <Typography variant="body2" sx={{ mb: 1 }} className="para-tcpp">
                    By creating an account, I accept the{" "}
                    <Link href="/terms-and-conditions" color="#FF6B00">
                      T&C
                    </Link>
                        {" / "}
                        <Link href="/privacy-policy" color="#FF6B00">
                          Privacy Policy
                        </Link>
                        {" / "}
                        <Link href="/refund-cancellation-policy" color="#FF6B00">
                          Refund Policy
                    </Link>
                  </Typography> */}

                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={acceptTerms}
                            onChange={(e) => setAcceptTerms(e.target.checked)}
                            sx={{ color: "#FF6B00" }}
                          />
                        }
                        label={
                          <Typography variant="body2" className="para-tcpp">
                            I accept the{" "}
                            <Link href="/terms-and-conditions" color="#FF6B00" target="_blank" rel="noopener noreferrer">
                              T&C
                            </Link>{" / "}
                            <Link href="/privacy-policy" color="#FF6B00" target="_blank" rel="noopener noreferrer">
                              Privacy Policy
                            </Link>{" / "}
                            <Link href="/refund-cancellation-policy" color="#FF6B00" target="_blank" rel="noopener noreferrer">
                              Refund Policy
                            </Link>
                          </Typography>

                        }
                        sx={{ mb: 1 }}
                      />


                      <Button
                        className="sotpbtn"
                        fullWidth
                        disabled={loading || !acceptTerms}
                        sx={{
                          backgroundColor: "#FF6B00",
                          color: "#fff",
                          "&:hover": { backgroundColor: "#e85f00" },
                        }}
                        onClick={handleSendOtp}
                      >
                        <span>Send One Time Password</span>
                      </Button>
                      <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
                        If you already have an account{" "}
                        <Typography
                          component="span"
                          color="#FF6B00"
                          fontWeight="500"
                          sx={{ cursor: "pointer", textDecoration: "underline" }}
                          onClick={() => setShowLogin(true)}
                        >
                          log in
                        </Typography>
                      </Typography>
                      <LoginPopup open={showLogin} onClose={() => setShowLogin(false)} />

                      {message && (
                        <Alert
                          severity={message.type}
                          sx={{ mt: 2, fontWeight: "bold", textAlign: "center" }}
                        >
                          {message.text}
                        </Alert>
                      )}
                    </div>
                    {/* Divider & Social */}
                    {/* <Divider className="ordivider" sx={{ my: 2, position: "relative", paddingY: "15px" }}>
                <Typography
                  component="span"
                  sx={{
                    position: "absolute",
                    top: "-12px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    backgroundColor: "#fff",
                    px: 1,
                    fontSize: "13px",
                    color: "#999",
                  }}
                >
                  OR
                </Typography>
              </Divider> */}

                    {/* Social Login Buttons */}
                    {/* <Box className="wsmideabtn">
                  <ul className="flex gap-2">
                    <li className="flex-1">
                      <Button className="gglebtn"
                    startIcon={<GoogleIcon />}
                    sx={{
                      backgroundColor: "#34A853",
                      color: "#fff",
                    }}
                  >
                    <span>Log In with Google</span>
                  </Button></li>
                    <li className="flex-1"><Button className="fbookbtn"
                    startIcon={<FacebookIcon />}
                    sx={{
                      backgroundColor: "#1877F2",
                      color: "#fff",
                    }}
                  >
                    <span>Log In with Facebook</span>
                  </Button></li>
                  </ul>


                </Box> */}
                </>
              )}
            </div>
          </Box>
        </Box>
      </Dialog>
    </>
  );
};

export default SignUpPopup;
