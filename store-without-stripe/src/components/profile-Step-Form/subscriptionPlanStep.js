import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Grid,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  FormHelperText,
  IconButton,
  LinearProgress,
  Divider,
  Checkbox,
  Paper,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import EventIcon from "@mui/icons-material/Event";
import dayjs from "dayjs";
import WorkingDaysCalendar from "./WorkingDaysCalendar";
import SubscriptionDatePicker from "./SubscriptionDatePicker";
import { useRouter } from "next/router";
import useRegistration from "@hooks/useRegistration";
import AttributeServices from "../../services/AttributeServices";
import useAsync from "../../hooks/useAsync";
import CategoryServices from "../../services/CategoryServices";

const BASE_PRICE_PER_DAY = 200;

const useHolidays = () => {
  const [holidays, setHolidays] = useState([]);
  const { data, loading: holidaysLoading } = useAsync(
    AttributeServices.getAllHolidays
  );
  useEffect(() => {
    if (data && Array.isArray(data)) {
      setHolidays(data.map((h) => dayjs(h.date).format("YYYY-MM-DD")));
    }
  }, [data]);
  return { holidays, holidaysLoading };
};

const isWeekend = (date) => [0, 6].includes(dayjs(date).day());
const isHoliday = (date, holidays) =>
  holidays.includes(dayjs(date).format("YYYY-MM-DD"));
const isWorkingDay = (date, holidays) =>
  !isWeekend(date) && !isHoliday(date, holidays);

const calculateWorkingDays = (startDate, endDate, holidays) => {
  let count = 0;
  let current = dayjs(startDate);
  const end = dayjs(endDate);
  while (current.isBefore(end) || current.isSame(end, "day")) {
    if (isWorkingDay(current, holidays)) {
      count++;
    }
    current = current.add(1, "day");
  }
  return count;
};

const calculateEndDateByWorkingDays = (startDate, workingDays, holidays) => {
  let count = 0;
  let current = dayjs(startDate);
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
  while (!isWorkingDay(current, holidays)) {
    current = current.add(1, "day");
  }
  return current;
};

const calculatePlans = (holidays, childCount = 1, customStartDates = {}) => {
  let todayDefault = dayjs().add(2, "day");
  while (!isWorkingDay(todayDefault, holidays)) {
    todayDefault = todayDefault.add(1, "day");
  }
  const discounts =
    childCount >= 2
      ? { 22: 0.05, 66: 0.15, 132: 0.2 }
      : { 22: 0, 66: 0.05, 132: 0.1 };

  return [
    {
      id: 1,
      label: `22 Working Days`,
      workingDays: 22,
      price: Math.round(
        22 * BASE_PRICE_PER_DAY * (1 - discounts[22]) * childCount
      ),
      discount: discounts[22],
      isOneMonth: true,
      startDate: customStartDates[1] || todayDefault,
      endDate: calculateEndDateByWorkingDays(
        customStartDates[1] || todayDefault,
        22,
        holidays
      ),
    },
    {
      id: 3,
      label: `66 Working Days`,
      workingDays: 66,
      price: Math.round(
        66 * BASE_PRICE_PER_DAY * (1 - discounts[66]) * childCount
      ),
      discount: discounts[66],
      isOneMonth: false,
      startDate: customStartDates[3] || todayDefault,
      endDate: calculateEndDateByWorkingDays(
        customStartDates[3] || todayDefault,
        66,
        holidays
      ),
    },
    {
      id: 6,
      label: `132 Working Days`,
      workingDays: 132,
      price: Math.round(
        132 * BASE_PRICE_PER_DAY * (1 - discounts[132]) * childCount
      ),
      discount: discounts[132],
      isOneMonth: false,
      startDate: customStartDates[6] || todayDefault,
      endDate: calculateEndDateByWorkingDays(
        customStartDates[6] || todayDefault,
        132,
        holidays
      ),
    },
  ];
};

