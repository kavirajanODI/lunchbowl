import React, { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import {
  Dialog,
  IconButton,
  Box,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import axios from "axios";
import useEmail from "@hooks/useEmail";

const NutritiousEnquire = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const { sendNutritionEnquiryEmail, loading } = useEmail(); 

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
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      errs.mobile = "Enter a valid 10-digit mobile number.";
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
        schoolName: "Nutrition Enquiry",
        message: formData.message,
        email: formData.email,
      };

      await sendNutritionEnquiryEmail(enquiryData);

      alert("Thank you for your enquiry! We'll get back to you soon.");
      onClose();
      // Reset handled by useEffect on close/open
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("There was an error submitting the form. Please try again.");
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
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      className="nutripopup compopups"
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
      <Box className="nutriPopBox nutriBoxRow Box flex bg-white relative h-full">
        <Box
          className="w-[50%] nutriBoxCol nutriLCol "
          sx={{
            backgroundImage: `url(/let-talk-pop-img.jpg)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></Box>
        <Box className="w-[50%] self-center nutriBoxCol nutriRCol logboxcol p-[3vw]">
          <div className="nutriinrRow">
            <Box sx={{ textAlign: "left", marginBottom: "24px" }} className="poptitles">
              <Typography variant="h4" color="#000" sx={{ textTransform: "uppercase", marginBottom: "4px" }} >!Talk Nutrition!</Typography>
              <p>Get expert guidance to provide a nutritious future to your little one.</p>
            </Box>
            <form onSubmit={handleSubmit} noValidate>
              <TextField
                fullWidth
                id="fullName"
                name="fullName"
                label="Full Name"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                margin="normal"
                placeholder="Joe Bloggs"
                className="fieldbox"
                error={!!errors.fullName}
                helperText={errors.fullName}
              />
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
                placeholder="example@domain.com"
                className="fieldbox"
                error={!!errors.email}
                helperText={errors.email}
              />
              <TextField
                fullWidth
                id="mobile"
                name="mobile"
                label="Mobile Number"
                type="tel"
                value={formData.mobile}
                onChange={handleChange}
                margin="normal"
                placeholder="1234567890"
                className="fieldbox"
                error={!!errors.mobile}
                helperText={errors.mobile}
              />
              <TextField
                fullWidth
                id="message"
                name="message"
                label="Message"
                type="text"
                value={formData.message}
                onChange={handleChange}
                margin="normal"
                placeholder="Message"
                className="fieldbox"
                error={!!errors.message}
                helperText={errors.message}
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
                    backgroundColor: "#e55c12",
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
  );
};

export default NutritiousEnquire;
