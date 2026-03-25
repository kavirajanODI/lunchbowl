import React, { useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Grid,
  Box,
  InputAdornment,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import stepOne from "../../../public/profileStepImages/stepOne.png";
import useRegistration from "@hooks/useRegistration";

const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/; 

const schema = yup.object().shape({
  fatherFirstName: yup
    .string()
    .required("First name is required")
    .matches(nameRegex, "Enter a valid name"),
  fatherLastName: yup
    .string()
    .required("Last name is required")
    .matches(nameRegex, "Enter a valid name"),
  motherFirstName: yup
    .string()
    .required("Mother first name is required")
    .matches(nameRegex, "Enter a valid name"),
  motherLastName: yup
    .string()
    .required("Mother last name is required")
    .matches(nameRegex, "Enter a valid name"),
  mobile: yup
    .string()
    .required("Mobile number is required")
    .matches(/^[6-9]\d{9}$/, "Enter a valid number"),
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  address: yup.string().required("Residential address is required"),
  pincode: yup
    .string()
    .required("Pincode is required")
    .matches(/^\d{6}$/, "Enter a valid 6-digit pincode"),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  country: yup.string().required("Country is required"),
});

const ParentDetailsStep = ({ formData, setFormData, nextStep, _id, sessionData }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      ...formData,
      mobile: sessionData?.user?.phone || "",
      email: sessionData?.user?.email || "",
      country: "India",
    },
    resolver: yupResolver(schema),
    mode: "onTouched",
  });

  const { submitHandler, loading } = useRegistration();

   useEffect(() => {
    reset({
      ...formData,
      mobile: sessionData?.user?.phone || "",
      email: sessionData?.user?.email || "",
      country: formData.country || "India",
    });
  }, [formData, reset, sessionData]);

  const onSubmit = async (data) => {
    console.log("Form data submitted:", data);
    const res = await submitHandler({
      formData: data,
      step: 1,
      path: "step-Form-ParentDetails",
      _id,
    });
    if (res) {
      setFormData(data);
      nextStep();
    }
  };

  return (
    <Box className="subplnBoxss"
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 2,
      }}
    >
      {/* Image */}
      <Box className="spboximg"
        sx={{
          width: { xs: "100%", md: "45%" },
          backgroundImage: `url(${stepOne.src})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          backgroundPosition: "center",
          minHeight: 500,
        }}
      />

      {/* Form Fields */}
      <Box className="spboxCont" sx={{ width: { xs: "100%", md: "55%" } }}>
        <div className="steptitles">
          <Typography variant="h5">PARENT'S DETAILS:</Typography>
        </div>

        <Grid className="formboxrow" container spacing={2}>
          {/* Parent Names */}
          <Grid className="formboxcol" item xs={12} sm={6}>
            <Typography
              variant="subtitle2"
              sx={{ color: "#FF6A00", fontWeight: 600, mb: 1 }}
            >
              FATHER FIRST NAME*
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Father First Name"
              {...register("fatherFirstName")}
              error={!!errors.fatherFirstName}
              helperText={errors.fatherFirstName?.message}
              sx={{ width: "300px", minWidth: "300px" }}
            />
          </Grid>
          <Grid className="formboxcol" item xs={12} sm={6}>
            <Typography
              variant="subtitle2"
              sx={{ color: "#FF6A00", fontWeight: 600, mb: 1 }}
            >
              FATHER LAST NAME*
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Father Last Name"
              {...register("fatherLastName")}
              error={!!errors.fatherLastName}
              helperText={errors.fatherLastName?.message}
              sx={{ width: "300px", minWidth: "300px" }}
            />
          </Grid>

          {/* Mother Names */}
          <Grid className="formboxcol" item xs={12} sm={6}>
            <Typography
              variant="subtitle2"
              sx={{ color: "#FF6A00", fontWeight: 600, mb: 1 }}
            >
              MOTHER FIRST NAME*
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Mother First Name"
              {...register("motherFirstName")}
              error={!!errors.motherFirstName}
              helperText={errors.motherFirstName?.message}
              sx={{ width: "300px", minWidth: "300px" }}
            />
          </Grid>
          <Grid className="formboxcol" item xs={12} sm={6}>
            <Typography
              variant="subtitle2"
              sx={{ color: "#FF6A00", fontWeight: 600, mb: 1 }}
            >
              MOTHER LAST NAME*
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Mother Last Name"
              {...register("motherLastName")}
              error={!!errors.motherLastName}
              helperText={errors.motherLastName?.message}
              sx={{ width: "300px", minWidth: "300px" }}
            />
          </Grid>

          {/* Contact Info */}
          <Grid className="formboxcol" item xs={12} sm={6}>
            <Typography variant="subtitle2" sx={{ color: "#FF6A00", fontWeight: 600, mb: 1 }}>
              MOBILE NUMBER*
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Mobile Number"
              {...register("mobile")}
              error={!!errors.mobile}
              helperText={errors.mobile?.message}
              sx={{ width: "300px", minWidth: "300px" }}
              InputProps={{
                readOnly: true
              }}
            />
          </Grid>
          <Grid className="formboxcol" item xs={12} sm={6}>
            <Typography variant="subtitle2" sx={{ color: "#FF6A00", fontWeight: 600, mb: 1 }}>
              EMAIL*
            </Typography>
            <TextField
              fullWidth
              type="email"
              variant="outlined"
              placeholder="Enter Email"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
              sx={{ width: "300px", minWidth: "300px" }}
              InputProps={{
                readOnly: true
              }}
            />
          </Grid>

          {/* Address Fields */}
          <Grid className="formboxcol" item xs={12} sm={6}>
            <Typography
              variant="subtitle2"
              sx={{ color: "#FF6A00", fontWeight: 600, mb: 1 }}
            >
              PINCODE*
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Pincode"
              {...register("pincode")}
              error={!!errors.pincode}
              helperText={errors.pincode?.message}
              sx={{ width: "300px", minWidth: "300px" }}
            />
          </Grid>

          <Grid className="formboxcol" item xs={12} sm={6}>
            <Typography
              variant="subtitle2"
              sx={{ color: "#FF6A00", fontWeight: 600, mb: 1 }}
            >
              CITY*
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter City"
              {...register("city")}
              error={!!errors.city}
              helperText={errors.city?.message}
              sx={{ width: "300px", minWidth: "300px" }}
            />
          </Grid>

          <Grid className="formboxcol" item xs={12} sm={6}>
            <Typography
              variant="subtitle2"
              sx={{ color: "#FF6A00", fontWeight: 600, mb: 1 }}
            >
              STATE*
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter State"
              {...register("state")}
              error={!!errors.state}
              helperText={errors.state?.message}
              sx={{ width: "300px", minWidth: "300px" }}
            />
          </Grid>

          <Grid className="formboxcol" item xs={12} sm={6}>
            <Typography
              variant="subtitle2"
              sx={{ color: "#FF6A00", fontWeight: 600, mb: 1 }}
            >
              COUNTRY*
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="India"
              defaultValue="India"
              {...register("country")}
              error={!!errors.country}
              helperText={errors.country?.message}
              sx={{
                width: "300px",
                minWidth: "300px",
                "& .MuiInputBase-input": {
                  color: "#333"
                },
              }}
              InputProps={{
                readOnly: true,
                startAdornment: (
                  <InputAdornment position="start">🇮🇳</InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid className="formboxcol" item xs={12}>
            <Typography
              variant="subtitle2"
              sx={{ color: "#FF6A00", fontWeight: 600, mb: 1 }}
            >
              RESIDENTIAL ADDRESS*
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              multiline
              maxRows={4}
              rows={5}
              placeholder="Enter your Residential Address"
              {...register("address")}
              sx={{ width: "625px", minWidth: "625px" }}
              error={!!errors.address}
              helperText={errors.address?.message}
            />
          </Grid>
        </Grid>

        <Box className="subbtnrow">
          <Button
            className="subbtn nextbtn"
            type="submit"
            variant="contained"
            disabled={loading}
          >
            {loading ? "Processing..." : <span className="nextspan">Next</span>}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ParentDetailsStep;
