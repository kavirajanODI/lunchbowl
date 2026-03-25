import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  Box,
  Typography,
  Divider,
  CircularProgress,
  TextField,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import Mainheader from "@layout/header/Mainheader";
import Mainfooter from "@layout/footer/Mainfooter";
import Accordion from "@components/faq/Accordion";
import { useSession } from "next-auth/react";
import AccountServices from "@services/AccountServices";
import abbanicon1 from "../../../public/enterrequireddetails/redroundedandlines.svg";
import abbanicon2 from "../../../public/enterrequireddetails/yellowroundedflower.svg";
import abbanicon3 from "../../../public/enterrequireddetails/redlittleheart.svg";
import abbanicon4 from "../../../public/enterrequireddetails/lighergreenarrow.svg";
import abbanicon5 from "../../../public/enterrequireddetails/violetyellow-star.svg";
import abbanicon6 from "../../../public/enterrequireddetails/redtriangle.svg";
import abbanicon7 from "../../../public/enterrequireddetails/redlittleflower.svg";
import abbanicon8 from "../../../public/enterrequireddetails/layerflower.svg";
import useAsync from "@hooks/useAsync";
import CategoryServices from "@services/CategoryServices";


const StepHeader = ({ label }) => (
  <Box className="SetpTabNav" sx={{ textAlign: "center", mb: 6 }}>
    <Box
      className="SetpTabul"
      sx={{
        display: "flex",
        columnGap: 2,
        rowGap: 0,
        flexWrap: "wrap",
        justifyContent: "space-between",
        paddingBottom: 2,
        border: 0,
        borderBottomStyle: "dashed",
        borderBottomColor: "#C0C0C0",
        borderBottomWidth: "1px",
      }}
    >
      <Box className="SetpTabli" sx={{ bgcolor: "#FF6A00" }}>
        <Typography sx={{ color: "#fff" }}>{label}</Typography>
      </Box>
    </Box>

    <Box
      sx={{
        height: "2px",
        borderRadius: "4px",
        overflow: "hidden",
        mt: "-2px",
      }}
    >
      <Box
        sx={{
          height: "100%",
          width: "100%",
          backgroundColor: "#FF6A00",
          transition: "width 0.4s ease",
        }}
      />
    </Box>
  </Box>
);

