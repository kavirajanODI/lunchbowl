import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  TextField,
  MenuItem,
  Button,
  Typography,
  Box,
  IconButton,
  FormHelperText,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/system";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import axios from "axios";

const timeOptions = ["1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM"];

const ImageBox = styled(Box)({
  position: "relative",
  width: "100%",
  height: "100%",
  maxHeight: "700px",
  overflow: "hidden",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const FormBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  paddingBottom: theme.spacing(8), // Extra space at bottom for better scrolling
  width: "100%",
}));

export default function FreeTrialPopup({ open, onClose }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    date: null,
    time: "",
    food: "",
    address: "",
    message: "",
    email: session?.user?.email || "",
    name: session?.user?.name || "",
    // Add userId to initial state
    userId: session?.user?.id || "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setFormData({
        date: null,
        time: "",
        food: "",
        address: "",
        message: "",
        email: session?.user?.email || "",
        name: session?.user?.name || "",
        userId: session?.user?.id || "",
      });
      setErrors({});
      setSubmitted(false);
    }
  }, [open, session]);

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleDateChange = (value) => {
    setFormData((prev) => ({ ...prev, date: value }));
    setErrors((prev) => ({ ...prev, date: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.date) {
      newErrors.date = "Please select a date";
    } else if (formData.date.isSame(dayjs(), "day")) {
      const currentHour = dayjs().hour();
      const currentMinute = dayjs().minute();
      if (currentHour > 12 || (currentHour === 12 && currentMinute >= 0)) {
        newErrors.date = "Same-day delivery is closed after 12 PM";
      }
    }
    if (!formData.time) newErrors.time = "Please select a time";
    if (!formData.food) newErrors.food = "Please select a dish";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Valid email is required";
    if (!formData.name || !formData.name.trim())
      newErrors.name = "Name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const shouldDisableDate = (date) => {
    const currentHour = dayjs().hour();
    const currentMinute = dayjs().minute();
    const isAfterNoon =
      currentHour > 12 || (currentHour === 12 && currentMinute >= 0);
    return date.isSame(dayjs(), "day") && isAfterNoon;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    const [firstName, ...lastNameParts] = (formData.name || "").split(" ");
    const lastName = lastNameParts.join(" ");

    try {
      await axios.post("http://localhost:5055/api/admin/school-enquiry", {
        firstName,
        lastName,
        email: formData.email,
        mobileNumber: "", // You can add a phone field if needed
        address: formData.address,
        schoolName: "Free Trial",
        message: `Dish: ${
          formData.food
        }\nDelivery Date: ${formData.date?.format("YYYY-MM-DD")}\nTime: ${
          formData.time
        }\n${formData.message}`,
        userId: formData.userId, // Include the userId in the payload
      });
      setSubmitted(true);
    } catch (err) {
      setErrors({
        submit: "There was an error submitting your request. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      className="compopups overflow-hidden"
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          height: "75vh",
        },
      }}
    >
      <IconButton
        className="popClose"
        onClick={onClose}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          zIndex: 1,
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.9)",
          },
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent sx={{ p: 0, height: "100%" }}>
        <Box
          container
          sx={{ height: "100%" }}
          className="flex popinboxs p-[5px]"
        >
          <Box item xs={12} md={6} sx={{ height: "100%" }} className="w-[50%]">
            <ImageBox>
              <Image
                src={"/LogInSignUp/signuppopimg.jpg"}
                alt="Free Trial"
                layout="fill"
                objectFit="cover"
                quality={100}
                priority
              />
            </ImageBox>
          </Box>
          <Box
            className="flex relative h-full relative w-[50%]"
            sx={{
              overflowY: "auto",
              maxHeight: "100%",
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-track": {
                background: "#f1f1f1",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#888",
                borderRadius: "3px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                background: "#555",
              },
            }}
          >
            <FormBox component="form" onSubmit={handleSubmit}>
              <div className="poptitles">
                <Typography variant="h4" fontWeight="bold" mb={2}>
                  START YOUR FREE TRIAL
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Provide the required information in the form to get started
                </Typography>
              </div>
              {submitted ? (
                <Box mt={5}>
                  <Typography variant="h6" color="success.main" gutterBottom>
                    Your order will be delivered on time.
                  </Typography>
                  <Typography variant="body1">
                    Delivery scheduled for:{" "}
                    {formData.date?.format("MMMM D, YYYY")} at {formData.time}
                  </Typography>
                  <Typography variant="body1" mt={1}>
                    Dish: {formData.food}
                  </Typography>
                  <Typography variant="body1">
                    Address: {formData.address}
                  </Typography>
                  <div className="mt-3">
                    <Button
                      className="sotpbtn"
                      variant="contained"
                      color="primary"
                      onClick={() => router.push("/profile-Step-Form")}
                    >
                      <span>Complete your registration </span>
                    </Button>
                  </div>
                </Box>
              ) : (
                <>
                  <div className="loginfiledss">
                    <div className="fretryrow mb-[2vh]">
                      <Typography
                        variant="subtitle2"
                        className="text-[#FF6514]"
                      >
                        FULL NAME*
                      </Typography>
                      <div className="mt-[1vh]">
                        <TextField
                          fullWidth
                          value={formData.name}
                          onChange={handleChange("name")}
                          size="small"
                          error={!!errors.name}
                          helperText={errors.name}
                        />
                      </div>
                    </div>

                    <div className="fretryrow mb-[2vh]">
                      <Typography
                        variant="subtitle2"
                        className="text-[#FF6514]"
                      >
                        EMAIL ADDRESS*
                      </Typography>
                      <div className="mt-[1vh]">
                        <TextField
                          fullWidth
                          value={formData.email}
                          onChange={handleChange("email")}
                          size="small"
                          error={!!errors.email}
                          helperText={errors.email}
                        />
                      </div>
                    </div>

                    <div className="fretryrow mb-[2vh] mt-[2vh]">
                      <Typography
                        variant="subtitle2"
                        className="text-[#FF6514]"
                      >
                        SELECT YOUR PREFERRED SLOT FOR DELIVERY*
                      </Typography>
                      <Box display="flex" gap={2} className="mt-2">
                        <Box flex={1}>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              value={formData.date}
                              onChange={handleDateChange}
                              minDate={dayjs()}
                              shouldDisableDate={shouldDisableDate}
                              slotProps={{
                                textField: {
                                  fullWidth: true,
                                  size: "small",
                                  error: !!errors.date,
                                },
                              }}
                            />
                          </LocalizationProvider>
                          {errors.date && (
                            <FormHelperText error>{errors.date}</FormHelperText>
                          )}
                        </Box>
                        <TextField
                          select
                          fullWidth
                          value={formData.time}
                          onChange={handleChange("time")}
                          size="small"
                          error={!!errors.time}
                          helperText={errors.time}
                        >
                          {timeOptions.map((time) => (
                            <MenuItem key={time} value={time}>
                              {time}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Box>
                    </div>
                    <div className="fretryrow mb-[2vh]">
                      <Typography
                        variant="subtitle2"
                        className="text-[#FF6514]"
                      >
                        SELECT YOUR PREFERRED FOOD*
                      </Typography>
                      <div className="mt-[1vh]">
                        <TextField
                          select
                          fullWidth
                          value={formData.food}
                          onChange={handleChange("food")}
                          size="small"
                          error={!!errors.food}
                          helperText={errors.food}
                        >
                          <MenuItem value="Paneer Butter Masala">
                            Paneer Butter Masala
                          </MenuItem>
                          <MenuItem value="Dal Tadka">Dal Tadka</MenuItem>
                          <MenuItem value="Aloo Gobi">Aloo Gobi</MenuItem>
                        </TextField>
                      </div>
                    </div>
                    <div className="fretryrow mb-[2vh]">
                      <Typography
                        variant="subtitle2"
                        className="text-[#FF6514]"
                      >
                        RESIDENTIAL ADDRESS*
                      </Typography>
                      <div className="mt-[1vh]">
                        <TextField
                          fullWidth
                          multiline
                          rows={3}
                          value={formData.address}
                          onChange={handleChange("address")}
                          size="small"
                          error={!!errors.address}
                          helperText={errors.address}
                          placeholder="Enter your delivery address"
                        />
                      </div>
                    </div>
                    <div className="fretryrow mb-[2vh]">
                      <Typography
                        variant="subtitle2"
                        className="text-[#FF6514]"
                      >
                        MESSAGE
                      </Typography>
                      <div className="mt-[1vh]">
                        <TextField
                          fullWidth
                          multiline
                          rows={2}
                          value={formData.message}
                          onChange={handleChange("message")}
                          placeholder="Feel free to type here if you'd like to share something with us."
                          size="small"
                        />
                      </div>
                    </div>
                    {errors.submit && (
                      <FormHelperText error>{errors.submit}</FormHelperText>
                    )}
                    <div className="fretryrow">
                      <p className="text-[14px]">
                        Submit your request before{" "}
                        <span className="text-[#FF6514]">12 PM</span> for{" "}
                        <span className="text-[#FF6514]">
                          Same-day Delivery
                        </span>
                        .
                      </p>
                    </div>
                    <div className="fretryrow lastrow">
                      <Button
                        className="sotpbtn"
                        type="submit"
                        variant="contained"
                        color="warning"
                        fullWidth
                        sx={{ mt: 2, py: 1.5 }}
                        disabled={loading}
                        endIcon={loading && <CircularProgress size={20} />}
                      >
                        <span>Get Free Trial</span>
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </FormBox>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}