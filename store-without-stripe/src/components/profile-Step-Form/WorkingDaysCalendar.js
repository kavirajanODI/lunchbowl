import React, { useState } from "react";
import { Box, Typography, IconButton, Paper, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

// Extend dayjs with the plugins
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const WorkingDaysCalendar = ({
  open,
  onClose,
  startDate,
  workingDays,
  holidays = [],
  hideMessage,
}) => {
  if (!open) return null;

  const [currentMonth, setCurrentMonth] = useState(startDate);
  const endDate = calculateEndDateByWorkingDays(
    startDate,
    workingDays,
    holidays
  );

  // Navigation functions
  const prevMonth = () => {
    setCurrentMonth(currentMonth.subtract(1, "month"));
  };

  const nextMonth = () => {
    setCurrentMonth(currentMonth.add(1, "month"));
  };

  // Check if the month contains any part of the subscription period
  const isRelevantMonth = (date) => {
    return (
      date.isSameOrAfter(startDate.startOf("month")) &&
      date.isSameOrBefore(endDate.endOf("month"))
    );
  };

  // Generate calendar for the current month
  const renderCalendar = () => {
    const monthStart = currentMonth.startOf("month");
    const daysInMonth = monthStart.daysInMonth();
    const adjustedStartDay = monthStart.day() === 0 ? 6 : monthStart.day() - 1;

    // Check if date is a holiday
    const isHoliday = (date) => {
      return holidays.includes(date.format("YYYY-MM-DD"));
    };

    // Check if date is within the active period and a working day
    const isActiveWorkingDay = (day) => {
      const currentDate = monthStart.date(day);
      return (
        currentDate.isSameOrAfter(startDate, "day") &&
        currentDate.isSameOrBefore(endDate, "day") &&
        !isHoliday(currentDate) &&
        currentDate.day() !== 0 &&
        currentDate.day() !== 6
      );
    };

    // Check if date is a weekend or holiday
    const isNonWorkingDay = (day) => {
      const currentDate = monthStart.date(day);
      return (
        currentDate.day() === 0 ||
        currentDate.day() === 6 ||
        isHoliday(currentDate)
      );
    };

    // Check if date is in the past (before today)
    const isPastDate = (day) => {
      return monthStart.date(day).isBefore(dayjs(), "day");
    };

    return (
      <>
        <Box
          display="grid"
          gridTemplateColumns="repeat(7, 1fr)"
          textAlign="center"
          fontWeight="bold"
          fontSize="0.875rem"
          mb={2}
          gap={1}
        >
          {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day) => (
            <Typography key={day}>{day}</Typography>
          ))}
        </Box>

        <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" gap={1.5}>
          {/* Empty days for start of month */}
          {[...Array(adjustedStartDay)].map((_, i) => (
            <Box key={`empty-start-${i}`} />
          ))}

          {/* Calendar days */}
          {[...Array(daysInMonth)].map((_, i) => {
            const dayNumber = i + 1;
            const currentDate = monthStart.date(dayNumber);
            const isWeekend = [6, 0].includes(currentDate.day());
            const isHolidayDay = isHoliday(currentDate);
            const isActive = isActiveWorkingDay(dayNumber);
            const isPast = isPastDate(dayNumber);
            const isToday = currentDate.isSame(dayjs(), "day");

            // Determine background color
            let bgColor = "transparent";
            if (isToday) {
              bgColor = "#FF6A00";
            } else if (isActive) {
              bgColor = "#4CAF50"; // Green for active working days
            } else if (isWeekend || isHolidayDay) {
              bgColor = "#FFE9E1"; // Light orange for weekends and holidays
            }

            // Determine text color
            let textColor = "#000";
            if (isToday || isActive) {
              textColor = "#fff";
            } else if (isPast) {
              textColor = "#9e9e9e"; // Grey for past dates
            }

            return (
              <Box
                key={dayNumber}
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: "50%",
                  backgroundColor: bgColor,
                  color: textColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 500,
                  fontSize: "0.875rem",
                  margin: "0 auto",
                  opacity: isPast ? 0.5 : 1,
                  border: isActive ? "2px solid #2E7D32" : "none",
                  position: "relative",
                }}
              >
                {String(dayNumber).padStart(2, "0")}
                {isHolidayDay && !isWeekend && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: -4,
                      right: -4,
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: "#f44336",
                    }}
                  />
                )}
              </Box>
            );
          })}
        </Box>
      </>
    );
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        zIndex: 1300,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 3,
          width: 700,
          position: "relative",
          minHeight: 550,
        }}
      >
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          position="relative"
          mb={1}
        >
          <Typography variant="h6" fontWeight="bold" align="center">
            YOUR SUBSCRIPTION WORKING DAYS
          </Typography>
          <IconButton onClick={onClose} sx={{ position: "absolute", right: 0 }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Month navigation */}
        <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
          <IconButton
            onClick={prevMonth}
            disabled={!isRelevantMonth(currentMonth.subtract(1, "month"))}
          >
            <ArrowBackIosIcon fontSize="small" />
          </IconButton>

          <Typography
            align="center"
            fontWeight="bold"
            sx={{ mx: 3, minWidth: 200 }}
          >
            {currentMonth.format("MMMM, YYYY")}
          </Typography>

          <IconButton
            onClick={nextMonth}
            disabled={!isRelevantMonth(currentMonth.add(1, "month"))}
          >
            <ArrowForwardIosIcon fontSize="small" />
          </IconButton>
        </Box>

        {renderCalendar()}

        {/* Legend */}
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          mt={3}
          gap={3}
          flexWrap="wrap"
        >
          <Box display="flex" alignItems="center">
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: "#4CAF50",
                mr: 1,
              }}
            />
            <Typography fontSize="0.875rem">Your Working Days</Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: "#FFE9E1",
                mr: 1,
              }}
            />
            <Typography fontSize="0.875rem">Weekends</Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: "#FFE9E1",
                mr: 1,
                position: "relative",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  top: -3,
                  right: -3,
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  backgroundColor: "#f44336",
                },
              }}
            />
            <Typography fontSize="0.875rem">Holidays</Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: "#e0e0e0",
                mr: 1,
              }}
            />
            <Typography fontSize="0.875rem">Past Dates</Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: "#FF6A00",
                mr: 1,
              }}
            />
            <Typography fontSize="0.875rem">Today</Typography>
          </Box>
        </Box>

        <Typography align="center" mt={2} fontSize="0.875rem">
          Subscription Period: {startDate.format("DD MMM YYYY")} -{" "}
          {endDate.format("DD MMM YYYY")}
        </Typography>
        {!hideMessage && (
          <Typography align="center" fontSize="0.875rem">
            This plan activates after 48 hrs
          </Typography>
        )}
        <Typography align="center" fontSize="0.875rem">
          Total Working Days: {workingDays}
        </Typography>
      </Paper>
    </Box>
  );
};

// Helper functions (same as before)
const calculateEndDateByWorkingDays = (
  startDate,
  workingDays,
  holidays = []
) => {
  let count = 0;
  let current = dayjs(startDate);

  // First ensure we start from a working day
  while (!isWorkingDay(current, holidays)) {
    current = current.add(1, "day");
  }

  while (count < workingDays) {
    if (isWorkingDay(current, holidays)) {
      count++;
    }
    if (count < workingDays) {
      current = current.add(1, "day");
    }
  }

  // Ensure we land on a working day
  while (!isWorkingDay(current, holidays)) {
    current = current.add(1, "day");
  }

  return current;
};

const isWorkingDay = (date, holidays) => {
  const day = dayjs(date);
  return (
    day.day() !== 0 &&
    day.day() !== 6 &&
    !holidays.includes(day.format("YYYY-MM-DD"))
  );
};

export default WorkingDaysCalendar;
