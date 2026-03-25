import React, { useState, useEffect, useRef } from "react";
import {
  TextField,
  Button,
  Typography,
  Grid,
  Box,
  Tabs,
  Tab,
  IconButton,
  MenuItem,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CloseIcon from "@mui/icons-material/Close";
import useRegistration from "@hooks/useRegistration";
import CategoryServices from "@services/CategoryServices";
import useAsync from "@hooks/useAsync";
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
    .transform((value, originalValue) =>
      originalValue === "" ? null : value
    )
    .required("Date of Birth is required"),
  lunchTime: yup.string().required("Lunch time is required"),
  school: yup.string().required("School is required"),
  location: yup.string().required("Location is required"),
  childClass: yup.string().required("Child class is required"),
  section: yup.string().required("Section is required"),
  allergies: yup.string(),
});

const lunchTimeOptions = [
  "11:00 AM - 12:00 PM",
  "12:00 PM - 01:00 PM",
];

const RenewChildDetailsStep = ({
  formData,
  setFormData,
  nextStep,
  prevStep,
  _id,
  setChildCount,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [children, setChildren] = useState(
    formData.children.length > 0
      ? formData.children
      : [
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
          },
        ]
  );

  const { submitHandler, loading } = useRegistration();

  const { data: fetchedChildren = [], loading: childrenLoading } = useAsync(() =>
    CategoryServices.getChildren(_id)
  );

  const { data: schools, loading: schoolsLoading } = useAsync(
    CategoryServices.getAllSchools
  );

  const [filteredLocations, setFilteredLocations] = useState([]);

  // Use ref to track if initial load is complete
  const isInitialLoadComplete = useRef(false);

  const getYesterdayDateString = () => {
    const now = new Date();
    now.setDate(now.getDate() - 1);
    return now.toISOString().slice(0, 10);
  };

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
    defaultValues: {
      childFirstName: "",
      childLastName: "",
      dob: "",
      lunchTime: "",
      school: "",
      location: "",
      childClass: "",
      section: "",
      allergies: "",
    },
    resolver: yupResolver(schema),
    mode: "onTouched",
  });

  const watchSchool = watch("school");
  const watchLocation = watch("location");

  // FIXED: Separate useEffect for initial data load from async sources
  useEffect(() => {
    if (
      fetchedChildren?.children?.length > 0 &&
      schools &&
      schools.length > 0 &&
      !isInitialLoadComplete.current
    ) {
      isInitialLoadComplete.current = true;

      const existingKids = fetchedChildren.children.map((child) => ({
        ...child,
        isExisting: true,
      }));

      setChildren(existingKids);
      setFormData((prev) => ({ ...prev, children: existingKids }));
      setChildCount(existingKids.length);

      // Set the first child's data
      const currentChild = existingKids[0];
      resetFormWithChild(currentChild);
    }
  }, [fetchedChildren, schools, setFormData, setChildCount]);

  // FIXED: Separate useEffect for tab changes
  useEffect(() => {
    if (children.length > activeTab && isInitialLoadComplete.current) {
      resetFormWithChild(children[activeTab]);
    }
  }, [activeTab, children]);

  // Helper function to safely reset form with child data
  const resetFormWithChild = (child) => {
    if (!child) return;

    const dobValue =
      child.dob && typeof child.dob === "string"
        ? child.dob.slice(0, 10)
        : child.dob || "";

    reset({
      childFirstName: child.childFirstName || "",
      childLastName: child.childLastName || "",
      dob: dobValue,
      lunchTime: child.lunchTime || "",
      school: child.school || "",
      location: child.location || "",
      childClass: child.childClass || "",
      section: child.section || "",
      allergies: child.allergies || "",
    });
  };

  // FIXED: Update filtered locations when school changes
  useEffect(() => {
    if (watchSchool && schools && schools.length > 0) {
      const schoolLocations = schools
        .filter((school) => school.name === watchSchool)
        .map((school) => school.location);

      const uniqueLocations = [...new Set(schoolLocations)];
      setFilteredLocations(uniqueLocations);

      // Clear location if it's not in the new filtered list
      if (
        watchLocation &&
        !uniqueLocations.includes(watchLocation)
      ) {
        setValue("location", "", { shouldValidate: false });
      }
    } else {
      setFilteredLocations([]);
    }
  }, [watchSchool, schools, setValue, watchLocation]);

  // FIXED: Debounced form sync to children state
  useEffect(() => {
    const subscription = watch((values) => {
      clearTimeout(window.__childUpdateTimer);
      window.__childUpdateTimer = setTimeout(() => {
        setChildren((prev) => {
          const updated = [...prev];
          if (updated[activeTab]) {
            updated[activeTab] = {
              ...updated[activeTab],
              ...values,
              isExisting: updated[activeTab].isExisting ?? false
            };
          }
          return updated;
        });
      }, 300);
    });

    return () => {
      subscription.unsubscribe();
      clearTimeout(window.__childUpdateTimer);
    };
  }, [watch, activeTab]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const addChild = () => {
    if (children.length < 3) {
      const newChild = {
        childFirstName: "",
        childLastName: "",
        dob: "",
        lunchTime: "",
        school: "",
        location: "",
        childClass: "",
        section: "",
        allergies: "",
        isExisting: false,
      };
      setChildren([...children, newChild]);
      setTimeout(() => {
        setActiveTab(children.length);
      }, 0);
    }
  };

  const removeChild = (index) => {
    if (children.length === 1) return;
    const updatedChildren = children.filter((_, i) => i !== index);
    setChildren(updatedChildren);

    let newTabIndex = activeTab;
    if (index === activeTab && activeTab > 0) {
      newTabIndex = activeTab - 1;
    } else if (index < activeTab) {
      newTabIndex = activeTab - 1;
    }
    setActiveTab(newTabIndex);
  };

  const onSubmit = async () => {
    try {
      await Promise.all(
        children.map((child) => schema.validate(child, { abortEarly: false }))
      );

      const res = await submitHandler({
        formData: children,
        path: "step-Form-ChildDetails",
        _id,
      });

      if (res) {
        setFormData({ ...formData, children });
        setChildCount(children.length);
        nextStep();
      }
    } catch (err) {
      if (err.name === "ValidationError") {
        const invalidIndex = children.findIndex((child) => {
          try {
            schema.validateSync(child, { abortEarly: false });
            return false;
          } catch {
            return true;
          }
        });
        if (invalidIndex >= 0) {
          setActiveTab(invalidIndex);
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

  const uniqueSchools = schools ? [...new Set(schools.map((s) => s.name))] : [];

  return (
    <Box
      className="renewchildboxs addchildformbox"
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 2,
      }}
    >
      {/* Image Side */}
      <Box
        className="renewchildLcol"
        sx={{
          width: { xs: "100%", md: "45%" },
          backgroundImage: `url(${stepTwo.src})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          backgroundPosition: "center",
          minHeight: 500,
        }}
      />

      {/* Form Side */}
      <Box className="renewchildRcol" sx={{ width: { xs: "100%", md: "55%" } }}>
        <Typography variant="h5" mb={2} className="renewchildtitle">
          CHILD DETAILS :
        </Typography>

        <Box className="childtabox" sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            className="childtabs"
          >
            {children.map((child, index) => (
              <Tab
                key={index}
                label={
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography>CHILD {index + 1}</Typography>
                    {!child.isExisting && children.length > 1 && (
                      <IconButton
                        className="closeicon"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeChild(index);
                        }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                }
                sx={{
                  bgcolor: activeTab === index ? "#FF6A00" : "transparent",
                  color: activeTab === index ? "#fff" : "inherit",
                }}
              />
            ))}
          </Tabs>

          {children.length < 3 && (
            <Button
              variant="outlined"
              onClick={addChild}
              disabled={children.length >= 3}
              sx={{ ml: 2 }}
            >
              Add Another Child
            </Button>
          )}
        </Box>

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
              />
            </Grid>
          ))}

          {/* Date Picker */}
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
                  value={
                    field.value
                      ? typeof field.value === "string"
                        ? field.value.slice(0, 10)
                        : ""
                      : ""
                  }
                  onChange={(e) => {
                    field.onChange(e.target.value || "");
                  }}
                  inputProps={{ max: getYesterdayDateString() }}
                />
              )}
            />
          </Grid>

          {/* School */}
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
                  disabled={schoolsLoading}
                >
                  <MenuItem value="" disabled>
                    {schoolsLoading ? "Loading schools..." : "Select School"}
                  </MenuItem>
                  {uniqueSchools.map((school) => (
                    <MenuItem value={school} key={school}>
                      {school}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>

          {/* Location */}
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
                  disabled={!watchSchool || filteredLocations.length === 0}
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

          {/* Lunch Time */}
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

          {/* Class */}
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

          {/* Section */}
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

          {/* Allergies */}
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
            />
          </Grid>
        </Grid>

        {/* Buttons */}
        <Box sx={{ mt: 4, display: "flex", gap: 3 }} className="navbtnbox">
          <Button variant="outlined" onClick={prevStep} className="backbtn">
            <span>Back</span>
          </Button>
          <Button type="submit" variant="contained" disabled={loading} className="proceedbtn">
            <span>{loading ? "Processing..." : "Next"}</span>
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default RenewChildDetailsStep;