import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import dayjs from "dayjs";
import useRegistration from "@hooks/useRegistration";

const LeftPanel = ({
  isSmall,
  currentYear,
  currentMonth,
  activeChild,
  setActiveChild,
  dummyChildren,
  menuSelections,
  subscriptionStart,
  subscriptionEnd,
  onEditClick,
  sx,
  onMenuDataChange,
  selectedMealPlanMeals = [],
  setUseMealPlan,
  setSelectedPlans,
  subscriptionId,
  userId,
  reloadSavedMeals,
  isHoliday,
}) => {
  const formatDate = (day) =>
    `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;

  const currentChild = dummyChildren?.[activeChild];
  const { submitHandler, error } = useRegistration();
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [selectedDeleteDate, setSelectedDeleteDate] = useState(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");


  // Helper: format date as "DD-MM-YYYY"
  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = dayjs(dateStr);
    return date.format("DD-MM-YYYY");
  };

  // Build menuData for parent components (note: dish may be object { mealName, deleted })
  useEffect(() => {
    if (!currentChild || !menuSelections) return;

    const menuData = {};

    const firstDayOfMonth = dayjs(`${currentYear}-${currentMonth + 1}-01`);

    const effectiveStartDate =
      subscriptionStart && subscriptionStart.isAfter(firstDayOfMonth)
        ? subscriptionStart
        : firstDayOfMonth;

    const daysInMonth = firstDayOfMonth.daysInMonth();

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = dayjs(formatDate(day));
      if (
        currentDate.isAfter(effectiveStartDate) ||
        currentDate.isSame(effectiveStartDate)
      ) {
        const dateKey = formatDate(day);
        const dish = menuSelections[dateKey]?.[currentChild.id];
        if (dish && dish.mealName) {
          if (!menuData[currentChild.id]) {
            menuData[currentChild.id] = {
              childId: currentChild.id,
              childName: currentChild.name,
              meals: [],
            };
          }
          // push mealName (and deleted flag if needed)
          menuData[currentChild.id].meals.push({
            mealDate: currentDate.toDate(),
            mealName: dish.mealName,
            deleted: !!dish.deleted,
          });
        }
      }
    }

    if (onMenuDataChange) {
      onMenuDataChange(Object.values(menuData));
    }
  }, [
    activeChild,
    menuSelections,
    currentChild,
    currentYear,
    currentMonth,
    subscriptionStart,
  ]);

  if (!dummyChildren || dummyChildren.length === 0 || !currentChild) {
    return <Box p={2}>No child data available.</Box>;
  }

  const firstDayOfMonth = dayjs(
    `${currentYear}-${currentMonth + 1}-01`
  ).startOf("day");

  const effectiveStartDate =
    subscriptionStart && subscriptionStart.startOf("day").isAfter(firstDayOfMonth)
      ? subscriptionStart.startOf("day")
      : firstDayOfMonth;

  const daysInMonth = firstDayOfMonth.daysInMonth();
  const daysArray = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const currentDate = dayjs(formatDate(day)).startOf("day");
    if (currentDate.isSameOrAfter(effectiveStartDate)) {
      daysArray.push(day);
    }
  }

  return (
    <Box
      className="MCLeftPanel"
      sx={{
        width: isSmall ? "100%" : "30%",
        borderRight: isSmall ? "none" : "1px solid #ddd",
        borderBottom: isSmall ? "1px solid #ddd" : "none",
        maxHeight: isSmall ? "none" : "600px",
        overflow: "auto",
        ...sx,
      }}
    >
      <Typography className="titles">
        {dayjs(`${currentYear}-${currentMonth + 1}`).format("MMMM").toUpperCase()}{" "}
        MENU LIST
      </Typography>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        className="childslidebox"
      >
        <IconButton
          onClick={() =>
            setActiveChild(
              (activeChild - 1 + dummyChildren.length) % dummyChildren.length
            )
          }
        >
          <ChevronLeft />
        </IconButton>

        {currentChild.name?.toUpperCase() || "UNKNOWN"}

        <IconButton
          onClick={() => setActiveChild((activeChild + 1) % dummyChildren.length)}
        >
          <ChevronRight />
        </IconButton>
      </Box>

      {/* Render selected meal plan meals */}
      {selectedMealPlanMeals.length > 0 && (
        <Box sx={{ mb: 2, p: 1 }}>
          <Typography variant="subtitle1" gutterBottom>
            Selected Meal Plan Meals
          </Typography>
          {selectedMealPlanMeals.map((meal, idx) => (
            <Typography key={idx} variant="body2" noWrap>
              {meal}
            </Typography>
          ))}
        </Box>
      )}

      <div className="FLtable">
        <Box display="flex" justifyContent="space-between" className="dataListbox">
          <Typography fontSize="14px" fontWeight="bold">
            DATE
          </Typography>
          <Typography fontSize="14px" fontWeight="bold">
            FOOD LIST
          </Typography>
        </Box>

        <div className="FLbody">
          {daysArray.map((day) => {
            const dateKey = formatDate(day);
            let dish = menuSelections[dateKey]?.[currentChild.id]; // now object { mealName, deleted }
            // Convert string → object
            if (typeof dish === "string") {
              dish = { mealName: dish, deleted: false };
            }
            const isOutOfRange =
              dayjs(dateKey).isBefore(subscriptionStart.subtract(1, "day")) ||
              dayjs(dateKey).isAfter(subscriptionEnd);
            const isWithin48Hours = dayjs(dateKey).diff(dayjs(), "hour") < 24;

            // If there's no meal or mealName, skip rendering that row
            if (!dish || !dish.mealName) return null;

            const isDeleted = !!dish.deleted;

            const dayOfWeek = dayjs(dateKey).day();  // 0 = Sun, 6 = Sat
            const isSaturday = dayOfWeek === 6;
            const isSunday = dayOfWeek === 0;

            // Use your existing holiday logic
            const isHolidayDay = isHoliday(day, currentMonth, currentYear);


            return (
              <Box
                className="flitems"
                key={day}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                py={0.5}
                borderBottom="1px solid #eee"
                color={isOutOfRange ? "#bbb" : "inherit"}
              >
                <Typography variant="body2">{formatDisplayDate(dateKey)}</Typography>

                <Box display="flex" alignItems="center" maxWidth="140px">
                  <Typography variant="body2" noWrap sx={isDeleted ? { opacity: 0.6, textDecoration: "line-through" } : {}}>
                    {dish.mealName}
                  </Typography>

                  {/* show deleted label if meal is marked deleted */}
                  {isDeleted && (
                    <Typography variant="caption" color="textSecondary" sx={{ ml: 1 }} className="deletbox">
                      Deleted
                    </Typography>
                  )}

                  {/* Locked label (within 48 hours) */}
                  {isWithin48Hours && !isOutOfRange && (
                    <Typography variant="caption" color="textSecondary" sx={{ ml: 1 }}>
                      Locked
                    </Typography>
                  )}

                  {!isOutOfRange && (
                    <>
                      {/* Edit: hide when locked or meal is deleted */}
                      {!isWithin48Hours && !isDeleted && (
                        <IconButton
                          className="editbtn"
                          size="small"
                          onClick={() => {
                            if (typeof setUseMealPlan === "function") setUseMealPlan(false);
                            if (typeof setSelectedPlans === "function") setSelectedPlans({});
                            onEditClick(dateKey);
                          }}
                          sx={{ color: "#f97316", ml: 0.5, p: 0 }}
                        >
                          {/* pencil svg */}
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <g clipPath="url(#clip0_1237_7420)">
                              <path
                                d="M7.33398 2.66699H2.66732C2.3137 2.66699 1.97456 2.80747 1.72451 3.05752C1.47446 3.30756 1.33398 3.6467 1.33398 4.00033V13.3337C1.33398 13.6873 1.47446 14.0264 1.72451 14.2765C1.97456 14.5265 2.3137 14.667 2.66732 14.667H12.0007C12.3543 14.667 12.6934 14.5265 12.9435 14.2765C13.1935 14.0264 13.334 13.6873 13.334 13.3337V8.66699"
                                stroke="#FF6514"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M12.334 1.66714C12.5992 1.40193 12.9589 1.25293 13.334 1.25293C13.7091 1.25293 14.0688 1.40193 14.334 1.66714C14.5992 1.93236 14.7482 2.29207 14.7482 2.66714C14.7482 3.04222 14.5992 3.40193 14.334 3.66714L8.00065 10.0005L5.33398 10.6671L6.00065 8.00048L12.334 1.66714Z"
                                stroke="#FF6514"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_1237_7420">
                                <rect width="16" height="16" fill="white" />
                              </clipPath>
                            </defs>
                          </svg>
                        </IconButton>
                      )}

                      {/* Delete Icon: show only for future dates and not for deleted meals */}
                      {dayjs(dateKey).isAfter(dayjs(), "day") &&
                        !isDeleted &&
                        !isSaturday &&
                        !isSunday &&
                        !isHolidayDay && (
                        <Tooltip title=" Delete meal permanently" arrow placement="top">
                          <IconButton
                            className="deletebtn"
                            size="small"
                            sx={{ color: "#dc2626", ml: 0.5, p: 0 }}
                            onClick={() => {
                              setSelectedDeleteDate(dateKey);
                              setOpenConfirmDialog(true);
                            }}
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M3 6h18"
                                stroke="#dc2626"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                              />
                              <path
                                d="M8 6V4h8v2m-9 0v14a2 2 0 002 2h6a2 2 0 002-2V6H7z"
                                stroke="#dc2626"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </IconButton>
                        </Tooltip>
                      )}
                    </>
                  )}
                </Box>
              </Box>
            );
          })}
        </div>
      </div>

      {/* Delete Confirmation Popup */}
      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
          This action cannot be undone!
        </DialogTitle>

        <DialogContent dividers sx={{ textAlign: "center" }}>
          <Typography variant="body2">
            Are you sure you want to delete this meal permanently? 
          </Typography>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button
            onClick={() => setOpenConfirmDialog(false)}
            variant="outlined"
            color="inherit"
          >
            Cancel
          </Button>
          <Button
            onClick={async () => {
              try {
                const res = await submitHandler({
                  path: "delete-meal",
                  data: {
                    userId,
                    subscriptionId,
                    childId: currentChild.id,
                    date: selectedDeleteDate,
                  },
                });

                // console.log("Delete API Response:", res);
                if (res && res.success) {
                  setSnackbarMessage("Meal deleted successfully!");
                  setSnackbarOpen(true);

                  // 🔥 Refresh saved meals from backend
                  if (typeof reloadSavedMeals === "function") {
                    await reloadSavedMeals();
                  }
                } else {
                  setSnackbarMessage(error.response?.data?.message || "Failed to delete meal------->1. Please try again.");
                  setSnackbarOpen(true);

                }
              } catch (err) {
                console.error("Delete failed:", err);
                const backendMessage =
                  err?.response?.data?.message || // axios style
                  err?.message ||                  // JS error
                  "Failed to delete meal. Please try again."; // fallback

                setSnackbarMessage(backendMessage);
                setSnackbarOpen(true);

              } finally {
                setOpenConfirmDialog(false);
              }
            }}
            color="error"
            variant="contained"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" variant="filled">
          {snackbarMessage}
        </Alert>
      </Snackbar>

    </Box>
  );
};

export default LeftPanel;