const SubscriptionPlanStep = ({
  nextStep,
  prevStep,
  _id,
  // numberOfChildren = 1,
  initialSubscriptionPlan = {},
  onSubscriptionPlanChange,
  childrenData = [],
}) => {
  const router = useRouter();
  const { holidays, holidaysLoading } = useHolidays();
  const isWorkingDayMemo = useCallback(
    (date) => isWorkingDay(date, holidays),
    [holidays]
  );

  const [selectedChildren, setSelectedChildren] = useState([]);


  // ---- CHANGE START: use dynamic child count everywhere ----
  const numberOfChildren = selectedChildren.length > 0 ? selectedChildren.length : 1;
  // ---- CHANGE END ----


  // Custom start dates for each plan
  const [customStartDates, setCustomStartDates] = useState({});
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [errors, setErrors] = useState({
    startDate: false,
    endDate: false,
    dateOrder: false,
  });
  const [calendarOpen, setCalendarOpen] = useState(false);
  const { submitHandler, loading } = useRegistration();
  const [hideMessage, setHideMessage] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [agreedError, setAgreedError] = useState(false);
  const [planError, setPlanError] = useState(false);


  // -- NEW: fetch children for subscription selection
  const { data: childrenList = [], loading: childrenLoading } = useAsync(() => CategoryServices.getChildren(_id));

  const subscriptionId = initialSubscriptionPlan?.subscriptionId;





  const [childError, setChildError] = useState(false);

  useEffect(() => {
    if (childrenList?.children?.length > 0) {

      if (initialSubscriptionPlan?.children?.length > 0) {
        // preload previously selected children
        setSelectedChildren(initialSubscriptionPlan.children);
      } else {
        // default select first child
        setSelectedChildren([childrenList.children[0]._id]);
    }
    }
  }, [childrenList, initialSubscriptionPlan]);


  const handleChildCheckbox = (childId) => {
    setSelectedChildren((prev) => {
      const isSelected = prev.includes(childId);
      if (isSelected) {
        // Prevent unchecking if only one child is selected
        if (prev.length === 1) {
          return prev; // Do not uncheck the last selected child
        }
        return prev.filter((id) => id !== childId);
      } else {
        return [...prev, childId];
      }
    });
  };

  useEffect(() => {
    setSelectedPlan("");
    setStartDate(null);
    setEndDate(null);
    setCustomStartDates({});
    setAgreed(false);
    setSelectedChildren([]);
  }, []);



  useEffect(() => {
    if (!holidays.length) return;

    const computedPlans = calculatePlans(
      holidays,
      numberOfChildren,
      customStartDates
    );
    setPlans(computedPlans);
  }, [holidays, numberOfChildren, customStartDates]);






  const handlePlanChange = (e) => {
    const newPlanId = e.target.value;
    setSelectedPlan(newPlanId);
    setPlanError(false);
    setErrors({ startDate: false, endDate: false, dateOrder: false });
    onSubscriptionPlanChange({ planId: newPlanId });

    if (newPlanId === "byDate") {
      setStartDate(null);
      setEndDate(null);
      onSubscriptionPlanChange({ startDate: null, endDate: null });
    } else {
      const selectedPlanObj = plans.find(
        (plan) => plan.id.toString() === newPlanId
      );
      if (selectedPlanObj) {
        setStartDate(selectedPlanObj.startDate);
        setEndDate(selectedPlanObj.endDate);
        onSubscriptionPlanChange({
          startDate: selectedPlanObj.startDate,
          endDate: selectedPlanObj.endDate,
        });
      }
    }
  };

  // Handle custom start date for standard plans
  const handleCustomStartDateChange = (planId, newStartDate) => {
    setCustomStartDates({
      ...customStartDates,
      [planId]: newStartDate,
    });
    const selectedPlanObj = plans.find(
      (plan) => plan.id.toString() === planId.toString()
    );
    if (selectedPlanObj) {
      const newEndDate = calculateEndDateByWorkingDays(
        newStartDate,
        selectedPlanObj.workingDays,
        holidays
      );
      setStartDate(newStartDate);
      setEndDate(newEndDate);
      onSubscriptionPlanChange({
        startDate: newStartDate,
        endDate: newEndDate,
      });
    }
  };

  const handleStartDateChange = (newValue) => {
    setStartDate(newValue);
    setErrors({ ...errors, startDate: false, dateOrder: false });
    onSubscriptionPlanChange({ startDate: newValue });

    if (selectedPlan !== "byDate") {
      const selected = plans.find((plan) => plan.id.toString() === selectedPlan);
      if (selected) {
        const newEndDate = calculateEndDateByWorkingDays(
          newValue,
          selected.workingDays,
          holidays
        );
        setEndDate(newEndDate);
      }
    }
  };

  // console.log("selectedChildren--->", selectedChildren.length);


  const handleEndDateChange = (newValue) => {
    setEndDate(newValue);
    setErrors({ ...errors, endDate: false, dateOrder: false });
    onSubscriptionPlanChange({ endDate: newValue });
  };

  const currentPlan =
    selectedPlan !== "byDate"
      ? plans.find((plan) => plan.id.toString() === selectedPlan)
      : null;

  // --- Overwrite only handleNext to use selectedChildren ---
  const handleNext = async () => {
    if (!selectedPlan) {
      setPlanError(true);
      return;
    }
    setPlanError(false);
    if (!agreed) {
      setAgreedError(true);
      return;
    }
    setAgreedError(false);

    if (selectedChildren.length === 0) {
      setChildError(true);
      return;
    }
    setChildError(false);

    // (rest of your error logic unchanged)
    if (selectedPlan === "byDate") {
      const newErrors = {
        startDate: !startDate,
        endDate: !endDate,
        dateOrder:
          endDate && startDate && dayjs(endDate).isBefore(dayjs(startDate)),
      };
      setErrors(newErrors);
      if (newErrors.startDate || newErrors.endDate || newErrors.dateOrder)
        return;
    }

    let totalWorkingDays, totalPrice;
    if (selectedPlan !== "byDate") {
      const currentPlan = plans.find((plan) => plan.id.toString() === selectedPlan);
      totalWorkingDays = currentPlan?.workingDays;
      totalPrice = currentPlan?.price;
    } else {
      totalWorkingDays = calculateWorkingDays(startDate, endDate, holidays);
      totalPrice = totalWorkingDays * BASE_PRICE_PER_DAY * numberOfChildren;
    }

    const payload = {
      subscriptionId,
      selectedPlan,
      workingDays: totalWorkingDays,
      totalPrice,
      startDate: startDate.format("YYYY-MM-DD"),
      endDate: endDate.format("YYYY-MM-DD"),
      children: selectedChildren, // Pass selected children IDs to backend
    };

    try {
      const res = await submitHandler({
        payload,
        step: 3,
        path: "step-Form-SubscriptionPlan",
        _id,
      });
      if (res) {
        nextStep();
      }
    } catch (error) {
      console.error("Error during subscription plan selection:", error);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        className="subplnBoxss"
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        gap={4}
      >
        <Box
          className="spboximg"
          sx={{
            width: { xs: "100%", md: "45%" },
            backgroundImage: `url("/profileStepImages/stepThree.png")`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
            backgroundPosition: "center",
            minHeight: 400,
          }}
        />

        <Box className="spboxCont" sx={{ width: { xs: "100%", md: "55%" } }}>
          {holidaysLoading && <LinearProgress />}

          {/* CHILD CHECKBOXES */}
          {childrenLoading && <LinearProgress />}
          {childrenList?.children?.length > 0 && (
            <Box mb={2}>
              <Typography sx={{ fontWeight: 600, mb: 1 }}>Select Child*</Typography>
              {childrenList?.children?.map(child => (
                <FormControlLabel
                  key={child._id}
                  control={
                    <Checkbox
                      checked={selectedChildren.includes(child._id)}
                      onChange={() => handleChildCheckbox(child._id)}
                    />
                  }
                  label={`${child.childFirstName} ${child.childLastName}`}
                />
              ))}
              {childError && (
                <FormHelperText error>
                  Please choose the children.
                </FormHelperText>
              )}
            </Box>
          )}

          <Typography
            sx={{ color: "#FF6A00", fontWeight: 600, mt: 2, mb: 1 }}
            variant="subtitle2"
          >
            SELECT YOUR SUBSCRIPTION PLAN*{" "}
            <Typography component="span" variant="caption" color="#888">
              (All Taxes included)
            </Typography>
          </Typography>

          {/* CHILD CHECKBOXES */}
          {/* {childrenLoading && <LinearProgress />}
          {childrenList.children.length > 0 && (
            <Box mb={2}>
              <Typography sx={{ fontWeight: 600, mb: 1 }}>Select Child*</Typography>
              {childrenList.children.map(child => (
                <FormControlLabel
                  key={child._id}
                  control={
                    <Checkbox
                      checked={selectedChildren.includes(child._id)}
                      onChange={() => handleChildCheckbox(child._id)}
                    />
                  }
                  label={`${child.childFirstName} ${child.childLastName}`}
                />
              ))}
              {childError && (
                <FormHelperText error>
                  Please select at least one child.
                </FormHelperText>
              )}
            </Box>
          )} */}

          <RadioGroup
            value={selectedPlan}
            onChange={handlePlanChange}
            className="radiogroub eachplansboxs"
          >
            {/* Render Standard Plans */}
            <FormControlLabel value="" control={<Radio sx={{ display: "none" }} />} label="" />
            {plans.map((plan) => (
              <Paper  className="eachplansradios"
                key={plan.id}
                elevation={selectedPlan === plan.id.toString() ? 8 : 2}
                sx={{
                  borderRadius: "12px",
                  mb: 2,
                  px: 2,
                  py: 2,
                  border: selectedPlan === plan.id.toString()
                    ? "2px solid #FF6A00"
                    : "1px solid #ddd",
                  boxShadow: selectedPlan === plan.id.toString()
                    ? "0 4px 15px rgba(255,106,0,0.07)"
                    : undefined,
                  bgcolor: selectedPlan === plan.id.toString()
                    ? "#FFFAF4"
                    : "#fff",
                  transition: "box-shadow .2s",
                  display: "flex",
                  alignItems: "flex-start",
                  flexDirection: "column",
                }}
              >
                <Box display="flex" alignItems="center" width="100%" className="eachplansradiosBoxs">
                  <FormControlLabel
                    value={plan.id.toString()}
                    control={
                      <Radio
                        sx={{
                          color: selectedPlan === plan.id.toString()
                            ? "#FF6A00"
                            : "rgba(0, 0, 0, 0.55)",
                          "&.Mui-checked": { color: "#FF6A00" },
                        }}
                      />
                    }
                    label={
                      <Box className="datepicOthers">
                        <Typography sx={{ fontWeight: 600, color: "#232323" }} variant="body1">
                          {plan.label}
                        </Typography>
                        <Box display="flex" flexWrap="wrap" alignItems="center" gap={1}>
                          <Typography fontSize={13} color="#888">
                            ({plan.workingDays} working days)
                          </Typography>
                          {plan.discount > 0 ? (
                            <>
                              <Typography fontSize={13} color="#888" sx={{ textDecoration: "line-through" }}>
                                Rs. {(plan.workingDays * BASE_PRICE_PER_DAY * numberOfChildren).toLocaleString("en-IN")}
                              </Typography>
                              <Typography fontSize={13} color="#FF6A00">
                                {plan.discount * 100}% OFF - Rs. {plan.price.toLocaleString("en-IN")}
                              </Typography>
                            </>
                          ) : (
                              <Typography fontSize={13} color="#232323">
                                Rs. {plan.price.toLocaleString("en-IN")}
                              </Typography>
                          )}
                        </Box>
                      </Box>
                    }
                    sx={{ marginRight: 0, flex: 1 }}
                  />

                  {/* Start Date Picker for selected standard plan */}
                  {selectedPlan === plan.id.toString() && (
                    <Box sx={{ minWidth: 180, ml: 3 }} className="datepicints">
                      <SubscriptionDatePicker
                        type="start"
                        value={customStartDates[plan.id] || plan.startDate}
                        onChange={(newDate) =>
                          handleCustomStartDateChange(plan.id, newDate)
                        }
                        minDate={dayjs().add(2, "day")}
                        shouldDisableDate={(date) => !isWorkingDayMemo(date)}
                        label="Start Date"
                      />
                    </Box>
                  )}

                  {selectedPlan === plan.id.toString() && (
                    <IconButton className="planclendicons"
                      onClick={() => {
                        setHideMessage(false);
                        setCalendarOpen(true);
                      }}
                      sx={{ color: "#FF6A00", ml: 2 }}
                    >
                      <EventIcon />
                    </IconButton>
                  )}
                </Box>

                {/* Subscription Details */}
                {selectedPlan === plan.id.toString() && (
                  <Box mt={2} sx={{ width: "100%" }} className="eachplansOthbox">
                    <Typography fontSize={13} color="#232323">
                      <strong>Start Date:</strong>{" "}
                      {startDate && startDate.format("DD MMM YYYY")}
                    </Typography>
                    <Typography fontSize={13} color="#232323">
                      <strong>End Date:</strong>{" "}
                      {endDate && endDate.format("DD MMM YYYY")}
                    </Typography>
                    <Typography fontSize={13} color="#232323">
                      <strong>Total Working Days:</strong> {plan.workingDays}
                    </Typography>
                    <Typography fontSize={13} color="#232323">
                      <strong>Price per day per child:</strong> Rs. {BASE_PRICE_PER_DAY}
                    </Typography>
                    {numberOfChildren > 1 && (
                      <>
                        <Typography fontSize={13} color="#232323">
                          <strong>Number of Children:</strong> {numberOfChildren}
                        </Typography>
                        <Typography fontSize={13} color="#232323">
                          <strong>Total Price Calculation:</strong> {plan.workingDays} days × Rs. {BASE_PRICE_PER_DAY} × {numberOfChildren}
                        </Typography>
                      </>
                    )}
                    {plan.discount > 0 && (
                      <Typography
                        fontSize={13}
                        color="#FF6A00"
                        sx={{ mt: 1, fontWeight: 600 }}
                      >
                        Saved Rs.{" "}
                        {Math.round(
                          plan.workingDays *
                          BASE_PRICE_PER_DAY *
                          numberOfChildren *
                          plan.discount
                        ).toLocaleString("en-IN")}
                      </Typography>
                    )}
                  </Box>
                )}
              </Paper>
            ))}

            {/* Render Custom By-Date Plan */}
            {/* <CustomDateSelection
              selectedPlan={selectedPlan}
              startDate={startDate}
              endDate={endDate}
              errors={errors}
              onStartDateChange={handleStartDateChange}
              onEndDateChange={handleEndDateChange}
              holidays={holidays}
              isWorkingDay={isWorkingDayMemo}
              numberOfChildren={numberOfChildren}
              openCalendar={() => setCalendarOpen(true)}
              setHideMessage={setHideMessage}
            /> */}
          </RadioGroup>

          {/* <Typography mt={1} fontSize={12} color="#888">
            End Date must be after Start Date.
          </Typography> */}

          {selectedPlan === "byDate" && startDate && endDate && (
            <CustomDateDetails
              startDate={startDate}
              endDate={endDate}
              holidays={holidays}
              numberOfChildren={numberOfChildren}
            />
          )}

          <OffersSection numberOfChildren={numberOfChildren} />

          <Typography mt={2} fontSize={12}>
            <strong>
              Note: Per Day Meal = Rs. {BASE_PRICE_PER_DAY} (No. of Days × Rs. {BASE_PRICE_PER_DAY} × {numberOfChildren} {numberOfChildren > 1 ? "children" : "child"} = Subscription Amount)
              {selectedPlan === "byDate" && " No discounts apply to custom date selections."}
            </strong>
          </Typography>

          <Box mt={2}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={agreed}
                  onChange={(e) => {
                    setAgreed(e.target.checked);
                    if (agreedError) setAgreedError(false);
                  }}
                  sx={{ color: "#FF6A00" }}
                />
              }
              label={
                <Typography fontSize={14}>
                  I agree with the{" "}
                  <a href="/terms-and-conditions" target="_blank" rel="noopener noreferrer" style={{ color: "#FF6A00", textDecoration: "underline" }}>
                    Terms and Conditions
                  </a>{" "}
                  /{" "}
                  <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: "#FF6A00", textDecoration: "underline" }}>
                    Privacy Policy
                  </a>{" "}
                  /{" "}
                  <a href="/refund-cancellation-policy" target="_blank" rel="noopener noreferrer" style={{ color: "#FF6A00", textDecoration: "underline" }}>
                    Refund Cancellation Policy
                  </a>
                </Typography>
              }
            />
            {agreedError && (
              <FormHelperText error>
                You must agree to the terms and conditions to proceed.
              </FormHelperText>
            )}

            {/* {childError && (
              <FormHelperText error>
                Please select at least one child before continuing.
              </FormHelperText>
            )} */}


            {planError && (
              <FormHelperText error>Please select a subscription plan to proceed.</FormHelperText>
            )}

          </Box>

          <Box className="subbtnrow" sx={{ mt: 4, display: "flex", gap: 3 }}>
            <Button variant="outlined" onClick={prevStep} className="backbtn">
              <span className="nextspan">Back</span>
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              className="nextbtn"
              disabled={loading || holidaysLoading}
              sx={{
                bgcolor: "#FF6A00",
                color: "#fff",
                boxShadow: 2,
                borderRadius: 2,
                fontWeight: 600,
                "&:hover": {
                  bgcolor: "#ff904b",
                },
              }}
            >
              <span className="nextspan">Next</span>
            </Button>
          </Box>
        </Box>
      </Box>

      <WorkingDaysCalendar
        open={calendarOpen}
        onClose={() => setCalendarOpen(false)}
        startDate={startDate}
        workingDays={
          selectedPlan !== "byDate" && currentPlan
            ? currentPlan.workingDays
            : calculateWorkingDays(startDate, endDate, holidays)
        }
        holidays={holidays}
        hideMessage={hideMessage}
      />
    </LocalizationProvider>
  );
};

