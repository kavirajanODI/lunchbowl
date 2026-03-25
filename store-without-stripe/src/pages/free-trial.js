import React, { useState, useEffect, useRef } from "react";
import {
  TextField,
  MenuItem,
  Button,
  Typography,
  Box,
  FormHelperText,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/system";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import config from "@components/product/config";
import Breadcrumbs from "@layout/Breadcrumbs";
import Mainheader from "@layout/header/Mainheader";
import Mainfooter from "@layout/footer/Mainfooter";

import CategoryServices from "@services/CategoryServices";
import useAsync from "@hooks/useAsync";
import useEmail from "@hooks/useEmail";

import abbanicon1 from "../../public/about/icons/herosec/pink-rounded-lines.svg";
import abbanicon2 from "../../public/about/icons/herosec/pink-smileflower.svg";

const ImageBox = styled(Box)({
  position: "relative",
  width: "100%",
  height: "100%",
  maxHeight: "700px",
  overflow: "hidden",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const FormBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  paddingBottom: theme.spacing(8),
  width: "100%",
}));

const classOptions = [
  "Nursery", "KG", "Class 1", "Class 2", "Class 3", "Class 4", "Class 5",
  "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"
];

export default function FreeTrialPage() {
  const { data: session } = useSession();
  const router = useRouter();

  // Added ref for scrolling
  const formSectionRef = useRef(null);

  // Fetch schools async
  const {
    data: schools,
    loading: schoolsLoading,
    error: schoolsError,
  } = useAsync(CategoryServices.getAllSchools);

  const [formData, setFormData] = useState({
    food: "",
    doorNo: "",
    areaCity: "",
    pincode: "",
    message: "",
    email: session?.user?.email || "",
    mobile: session?.user?.mobile || "",
    altMobile: "",
    name: session?.user?.name || "",
    userId: session?.user?.id || "",
    class: "",
    childName: "",
    school: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [freeTrialTaken, setFreeTrialTaken] = useState(false);
  const { sendEmail, loading: emailLoading, error: emailError } = useEmail();

  useEffect(() => {
    setFormData({
      food: "",
      doorNo: "",
      areaCity: "",
      pincode: "",
      message: "",
      email: session?.user?.email || "",
      mobile: session?.user?.phone || "",
      altMobile: "",
      name: session?.user?.name || "",
      userId: session?.user?.id || "",
      class: "",
      childName: "",
      school: "",
    });
    setErrors({});
    setSubmitted(false);
  }, [session]);

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name || !/^[A-Za-z\s]+$/.test(formData.name.trim()))
      newErrors.name = "Full Name is required and alphabets only";

    if (!formData.childName || !/^[A-Za-z\s]+$/.test(formData.childName.trim()))
      newErrors.childName = "Child Name is required and alphabets only";

    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Valid email is required";

    if (!formData.class) newErrors.class = "Class is required";

    if (!formData.school) {
      newErrors.school = "School selection is required";
    }


    if (!formData.food) newErrors.food = "Please select a dish";

    if (!formData.doorNo || !formData.doorNo.trim())
      newErrors.doorNo = "Door no./Building/Street is required";

    if (!formData.areaCity || !formData.areaCity.trim())
      newErrors.areaCity = "Area/City is required";

    if (!formData.pincode || !/^\d{6}$/.test(formData.pincode))
      newErrors.pincode = "Place enter valid pincode";

    if (formData.altMobile) {
      if (!/^[6789]\d{9}$/.test(formData.altMobile))
        newErrors.altMobile =
          "Alternative Mobile Number must be 10 digits and start with 6,7,8 or 9";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    const [firstName, ...lastNameParts] = (formData.name || "").split(" ");
    const lastName = lastNameParts.join(" ");

    const addressCombined = `Door No./Building/Street: ${formData.doorNo}\nArea/City: ${formData.areaCity}\nPincode: ${formData.pincode}`;

    const emailData = {
      firstName,
      lastName,
      email: formData.email,
      mobileNumber: formData.mobile,
      altMobileNumber: formData.altMobile,
      address: addressCombined,
      className: formData.class,
      schoolName: formData.school,
      childName: formData.childName,
      message: `Dish: ${formData.food}\n${formData.message}`,
      userId: formData.userId,
    };

    try {
      await sendEmail(emailData);
      setSubmitted(true);
      setFreeTrialTaken(true);
      // Scroll to form section after submit
      if (formSectionRef.current) {
        formSectionRef.current.scrollIntoView({ behavior: "smooth" });
      }
      setTimeout(() => {
        router.push("/user/profile-Step-Form");
      }, 5000);
    } catch (err) {
      alert("Thank you for your enquiry! We'll get back to you soon.");
      setSubmitted(true);
      // Also scroll in error case
      if (formSectionRef.current) {
        formSectionRef.current.scrollIntoView({ behavior: "smooth" });
      }
    } finally {
      setLoading(false);
    }
  };

  const renderSchoolOptions = () => {
    if (schoolsLoading) {
      return <MenuItem value="" disabled>Loading schools...</MenuItem>;
    }
    if (schoolsError) {
      return <MenuItem value="" disabled>Error loading schools</MenuItem>;
    }
    if (!schools || schools.length === 0) {
      return <MenuItem value="" disabled>No schools available</MenuItem>;
    }
    return schools.map((school) => (
      <MenuItem key={school._id} value={school.name}>
        {school.name} - {school.location}
      </MenuItem>
    ));
  };

  return (
    <div className="freetrilpage">
      <Mainheader freeTrialTaken={freeTrialTaken} title="Free Trial" description="This is Free Trial page" />
      <div className="pagebody">
        <section className="pagebansec freetrilbanersec relative">
          <div className="container mx-auto relative h-full">
            <div className="pageinconter relative h-full w-full flex items-center">
              <div className="hworkTitle combtntb comtilte">
                <h1 className="flex flex-col textFF6514">
                  <span className="block firstspan">YOUR FIRST </span>
                  <span className="block">BOWL IS ON US</span>
                </h1>
                <p>
                  Worried if your little one will like it? Don’t worry we provide a <br />
                  free trial meal No risk- no commitments absolute !!FREE!!
                </p>
                <Breadcrumbs />
              </div>
            </div>
            <div className="abbanIconss">
              <div className="abbanicn iconone absolute">
                <Image src={abbanicon1} priority alt="Icon" className="iconrotates" />
              </div>
              <div className="abbanicn icontwo absolute">
                <Image src={abbanicon2} priority alt="Icon" />
              </div>
            </div>
          </div>
        </section>

        <section className="freetrilsec relative secpaddblock">
          <div className="container mx-auto relative">
            <Box className="freetrilRow flex">
              {/* Left Image */}
              <Box className="freetrilCol ftLCol">
                <ImageBox className="ftLImg">
                  <Image
                    src={"/LogInSignUp/free-trial-img.jpg"}
                    alt="Free Trial"
                    layout="fill"
                    objectFit="cover"
                    quality={100}
                    priority
                  />
                </ImageBox>
              </Box>

              {/* Right Form */}
              <Box className="freetrilCol ftRCol">
                <FormBox
                  component="form"
                  onSubmit={handleSubmit}
                  ref={formSectionRef}
                >
                  <Typography variant="h4" fontWeight="bold" mb={2}>
                    START YOUR FREE TRIAL
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Provide the required information in the form to get started
                  </Typography>
                  {submitted ? (
                    <Box mt={5}>
                      <Typography variant="h6" color="success.main" gutterBottom>
                        Your order will be delivered on time.
                      </Typography>
                      <Typography>Child Name: {formData.childName}</Typography>
                      <Typography>Dish: {formData.food}</Typography>
                      <Typography>Class: {formData.class}</Typography>
                      <Typography>Address:</Typography>
                      <Typography>{`Door No./Building/Street: ${formData.doorNo}`}</Typography>
                      <Typography>{`Area/City: ${formData.areaCity}`}</Typography>
                      <Typography>{`Pincode: ${formData.pincode}`}</Typography>
                      <Typography>Email: {formData.email}</Typography>
                      <Typography>Mobile: {formData.mobile}</Typography>
                      {formData.altMobile && (
                        <Typography>Alternative Mobile: {formData.altMobile}</Typography>
                      )}
                      <Button
                        sx={{ mt: 3 }}
                        variant="contained"
                        color="primary"
                        onClick={() => router.push("/user/profile-Step-Form")}
                      >
                        Complete your registration
                      </Button>
                    </Box>
                  ) : (
                    <>
                      {/* Full Name */}
                      <Typography variant="subtitle2" className="text-[#FF6514]" mt={2}>
                        FULL NAME*
                      </Typography>
                      <TextField
                        fullWidth
                        value={formData.name}
                        onChange={handleChange("name")}
                        size="small"
                        error={!!errors.name}
                        helperText={errors.name}
                        sx={{ mt: 1 }}
                        />
                      {/* Email */}
                      <Typography variant="subtitle2" mt={2} className="text-[#FF6514]">
                        EMAIL ADDRESS*
                      </Typography>
                      <TextField
                        fullWidth
                        value={formData.email}
                        onChange={handleChange("email")}
                        size="small"
                        error={!!errors.email}
                        helperText={errors.email}
                        sx={{ mt: 1 }}
                        />
                      {/* Mobile (not editable) */}
                      <Typography variant="subtitle2" className="text-[#FF6514]" mt={2}>
                        MOBILE NUMBER*
                      </Typography>
                      <TextField
                        fullWidth
                        value={formData.mobile}
                        size="small"
                        sx={{ mt: 1 }}
                        InputProps={{
                          readOnly: true,
                        }}
                        />
                      {/* Alternative Mobile */}
                      <Typography variant="subtitle2" className="text-[#FF6514]" mt={2}>
                        ALTERNATIVE MOBILE NUMBER
                      </Typography>
                      <TextField
                        fullWidth
                        value={formData.altMobile}
                        onChange={handleChange("altMobile")}
                        size="small"
                        error={!!errors.altMobile}
                        helperText={errors.altMobile}
                        sx={{ mt: 1 }}
                        inputProps={{ maxLength: 10 }}
                        />
                      {/* Child Name */}
                      <Typography variant="subtitle2" className="text-[#FF6514]" mt={2}>
                        CHILD NAME*
                      </Typography>
                      <TextField
                        fullWidth
                        value={formData.childName}
                        onChange={handleChange("childName")}
                        size="small"
                        error={!!errors.childName}
                        helperText={errors.childName}
                        sx={{ mt: 1 }}
                        />
                      {/* Class */}
                      <Typography variant="subtitle2" mt={2} className="text-[#FF6514]">
                        SELECT CLASS*
                      </Typography>
                      <TextField
                        select
                        fullWidth
                        value={formData.class}
                        onChange={handleChange("class")}
                        size="small"
                        error={!!errors.class}
                        helperText={errors.class}
                        sx={{ mt: 1 }}
                      >
                        <MenuItem value="">Select Class</MenuItem>
                        {classOptions.map((cls) => (
                          <MenuItem key={cls} value={cls}>{cls}</MenuItem>
                        ))}
                        </TextField>

                        {/* School */}
                        <Typography variant="subtitle2" mt={2} className="text-[#FF6514]">
                          SELECT SCHOOL*
                        </Typography>

                        <TextField
                          select
                          fullWidth
                          value={formData.school}
                          onChange={handleChange("school")}
                          size="small"
                          error={!!errors.school}
                          helperText={errors.school}
                          sx={{ mt: 1 }}
                        >
                          <MenuItem value="">Select School</MenuItem>
                          {renderSchoolOptions()}
                        </TextField>


                      {/* Food */}
                      <Typography variant="subtitle2" mt={3} className="text-[#FF6514]">
                        SELECT YOUR PREFERRED FOOD*
                      </Typography>
                      <TextField
                        select
                        fullWidth
                        value={formData.food}
                        onChange={handleChange("food")}
                        size="small"
                        error={!!errors.food}
                        helperText={errors.food}
                        sx={{ mt: 1 }}
                      >
                          <MenuItem value="PANEER SHASHLIK WITH HERB RICE">
                            PANEER SHASHLIK WITH HERB RICE
                        </MenuItem>
                        <MenuItem value="COCONUT RICE – BROWN CHANA PORIYAL">
                          COCONUT RICE – BROWN CHANA PORIYAL
                        </MenuItem>
                          <MenuItem value="AGLIO E OLIO PASTA AND GARLIC BREAD">
                            AGLIO E OLIO PASTA AND GARLIC BREAD
                        </MenuItem>
                        <MenuItem value="Paneer Bao - with Butter garlic Sautte Vegetables">
                          PANEER BAO - WITH BUTTER GARLIC SAUTTE VEGETABLES
                        </MenuItem>
                          <MenuItem value="DAL KHICHDI AND BABY POTATO FRY">
                            DAL KHICHDI AND BABY POTATO FRY
                          </MenuItem>
                        </TextField>
                      {/* Address split into three fields */}
                      <Typography variant="subtitle2" mt={3} className="text-[#FF6514]">
                        RESIDENTIAL ADDRESS*
                        </Typography>
                      <TextField
                        fullWidth
                        value={formData.doorNo}
                        onChange={handleChange("doorNo")}
                        size="small"
                        error={!!errors.doorNo}
                        helperText={errors.doorNo}
                        placeholder="Door no./Building/Street"
                        sx={{ mt: 1 }}
                        />
                      <TextField
                        fullWidth
                        value={formData.areaCity}
                        onChange={handleChange("areaCity")}
                        size="small"
                        error={!!errors.areaCity}
                        helperText={errors.areaCity}
                        placeholder="Area/City"
                        sx={{ mt: 1 }}
                        />
                      <TextField
                        fullWidth
                        value={formData.pincode}
                        onChange={handleChange("pincode")}
                        size="small"
                        error={!!errors.pincode}
                        helperText={errors.pincode}
                        placeholder="Pincode"
                        sx={{ mt: 1 }}
                        inputProps={{ maxLength: 6 }}
                        />
                      {/* Message */}
                      <Typography variant="subtitle2" mt={3} className="text-[#FF6514]">
                        MESSAGE
                      </Typography>
                      <TextField
                        fullWidth
                        multiline
                        rows={2}
                        value={formData.message}
                        onChange={handleChange("message")}
                        placeholder="Optional message"
                        size="small"
                        sx={{ mt: 1 }}
                        />
                      {errors.submit && (
                        <FormHelperText error>{errors.submit}</FormHelperText>
                        )}
                      <Button
                        type="submit"
                        variant="contained"
                        color="warning"
                        fullWidth
                        sx={{ mt: 2, py: 1.5 }}
                        disabled={loading || emailLoading}
                        endIcon={(loading || emailLoading) && <CircularProgress size={20} />}
                      >
                        Get Free Trial
                      </Button>
                    </>
                  )}
                </FormBox>
              </Box>
            </Box>
          </div>
        </section>
      </div>
      <Mainfooter />
    </div>
  );
}
