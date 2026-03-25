import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Chip,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  Event as EventIcon,
} from "@mui/icons-material";
import dayjs from "dayjs";
import AttributeServices from "../../services/AttributeServices";
import useAsync from "../../hooks/useAsync";

const SubscriptionDatePicker = ({
  type = "start",
  value,
  onChange,
  minDate,
  maxDate,
}) => {
  const [holidays, setHolidays] = useState([]);
  const { data } = useAsync(AttributeServices.getAllHolidays);

  useEffect(() => {
    if (data && Array.isArray(data)) {
      const apiHolidays = data.map((h) => ({
        date: dayjs(h.date).format("YYYY-MM-DD"),
        name: h.name,
      }));
      setHolidays(apiHolidays);
    }
  }, [data]);

  const isWeekend = (date) => [0, 6].includes(dayjs(date).day()); // Sunday (0) or Saturday (6)
  const isHoliday = (date) =>
    holidays.some((h) => dayjs(h.date).isSame(dayjs(date), "day"));
  const isWorkingDay = (date) => !isWeekend(date) && !isHoliday(date);

  const getLastWorkingDayOfMonth = (date) => {
    let lastDay = dayjs(date).endOf("month");
    while (!isWorkingDay(lastDay)) {
      lastDay = lastDay.subtract(1, "day");
    }
    return lastDay;
  };

  // Ensure value is a Dayjs object if not null
  const valueDayjs = value ? dayjs(value) : null;
  const minDateDayjs = minDate ? dayjs(minDate) : dayjs("1900-01-01");
  const maxDateDayjs = maxDate ? dayjs(maxDate) : null;

  const [open, setOpen] = useState(false);
  // Default month & year from value or today
  const [currentMonth, setCurrentMonth] = useState(
    valueDayjs ? valueDayjs.month() : dayjs().month()
  );
  const [currentYear, setCurrentYear] = useState(
    valueDayjs ? valueDayjs.year() : dayjs().year()
  );

  const handleMonthChange = (delta) => {
    const newDate = dayjs(`${currentYear}-${currentMonth + 1}-01`).add(
      delta,
      "month"
    );
    setCurrentMonth(newDate.month());
    setCurrentYear(newDate.year());
  };

  const generateCalendarDates = () => {
    const startOfMonth = dayjs(`${currentYear}-${currentMonth + 1}-01`);
    const daysInMonth = startOfMonth.daysInMonth();
    const startDay = startOfMonth.day();

    return Array.from({ length: 42 }, (_, i) => {
      if (i < startDay || i >= startDay + daysInMonth) return null;
      return i - startDay + 1;
    });
  };

  const calendarDates = useMemo(generateCalendarDates, [
    currentMonth,
    currentYear,
    holidays, // in case holidays change
  ]);

  const handleDateSelect = (day) => {
    if (!day) return;
    const date = dayjs(`${currentYear}-${currentMonth + 1}-${day}`);
    if (type === "end") {
      // For end date, always select the last working day of the month
      const selectedDate = getLastWorkingDayOfMonth(date);
      onChange && onChange(selectedDate);
    } else {
      // For start date, allow selection of any working day except weekends and holidays
      if (isWorkingDay(date)) {
        onChange && onChange(date);
      }
    }
  };

  const isDateDisabled = (day) => {
    if (!day) return true;
    const dayjsDate = dayjs(`${currentYear}-${currentMonth + 1}-${day}`);

    // Common disabled conditions
    if (dayjsDate.isBefore(minDateDayjs, "day")) return true;
    if (maxDateDayjs && dayjsDate.isAfter(maxDateDayjs, "day")) return true;

    // Additional conditions based on type
    if (type === "start") return !isWorkingDay(dayjsDate);

    // Only allow the last working day for the end date
    if (type === "end") {
      const lastWorkingDay = getLastWorkingDayOfMonth(
        dayjs(`${currentYear}-${currentMonth + 1}-01`)
      );
      return !dayjsDate.isSame(lastWorkingDay, "day");
    }

    return false;
  };

  // Get last working day for this month, for highlighting
  const lastWorkingDay = getLastWorkingDayOfMonth(
    dayjs(`${currentYear}-${currentMonth + 1}-01`)
  );

  return (
    <>
      <Button
        variant="outlined"
        onClick={() => setOpen(true)}
        startIcon={<EventIcon />}
        sx={{ textTransform: "none" }}
      >
        {valueDayjs ? valueDayjs.format("DD MMM YYYY") : `Select ${type} date`}
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="xs"
        fullWidth className="dpmodalbox"
      >
        <DialogTitle className="poptitle">
          Select {type === "start" ? "Start" : "End"} Date
        </DialogTitle>
        <DialogContent className="dateboxss">
          <Box sx={{ p: 2 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
              className="dateboxarrow"
            >
              <IconButton onClick={() => handleMonthChange(-1)}>
                <ChevronLeft />
              </IconButton>
              <Box sx={{ mt: 1 }} className="datebtn">
                <Chip
                  label={dayjs(`${currentYear}-${currentMonth + 1}-01`).format(
                    "MMMM YYYY"
                  )}
                  color="primary"
                  size="small"
                />
              </Box>
              <IconButton onClick={() => handleMonthChange(1)}>
                <ChevronRight />
              </IconButton>
            </Box>

            <Box
              display="grid"
              gridTemplateColumns="repeat(7, 1fr)"
              textAlign="center"
              mb={1}
              className="poptopdays"
            >
              {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
                <Typography key={day} variant="caption" color="textSecondary">
                  {day}
                </Typography>
              ))}
            </Box>

            <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" gap={1} className="popbtmdays" >
              {calendarDates.map((date, idx) => {
                if (date === null) return <Box key={idx} />;

                const dateObj = dayjs(
                  `${currentYear}-${currentMonth + 1}-${date}`
                );
                const disabled = isDateDisabled(date);
                const isSelected =
                  valueDayjs && valueDayjs.isSame(dateObj, "day");
                const isHolidayDate = isHoliday(dateObj);
                const isWeekendDate = isWeekend(dateObj);

                return (
                  <Box
                    key={idx}
                    onClick={() => !disabled && handleDateSelect(date)}
                    borderRadius="50%"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    sx={{
                      cursor: disabled ? "default" : "pointer",
                      mx: "auto",
                      bgcolor: isSelected ? "primary.main" : "transparent",
                      color: isSelected
                        ? "common.white"
                        : disabled
                        ? "text.disabled"
                        : isHolidayDate
                        ? "error.main"
                        : isWeekendDate
                        ? "text.secondary"
                        : "text.primary",
                      "&:hover": !disabled && {
                        bgcolor: isSelected ? "primary.dark" : "action.hover",
                      },
                      opacity: disabled ? 0.3 : 1, // Fade out disabled dates
                    }}
                  >
                    <Typography variant="body2">{date}</Typography>
                  </Box>
                );
              })}
            </Box>

            <Box className='submitbtn'>
              <div className='subbcont'>
                {type === "start" && (
                  <Typography variant="caption" color="text.secondary">
                    Weekends and holidays are not selectable
                  </Typography>
                )}
                {type === "end" && (
                  <Typography variant="caption" color="text.secondary">
                    Only the last working day is selectable
                  </Typography>
                )}
              </div>
              <div className='subbtnss'>
                <Button onClick={() => setOpen(false)} sx={{ mr: 1 }} className="cancelbtn">
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={() => setOpen(false)}
                  disabled={!valueDayjs} className="confirmbtn"
                >
                  Confirm
                </Button>
              </div>
            </Box>

            {holidays.some((h) =>
              dayjs(h.date).isSame(
                dayjs(`${currentYear}-${currentMonth + 1}-01`),
                "month"
              )
            ) && (
              <Box mt={2} className="holidyssmth">
                <Typography variant="caption" color="text.secondary">
                  Holidays this month:
                </Typography>
                <Box
                  sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 0.5, justifyContent: "center", }}
                >
                  {holidays
                    .filter((h) =>
                      dayjs(h.date).isSame(
                        dayjs(`${currentYear}-${currentMonth + 1}-01`),
                        "month"
                      )
                    )
                    .map((h) => (
                      <Chip
                        key={h.date}
                        label={`${dayjs(h.date).format("D")}: ${h.name}`}
                        size="small"
                        color="error"
                        variant="outlined"
                      />
                    ))}
                </Box>
              </Box>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SubscriptionDatePicker;