const CustomDateSelection = ({
  selectedPlan,
  startDate,
  endDate,
  errors,
  onStartDateChange,
  onEndDateChange,
  holidays,
  isWorkingDay,
  numberOfChildren,
  openCalendar,
  setHideMessage
}) => (
  <Box
    className="custmontplan"
    sx={{
      border: "1px solid #ddd",
      borderRadius: "8px",
      px: 2,
      py: 2,
      mt: 1,
      bgcolor: selectedPlan === "byDate" ? "#FFF3EB" : "#fff",
    }}
  >
    <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
      <FormControlLabel
        value="byDate"
        control={
          <Radio
            sx={{
              color: selectedPlan === "byDate" ? "#FF6A00" : "rgba(0, 0, 0, 0.6)",
              "&.Mui-checked": { color: "#FF6A00" },
            }}
          />
        }
        label={
          <Typography
            variant="body2"
            sx={{ color: selectedPlan === "byDate" ? "#FF6A00" : "inherit" }}
          >
            Subscription By Date{" "}
            <Typography component="span" fontSize={12} color="#777">
              (Pre Book)
            </Typography>
            {numberOfChildren > 1 && (
              <Typography
                component="span"
                fontSize={12}
                color="#777"
                sx={{ ml: 1 }}
              >
                for {numberOfChildren} children
              </Typography>
            )}
          </Typography>
        }
      />
      {selectedPlan === "byDate" && startDate && endDate && (
        <IconButton onClick={() => {
          setHideMessage(true);
          openCalendar();
        }} sx={{ color: "#FF6A00" }}>
          <EventIcon />
        </IconButton>
      )}
    </Box>

    {selectedPlan === "byDate" && (
      <Grid container spacing={2} className="custdatepick">
        <Grid item xs={12} sm={6} className="cusdpstart">
          <Typography variant="subtitle2" gutterBottom>
            Start Date
          </Typography>
          <SubscriptionDatePicker
            type="start"
            value={startDate}
            onChange={onStartDateChange}
            minDate={dayjs().add(2, "day")}
            shouldDisableDate={(date) => !isWorkingDay(date)}
          />
          {errors.startDate && (
            <FormHelperText error>Start date is required</FormHelperText>
          )}
        </Grid>

        <Grid item xs={12} sm={6} className="cusdpend">
          <Typography variant="subtitle2" gutterBottom>
            End Date
          </Typography>
          <SubscriptionDatePicker
            type="end"
            value={endDate}
            onChange={onEndDateChange}
            minDate={startDate || dayjs().add(2, "day")}
            shouldDisableDate={(date) => !isWorkingDay(date)}
          />
          {errors.endDate && (
            <FormHelperText error>End date is required</FormHelperText>
          )}
          {/* {errors.dateOrder && (
            <FormHelperText error>
              End date must be after start date
            </FormHelperText>
          )} */}
        </Grid>
      </Grid>
    )}
  </Box>
);

