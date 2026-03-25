import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  FormHelperText,
  LinearProgress,
  Divider,
  Checkbox,
  Paper,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import EventIcon from "@mui/icons-material/Event";
import dayjs from "dayjs";
import WorkingDaysCalendar from "../profile-Step-Form/WorkingDaysCalendar";
import { useRouter } from "next/router";
import useRegistration from "@hooks/useRegistration";
import AttributeServices from "../../services/AttributeServices";
import useAsync from "../../hooks/useAsync";
import CategoryServices from "../../services/CategoryServices";
import { useSession } from "next-auth/react";
import AccountServices from "@services/AccountServices";
import PriceBreakdownModal from "./PriceBreakdownModal";
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Tooltip from "@mui/material/Tooltip";




const BASE_PRICE_PER_DAY = 200;

// Fetches holidays as ["YYYY-MM-DD", ...]
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

// Always uses minStartDate for plans!
const calculatePlans = (holidays, childCount = 1, minStartDate) => {
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
      startDate: minStartDate,
      endDate: calculateEndDateByWorkingDays(minStartDate, 22, holidays),
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
      startDate: minStartDate,
      endDate: calculateEndDateByWorkingDays(minStartDate, 66, holidays),
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
      startDate: minStartDate,
      endDate: calculateEndDateByWorkingDays(minStartDate, 132, holidays),
    },
  ];
};

