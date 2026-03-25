import React, { useState, useEffect, useMemo } from "react";
import dayjs from "dayjs";
import {
  Box,
  Typography,
  Grid,
  Tabs,
  Tab,
  IconButton,
  MenuItem,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CloseIcon from "@mui/icons-material/Close";
import useRegistration from "@hooks/useRegistration";
import CategoryServices from "@services/CategoryServices";
import AttributeServices from "@services/AttributeServices";
import useAsync from "@hooks/useAsync";
import WorkingDaysCalendar from "../profile-Step-Form/WorkingDaysCalendar";
import AddChildPayment from "./AddChildPayment";
import { useRouter } from 'next/router';
import stepTwo from "../../../public/profileStepImages/stepTwo.png";

const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;

const schema = yup.object().shape({
  childFirstName: yup
    .string()
    .matches(nameRegex, "Enter a valid name")
    .required("Child's first name is required"),
  childLastName: yup
    .string()
    .matches(nameRegex, "Enter a valid name")
    .required("Child's last name is required"),
  dob: yup
    .date()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .required("Date of Birth is required"),
  lunchTime: yup.string().required("Lunch time is required"),
  school: yup.string().required("School is required"),
  location: yup.string().required("Location is required"),
  childClass: yup.string().required("Child class is required"),
  section: yup.string().required("Section is required"),
  allergies: yup.string(),
});

const lunchTimeOptions = ["11:00 AM - 12:00 PM", "12:00 PM - 01:00 PM"];

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

const getYesterdayDateString = () => {
  const now = new Date();
  now.setDate(now.getDate() - 1);
  return now.toISOString().slice(0, 10);
};

// Helper: earliest valid start date = today + 2 days, then next working day
const getEarliestValidStartDate = (holidays) => {
  let date = dayjs().add(2, "day");
  while (!isWorkingDay(date, holidays)) {
    date = date.add(1, "day");
  }
  return date;
};

const AddChild = ({ _id, onComplete }) => {
  const { data: fetchedChildren = {}, loading: childrenLoading } = useAsync(() =>
    CategoryServices.getChildren(_id, "Add-Child")
  );

  const { data: schools = [], loading: schoolsLoading } = useAsync(
    CategoryServices.getAllSchools
  );
  const { data: holidaysRaw = [], loading: holidaysLoading } = useAsync(
    AttributeServices.getAllHolidays
  );

  const holidayDates = useMemo(
    () => holidaysRaw.map((h) => dayjs(h.date).format("YYYY-MM-DD")),
    [holidaysRaw]
  );

  const activeSubscription = useMemo(
    () => fetchedChildren.activeSubscription || null,
    [fetchedChildren]
  );

  // Build a Set of child ids (as strings) from the current plan (supports populated docs or plain ids)
  const activeSubscriptionChildIdSet = useMemo(() => {
    const list = activeSubscription?.children ?? [];
    const ids = list
      .map((c) => (typeof c === "string" || typeof c === "number" ? c : c?._id))
      .filter(Boolean)
      .map(String);
    return new Set(ids);
  }, [activeSubscription]);

  const [activeTab, setActiveTab] = useState(0);

  const router = useRouter();

  const [children, setChildren] = useState([
    {
      childFirstName: "",
      childLastName: "",
      dob: null,
      lunchTime: "",
      school: "",
      location: "",
      childClass: "",
      section: "",
      allergies: "",
      isExisting: false,
      //   _id: null,
    },
  ]);

  // selectedChildren tracks child _ids or temporary indexes for new children
  // For existing children, the key is _id string
  // For new children without _id, use indexes with prefix `new-`
  const [selectedChildren, setSelectedChildren] = useState({});

  const { submitHandler, loading } = useRegistration();

  useEffect(() => {
    if (fetchedChildren.children?.length > 0) {
      const existingChildren = fetchedChildren.children.map((child) => ({
        ...child,
        isExisting: true,
      }));
      setChildren(existingChildren);

      // Initialize selection for children; ensure children already in plan are NOT marked selected
      const selection = {};
      existingChildren.forEach((child) => {
        const idStr = child._id ? String(child._id) : null;
        selection[child._id] = idStr ? activeSubscriptionChildIdSet.has(idStr) : false;
        if (selection[child._id]) selection[child._id] = false; // force not selected if already in plan
      });
      setSelectedChildren(selection);
    } else {
      setChildren([
        {
          childFirstName: "",
          childLastName: "",
          dob: null,
          lunchTime: "",
          school: "",
          location: "",
          childClass: "",
          section: "",
          allergies: "",
          isExisting: false,
          //   _id: null,
        },
      ]);
      setSelectedChildren({});
    }
  }, [fetchedChildren, activeSubscriptionChildIdSet]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    control,
    setValue,
    setError,
  } = useForm({
    defaultValues: children[activeTab] || {},
    resolver: yupResolver(schema),
    mode: "onTouched",
  });

  const watchSchool = watch("school");

  const [filteredLocations, setFilteredLocations] = useState([]);

  // Log the subscription plan id when available
  useEffect(() => {
    const id = activeSubscription?._id ?? activeSubscription?.id ?? null;
    console.log("Subscription plan id:", activeSubscription);

    if (id) {
      console.log("Subscription plan id:", id);
    } else {
      console.log("Subscription plan id: not available");
    }
  }, [activeSubscription]);


  useEffect(() => {
    if (watchSchool && schools.length) {
      const schoolLocations = schools
        .filter((s) => s.name === watchSchool)
        .map((s) => s.location);
      setFilteredLocations([...new Set(schoolLocations)]);
      if (!schoolLocations.includes(watch("location"))) setValue("location", "");
    } else {
      setFilteredLocations([]);
      setValue("location", "");
    }
  }, [watchSchool, schools, setValue, watch]);

  useEffect(() => {
    if (children.length > 0) {
      const child = {
        ...children[activeTab],
        dob:
          children[activeTab]?.dob && typeof children[activeTab].dob === "string"
            ? children[activeTab].dob.slice(0, 10)
            : "",
      };
      // Preserve error/touched/dirty state so UI errors don't disappear
      reset(child, { keepErrors: true, keepDirty: true, keepTouched: true });

      // Set filteredLocations according to child's school
      if (child.school && schools.length) {
        const schoolLocations = schools
          .filter((s) => s.name === child.school)
          .map((s) => s.location);
        setFilteredLocations([...new Set(schoolLocations)]);
      } else {
        setFilteredLocations([]);
      }
    }
  }, [children, activeTab, reset, schools]);

  useEffect(() => {
    const subscription = watch((values) => {
      clearTimeout(window.__childUpdateTimer);
      window.__childUpdateTimer = setTimeout(() => {
        setChildren((prev) => {
          const updated = [...prev];
          updated[activeTab] = { ...updated[activeTab], ...values };
          return updated;
        });
      }, 300);
    });
    return () => subscription.unsubscribe();
  }, [watch, activeTab]);

  const handleTabChange = (event, newValue) => setActiveTab(newValue);

  const addChild = () => {
    if (children.length < 3) {
      setChildren([
        ...children,
        {
          childFirstName: "",
          childLastName: "",
          dob: null,
          lunchTime: "",
          school: "",
          location: "",
          childClass: "",
          section: "",
          allergies: "",
          isExisting: false,
          //   _id: null,
        },
      ]);
      setActiveTab(children.length);
    }
  };

  const removeChild = (index) => {
    if (children[index]?.isExisting) return;
    if (children.length === 1) return;

    const updated = children.filter((_, i) => i !== index);
    setChildren(updated);

    // Remove selection for this child
    setSelectedChildren((prev) => {
      const newSelection = { ...prev };
      const childToRemove = children[index];
      if (childToRemove._id) {
        delete newSelection[childToRemove._id];
    }
    return newSelection;
  });

    // Calculate new active tab index
    let newActiveTab = activeTab;
    if (index === activeTab && activeTab > 0) {
      newActiveTab = activeTab - 1;
    } else if (index < activeTab) {
      newActiveTab = activeTab - 1;
    }

    setActiveTab(newActiveTab);

    // Important: Reset form with the new active tab's data
    setTimeout(() => {
      const targetChild = updated[newActiveTab];
      if (targetChild) {
        reset({
          ...targetChild,
          dob: targetChild.dob && typeof targetChild.dob === "string"
            ? targetChild.dob.slice(0, 10)
            : "",
        }, { keepErrors: false, keepDirty: false, keepTouched: false });
      }
    }, 0);
  };


  const toggleChildSelection = (index) => {
    const child = children[index];
    if (!child) return;

    // Prevent selection for children already in the plan
    const idStr = child._id ? String(child._id) : null;
    if (idStr && activeSubscriptionChildIdSet.has(idStr)) return;

    const key = child._id || `new-${index}`;
    setSelectedChildren((prev) => {
      const newSelection = { ...prev };
      if (newSelection[key]) {
        delete newSelection[key];
      } else {
        newSelection[key] = true;
      }
      return newSelection;
    });
  };

  const onSubmit = async () => {
    try {
      // Collect only selected children to validate and submit
      const childrenToSubmit = children.filter((child, idx) => {
        const key = child._id || `new-${idx}`;
        return selectedChildren[key];
      });

      if (childrenToSubmit.length === 0) {
        alert("Please select at least one child to submit.");
        return;
      }

      await Promise.all(
        childrenToSubmit.map((child) => schema.validate(child, { abortEarly: false }))
      );

      const res = await submitHandler({
        formData: childrenToSubmit,
        // step: 2,
        path: "step-Form-ChildDetails",
        _id,
      });

      if (res && typeof onComplete === "function") onComplete(childrenToSubmit);
    } catch (err) {
      if (err.name === "ValidationError") {
        // Find first invalid child index among selected children
        const childrenToSubmit = children.filter((child, idx) => {
          const key = child._id || `new-${idx}`;
          return selectedChildren[key];
        });
        const invalidIndex = childrenToSubmit.findIndex((child) => {
          try {
            schema.validateSync(child, { abortEarly: false });
            return false;
          } catch {
            return true;
          }
        });
        if (invalidIndex >= 0) {
          // Find global child index of this invalid child
          const invalidChild = childrenToSubmit[invalidIndex];
          const globalIndex = children.findIndex((c) => c === invalidChild);
          if (globalIndex >= 0) setActiveTab(globalIndex);

          err.inner.forEach((validationError) => {
            setError(validationError.path, {
              type: "manual",
              message: validationError.message,
            });
          });
        }
      }
    }
  };

  const [startCalcDate, setStartCalcDate] = useState(null);
  const [remainingWorkingDays, setRemainingWorkingDays] = useState(0);
  const [calendarOpen, setCalendarOpen] = useState(false);

  useEffect(() => {
    if (
      activeSubscription?.startDate &&
      activeSubscription?.endDate &&
      holidayDates.length > 0
    ) {
      const earliestStart = getEarliestValidStartDate(holidayDates);
      const subscriptionStart = dayjs(activeSubscription.startDate);
      const calcStart = subscriptionStart.isAfter(earliestStart)
        ? subscriptionStart
        : earliestStart;

      if (!startCalcDate || !startCalcDate.isSame(calcStart, "day")) {
        setStartCalcDate(calcStart);
      }

      const count = calculateWorkingDays(
        calcStart,
        dayjs(activeSubscription.endDate),
        holidayDates
      );

      if (remainingWorkingDays !== count) {
        setRemainingWorkingDays(count);
      }
    }
  }, [activeSubscription, holidayDates, startCalcDate, remainingWorkingDays]);

  // Count only newly added selected children (not active subscription children) for amount calculation
  const newSelectedChildrenCount = children.reduce((count, child, idx) => {
    const key = child._id || `new-${idx}`;
    const idStr = child._id ? String(child._id) : null;
    const alreadyInPlan = idStr ? activeSubscriptionChildIdSet.has(idStr) : false;
    if (selectedChildren[key] && !alreadyInPlan) {
      return count + 1;
    }
    return count;
  }, 0);

  // Total amount = 200 ₹ * remaining days * new selected children count
  const totalToPay = newSelectedChildrenCount * remainingWorkingDays * 200;

  // Selected children for payment and guard using Yup's synchronous validateSync
  const selectedChildrenForPayment = useMemo(
    () =>
      children.filter((child, idx) => {
        const key = child._id || `new-${idx}`;
        return selectedChildren[key];
      }),
    [children, selectedChildren]
  );

  const hasInvalidRequired =
    selectedChildrenForPayment.length === 0 ||
    selectedChildrenForPayment.some((c) => {
      try {
        schema.validateSync(c, { abortEarly: false });
        return false;
      } catch (e) {
        return true;
      }
    });

  return (
    <div >
      <Box sx={{ display: "flex", flexDirection: "column" }}>

        {/*<div className='hworkTitle combtntb comtilte textcenter  mb-[5vh]'>
          <h3 className='flex flex-col textFF6514'> <span className='block'>Add Child Details</span> </h3>
          <p className=''>See how our site works as soon as you register <br />and create an account with us.</p>
        </div>*/}

        <Box className="curplanBox" sx={{ mb: 4, p: 2, border: "1px solid #ccc", borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom>
            Subscription Plan Details
          </Typography>
          <Grid className="curplanGrid flex flex-wrap">
            <Grid className="curplanItem">
              <Typography variant="h5"><strong>Current Plan Range</strong></Typography>
              <Typography>
                {activeSubscription && activeSubscription.startDate
                  ? dayjs(activeSubscription.startDate).format("DD MMM YYYY")
                  : "-"} &nbsp;to&nbsp;
                {activeSubscription && activeSubscription.endDate
                  ? dayjs(activeSubscription.endDate).format("DD MMM YYYY")
                  : "-"}
              </Typography>
            </Grid>
            <Grid className="curplanItem">
              <Typography variant="h5"><strong>Total Working Days (Plan)</strong></Typography>
              <Typography>
                {activeSubscription && activeSubscription.startDate && activeSubscription.endDate
                  ? calculateWorkingDays(dayjs(activeSubscription.startDate), dayjs(activeSubscription.endDate), holidayDates)
                  : "-"}
              </Typography>
            </Grid>
            <Grid className="curplanItem">
              <Typography variant="h5"><strong>Remaining Working Days</strong></Typography>
              <Typography>{remainingWorkingDays}</Typography>
            </Grid>
            <Grid className="curplanItem">
              <Typography variant="h5"><strong>Earliest New Plan Start Date</strong></Typography>
              <Typography>{startCalcDate ? startCalcDate.format("DD MMM YYYY") : "-"}</Typography>
            </Grid>
            <Grid className="curplanItem">
              <Typography variant="h5"><strong>New Children Selected</strong></Typography>
              <Typography>{newSelectedChildrenCount}</Typography>
            </Grid>
            <Grid className="curplanItem">
              <Typography variant="h5"><strong>Amount per Day per Child</strong></Typography>
              <Typography>₹ 200</Typography>
            </Grid>
            <Grid className="curplanItem totalamountItem">
              <Typography variant="h5" color="primary" fontWeight="bold">
                Total Amount to Pay
              </Typography>
              <Typography color="primary" fontWeight="bold">
                ₹ {totalToPay}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Box className="addchildformbox"
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
        }}>

        {/* Image Side */}
        <Box
          className="spboximg"
          sx={{
            width: { xs: "100%", md: "40%" },
            backgroundImage: `url(${stepTwo.src})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
            backgroundPosition: "center",
            minHeight: 500,
          }}
        />
        <Box
          sx={{
            width: { xs: "100%", md: "60%" },
          }}>

          {/* Tabs */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }} className="childtabox">
            <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto" className="childtabs">
              {children.map((child, index) => {
                const childIdStr = child._id ? String(child._id) : null;
                const isInActiveSubscription = childIdStr ? activeSubscriptionChildIdSet.has(childIdStr) : false;
                const key = child._id || `new-${index}`;
                return (
                  <Tab
                    className="childsubtab"
                    key={key}
                    label={
                      <Box sx={{ display: "flex", alignItems: "center" }} className="childtablabel">
                        <Typography>CHILD {index + 1}</Typography>
                        {!isInActiveSubscription && (
                          <>
                            <Checkbox
                              checked={!!selectedChildren[key]}
                              onChange={() => toggleChildSelection(index)}
                              size="small"
                              sx={{ ml: 1 }}
                              onClick={(e) => e.stopPropagation()}
                              className="checkbtn"
                            />
                            {!child.isExisting && (
                              <IconButton
                                size="small"
                                className="closeicon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeChild(index);
                                }}
                              >
                                <CloseIcon fontSize="small" />
                              </IconButton>
                            )}
                          </>
                        )}
                      </Box>
                    }
                    sx={{
                      bgcolor: activeTab === index ? "#FF6A00" : "transparent",
                      color: activeTab === index ? "#fff" : "inherit",
                    }}
                  />
                );
              })}
            </Tabs>
            {children.length < 3 && (
              <Button variant="outlined" onClick={addChild} disabled={children.length >= 3} sx={{ ml: 2 }}>
                Add Another Child
              </Button>
            )}
          </Box>

          {/* Form Fields */}
          <Grid container spacing={2} className="childformgrid">
            {[
              ["CHILD'S FIRST NAME*", "childFirstName", "Enter Child's First Name"],
              ["CHILD'S LAST NAME*", "childLastName", "Enter Child's Last Name"],
            ].map(([label, name, placeholder]) => (
              <Grid item xs={12} md={6} key={name}>
                <Typography variant="subtitle2" sx={{ color: "#FF6A00", fontWeight: 600, mb: 1 }}>
                  {label}
                </Typography>
                <TextField
                  fullWidth
                  placeholder={placeholder}
                  {...register(name)}
                  error={!!errors[name]}
                  helperText={errors[name]?.message}
                  disabled={children[activeTab]?.isExisting}
                />
              </Grid>
            ))}

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ color: "#FF6A00", fontWeight: 600, mb: 1 }}>
                DATE OF BIRTH*
              </Typography>
              <Controller
                name="dob"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.dob}
                    helperText={errors.dob?.message}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value || "")}
                    inputProps={{ max: getYesterdayDateString() }}
                    disabled={children[activeTab]?.isExisting}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ color: "#FF6A00", fontWeight: 600, mb: 1 }}>
                SCHOOL*
              </Typography>
              <Controller
                name="school"
                control={control}
                render={({ field }) => (
                  <TextField
                    select
                    fullWidth
                    label="Select School"
                    {...field}
                    error={!!errors.school}
                    helperText={errors.school?.message}
                    disabled={schoolsLoading || children[activeTab]?.isExisting}
                  >
                    <MenuItem value="" disabled>
                      {schoolsLoading ? "Loading schools..." : "Select School"}
                    </MenuItem>
                    {[...new Set(schools.map((s) => s.name))].map((school) => (
                      <MenuItem value={school} key={school}>
                        {school}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ color: "#FF6A00", fontWeight: 600, mb: 1 }}>
                LOCATION*
              </Typography>
              <Controller
                name="location"
                control={control}
                render={({ field }) => (
                  <TextField
                    select
                    fullWidth
                    label="Select Location"
                    {...field}
                    error={!!errors.location}
                    helperText={errors.location?.message}
                    disabled={
                      !watchSchool || filteredLocations.length === 0 || children[activeTab]?.isExisting
                    }
                  >
                    <MenuItem value="" disabled>
                      {!watchSchool
                        ? "Select a school first"
                        : filteredLocations.length === 0
                          ? "No locations available"
                          : "Select Location"}
                    </MenuItem>
                    {filteredLocations.map((location) => (
                      <MenuItem key={location} value={location}>
                        {location}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ color: "#FF6A00", fontWeight: 600, mb: 1 }}>
                CHILD'S LUNCH TIME*
              </Typography>
              <Controller
                name="lunchTime"
                control={control}
                render={({ field }) => (
                  <TextField
                    select
                    fullWidth
                    label="Select Lunch Time"
                    {...field}
                    error={!!errors.lunchTime}
                    helperText={errors.lunchTime?.message}
                    disabled={children[activeTab]?.isExisting}
                  >
                    <MenuItem value="" disabled>
                      Select Lunch Time
                    </MenuItem>
                    {lunchTimeOptions.map((time) => (
                      <MenuItem key={time} value={time}>
                        {time}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ color: "#FF6A00", fontWeight: 600, mb: 1 }}>
                CHILD CLASS*
              </Typography>
              <Controller
                name="childClass"
                control={control}
                render={({ field }) => (
                  <TextField
                    select
                    fullWidth
                    label="Select Class"
                    {...field}
                    error={!!errors.childClass}
                    helperText={errors.childClass?.message}
                    disabled={children[activeTab]?.isExisting}
                  >
                    <MenuItem value="" disabled>
                      Select Class
                    </MenuItem>
                    {[
                      "LKG",
                      "UKG",
                      "Class 1",
                      "Class 2",
                      "Class 3",
                      "Class 4",
                      "Class 5",
                      "Class 6",
                      "Class 7",
                      "Class 8",
                      "Class 9",
                      "Class 10",
                      "Class 11",
                      "Class 12",
                    ].map((grade) => (
                      <MenuItem key={grade} value={grade}>
                        {grade}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ color: "#FF6A00", fontWeight: 600, mb: 1 }}>
                CHILD SECTION*
              </Typography>
              <Controller
                name="section"
                control={control}
                render={({ field }) => (
                  <TextField
                    select
                    fullWidth
                    label="Select Section"
                    {...field}
                    error={!!errors.section}
                    helperText={errors.section?.message}
                    disabled={children[activeTab]?.isExisting}
                  >
                    <MenuItem value="" disabled>
                      Select Section
                    </MenuItem>
                    {["A", "B", "C", "D", "E", "F", "G", "H"].map((section) => (
                      <MenuItem key={section} value={section}>
                        {section}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ color: "#FF6A00", fontWeight: 600, mb: 1 }}>
                DOES THE CHILD HAVE ANY ALLERGIES?
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="If yes, please specify."
                {...register("allergies")}
                error={!!errors.allergies}
                helperText={errors.allergies?.message}
                disabled={children[activeTab]?.isExisting}
              />
            </Grid>
          </Grid>

          {/* Working Days Calendar with toggle */}
          <Box mt={2} className="workingdayscalbox">
            <Button variant="outlined" onClick={() => setCalendarOpen(true)} className="wdaybtn">
              Show Working Days Calendar
            </Button>

            {startCalcDate && (
              <WorkingDaysCalendar
                open={calendarOpen}
                onClose={() => setCalendarOpen(false)}
                startDate={startCalcDate}
                workingDays={remainingWorkingDays}
                holidays={holidayDates}
                hideMessage={true}
              />
            )}
          </Box>

          {/* Navigation Buttons */}
          <Box sx={{ mt: 4, display: "flex", gap: 3 }} className="navbtnbox">
            <Button variant="outlined" onClick={() => { /* Implement back logic */ }} className="backbtn">
              <span>Back</span>
            </Button>

            {hasInvalidRequired ? (
              <Button
                className="proceedbtn"
                variant="contained"
                color="primary"
                disabled
                onClick={() => {
                  // Surface errors on current tab if needed
                  selectedChildrenForPayment.forEach((c) => {
                    try {
                      schema.validateSync(c, { abortEarly: false });
                    } catch (err) {
                      if (err?.inner) {
                        err.inner.forEach((ve) =>
                          setError(ve.path, { type: "manual", message: ve.message })
                        );
                      }
                    }
                  });
                  alert("Please fill all mandatory fields for selected child(ren) before proceeding.");
                }}
              >
                <span>You need to choose a child</span>
              </Button>
            ) : (
              <AddChildPayment
                _id={_id}
                formData={selectedChildrenForPayment}
                subscriptionPlan={activeSubscription}
                totalAmount={totalToPay}
                onError={(msg) => alert(msg)}
                onSuccess={() => {
                  if (typeof onComplete === "function") onComplete(children);
                  router.push("/user/menuCalendarPage");
                }}
              />
            )}
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default AddChild;
