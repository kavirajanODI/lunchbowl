import React from "react";
import {
  Box,
  Typography,
  IconButton,
  Divider,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import dayjs from "dayjs";
const CenterPanel = ({
  isSmall,
  currentMonth,
  currentYear,
  handleMonthChange,
  calendarDates,
  selectedDate,
  setSelectedDate,
  isHoliday,
  dummyHolidays,
  subscriptionStart,
  subscriptionEnd,
  sx,
  savedMenuDates = [],
}) => {
  // Helper to check if a date is saved
  const isDateSaved = (date) => {
    // date is number (day of month)
    const dateStr = dayjs(`${currentYear}-${currentMonth + 1}-${String(date).padStart(2, "0")}`).format("YYYY-MM-DD");
    return savedMenuDates.includes(dateStr);
  };
  return (
    <Box
      className="MCMiddlePanel"
      sx={{
        width: isSmall ? "100%" : "45%",
        p: 2,
        ...sx,
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        className="childslidebox"
      >
        <IconButton onClick={() => handleMonthChange(-1)}>
          <ChevronLeft />
        </IconButton>
        <Typography fontWeight="bold">
          {dayjs(`${currentYear}-${currentMonth + 1}`)
            .format("MMMM, YYYY")
            .toUpperCase()}
        </Typography>
        <IconButton onClick={() => handleMonthChange(1)}>
          <ChevronRight />
        </IconButton>
      </Box>
      <div className="clandybox">
        <Box
          className="clandhead"
          display="grid"
          gridTemplateColumns="repeat(7, 1fr)"
          textAlign="center"
        >
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <Typography key={day}>
              <span>{day}</span>
            </Typography>
          ))}
        </Box>
        <Box
          className="clandbody"
          display="grid"
          gridTemplateColumns="repeat(7, 1fr)"
          gap={1}
        >
          {calendarDates.map((date, idx) => {
            if (date === null) return <Box key={idx} />;
            if (date === "disabled") {
              const dayNumber =
                idx - dayjs(`${currentYear}-${currentMonth + 1}-01`).day() + 1;
              return (
                <Box
                  key={idx}
                  borderRadius="50%"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="0.875rem"
                  color="#ccc"
                  sx={{ mx: "auto", pointerEvents: "none" }}
                >
                  <span>{String(dayNumber).padStart(2, "0")}</span>
                </Box>
              );
            }
            const fullDate = dayjs(
              `${currentYear}-${currentMonth + 1}-${String(date).padStart(
                2,
                "0"
              )}`
            );
            const isBeforeStart = fullDate.isBefore(subscriptionStart, "day");
            const isAfterEnd = fullDate.isAfter(subscriptionEnd, "day");
            const holiday = isHoliday(date);
            const isSelected = date === selectedDate;
            const saved = isDateSaved(date);

            // Add savedmenu in addition to other classes, do NOT use inline style for saved
            let className = "daybox";
            if (isSelected && saved) {
              className += " selectday savedmenu";
            } else if (isSelected) {
              className += " selectday";
            } else if (saved) {
              className += " savedmenu";
            } else if (holiday) {
              className += " holiday";
            } else {
              className += " normalday";
            }

            return (
              <Box
                className={className}
                key={idx}
                onClick={() => {
                  if (!isBeforeStart && !isAfterEnd) {
                    setSelectedDate(date);
                  }
                }}
                borderRadius="50%"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="0.875rem"
                fontWeight="bold"
                sx={{
                  cursor: isBeforeStart || isAfterEnd ? "default" : "pointer",
                  color: isBeforeStart || isAfterEnd ? "#ccc" : "inherit",
                  opacity: isBeforeStart || isAfterEnd ? 0.5 : 1,
                  mx: "auto",
                  // -- REMOVE inline styles for 'saved' state here --
                  // border and boxShadow for saved are removed
                }}
              >
                <span>{String(date).padStart(2, "0")}</span>
              </Box>
            );
          })}
        </Box>
      </div>
      <div className="holylistbox">
        <h4 gutterBottom className="holylistitle">
          {" "}
          HOLIDAY LIST{" "}
        </h4>
        <ul className="holylisul">
          {dummyHolidays.map((h, i) => {
            const holidayDateStr = dayjs(h.date).format("YYYY-MM-DD");
            const isSaved = savedMenuDates.includes(holidayDateStr);
            return (
              <li key={i}>
                <strong>{dayjs(h.date).format("MMM DD")}</strong> - {h.name}
                {isSaved && (
                  <span
                    style={{
                      display: "inline-block",
                      marginLeft: 8,
                      width: 15,
                      height: 15,
                      borderRadius: "50%",
                      // border: "2px solid green",
                      verticalAlign: "middle",
                      // background: "rgba(0,128,0,0.10)",
                    }}
                    title="Saved Menu"
                  />
                )}
              </li>
            );
          })}
        </ul>
        <Box display="flex" justifyContent="flex-end" className="holylicolor">
          <Typography variant="caption" mt={1} display="block">
            <ul>
              <li>(<span style={{ color: "#FFE6E6", fontSize: '24px', lineHeight: '1' }}>◉</span>) Denotes Holiday.{" "}</li>
              <li>(<span style={{ color: "green", fontSize: '24px', lineHeight: '1' }}>◉</span>) Denotes Selected / Saved Menu.</li>
            </ul>
          </Typography>

        </Box>
      </div>
    </Box>
  );
};
export default CenterPanel;
