import React from "react";
import { Box, Typography, Button } from "@mui/material";
import ConstructionIcon from "@mui/icons-material/Construction";

export default function UnderConstruction() {
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        background:
          "linear-gradient(135deg, #f9fafb 0%, #e5e7eb 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        p: 3,
      }}
    >
      <ConstructionIcon
        sx={{
          fontSize: 80,
          color: "#ff9800",
          mb: 2,
          animation: "rotate 4s linear infinite",
          "@keyframes rotate": {
            "0%": { transform: "rotate(0deg)" },
            "100%": { transform: "rotate(360deg)" },
          },
        }}
      />

      <Typography
        variant="h3"
        sx={{
          fontWeight: 700,
          color: "#333",
          mb: 1,
          fontSize: { xs: "1.8rem", sm: "2.5rem" },
        }}
      >
        🚧 We’re Under Construction
      </Typography>

      <Typography
        variant="body1"
        sx={{
          color: "#555",
          mb: 3,
          maxWidth: 600,
        }}
      >
        Our website is currently being improved to serve you better.
        We’ll be back shortly with exciting updates and new features!
      </Typography>

      {/* <Button
        variant="contained"
        sx={{
          backgroundColor: "#ff9800",
          color: "#fff",
          "&:hover": { backgroundColor: "#f57c00" },
          px: 4,
          py: 1,
          borderRadius: "8px",
          textTransform: "none",
          fontSize: "1rem",
          fontWeight: 600,
          boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
        }}
        href="/live_testing"
      >
        Go to Testing Site
      </Button> */}

      <Typography
        variant="caption"
        sx={{ mt: 4, color: "#888" }}
      >
        © {new Date().getFullYear()} humCen. All rights reserved.
      </Typography>
    </Box>
  );
}
