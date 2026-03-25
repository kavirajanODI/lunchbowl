import React, { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Link from "next/link";
import {
  Dialog,
  IconButton,
  Box,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import axios from "axios";
import LogIn from "../../../public/LogInSignUp/LogIn.jpg";
import GetintouchPopimg from "../../../public/GetintouchPopimg.jpg";
import useEmail from "@hooks/useEmail";

const GetinTouch = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const { sendGetInTouchEmail, loading } = useEmail();

  // Reset form and errors whenever dialog opens
  useEffect(() => {
    if (open) {
      setFormData({
        fullName: "",
        email: "",
        mobile: "",
        message: "",
      });
      setErrors({});
    }
  }, [open]);

  // Validation (message now optional)
  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = "Full Name is required!";
    if (!formData.email.trim()) {
      errs.email = "Email is required!";
    } else if (
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(formData.email)
    ) {
      errs.email = "Enter a valid email.";
    }
   if (!formData.mobile.trim()) {
    errs.mobile = "Mobile Number is required!";
  } else if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
    errs.mobile = "Enter a valid 10-digit mobile number";
  }
    // message is optional, no error
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currErrs = validate();
    setErrors(currErrs);
    if (Object.keys(currErrs).length > 0) return;

    try {
      const [firstName, ...lastNameParts] = formData.fullName.split(" ");
      const lastName = lastNameParts.join(" ") || "";

      const enquiryData = {
        firstName,
        lastName,
        mobileNumber: formData.mobile,
        schoolName: "General Enquiry", // Using a distinguishable name
        message: formData.message,
        email: formData.email,
      };

      await sendGetInTouchEmail(enquiryData);

      alert("Thank you for your enquiry! We'll get back to you soon.");
      onClose();
      // Reset handled by useEffect on close/open
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("Thank you for your enquiry! We'll get back to you soon.");
      onClose();

    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        className="gintpopus compopups"
        sx={{
          "& .MuiDialog-paper": {
            height: "auto",
          },
        }}
      >
        <IconButton
          className="popClose"
          onClick={onClose}
          sx={{ position: "absolute", top: 16, right: 16, zIndex: 99 }}
        >
          <CloseIcon />
        </IconButton>
        <Box className="gintPopBox gintPopRow Box flex bg-white relative h-full">
          <Box
            className="w-[50%] gintPopCol gintLCol"
            sx={{
              backgroundImage: `url(${GetintouchPopimg.src})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></Box>
          <Box className="w-[50%] gintPopCol gintRCol self-center logboxcol p-[2.5vw]">
            <div className="gintPinRow">
              <Box sx={{ textAlign: "left", marginBottom: "24px" }} className="poptitles">
                <Typography variant="h4" color="#000" sx={{ textTransform: "uppercase", marginBottom: "4px" }} >!Reach out We deliver excellence!</Typography>
                <p>We are here to ensure personalized solutions with complete transparency to reach out  - <Link href="mailto:contactus@lunchbowl.co.in">contactus@lunchbowl.co.in</Link></p>
              </Box>
              <form onSubmit={handleSubmit} noValidate>
                <TextField
                  fullWidth
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  error={!!errors.fullName}
                  helperText={errors.fullName}
                  margin="normal"
                  variant="outlined"
                  placeholder="Full Name"
                  className="fieldbox"
                />
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  margin="normal"
                  variant="outlined"
                  placeholder="Email"
                  className="fieldbox"
                />
                <TextField
                  fullWidth
                  id="mobile"
                  name="mobile"
                  type="tel"
                  value={formData.mobile}
                  onChange={handleChange}
                  error={!!errors.mobile}
                  helperText={errors.mobile}
                  margin="normal"
                  variant="outlined"
                  placeholder="Mobile Number"
                  className="fieldbox"
                />
                <TextField
                  fullWidth
                  id="message"
                  name="message"
                  type="text"
                  value={formData.message}
                  onChange={handleChange}
                  error={!!errors.message}
                  helperText={errors.message}
                  margin="normal"
                  variant="outlined"
                  placeholder="Message"
                  className="fieldbox"
                />
                <Button
                  color="primary"
                  disabled={loading}
                  variant="contained"
                  fullWidth
                  type="submit"
                  sx={{
                    mt: 3,
                    backgroundColor: "#ff6514",
                    "&:hover": {
                      backgroundColor: "#e55c12", // Slightly darker on hover
                    },
                  }}
                >
                  Submit
                </Button>
              </form>
            </div>
          </Box>
        </Box>
      </Dialog>
    </div>
  );
};

export default GetinTouch;