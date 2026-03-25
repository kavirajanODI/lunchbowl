import React from "react";
import { Box, Typography, Button } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useRouter } from "next/router";

const PaymentFailed = () => {
  const router = useRouter();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      textAlign="center"
      px={2}
    >
      <ErrorOutlineIcon sx={{ fontSize: 80, color: "red", mb: 2 }} />
      <Typography variant="h4" gutterBottom>
        Payment Failed
      </Typography>
      <Typography sx={{ mb: 3 }}>
        Unfortunately, your payment could not be processed. Please try again or contact support.
      </Typography>
      <Button
        variant="contained"
        color="error"
        onClick={() => router.push("/user/profile-Step-Form")} // Replace with retry or form page
      >
        Payment Details
      </Button>
    </Box>
  );
};

export default PaymentFailed;
