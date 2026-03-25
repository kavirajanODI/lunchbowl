import React, { useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useRouter } from "next/router";
import useRegistration from "@hooks/useRegistration";
import Image from "next/image";
import Mainheader from "@layout/header/Mainheader";
import Mainfooter from "@layout/footer/Mainfooter";

// Confetti component as before...
const Confetti = () => (
  <div
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      pointerEvents: "none",
      width: "100vw",
      height: "100vh",
      overflow: "hidden",
      zIndex: 1
    }}
  >
    {[...Array(30)].map((_, i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 80}%`,
          width: 20 + Math.random() * 15,
          height: 20 + Math.random() * 15,
          background: `hsl(${Math.random() * 360}, 80%, 70%)`,
          borderRadius: "50%",
          opacity: 0.7,
          animation: `fall 3s infinite cubic-bezier(0.63, 0.02, 0.4, 0.99)`,
          animationDelay: `${Math.random() * 2}s`
        }}
      />
    ))}
    <style>{`
      @keyframes fall {
        0% { transform: translateY(-100px);}
        100% { transform: translateY(100vh);}
      }
    `}</style>
  </div>
);

const PaymentSuccess = () => {
  const router = useRouter();
  const { submitHandler } = useRegistration();

  useEffect(() => {
    const savePaidMeals = async () => {
      try {
        const paidMeals = JSON.parse(localStorage.getItem("paidHolidayMeal"));
        if (!Array.isArray(paidMeals) || paidMeals.length === 0) return;

        const grouped = {};
        paidMeals.forEach(({ userId, childId, mealDate, mealName }) => {
          if (!grouped[userId]) grouped[userId] = {};
          if (!grouped[userId][childId]) grouped[userId][childId] = [];
          grouped[userId][childId].push({ mealDate, mealName });
        });

        for (const userId in grouped) {
          const children = Object.entries(grouped[userId]).map(([childId, meals]) => ({
            childId,
            meals,
          }));

          const payload = {
            userId,
            children,
          };

          const res = await submitHandler({
            _id: userId,
            path: "save-meals",
            data: payload,
          });

          if (res.success) {
            console.log("Holiday meals saved for user", userId);
          } else {
            console.error("Failed to save holiday meals:", res.message);
          }
        }

        localStorage.removeItem("paidHolidayMeal");
      } catch (err) {
        console.error("Error saving holiday meals on payment success:", err);
      }
    };

    savePaidMeals();
  }, [submitHandler]);

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #FBF6FF 0%, #BDFCC9 100%)",
        overflow: "hidden"
      }}
    >
      <Mainheader title="Payment Success" description="Your payment was successful" />
      <Confetti />
      {/* This is the key line to start content below header */}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="80vh"
        textAlign="center"
        px={2}
        zIndex={10}
        position="relative"
        paddingTop="100px" // <-- set to your actual header height!
      >

        <style>{`
          @keyframes bounce {
            0%, 100% { transform: translateY(0);}
            50% { transform: translateY(-14px);}
          }
        `}</style>

        <CheckCircleOutlineIcon
          sx={{
            fontSize: 100,
            color: "#4AB138",
            mb: 2,
            filter: "drop-shadow(0 2px 8px rgba(0,0,0,.12))"
          }}
        />
        <Typography
          variant="h3"
          sx={{
            fontFamily: "'Comic Sans MS', 'Baloo 2', cursive",
            color: "#FF6A00",
            fontWeight: 700,
            mb: 1,
            letterSpacing: 2,
            textShadow: "1px 2px #fff"
          }}
          gutterBottom
        >
          Hooray! Payment Success 🎉
        </Typography>
        <Box
          sx={{
            background: "#fffaf3",
            borderRadius: "24px",
            boxShadow: "4px 6px 18px rgba(254, 185, 83, 0.13)",
            display: "inline-block",
            px: 4,
            py: 2,
            mb: 2
          }}
        >
          <Typography
            sx={{
              fontFamily: "'Baloo 2', 'Comic Sans MS', cursive",
              color: "#652FBB",
              fontSize: 20,
              fontWeight: 500
            }}
          >
            !Yayy! Your holiday payment is successful <br/>
Enjoy your requested meal bowl happily
          </Typography>
        </Box>
        <Typography
          sx={{
            fontFamily: "'Baloo 2', 'Comic Sans MS', cursive",
            color: "#FF6A00",
            fontSize: 18,
            my: 2
          }}
        >
          Want to go back and choose from your fun menu calendar?
        </Typography>
        <Button
          variant="contained"
          size="large"
          sx={{
            bgcolor: "#FB6A36",
            fontFamily: "'Baloo 2', 'Comic Sans MS', cursive",
            color: "#fff",
            fontWeight: 700,
            fontSize: 18,
            borderRadius: 8,
            boxShadow: "1px 2px 10px rgba(255, 165, 0, 0.15)",
            py: 1.2,
            px: 5,
            "&:hover": {
              bgcolor: "#FF6A00"
            }
          }}
          onClick={() => router.push("/user/menuCalendarPage")}
        >
          🥗 Go to Menu Calendar
        </Button>
      </Box>
      <Mainfooter />
    </div>
  );
};

export default PaymentSuccess;