const RenewSubscriptionPlanStep = ({
  nextStep,
  prevStep,
  _id,
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
  const { submitHandler, loading } = useRegistration();
  const [showBreakdown, setShowBreakdown] = useState(false);

  const [activeSubscriptionEndDate, setActiveSubscriptionEndDate] = useState(null);
  const { data: session } = useSession();
  const userId = session?.user?.id;

  // ---------------------- ACCOUNT FETCH -----------------------
  const [accountDetails, setAccountDetails] = useState(null);
  const [accountLoading, setAccountLoading] = useState(true);

  const walletPoints = accountDetails?.wallet?.points || 0;

  const [useWallet, setUseWallet] = useState(false);

  const fetchAccountDetails = async () => {
    if (!userId) return;

    setAccountLoading(true);
    try {
      const res = await AccountServices.getAccountDetails(userId);

      const raw = res?.data ?? res;
      const payload =
        (raw && typeof raw === "object" && ("parentDetails" in raw || "subscriptions" in raw))
          ? raw
          : (raw?.data && typeof raw.data === "object" &&
            ("parentDetails" in raw.data || "subscriptions" in raw.data))
            ? raw.data
            : null;

      setAccountDetails(payload);
    } catch (err) {
      console.error("Account details fetch failed:", err);
      setAccountDetails(null);
    } finally {
      setAccountLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchAccountDetails();
    }
  }, [userId]);

  // ------------------------------------------------------------

  // Fetch children for current user
  const { data: childrenList = [], loading: childrenLoading } = useAsync(() =>
    CategoryServices.getChildren(_id)
  );
  const [selectedChildren, setSelectedChildren] = useState([]);

  useEffect(() => {
    if (childrenList && childrenList.length > 0) {
      setSelectedChildren([childrenList[0]._id]);
    }
  }, [childrenList]);

  useEffect(() => {
    if (childrenList?.activeSubscription?.endDate) {
      setActiveSubscriptionEndDate(dayjs(childrenList.activeSubscription.endDate));
    } else {
      setActiveSubscriptionEndDate(null);
    }
  }, [childrenList]);

  // Utility function to find next working day
  const getNextWorkingDay = (date, holidays) => {
    let current = dayjs(date);
    while (!isWorkingDay(current, holidays)) {
      current = current.add(1, "day");
    }
    return current;
  };

  // Calculate minStartDate
  const afterEnd = activeSubscriptionEndDate
    ? activeSubscriptionEndDate.add(1, "day")
    : null;

  const todayPlusTwo = dayjs().add(2, "day");

  let tentativeStartDate;

  if (afterEnd) {
    if (afterEnd.isAfter(todayPlusTwo)) {
      tentativeStartDate = afterEnd;
    } else {
      tentativeStartDate = todayPlusTwo;
    }
  } else {
    tentativeStartDate = todayPlusTwo;
  }

  const minStartDate = getNextWorkingDay(tentativeStartDate, holidays);

  const [selectedPlan, setSelectedPlan] = useState("");
  const [startDate, setStartDate] = useState(minStartDate);
  const [endDate, setEndDate] = useState(null);
  const [errors, setErrors] = useState({
    startDate: false,
    endDate: false,
    dateOrder: false,
  });
  const [hideMessage, setHideMessage] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [agreedError, setAgreedError] = useState(false);
  const [planError, setPlanError] = useState(false);
  const [childError, setChildError] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const numberOfChildren =
    selectedChildren.length > 0 ? selectedChildren.length : 1;

  const plans = useMemo(
    () => calculatePlans(holidays, numberOfChildren, minStartDate),
    [holidays, numberOfChildren, minStartDate]
  );

  useEffect(() => {
    if (selectedPlan !== "byDate") {
      const selectedPlanObj = plans.find((plan) => plan.id.toString() === selectedPlan);
      if (selectedPlanObj) {
        if (!dayjs(startDate).isSame(selectedPlanObj.startDate) || !dayjs(endDate).isSame(selectedPlanObj.endDate)) {
          setStartDate(selectedPlanObj.startDate);
          setEndDate(selectedPlanObj.endDate);
        }
      }
    }
  }, [selectedPlan, plans, startDate, endDate]);

  const handleChildCheckbox = (childId) => {
    setSelectedChildren((prev) => {
      const isSelected = prev.includes(childId);
      if (isSelected) {
        if (prev.length === 1) {
          return prev;
        }
        return prev.filter((id) => id !== childId);
      } else {
        return [...prev, childId];
      }
    });
  };

  const handlePlanChange = (e) => {
    const newPlanId = e.target.value;
    if (selectedPlan === newPlanId) return;

    setSelectedPlan(newPlanId);
    setPlanError(false);
    setErrors({ startDate: false, endDate: false, dateOrder: false });

    const selectedPlanObj = plans.find((plan) => plan.id.toString() === newPlanId);
    if (selectedPlanObj) {
      const payload = {
        planId: newPlanId,
        startDate: selectedPlanObj.startDate,
        endDate: selectedPlanObj.endDate,
      };
      onSubscriptionPlanChange && onSubscriptionPlanChange(payload);
    }
  };

  // ---------------------- HANDLE NEXT ----------------------
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

    let totalWorkingDays, totalPrice, useStartDate, useEndDate;

    if (selectedPlan !== "byDate") {
      const currentPlan = plans.find(
        (plan) => plan.id.toString() === selectedPlan
      );
      totalWorkingDays = currentPlan?.workingDays;
      totalPrice = currentPlan?.price;
      useStartDate = currentPlan?.startDate;
      useEndDate = currentPlan?.endDate;
    } else {
      totalWorkingDays = calculateWorkingDays(startDate, endDate, holidays);
      totalPrice = totalWorkingDays * BASE_PRICE_PER_DAY * numberOfChildren;
      useStartDate = startDate;
      useEndDate = endDate;
    }

    // -------------- WALLET DEDUCTION ADDED HERE ----------------
    let walletUsed = 0;
    let remainingWallet = walletPoints;

    if (useWallet && walletPoints > 0) {

      // 80% MAX REDEEM RULE
      const maxRedeemable = totalPrice * 0.8;

      // Wallet can be used up to min(walletPoints, maxRedeemable)
      walletUsed = Math.min(walletPoints, maxRedeemable);

      // Deduct only allowed wallet from payable
      totalPrice = totalPrice - walletUsed;
      remainingWallet = walletPoints - walletUsed;

    }

    // ------------------------------------------------------------

    const payload = {
      selectedPlan,
      workingDays: totalWorkingDays,
      totalPrice,
      startDate: dayjs(useStartDate).format("YYYY-MM-DD"),
      endDate: dayjs(useEndDate).format("YYYY-MM-DD"),
      children: selectedChildren,

      // ADDED FIELD
      walletUsed,
    };

    try {
      const res = await submitHandler({
        payload,
        path: "step-Form-Renew-SubscriptionPlan",
        _id,
      });
      if (res) {
        nextStep(walletUsed, remainingWallet);

      }
    } catch (error) {
      console.error("Error during subscription plan selection:", error);
    }
  };

  const currentPlan =
    selectedPlan !== "byDate"
      ? plans.find((plan) => plan.id.toString() === selectedPlan)
      : null;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        className="subplnBoxss subplnBoxssrenew"
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
          {childrenLoading && <LinearProgress />}

          {childrenList?.children?.length > 0 && (
            <Box mb={2} className="renewptitlebox">
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }} className="renewplantitle">Select Child*</Typography>
              <div className="childalllistboxs flex items-center">
                {childrenList?.children?.map(child => (
                  <div className="childlistboxs flex items-center">
                    <FormControlLabel className="childlistfbox"
                      key={child._id}
                      control={
                        <Checkbox
                          checked={selectedChildren.includes(child._id)}
                          onChange={() => handleChildCheckbox(child._id)}
                        />
                      }
                      label={`${child.childFirstName} ${child.childLastName}`}
                    />
                  </div>
                ))}
              </div>
              {childError && (
                <FormHelperText error>
                  Please choose the children.
                </FormHelperText>
              )}
            </Box>
          )}

          <Typography sx={{ color: "#FF6A00", fontWeight: 600, mt: 2, mb: 1 }} variant="subtitle2">
            SELECT YOUR SUBSCRIPTION PLAN*{" "}
            <Typography component="span" variant="caption" color="#888">
              (All Taxes included)
            </Typography>
          </Typography>

          <RadioGroup value={selectedPlan} onChange={handlePlanChange} className="radiogroub eachplansboxs">
            <FormControlLabel value="" control={<Radio sx={{ display: "none" }} />} label="" />
            {plans.map((plan) => (
              <Paper
                key={plan.id}
                elevation={selectedPlan === plan.id.toString() ? 8 : 2}
                sx={{
                  borderRadius: "12px",
                  mb: 2,
                  px: 2,
                  py: 2,
                  border: selectedPlan === plan.id.toString() ? "2px solid #FF6A00" : "1px solid #ddd",
                  boxShadow: selectedPlan === plan.id.toString()
                    ? "0 4px 15px rgba(255,106,0,0.07)"
                    : undefined,
                  bgcolor: selectedPlan === plan.id.toString() ? "#FFFAF4" : "#fff",
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
                          color: selectedPlan === plan.id.toString() ? "#FF6A00" : "rgba(0, 0, 0, 0.55)",
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
                </Box>
                {selectedPlan === plan.id.toString() && (
                  <Box mt={2} sx={{ width: "100%" }} className="eachplansOthbox">
                    <Typography fontSize={13} color="#232323">
                      <strong>Start Date:</strong> {plan.startDate && dayjs(plan.startDate).format("DD MMM YYYY")}
                    </Typography>
                    <Typography fontSize={13} color="#232323">
                      <strong>End Date:</strong> {plan.endDate && dayjs(plan.endDate).format("DD MMM YYYY")}
                    </Typography>
                    <Typography fontSize={13} color="#232323">
                      <strong>Total Working Days:</strong> {plan.workingDays}
                    </Typography>
                    {/* <Typography fontSize={13} color="#232323">
                      <strong>Price per day per child:</strong> Rs. {BASE_PRICE_PER_DAY}
                    </Typography> */}
                    {/* {numberOfChildren > 1 && (
                      <>
                        <Typography fontSize={13} color="#232323">
                          <strong>Number of Children:</strong> {numberOfChildren}
                        </Typography>
                        <Typography fontSize={13} color="#232323">
                          <strong>Total Price Calculation:</strong> {plan.workingDays} days × Rs.{" "}
                          {BASE_PRICE_PER_DAY} × {numberOfChildren}
                        </Typography>
                      </>
                    )} */}
                    {plan.discount > 0 && (
                      <Typography fontSize={13} color="#FF6A00" sx={{ mt: 1, fontWeight: 600 }}>
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
          </RadioGroup>

          {/* ---------------- WALLET UI SECTION ---------------- */}
          {walletPoints > 0 && selectedPlan && (
            <Box
              mt={2}
              p={2}
              sx={{
                border: "1px solid #ddd",
                borderRadius: "12px",
                background: "#FFFAF4"
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={useWallet}
                    onChange={(e) => setUseWallet(e.target.checked)}
                    sx={{ color: "#FF6A00", "&.Mui-checked": { color: "#FF6A00" } }}
                  />
                }
                label={
                  <Typography fontSize={14} sx={{ fontWeight: 600 }}>
                    Redeem Wallet Points (Available:{" "}
                    <span style={{ color: "#FF6A00" }}>{walletPoints} points</span>)
                  </Typography>
                }
              />

              {useWallet && (
                <Typography mt={1} fontSize={12} color="#232323">
                  <strong>Note:</strong> Wallet points applied will automatically reduce your final payable amount.
                </Typography>
              )}
            </Box>
          )}
          {/* --------------------------------------------------- */}

          {/* --- SUMMARY TABLE --- */}
          <Box className="overaldetiltable">
            <table >
              <tbody>
                <tr>
                  <td >
                    <strong>No. Of Children’s</strong>
                  </td>
                  <td >{numberOfChildren}</td>
                </tr>

                <tr>
                  <td >
                    <strong>Total - Day / Price</strong>
                  </td>
                  <td >
                    {currentPlan?.workingDays} Days / ₹
                    {currentPlan?.price?.toLocaleString("en-IN")}

                  </td>
                </tr>

                {/* <tr>
                  <td style={{ padding: "10px", borderRight: "1px solid #ddd" }}>
                    <strong>Offer</strong>
                  </td>
                  <td style={{ padding: "10px" }}>
                    {currentPlan?.discount > 0
                      ? `${currentPlan.discount * 100}% OFF`
                      : "No offer"}
                  </td>
                </tr> */}

                <tr>
                  <td >
                    <strong>Wallet</strong>
                  </td>
                  <td >
                    {useWallet
                      ? `Using ${(
                        Math.min(
                          walletPoints,
                          (currentPlan?.price || 0) * 0.8
                        )
                      ).toLocaleString("en-IN")} points`
                      : `${walletPoints.toLocaleString("en-IN")} points available`}

                  </td>
                </tr>

                {/* NEW FIELD → TOTAL TO PAY */}
                <tr>
                  <td >
                    <strong>Total Amount To Pay</strong>

                    {/* Show icon only if plan selected + at least one child */}
                    {/* {selectedPlan && (
                      <Tooltip title="View Detailed Price Breakdown" arrow>
                        <InfoOutlinedIcon
                          onClick={() => setShowBreakdown(true)}
                          sx={{
                            fontSize: 18,
                            color: "#FF6A00",
                            cursor: "pointer",
                            "&:hover": { color: "#ff914d" },
                          }}
                        />
                      </Tooltip>
                    )} */}
                  </td>

                  <td>
                    ₹
                    {(
                      (currentPlan?.price || 0) -
                      (useWallet
                        ? Math.min(walletPoints, (currentPlan?.price || 0) * 0.8)
                        : 0)
                    ).toLocaleString("en-IN")}
                  </td>
                </tr>

              </tbody>
            </table>
            {selectedPlan && (
              <Button
                variant="outlined"
                startIcon={<InfoOutlinedIcon />}
                onClick={() => setShowBreakdown(true)}
                sx={{
                  mt: 2,
                  borderColor: "#FF6A00",
                  color: "#FF6A00",
                  '&:hover': { borderColor: "#ff914d", color: "#ff914d" },
                }}
              >
                <span>View Detailed Price Breakdown</span>
              </Button>
            )}

          </Box>
          {/* --- END SUMMARY TABLE --- */}



          <OffersSection numberOfChildren={numberOfChildren} />

          <Typography mt={2} fontSize={12}>
            <strong>
              Note: Per Day Meal = Rs. {BASE_PRICE_PER_DAY} (No. of Days × Rs. {BASE_PRICE_PER_DAY} × {numberOfChildren} {numberOfChildren > 1 ? "children" : "child"} = Subscription Amount)
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
            {childError && (
              <FormHelperText error>
                Please select at least one child before continuing.
              </FormHelperText>
            )}
            {planError && (
              <FormHelperText error>Please select a subscription plan to proceed.</FormHelperText>
            )}
          </Box>

          <Box className="subbtnrow navbtnbox" sx={{ mt: 4, display: "flex", gap: 3 }}>
            <Button variant="outlined" onClick={prevStep} className="backbtn">
              <span className="nextspan">Back</span>
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              className="nextbtn proceedbtn"
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
            {/* <Button
              variant="outlined"
              sx={{ color: "#FF6A00", borderColor: "#FF6A00" }}
              onClick={() => setShowBreakdown(true)}
            >
              View Detailed Price Breakdown
            </Button> */}

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
      <PriceBreakdownModal
        open={showBreakdown}
        onClose={() => setShowBreakdown(false)}
        numberOfChildren={numberOfChildren}
        currentPlan={currentPlan}
        walletPoints={walletPoints}
        useWallet={useWallet}
        BASE_PRICE_PER_DAY={BASE_PRICE_PER_DAY}
      />
    </LocalizationProvider>
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
    </ul>
  </Box>
);

export default React.memo(RenewSubscriptionPlanStep);