const CustomDateDetails = ({
  startDate,
  endDate,
  holidays,
  numberOfChildren = 1,
}) => {
  const days = calculateWorkingDays(startDate, endDate, holidays);
  const pricePerChild = days * BASE_PRICE_PER_DAY;
  const totalPrice = pricePerChild * numberOfChildren;

  return (
    <Box mt={2} sx={{ border: "1px solid #eee", p: 2, borderRadius: 1 }}>
      <Typography variant="body2" gutterBottom>
        <strong>Subscription Details:</strong>
      </Typography>
      <Typography variant="body2">
        <strong>Start Date:</strong> {startDate.format("DD MMM YYYY")}
      </Typography>
      <Typography variant="body2">
        <strong>End Date:</strong> {endDate.format("DD MMM YYYY")}
      </Typography>
      <Typography variant="body2">
        <strong>Total Working Days:</strong> {days} days
      </Typography>
      <Typography variant="body2">
        <strong>Price per day per child:</strong> Rs. {BASE_PRICE_PER_DAY}
      </Typography>
      <Typography variant="body2">
        <strong>Price per child:</strong> Rs.{" "}
        {pricePerChild.toLocaleString("en-IN")}({days} days × Rs. {BASE_PRICE_PER_DAY})
      </Typography>
      {numberOfChildren > 1 && (
        <>
          <Typography variant="body2">
            <strong>Number of Children:</strong> {numberOfChildren}
          </Typography>
          <Typography variant="body2">
            <strong>Total Price Calculation:</strong> {days} days × Rs.{" "}
            {BASE_PRICE_PER_DAY} × {numberOfChildren} children
          </Typography>
        </>
      )}
      <Divider sx={{ my: 1 }} />
      <Typography variant="body2" fontWeight="bold">
        <strong>Total Price:</strong> Rs. {totalPrice.toLocaleString("en-IN")}
      </Typography>
    </Box>
  );
};