const MyAccount = () => {
  const { data: session } = useSession();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // Editable state for email and mobile
  const [editField, setEditField] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [saving, setSaving] = useState(false);

  const userId = session?.user?.id;

  // ✅ Fetch children list using the Add-Child API
  const { data: fetchedChildren = {}, loading: childrenLoading } = useAsync(() =>
    userId && CategoryServices.getChildren(userId, "Add-Child")
  );

  // Unified get (and update) function using AccountServices
  const fetchAccountDetails = async (updateField, updateValue) => {
    setLoading(true);
    try {
      const updateData =
        updateField && updateValue
          ? { field: updateField, value: updateValue }
          : null;

      const res = await AccountServices.getAccountDetails(userId, updateData);

      // Unwrap Axios response -> API envelope: { success, data: {...} }
      const raw = res?.data ?? res; // handle either axios response or already-unwrapped
      const payload =
        (raw && typeof raw === "object" && ("parentDetails" in raw || "subscriptions" in raw))
          ? raw
          : (raw?.data && typeof raw.data === "object" && ("parentDetails" in raw.data || "subscriptions" in raw.data))
            ? raw.data
            : null;

      if (!payload) throw new Error("Invalid API response shape");

      setUserDetails(payload);
    } catch (err) {
      console.error("Account details fetch failed:", err?.response?.data || err?.message);
      setUserDetails(null);
    } finally {
      setLoading(false);
      setSaving(false);
      setEditField(null);
      setEditValue("");
    }
  };

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    fetchAccountDetails();
    // eslint-disable-next-line
  }, [userId]);

  // Handle edit initiation
  const handleEdit = (field) => {
    setEditField(field);
    setEditValue(
      field === "email"
        ? userDetails?.parentDetails?.email
        : userDetails?.parentDetails?.mobile
    );
  };

  // Handle save
  const handleSave = (field) => {
    if (!editValue) return;
    setSaving(true);
    fetchAccountDetails(field, editValue);
  };

  function formatDate(dateStr) {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("default", { month: "short" }); // e.g. Nov
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }



  // Derived data (no UI changes)
  const subscriptions = userDetails?.subscriptions ?? [];
  const activeSub = subscriptions.find((s) => s.status === "active") || null; // first active [web:22]
  const uniqueChildren = fetchedChildren?.children ?? [];
  const isPaid =
    userDetails?.paymentStatus === "Success" ||
    userDetails?.paymentStatus === true;

  const faqItems = [
    {
      title:
        "In what way are the lunch dishes sealed to keep them fresh and stop leaks?",
      content:
        "Our Lunch dishes are tightly sealed with Plastic free, eco-friendly leak proof and Sugarcane Bagasse Canisters. To preserve freshness and maintain the right temperature until noon, we also use insulated bags for delivery purposes.",
    },
    {
      title: "Can I order meals for a specific day only?",
      content: (
        <>
          Yes, you can order adhoc meals for ₹250 per meal by calling or
          messaging us on <a href="tel:+919176917602">9176 9176 02</a>.
        </>
      ),
    },
    {
      title:
        "Over time, what type of variation can I anticipate in the lunch bowl options?",
      content:
        "We provide a varied and ever-changing menu to keep your child engaged. Our culinary team regularly introduces new recipes and seasonal ingredients to ensure a range of wholesome and appealing options.",
    },
    {
      title:
        "What safeguards are in place to guarantee a clean atmosphere for food preparation?",
      content:
        "Our cooking facilities follow the highest hygiene standards. All surfaces and equipment are routinely sterilized, staff wear protective gear, and adhere to strict handwashing guidelines. Regular inspections are conducted in line with food safety regulations.",
    },
    {
      title:
        "How can I share feedback or resolve any issues with the lunch bowl?",
      content: (
        <>
          We value your feedback. Please contact our customer service team by
          phone at{" "}
          <strong>
            <a href="tel:+919176917602">+91 91769 17602</a>
          </strong>{" "}
          or email us at{" "}
          <strong>
            <a href="mailto:contactus@lunchbowl.co.in">contactus@lunchbowl.co.in</a>
          </strong>
          . We take all complaints seriously and are committed to resolving them
          quickly to ensure your child’s satisfaction.
        </>
      ),
    },
    {
      title:
        "How do you ensure the food is nutritious and safe for my child?",
      content:
        "Our meals are nutritionist-designed, prepared with fresh, high-quality ingredients, and made under strict hygiene standards. We also customize meals for dietary needs and take extra care to avoid allergens.",
    },
    {
      title:
        "How does the delivery process work, and can I trust it will arrive on time?",
      content:
        "We deliver meals directly to schools in temperature-controlled vehicles, scheduled to arrive just before lunchtime. In the rare event of a delay, we’ll notify you immediately.",
    },
    {
      title:
        "What if my child has specific dietary restrictions or allergies?",
      content:
        "We take special care to accommodate dietary restrictions and allergies. Our team follows strict preparation practices to ensure meals are safe and free from cross-contamination.",
    },
    {
      title: "What if I need food on Sunday?",
      content: (
        <>
          Our regular service is available Monday to Friday. If you need meals
          on a Sunday, please call us at{" "}
          <strong>
            <a href="tel:+919176917602">+91 91769 17602</a>
          </strong>{" "}
          in advance. Our team will confirm availability and make special
          arrangements based on your request and location.
        </>
      ),
    },
    {
      title: "Can I get a free trial on Sunday?",
      content:
        "We don’t offer free trials on Sundays. Please choose any weekday or Saturday slot for your trial.",
    },
    {
      title:
        "What if I don’t need a meal on a day during my subscription? Will I get a refund?",
      content:
        "Any unused meal days will be credited to your wallet and can be redeemed during your next subscription.",
    },
    {
      title: "What if I want to terminate the service?",
      content:
        "You can request service termination at any time. The unconsumed meal days will be calculated, and a refund will be processed. Please contact customer service for termination assistance.",
    },
    {
      title: "How do I earn wallet points and where can I see them?",
      content:
        "You earn wallet points when you don’t need a meal on a particular date and delete that meal at least one day in advance using the Delete icon. Each deleted meal’s value is added to your wallet (₹1 = 1 point). You can view your wallet balance under My Account → Wallet, where you’ll find your total points, a 'How It Works' guide, and complete history of points earned and redeemed.",
    },
    {
      title: "When can I redeem my wallet points and is there any limit?",
      content:
        "Wallet points can be redeemed only during subscription renewal. If points are available, a redemption option will appear when selecting your new plan. If your wallet points exceed the renewal amount, only 80% of your wallet value will be applied, and the remaining points will stay in your wallet for future renewals.",
    },
    {
      title: "Can wallet points be transferred or shared?",
      content:
        "No. Wallet points are non-transferable and cannot be shared with another account or another child. Points can only be used by the account holder who earned them.",
    },
    {
      title: "What do I do when I don’t need a meal on a particular day?",
      content:
        "If your child is not attending school on a particular day, you can go to your subscription and delete the meal for that date using the Delete icon. This must be done a day prior. The meal will not be delivered, and the meal value will be automatically added to your wallet.",
    },
  ];

  return (
    <div className="myaccontpage">
      <Mainheader title="My Account" description="User Account Details" />
      <div className="pagebody">
        <section className="pagebansec MyAccbanersec relative">
          <div className="container mx-auto relative h-full">
            <div className="pageinconter relative h-full w-full flex items-center justify-center text-center">
              <div className="hworkTitle combtntb comtilte relative">
                <h1 className="flex flex-row textFF6514">
                  <span className="block">My</span>
                  <span className="block firstspan ml-2">Profile</span>
                </h1>
                <p>Here you can view and update your account details.</p>

                <div className="psfbanIconss">
                  <div className="psfbanicn iconone absolute">
                    <Image src={abbanicon1} priority alt="Icon" className="iconrotates" />
                  </div>
                  <div className="psfbanicn icontwo absolute">
                    <Image src={abbanicon2} priority alt="Icon" className="iconrotates" />
                  </div>
                  <div className="psfbanicn iconthree absolute">
                    <Image src={abbanicon3} priority alt="Icon" className="iconrubberband" />
                  </div>
                  <div className="psfbanicn iconfour absolute">
                    <Image src={abbanicon4} priority alt="Icon" />
                  </div>
                  <div className="psfbanicn iconfive absolute">
                    <Image src={abbanicon5} priority alt="Icon" />
                  </div>
                  <div className="psfbanicn iconsix absolute">
                    <Image src={abbanicon6} priority alt="Icon" className="iconrotates" />
                  </div>
                  <div className="psfbanicn iconseven absolute">
                    <Image src={abbanicon7} priority alt="Icon" className="iconrotates" />
                  </div>
                  <div className="psfbanicn iconeight absolute">
                    <Image src={abbanicon8} priority alt="Icon" className="iconrotates" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="myaccContainer secpaddblock">
          <Box className="container mx-auto relative">
            <StepHeader label="ACCOUNT DETAILS" />

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
                <CircularProgress />
              </Box>
            ) : userDetails ? (
                <Box className="myaccboxitems">
                  {/* Parent Details */}
                  <Box className="myaccboxlist boxone">
                    <h4> Parent Details </h4>
                    <ul>
                      <li>
                        <b>Father's Name:</b>{" "}
                        <p>
                          {userDetails.parentDetails?.fatherFirstName}{" "}
                          {userDetails.parentDetails?.fatherLastName}
                        </p>
                      </li>
                      <li>
                        <b>Mother's Name:</b>{" "}
                        <p>
                          {userDetails.parentDetails?.motherFirstName}{" "}
                          {userDetails.parentDetails?.motherLastName}
                        </p>
                      </li>

                      <li className="editli">
                        <b>Email:</b>{" "}
                        {editField === "email" ? (
                        <p>
                          <TextField
                            size="small"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            sx={{ mr: 1 }}
                          />
                            {/* <IconButton onClick={() => handleSave("email")} color="primary" disabled={saving} size="small">
                            <SaveIcon fontSize="inherit" />
                          </IconButton> */}
                        </p>
                      ) : (
                            <p>
                              {userDetails.parentDetails?.email}
                              {/* <IconButton onClick={() => handleEdit("email")} size="small" sx={{ ml: 1 }}>
                            <EditIcon fontSize="inherit" />
                          </IconButton> */}
                        </p>
                        )}
                      </li>

                      <li className="editli">
                        <b>Mobile:</b>{" "}
                        {editField === "mobile" ? (
                        <p>
                          <TextField
                            size="small"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            sx={{ mr: 1 }}
                          />
                            {/* <IconButton onClick={() => handleSave("mobile")} color="primary" disabled={saving} size="small">
                            <SaveIcon fontSize="inherit" />
                          </IconButton> */}
                        </p>
                      ) : (
                            <p>
                              {userDetails.parentDetails?.mobile}
                              {/* <IconButton onClick={() => handleEdit("mobile")} size="small" sx={{ ml: 1 }}>
                            <EditIcon fontSize="inherit" />
                          </IconButton> */}
                        </p>
                        )}
                      </li>

                      <li>
                        <b>Address:</b>{" "}
                        <p>{userDetails.parentDetails?.address}</p>
                      </li>
                    </ul>
                  </Box>

                  {/* Subscription */}
                  <Box className="myaccboxlist boxtwo">
                    <h4> Subscription </h4>

                    {activeSub ? (
                      <ul>
                        <li>
                          <b>Start Date:</b> <span>{formatDate(activeSub.startDate)}</span>
                        </li>
                        <li>
                          <b>End Date:</b> <span>{formatDate(activeSub.endDate)}</span>
                        </li>
                        <li>
                          <b>Working Days:</b> <span>{activeSub.workingDays}</span>
                        </li>
                        <li>
                          <b>Price:</b> <span>₹{activeSub.price}</span>
                        </li>
                      </ul>
                    ) : (
                      <Typography>No subscription found.</Typography>
                    )}

                    <Typography className="paystaus">
                      <b>Payment Status:</b>{" "}
                      <strong
                        className={`ml-1 ${isPaid ? "paypaid" : "paynotpaid"}`}
                      >
                        {isPaid ? "Paid" : "Not Paid"}
                      </strong>
                    </Typography>
                  </Box>

                  {/* Children */}
                  <Box className="myaccboxlist boxthree ">
                    <h4>Children </h4>
                    <Box className="ChildlistBoxs flex">

                      {childrenLoading ? (
                        <h6>Loading children details...</h6>
                      ) : uniqueChildren && uniqueChildren.length > 0 ? (
                        uniqueChildren.map((child, idx) => (


                      <Box
                        className="ChildlistItems"
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "1.5rem",
                          justifyContent: "flex-start",
                        }}
                          >
                            <table
                              key={child._id || idx}
                              style={{
                              borderCollapse: "collapse",
                              border: "1px solid #ddd",
                            }}
                          >
                            <thead>
                              <tr>
                                <th
                                  colSpan={2}
                                  style={{
                                    backgroundColor: "#f4f4f4",
                                    textAlign: "left",
                                    borderBottom: "1px solid #ddd",
                                  }}
                                >
                                  Child {idx + 1} Details
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                  <td >
                                  <b>Name:</b>
                                </td>
                                  <td >
                                  {child.childFirstName} {child.childLastName}
                                </td>
                              </tr>
                              <tr>
                                  <td >
                                  <b>Date of Birth:</b>
                                </td>
                                  <td >
                                  {formatDate(child.dob)}
                                </td>
                              </tr>
                              <tr>
                                  <td >
                                  <b>School:</b>
                                </td>
                                  <td >
                                  {child.school}
                                </td>
                              </tr>
                              <tr>
                                  <td >
                                  <b>Class:</b>
                                </td>
                                  <td >
                                  {child.childClass}
                                </td>
                              </tr>
                              <tr>
                                  <td >
                                  <b>Section:</b>
                                </td>
                                  <td >
                                  {child.section}
                                </td>
                              </tr>
                              <tr>
                                  <td >
                                  <b>Lunch Time:</b>
                                </td>
                                  <td >
                                  {child.lunchTime}
                                </td>
                              </tr>
                              <tr>
                                  <td >
                                  <b>Location:</b>
                                </td>
                                  <td >
                                  {child.location}
                                </td>
                              </tr>
                              <tr>
                                  <td >
                                  <b>Allergies:</b>
                                </td>
                                  <td >
                                  {child.allergies || "None"}
                                </td>
                              </tr>
                            </tbody>
                          </table>

                          </Box>
                        ))
                        ) : (
                          <h6>No children details available.</h6>
                        )}

                    </Box>
                  </Box>
              </Box>
            ) : (
                  <Box className="notfetchbox">
                    <h4> Could not fetch user details. Please try again later. </h4>
                  </Box>
            )}
          </Box>
        </section>

        <section className="HfaqSec senddesfaq relative bg-4AB138 flex">
          <div className="Hfaqinrow w-full relative py-[12vh]">
            <div className="container mx-auto">
              <div className="faqcontain py-[6vw] px-[8vw] bg-white relative">
                <div className="hfaqTitle combtntb comtilte mb-[4vh]">
                  <h4 className="text-[#000000]">Frequently Asked</h4>
                  <h3 className="flex flex-col text4AB138">
                    <span className="block">Questions</span>
                  </h3>
                </div>
                <div className="hfaqAccordion ">
                  <Accordion items={faqItems} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Mainfooter />
    </div>
  );
};

export default MyAccount;
