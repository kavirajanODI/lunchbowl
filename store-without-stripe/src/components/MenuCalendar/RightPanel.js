import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  FormControl,
  Link,
  Snackbar,
  Alert,
} from "@mui/material";
import { ChevronLeft, ChevronRight, Close } from "@mui/icons-material";
import dayjs from "dayjs";
import MealPlanDialog from "./MealPlanDialog";
import HolidayPayment from "./HolidayPayment";
import mealPlanData from "../../jsonHelper/meal_plan.json";
import dietitianMealPlanData from "../../jsonHelper/Dietitian_meal_plan.json";

import { useSession } from "next-auth/react";
import useRegistration from "@hooks/useRegistration";


const mealPlanArray = mealPlanData.meal_plan;
const dietitianMealPlanArray = dietitianMealPlanData.meal_plan;


const RightPanel = ({
  isSmall,
  selectedDate,
  getDayName,
  isHoliday,
  dummyChildren,
  menuSelections,
  handleMenuChange,
  formatDate,
  onClose,
  editMode,
  setEditMode,
  sx,
  setMealPlanDialog,
  applyMealPlan,
  activeChild,
  setActiveChild,
  onSave,
  saveSelectedMeals,
  onMealPlanChange,
  useMealPlan,
  setUseMealPlan,
  selectedPlans,
  setSelectedPlans,
  canPay,
  subscriptionStart,   // ⬅️ add this
  subscriptionEnd,     // ⬅️ add this
  goToPrevDate,   // ✅ add
  goToNextDate,   // ✅ add
  subscriptionPlans,       // ✅ add this
  selectedPlanIndex,
}) => {
  const { data: session } = useSession();

  // const [useMealPlan, setUseMealPlan] = useState(false);
  // const [selectedPlans, setSelectedPlans] = useState({});
  const [applyToAll, setApplyToAll] = useState(false);
  const [dialogOpen1, setDialogOpen1] = useState(false);
  const [dialogOpen2, setDialogOpen2] = useState(false);
  const [holidayPaymentOpen, setHolidayPaymentOpen] = useState(false);
  const [holidayPaymentData, setHolidayPaymentData] = useState([]);
  const [paidHolidayMeals, setPaidHolidayMeals] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const selectedDateObj = dayjs(formatDate(selectedDate));
  const holiday = isHoliday(selectedDate);
  const isSelectedHoliday = !!holiday;
  const isWithin48Hours = selectedDateObj.diff(dayjs(), "hour") < 24;
  const isSunday = selectedDateObj.day() === 0;
  const { submitHandler, loading } = useRegistration();

  const isSaturday = selectedDateObj.day() === 6;

  const [showSaveWarning, setShowSaveWarning] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const anyChildMealDeleted = dummyChildren.some((child) => {
    const dish = menuSelections[formatDate(selectedDate)]?.[child.id];
    return dish && dish.deleted === true;
  });





  // Load paid meal data from API, fallback to localStorage
  useEffect(() => {
    const dateKey = formatDate(selectedDate);
    if (!session?.user?.id) return;

    const fetchPaidMeals = async () => {
      try {
        const res = await submitHandler({
          path: "get-holiday-payments",
          data: { date: dateKey, userId: session.user.id }
        });
        if (res?.success !== false) {
          setPaidHolidayMeals(res || []);
          localStorage.setItem("paidHolidayMeal", JSON.stringify(res || []));
        } else {
          setPaidHolidayMeals([]);
        }
      } catch (err) {
        console.error("Error fetching paid holiday data:", err);
        setPaidHolidayMeals([]);
      }
    };

    fetchPaidMeals();
  }, [selectedDate, formatDate, session?.user?.id]);

  const getDayMenu = (selectedDate) => {
    if (!mealPlanArray || mealPlanArray.length === 0) return [];
    const menuIndex = (selectedDate - 1) % mealPlanArray.length;
    return mealPlanArray[menuIndex]?.meals || [];
  };

  const mealPlans = [
    {
      id: 1,
      name: "Meal Plan ",
      meals: dietitianMealPlanArray.map((day) => day.meal),

    },
  ];

  const checkAllWorkingDaysFilled = () => {
    let currentDate = dayjs(subscriptionStart);
    const endDate = dayjs(subscriptionEnd);

    while (currentDate.isSameOrBefore(endDate, "day")) {
      const day = currentDate.date();
      const month = currentDate.month();
      const year = currentDate.year();
      const dateKey = currentDate.format("YYYY-MM-DD");

      // skip weekends and holidays
      if (!isHoliday(day, month, year)) {
        for (const child of dummyChildren) {
          const meal = menuSelections[dateKey]?.[child.id];
          if (!meal) {
            return false; // missing a meal
          }
        }
      }
      currentDate = currentDate.add(1, "day");
    }
    return true;
  };


  const handlePlanChange = (childId, planId) => {
    const dateObj = dayjs(formatDate(selectedDate));

    // Block within 48 hours
    if (isWithin48Hours) return;

    // ✅ Only apply inside subscription period
    if (
      dateObj.isBefore(dayjs(subscriptionStart), "day") ||
      dateObj.isAfter(dayjs(subscriptionEnd), "day")
    ) {
      console.log("❌ Selected date outside subscription range, skipping");
      return;
    }

    setSelectedPlans((prev) => ({ ...prev, [childId]: planId }));

    const childIndex = dummyChildren.findIndex((child) => child.id === childId);
    if (childIndex !== -1) setActiveChild(childIndex);

    // 🔎 Apply Meal Plan but filter by subscription range
    if (applyMealPlan) {
      applyMealPlan(planId, childId, subscriptionStart, subscriptionEnd);
    }

    if (typeof onMealPlanChange === "function") {
      onMealPlanChange(planId);
    }
  };




  const handleApplyToAllChange = (e) => {
    if (isWithin48Hours) return;

    const { checked } = e.target;
    setApplyToAll(checked);

    if (checked && dummyChildren.length > 1) {
      const firstChildId = dummyChildren[0].id;
      const firstChildSelection = menuSelections[formatDate(selectedDate)]?.[firstChildId];

      const dishObj = firstChildSelection
        ? {
          mealName: firstChildSelection.mealName || firstChildSelection,
          deleted: firstChildSelection.deleted ?? false,
        }
        : {
          mealName: "",
          deleted: false,
        };

      dummyChildren.slice(1).forEach((child) => {
        handleMenuChange(child.id, dishObj);
      });
    }
  };


  const handleFirstChildMenuChange = (childId, value) => {
    if (isWithin48Hours) return;

    handleMenuChange(childId, value); // pass only string

    if (applyToAll && dummyChildren.length > 1) {
      dummyChildren.slice(1).forEach((child) => {
        handleMenuChange(child.id, value); // pass only string
      });
    }
  };



  const handleMenuSelectionChange = (childId, value) => {
    if (isWithin48Hours) return;

    handleMenuChange(childId, value); // pass only string
  };



  const isChildPaid = (childId) => {
    return paidHolidayMeals.some(
      (p) => p.childId === childId && p.mealDate === formatDate(selectedDate)
    );
  };

  const childrenWithSelectedMeals = dummyChildren.filter((child) => {
    const meal = menuSelections[formatDate(selectedDate)]?.[child.id];
    return meal && meal !== "";
  });

  const allPaid =
    childrenWithSelectedMeals.length > 0 &&
    childrenWithSelectedMeals.every((child) => isChildPaid(child.id));

  const handleSaveClick = () => {
    const dateKey = formatDate(selectedDate);
    const allMenusEmpty = dummyChildren.every(
      (child) =>
        !menuSelections[dateKey] ||
        !menuSelections[dateKey][child.id] ||
        menuSelections[dateKey][child.id] === ""
    );

    if (allMenusEmpty) {
      // setSnackbarMessage("Please select at least one menu to save");
      // setSnackbarOpen(true);
      alert("Please select at least one menu to save");
      return; // Prevent save if nothing is selected
    }

    const allWorkingDaysFilled = checkAllWorkingDaysFilled();

    if (typeof saveSelectedMeals === "function") {
      saveSelectedMeals();
      setSnackbarMessage(
        allWorkingDaysFilled
          ? "✅ You have successfully selected ALL meals! Thanks for joining Lunch Bowl. Now sit back, relax — we've got lunchtime covered!"
          : "✅ Meals saved successfully! Don't forget to select meals for all working days."
      );
      setSnackbarOpen(true);
    }
  };


  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  return (
    <Box
      className="MCRightPanel"
      sx={{
        width: isSmall ? "100%" : "25%",
        bgcolor: "#f97316",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        ...sx,
      }}
    >
      {isSmall && (
        <Box display="flex" justifyContent="flex-end">
          <IconButton onClick={onClose} sx={{ color: "#fff" }}>
            <Close />
          </IconButton>
        </Box>
      )}

      {!(isSelectedHoliday || isSaturday || isSunday) && (
        <div className="fixcheckboxs">
          <FormControlLabel
            control={
              <Checkbox
                checked={useMealPlan}
                onChange={(e) => !isWithin48Hours && setUseMealPlan(e.target.checked)}
                sx={{ color: "#fff" }}
                disabled={isWithin48Hours}
              />
            }
            label={
              <Typography fontSize="0.8rem" color="#fff">
                Meal Plan Approved by Dietitian
              </Typography>
            }
            sx={{ mb: 1, alignSelf: "flex-start" }}
          />
        </div>
      )}
      <div className="fixdatesboxwarrow">
      {isSmall && (
        <Box display="flex" justifyContent="space-between" alignItems="center" className="datearrow">
          <IconButton onClick={goToPrevDate} sx={{ color: "#fff" }} className="arrowprew">
            <ChevronLeft />
          </IconButton>
          {/* <IconButton onClick={onClose} sx={{ color: "#fff" }}>
                      <Close />
                    </IconButton> */}
          <IconButton onClick={goToNextDate} sx={{ color: "#fff" }} className="arrownext">
            <ChevronRight />
          </IconButton>
        </Box>
      )}
      <div className="fixdatesboxs">
        {isSmall ? (
          // 📱 Mobile → Full Date
          <h2>
            {dayjs(formatDate(selectedDate)).format("DD MMM YYYY")}
          </h2>
        ) : (
        // 💻 Desktop → Only Day Number
            <h2>{String(selectedDate).padStart(2, "0")}</h2>
        )}
        <h4>{getDayName(selectedDate).toUpperCase()}</h4>
        <h5>SELECT YOUR CHILD'S MENU</h5>
      </div>
      </div>


      {isWithin48Hours ? (
        <Box bgcolor="#fff" color="#000" borderRadius={2} p={2} textAlign="center" mb={2}>
          <Typography fontWeight="bold" fontSize="0.9rem">
            Orders must be placed at least 48 hours in advance.
          </Typography>
          <Typography fontSize="0.8rem" mt={1}>
            Menu selections cannot be changed for this date.
          </Typography>
        </Box>
      ) : isSunday ? (
        <Box bgcolor="#fff" color="#000" borderRadius={2} p={2} textAlign="center" mb={2}>
          <Typography fontWeight="bold" fontSize="0.9rem">
            The Lunch Bowl is closed on Sundays.
          </Typography>
        </Box>
      ) : (
        <>
          <div className="childlistbox">
            <div className="childinputbox">
              {useMealPlan
                ? dummyChildren.map((child, childIndex) => (
                  <Box key={child.id} className="childmlist">
                    <Typography className="menuddtitle">
                      {(child.name || "").toUpperCase()}
                    </Typography>
                    <Box className="radiobtngroup">
                      <FormControl
                        className="radiobtnss"
                        component="fieldset"
                        fullWidth
                      >
                        <RadioGroup
                          value={selectedPlans[child.id] || ""}
                          onChange={(e) => {
                            handlePlanChange(
                              child.id,
                              parseInt(e.target.value)
                            );
                            setActiveChild(childIndex);
                          }}
                          className="RGradiobtnSSS"
                        >
                          {mealPlans.map((plan) => {
                            return (
                              <Box
                                key={plan.id}
                                display="flex"
                                alignItems="center"
                                mb={0.5}
                                className="RGradiobtn"
                              >
                                <Radio
                                  value={plan.id}
                                  size="small"
                                  className="radiobtnsinput"
                                />
                                <Typography
                                  fontSize="0.8rem"
                                  color="#000"
                                  sx={{ flexGrow: 1 }}
                                  className="radiobtnstext"
                                >
                                  {plan.name}
                                </Typography>
                                <Link
                                  href="#"
                                  fontSize="0.8rem"
                                  sx={{
                                    color: "#fff",
                                    textDecoration: "none",
                                    "&:hover": { textDecoration: "underline" },
                                  }}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setDialogOpen1(true);
                                  }}
                                >
                                  View Plan
                                </Link>
                              </Box>
                            );
                          })}

                        </RadioGroup>
                      </FormControl>
                    </Box>
                  </Box>
                ))
                : dummyChildren.map((child, childIndex) => {
                  const isPaid = paidHolidayMeals.some(
                    (p) => p.childId === child.id && p.mealDate === formatDate(selectedDate)
                  );

                  const dishObj = menuSelections[formatDate(selectedDate)]?.[child.id];
                  const dishValue = dishObj?.mealName || dishObj || ""; // gracefully handle 
                  const isDeletedMeal = dishObj && dishObj.deleted;

                  return (
                    <Box key={child.id} className="childmlist">
                      <Typography className="menuddtitle">
                        {(child.name || "").toUpperCase()}
                      </Typography>

                      <Box
                        className={`menuddlistbox ${isDeletedMeal ? "mealdeletbox" : ""}`}
                        bgcolor="#fff"
                        borderRadius={2}
                        px={1}
                        py={0.5}
                      >
                        {isDeletedMeal ? (
                          <Typography className="mealdelettag">
                            This Meal is deleted. The meal amount is credited to your LunchBowl wallet.{" "}
                            <Link href="/user/wallet" style={{ textDecoration: "underline", color: "rgb(38 62 85)", fontSize: "x-small", }}>
                              Redirect to my wallet
                            </Link>
                          </Typography>
                        ) : (
                            <Select
                              value={dishObj?.mealName || ""}

                              onChange={(e) => {
                                childIndex === 0
                                  ? handleFirstChildMenuChange(child.id, e.target.value)

                                  : handleMenuSelectionChange(child.id, e.target.value)

                                setActiveChild(childIndex);
                              }}
                              fullWidth
                              variant="standard"
                              disableUnderline
                              MenuProps={{ PaperProps: { style: { maxHeight: 48 * 4.5 } } }}
                            >
                              <MenuItem value="">Select Dish</MenuItem>

                              {(() => {
                                if (dishObj && dishObj.mealName && !getDayMenu(selectedDate).includes(dishObj.mealName)) {
                                  return (
                                    <MenuItem key="saved" value={dishObj.mealName}>
                                      {dishObj.mealName} (Paid)
                                    </MenuItem>
                                  );
                                }
                                return null;
                              })()}

                              {getDayMenu(selectedDate).map((menu, i) => (
                                <MenuItem key={i} value={menu}>
                                  {menu}
                                </MenuItem>
                              ))}
                            </Select>
                        )}
                      </Box>

                      {isSelectedHoliday && !isSunday && (
                        <Box display="flex" gap={2} className="btngroups" mt={1}>
                          {!isPaid && (
                            <Button
                              variant="contained"
                              className="paysavebtn"
                              color="warning"
                              onClick={() => {
                                if (canPay) {
                                  setShowSaveWarning(true);
                                  return;
                                }
                                const dish = menuSelections[formatDate(selectedDate)]?.[child.id];
                                if (!dish) {
                                  alert("Select a dish first");
                                  return;
                                }
                                setHolidayPaymentData([
                                  {
                                    childId: child.id,
                                    dish,
                                    mealDate: formatDate(selectedDate),
                                    planId: selectedPlans[child.id] || "HOLIDAY", // ✅ Correct line
                                  },
                                ]);


                                setHolidayPaymentOpen(true);
                              }}
                            >
                              <span>Pay ₹200</span>
                            </Button>
                          )}
                        </Box>
                      )}


                      {childIndex === 0 &&
                        !isSelectedHoliday &&
                        dummyChildren.length > 1 &&
                        !anyChildMealDeleted && (
                        <Box sx={{ mt: 1 }}>
                          <FormControlLabel
                            className="cbapplysbtn"
                            control={
                              <Checkbox
                                checked={applyToAll}
                                onChange={handleApplyToAllChange}
                                sx={{ color: "#fff" }}
                              />
                            }
                            label={
                              <Typography fontSize="0.8rem" color="#fff">
                                Apply the same menu for all children
                              </Typography>
                            }
                          />
                        </Box>
                      )}

                    </Box>
                  );
                })}
            </div>

            <div className="childbtnsbox">
              {isSelectedHoliday && (
                <Box mb={2}>
                  <Typography variant="body2" fontStyle="italic" fontSize="0.8rem">
                    Note: This day is a holiday – additional charges apply.
                  </Typography>
                </Box>
              )}
              <Box display="flex" gap={2} className="btngroups">
                {(!isSelectedHoliday || allPaid) && (
                  <Button
                    variant="outlined"
                    className="paysavebtn"
                    onClick={handleSaveClick}
                  >
                    <span>Save</span>
                  </Button>
                )}
              </Box>
            </div>

          </div>
        </>
      )}

      <MealPlanDialog open={dialogOpen1} onClose={() => setDialogOpen1(false)} planId={1} startDate={formatDate(selectedDate)} />
      {/* <MealPlanDialog open={dialogOpen2} onClose={() => setDialogOpen2(false)} planId={2} startDate={formatDate(selectedDate)} /> */}

      <HolidayPayment
        open={holidayPaymentOpen}
        onClose={() => setHolidayPaymentOpen(false)}
        selectedDate={formatDate(selectedDate)}
        childrenData={holidayPaymentData}
        currentPlanId={subscriptionPlans[selectedPlanIndex]?.id} // ✅ Now it’s defined
      />



      <Snackbar open={showSaveWarning} autoHideDuration={4000} onClose={() => setShowSaveWarning(false)} className="saveworkmenu">
        <Alert severity="warning" sx={{ width: '100%' }}>
          Please save working days menu before paying holidays.
        </Alert>
      </Snackbar>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        sx={{ mb: 25 }}
        className="seletallmenu"
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RightPanel;