const OffersSection = ({ numberOfChildren = 1 }) => (
  <Box mt={3}>
    <Typography sx={{ fontWeight: 600, color: "#FF6A00", mb: 1 }} variant="subtitle2">
      OFFERS AVAILABLE
    </Typography>
    <ul style={{ margin: 0 }}>
      {numberOfChildren >= 2 ? (
        <>
          <li>
            <Typography fontSize={14}>
              Save <strong>5%</strong> on the 22 Working Days Plan (for 2+ children).
            </Typography>
          </li>
          <li>
            <Typography fontSize={14}>
              Save <strong>15%</strong> on the 66 Working Days Plan (for 2+ children).
            </Typography>
          </li>
          <li>
            <Typography fontSize={14}>
              Save <strong>20%</strong> on the 132 Working Days Plan (for 2+ children).
            </Typography>
          </li>
        </>
      ) : (
        <>
          <li>
            <Typography fontSize={14}>
              Save <strong>5%</strong> on the 66 Working Days Plan.
            </Typography>
          </li>
          <li>
            <Typography fontSize={14}>
              Save <strong>10%</strong> on the 132 Working Days Plan.
            </Typography>
          </li>
        </>
      )}
      {/* <li>
        <Typography fontSize={14} fontStyle="italic">
          Discounts do not apply to custom date selections.
        </Typography>
      </li> */}
    </ul>
  </Box>
);

export default SubscriptionPlanStep;