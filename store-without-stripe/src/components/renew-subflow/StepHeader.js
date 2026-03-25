// components/renew-subflow/StepHeader.js
import React from "react";
import { Box, Typography } from "@mui/material";

const StepHeader = ({ step }) => {
  const labels = ["CHILDREN’S DETAILS", "SUBSCRIPTION PLAN", "PAYMENT"];
  const totalSteps = labels.length;
  const progressPercentage = (step / totalSteps) * 100;

  return (
    <Box className="SetpTabNav" sx={{ textAlign: "center", mb: 6 }}>
      <Box
        className="SetpTabul"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          borderBottom: "1px dashed #C0C0C0",
          pb: 2,
        }}
      >
        {labels.map((label, index) => (
          <Box
            key={index}
            sx={{
              bgcolor: step === index + 1 ? "#FF6A00" : "transparent",
              px: 2,
              py: 0.5,
              borderRadius: "8px",
            }}
          >
            <Typography
              sx={{
                color: step === index + 1 ? "#fff" : "#C0C0C0",
                fontWeight: step === index + 1 ? 600 : 400,
              }}
            >
              {label}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Progress line */}
      <Box sx={{ height: "2px", borderRadius: "4px", overflow: "hidden", mt: 1 }}>
        <Box
          sx={{
            height: "100%",
            width: `${progressPercentage}%`,
            backgroundColor: "#FF6A00",
            transition: "width 0.4s ease",
          }}
        />
      </Box>
    </Box>
  );
};

export default StepHeader;
