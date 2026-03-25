const bcrypt = require("bcryptjs");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);
const jwt = require("jsonwebtoken");
const {
  signInToken,
  tokenForVerify,
  handleEncryptData,
} = require("../config/auth");
const { sendEmail } = require("../lib/email-sender/sender");
const Admin = require("../models/Admin");
const School = require("../models/School");
const Holiday = require("../models/holidaySchema");
const nodemailer = require("nodemailer");
const Customer = require("../models/Customer");
const { sendSMS } = require("../lib/sms-sender/smsService");
const SmsLog = require("../models/SmsLog");

const registerAdmin = async (req, res) => {
  try {
    const isAdded = await Admin.findOne({ email: req.body.email });
    if (isAdded) {
      return res.status(403).send({
        message: "This Email already Added!",
      });
    } else {
      const newStaff = new Admin({
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
        password: bcrypt.hashSync(req.body.password),
      });
      const staff = await newStaff.save();
      const token = signInToken(staff);
      res.send({
        token,
        _id: staff._id,
        name: staff.name,
        email: staff.email,
        role: staff.role,
        joiningData: Date.now(),
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const admin = await Admin.findOne({ email: req.body.email });
    if (admin && bcrypt.compareSync(req.body.password, admin.password)) {
      if (admin?.status === "Inactive") {
        return res.status(403).send({
          message:
            "Sorry, you don't have the access right now, please contact with Super Admin.",
        });
      }
      const token = signInToken(admin);

      const { data, iv } = handleEncryptData([
        ...admin?.access_list,
        admin.role,
      ]);
      res.send({
        token,
        _id: admin._id,
        name: admin.name,
        phone: admin.phone,
        email: admin.email,
        image: admin.image,
        iv,
        data,
      });
    } else {
      res.status(401).send({
        message: "Invalid Email or password!",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const forgetPassword = async (req, res) => {
  const isAdded = await Admin.findOne({ email: req.body.verifyEmail });
  if (!isAdded) {
    return res.status(404).send({
      message: "Admin/Staff Not found with this email!",
    });
  } else {
    const token = tokenForVerify(isAdded);
    const body = {
      from: process.env.EMAIL_USER,
      to: `${req.body.verifyEmail}`,
      subject: "Password Reset",
      html: `<h2>Hello ${req.body.verifyEmail}</h2>
      <p>A request has been received to change the password for your <strong>lunchBowl</strong> account </p>

        <p>This link will expire in <strong> 15 minute</strong>.</p>

        <p style="margin-bottom:20px;">Click this link for reset your password</p>

        <a href=${process.env.ADMIN_URL}/auth/reset-password/${token}  style="background:#22c55e;color:white;border:1px solid #22c55e; padding: 10px 15px; border-radius: 4px; text-decoration:none;">Reset Password </a>

        
        <p style="margin-top: 35px;">If you did not initiate this request, please contact us immediately at support@lunchBowl.com</p>

        <p style="margin-bottom:0px;">Thank you</p>
        <strong>lunchBowl Team</strong>
             `,
    };
    const message = "Please check your email to reset password!";
    sendEmail(body, res, message);
  }
};

const resetPassword = async (req, res) => {
  const token = req.body.token;
  const { email } = jwt.decode(token);
  const staff = await Admin.findOne({ email: email });

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET_FOR_VERIFY, (err, decoded) => {
      if (err) {
        return res.status(500).send({
          message: "Token expired, please try again!",
        });
      } else {
        staff.password = bcrypt.hashSync(req.body.newPassword);
        staff.save();
        res.send({
          message: "Your password change successful, you can login now!",
        });
      }
    });
  }
};

const addStaff = async (req, res) => {
  // console.log("add staf....", req.body.staffData);
  try {
    const isAdded = await Admin.findOne({ email: req.body.email });
    if (isAdded) {
      return res.status(500).send({
        message: "This Email already Added!",
      });
    } else {
      const newStaff = new Admin({
        name: { ...req.body.name },
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password),
        phone: req.body.phone,
        joiningDate: req.body.joiningDate,
        role: req.body.role,
        image: req.body.image,
        access_list: req.body.access_list,
      });
      await newStaff.save();
      res.status(200).send({
        message: "Staff Added Successfully!",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
    // console.log("error", err);
  }
};

const getAllStaff = async (req, res) => {
  // console.log('allamdin')
  try {
    const admins = await Admin.find({}).sort({ _id: -1 });
    res.send(admins);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getStaffById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    res.send(admin);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const updateStaff = async (req, res) => {
  try {
    const admin = await Admin.findOne({ _id: req.params.id });

    if (admin) {
      admin.name = { ...admin.name, ...req.body.name };
      admin.email = req.body.email;
      admin.phone = req.body.phone;
      admin.role = req.body.role;
      admin.access_list = req.body.access_list;
      admin.joiningData = req.body.joiningDate;
      // admin.password =
      //   req.body.password !== undefined
      //     ? bcrypt.hashSync(req.body.password)
      //     : admin.password;

      admin.image = req.body.image;
      const updatedAdmin = await admin.save();
      const token = signInToken(updatedAdmin);

      const { data, iv } = handleEncryptData([
        ...updatedAdmin?.access_list,
        updatedAdmin.role,
      ]);
      res.send({
        token,
        _id: updatedAdmin._id,
        name: updatedAdmin.name,
        email: updatedAdmin.email,
        image: updatedAdmin.image,
        data,
        iv,
      });
    } else {
      res.status(404).send({
        message: "This Staff not found!",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const deleteStaff = (req, res) => {
  Admin.deleteOne({ _id: req.params.id }, (err) => {
    if (err) {
      res.status(500).send({
        message: err.message,
      });
    } else {
      res.status(200).send({
        message: "Admin Deleted Successfully!",
      });
    }
  });
};

const updatedStatus = async (req, res) => {
  try {
    const newStatus = req.body.status;

    await Admin.updateOne(
      { _id: req.params.id },
      {
        $set: {
          status: newStatus,
        },
      }
    );
    res.send({
      message: `Staff ${newStatus} Successfully!`,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const addSchool = async (req, res) => {
  try {
    const school = new School(req.body);
    await school.save();
    res.status(201).json({
      success: true,
      message: "School created successfully",
      data: school,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllSchools = async (req, res) => {
  try {
    const schools = await School.find({}).sort({ name: 1 });
    res.json(schools);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSchoolById = async (req, res) => {
  try {
    const school = await School.findById(req.params.id);
    if (!school) {
      return res.status(404).json({ message: "School not found" });
    }
    res.json(school);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update school
// @route   PUT /api/schools/update-school/:id
// @access  Private/Admin
const updateSchool = async (req, res) => {
  try {
    const school = await School.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!school) {
      return res.status(404).json({ message: "School not found" });
    }
    res.status(201).json({
      success: true,
      message: "School created successfully",
      data: school,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete school
// @route   DELETE /api/schools/delete-school/:id
// @access  Private/Admin
const deleteSchool = async (req, res) => {
  try {
    const school = await School.findByIdAndDelete(req.params.id);
    if (!school) {
      return res.status(404).json({ message: "School not found" });
    }
    res.json({ message: "School removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a holiday
// @route   POST /api/holidays/add-holiday
// @access  Private/Admin
const addHoliday = async (req, res) => {
  try {
    const { date, name } = req.body;

    // Check if holiday already exists for this date
    const existingHoliday = await Holiday.findOne({ date });
    if (existingHoliday) {
      return res.status(400).json({
        success: false,
        message: "Holiday already exists for this date",
      });
    }

    const holiday = new Holiday({ date, name });
    await holiday.save();

    res.status(201).json({
      success: true,
      message: "Holiday created successfully",
      data: holiday,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all holidays
// @route   GET /api/holidays/get-all-holidays
// @access  Public
const getAllHolidays = async (req, res) => {
  try {
    const holidays = await Holiday.find({}).sort({ date: 1 });
    res.json({
      success: true,
      data: holidays,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update holiday
// @route   PUT /api/holidays/update-holiday/:id
// @access  Private/Admin
const updateHoliday = async (req, res) => {
  try {
    const { date, name } = req.body;
    const holiday = await Holiday.findById(req.params.id);

    if (!holiday) {
      return res.status(404).json({
        success: false,
        message: "Holiday not found",
      });
    }

    // Check if date is being changed and if new date already exists
    if (date && holiday.date.toString() !== new Date(date).toString()) {
      const existingHoliday = await Holiday.findOne({ date });
      if (existingHoliday) {
        return res.status(400).json({
          success: false,
          message: "Holiday already exists for this date",
        });
      }
    }

    holiday.date = date || holiday.date;
    holiday.name = name || holiday.name;
    const updatedHoliday = await holiday.save();

    res.status(200).json({
      success: true,
      message: "Holiday updated successfully",
      data: updatedHoliday,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete holiday
// @route   DELETE /api/holidays/delete-holiday/:id
// @access  Private/Admin
const deleteHoliday = async (req, res) => {
  try {
    const holiday = await Holiday.findByIdAndDelete(req.params.id);
    if (!holiday) {
      return res.status(404).json({
        success: false,
        message: "Holiday not found",
      });
    }
    res.json({
      success: true,
      message: "Holiday removed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// const sendSchoolEnquiryMail = async (req, res) => {
//   try {
//     const {
//       firstName,
//       lastName,
//       mobileNumber,
//       schoolName,
//       message,
//       email,
//       address,
//       userId,
//     } = req.body;

//     // Is this a free trial?
//     const isFreeTrial = schoolName === "Free Trial";
//     let _id = userId;

//     // If it's a free trial, update customer with freeTrial: true
//     if (isFreeTrial && email) {
//       // Update existing customer or create new one if needed
//       await Customer.findOneAndUpdate(
//         { _id },
//         { freeTrial: true, email, firstName, lastName, mobileNumber },
//         { upsert: true, new: true }
//       );
//     }

//     // Email setup
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     const enquiryType = isFreeTrial
//       ? "Free Trial"
//       : schoolName === "Nutrition Enquiry"
//       ? "Nutrition"
//       : "School Service";

//     const subject = isFreeTrial
//       ? `New Free Trial Request from ${firstName} ${lastName}`
//       : `New ${enquiryType} Enquiry from ${firstName} ${lastName}`;

//     // Email content
//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: "shivarex.c@gmail.com, maniyarasanodi20@gmail.com",
//       subject,
//       html: `
//         <h2>${enquiryType} Enquiry</h2>
//         <p><strong>Name:</strong> ${firstName} ${lastName}</p>
//         ${email ? `<p><strong>Email:</strong> ${email}</p>` : ""}
//         <p><strong>Mobile Number:</strong> ${mobileNumber}</p>
//         ${address ? `<p><strong>Address:</strong> ${address}</p>` : ""}
//         ${
//           !isFreeTrial && schoolName && schoolName !== "Nutrition Enquiry"
//             ? `<p><strong>School Name:</strong> ${schoolName}</p>`
//             : ""
//         }
//         <p><strong>Message:</strong> ${
//           message || "No additional message provided"
//         }</p>
//         ${isFreeTrial ? "<p>This is a Free Trial enquiry.</p>" : ""}
//         <br>
//         <p>This enquiry was submitted through the website contact form.</p>
//       `,
//     };

//     // Send email
//     await transporter.sendMail(mailOptions);

//     // Send SMS confirmation for free trial requests
//     if (isFreeTrial && mobileNumber) {
//       try {
//         const date = new Date().toLocaleDateString('en-IN');
//         const location = "as per your preference"; // This could be dynamic based on school/location
//         const childName = `${firstName}'s child`; // Generic since child name might not be available
        
//         const smsResult = await sendSMS(mobileNumber, 'TRIAL_FOOD_CONFIRMATION', [childName, date, location]);
        
//         // Log SMS
//         const smsLog = new SmsLog({
//           mobile: mobileNumber,
//           messageType: 'TRIAL_FOOD_CONFIRMATION',
//           message: smsResult.message || '',
//           templateId: smsResult.templateId || '',
//           messageId: smsResult.messageId || '',
//           status: smsResult.success ? 'sent' : 'failed',
//           error: smsResult.error || undefined,
//           customerId: _id,
//           variables: [childName, date, location],
//           sentAt: new Date()
//         });
        
//         await smsLog.save();
//         console.log('Trial food confirmation SMS sent to:', mobileNumber);
//       } catch (smsError) {
//         console.error('Error sending trial food confirmation SMS:', smsError);
//         // Don't fail the enquiry process if SMS fails
//       }
//     }

//     res.status(200).json({
//       success: true,
//       message: isFreeTrial
//         ? "Free trial request submitted successfully. We will contact you soon."
//         : "Enquiry submitted successfully. We will contact you soon.",
//     });
//   } catch (err) {
//     console.error("Error sending email:", err);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: err.message,
//     });
//   }
// };


const talkNutrition = async (req, res) => {
  const { firstName, lastName, mobileNumber, schoolName, message, email } = req.body;

  // Validate user email
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ success: false, error: "A valid user email is required for thank you mail." });
  }

  // Setup transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Compose the admin/team email
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: "contactus@lunchbowl.co.in, maniyarasanodi20@gmail.com, yourpersonalrd.sujatha@gmail.com, sujatha@nutritureclinic.com",
    subject: "New Nutrition Enquiry Received",
    html: `
      <h2>Nutrition Enquiry Details</h2>
      <p><strong>Name:</strong> ${firstName} ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Mobile:</strong> ${mobileNumber}</p>
      <p><strong>School Name:</strong> ${schoolName}</p>
      <p><strong>Message:</strong> ${message || 'N/A'}</p>
    `,
  };

  // Compose thank you email for the user
  const thankYouMailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Thank you for submitting your Nutrition Form!",
    html: `
      <p>Hello ${firstName} ${lastName},</p>
      <p>Thank you for filling out our Nutrition Form. We’ve received your details and our team will review them carefully to prepare a personalized meal plan that suits your needs.</p>
      <p><em>Note: Your first session is free.</em> One of our nutrition specialists will reach out to you shortly with recommendations and the next steps.</p>
      <br>
      <p>Best regards,<br>Team LunchBowl</p>
    `,
  };

  try {
    // Send admin/team email
    const adminResult = await transporter.sendMail(mailOptions);
    console.log("Nutrition enquiry email sent successfully:", adminResult);

    // Send thank you email to user
    const thankYouResult = await transporter.sendMail(thankYouMailOptions);
    console.log("Thank you mail sent to user:", thankYouResult);

    res.status(200).json({ success: true, message: "Enquiry sent successfully." });
  } catch (error) {
    console.error("Email send error:", error);
    res.status(500).json({ success: false, error: "Failed to send email.", details: error.message });
  }
};


const freeTrialEnquiry = async (req, res) => {
   const {
    firstName,
    lastName,
    email,
    mobileNumber,
    altMobileNumber, // new alternative mobile
    address,        // full combined address string from frontend (optional fallback)
    doorNo,         // new door no/building/street
    areaCity,       // new area/city
    pincode,        // new pincode
    schoolName,
    className,
    message,
    userId,
    childName,
  } = req.body;

  // Update/create customer with freeTrial: true
  let _id = userId;

  console.log("Free trial enquiry received for user:", _id);

  if (email && _id) {
    try {
      const customer = await Customer.findOneAndUpdate(
        { _id },
        { freeTrial: true, email, firstName, lastName, mobileNumber },
        { upsert: true, new: true }
      );
      console.log("Customer updated for free trial:", customer);
    } catch (customerErr) {
      console.error('Error updating customer for free trial:', customerErr);
      // Optionally fail or log only
    }
  }

   // Compose full address from parts if provided  
  let fullAddress = "";
  if (doorNo || areaCity || pincode) {
    fullAddress = `Door No./Building/Street: ${doorNo || ''}\nArea/City: ${areaCity || ''}\nPincode: ${pincode || ''}`;
  } else {
    fullAddress = address || "";
  }

  // Configure nodemailer
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Compose admin notification email
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: "contactus@lunchbowl.co.in, maniyarasanodi20@gmail.com",
    subject: "New Free Trial Enquiry",
    html: `
      <h2>Free Trial Enquiry Received</h2>
      <p><strong>Name:</strong> ${firstName} ${lastName}</p>
      <p><strong>Child Name:</strong> ${childName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>School:</strong> ${schoolName}</p>
      <p><strong>Class:</strong> ${className}</p>
      <p><strong>Address:</strong><br/>${fullAddress.replace(/\n/g, "<br/>")}</p>
      <p><strong>Primary Mobile:</strong> ${mobileNumber}</p>
      <p><strong>Alternative Mobile:</strong> ${altMobileNumber || "N/A"}</p>
      <p><strong>Message:</strong><br/>${message}</p>
      <p>This is a Free Trial enquiry.</p>
      <br>
      <p>This enquiry was submitted through the website contact form.</p>
    `,
  };

  // Compose thank you/feedback request email for parent
  const parentName = `${firstName} ${lastName}`;
  const feedbackMailOptions = {
  from: process.env.EMAIL_USER,
  to: email,
  subject: "ONE BOWL, ENDLESS FRESHNESS—FREE TRIAL INSIDE",
  html: `
    <p>Dear ${parentName},</p>
    <p>Thank you for enquiring about our Lunch Bowl FREE TRIAL.</p>
    <p>As you requested, after verification we will provide you a free trial for your first bowl. Experience the wholesome freshness and taste in one bowl.</p>
    <p>Warm regards,<br/>The Lunch Bowl Team</p>
  `,
};

  try {
    await transporter.sendMail(mailOptions); // Admin mail

    // Send SMS confirmation for free trial (optional, as before)
    if (mobileNumber) {
      try {
        const date = new Date().toLocaleDateString('en-IN');
        const location = "as per your preference";
        const smsChildName = childName || `${firstName}'s child`;

        const smsResult = await sendSMS(mobileNumber, 'TRIAL_FOOD_CONFIRMATION', [smsChildName, date, location]);

        const smsLog = new SmsLog({
          mobile: mobileNumber,
          messageType: 'TRIAL_FOOD_CONFIRMATION',
          message: smsResult.message || '',
          templateId: smsResult.templateId || '',
          messageId: smsResult.messageId || '',
          status: smsResult.success ? 'sent' : 'failed',
          error: smsResult.error || undefined,
          customerId: _id,
          variables: [smsChildName, date, location],
          sentAt: new Date()
        });
        await smsLog.save();
        console.log('Trial food confirmation SMS sent to:', mobileNumber);
      } catch (smsError) {
        console.error('Error sending trial food confirmation SMS:', smsError);
      }
    }

    // Send thank you/feedback mail to user
    await transporter.sendMail(feedbackMailOptions);
    console.log("Thank you/feedback email sent to user:", email);

    res.status(200).json({
      success: true,
      message: "Free trial request submitted successfully. We will contact you soon.",
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, error: "Failed to send email." });
  }
};


// Controller for "Get in Touch" email enquiries
const getInTouch = async (req, res) => {
  const { firstName, lastName, mobileNumber, schoolName, message, email } = req.body;

  // Setup transporter (Gmail example)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,  // Set your email in .env
      pass: process.env.EMAIL_PASS,  // Set your app password in .env
    },
  });

  // Compose the email
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: "contactus@lunchbowl.co.in, maniyarasanodi20@gmail.com", // Change to your desired recipient
    subject: "New General Enquiry Received",
    html: `
      <h2>General Enquiry Details</h2>
      <p><strong>Name:</strong> ${firstName} ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Mobile:</strong> ${mobileNumber}</p>
      <p><strong>School Name:</strong> ${schoolName}</p>
      <p><strong>Message:</strong> ${message || 'N/A'}</p>
    `,
  };

   // Compose thank you email for the user
  const thankYouMailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Thank you for getting in touch with Lunch Bowl!",
    html: `
      <p>Hello ${firstName} ${lastName},</p>
      <p>Thank you for contacting us. We’ve received your enquiry and our team will get back to you shortly.</p>
      <p>Best regards,<br/>Team Lunch Bowl</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("General enquiry email sent successfully --------->", mailOptions);
    
    await transporter.sendMail(thankYouMailOptions);
    console.log("Thank you email sent successfully --------->", thankYouMailOptions);

    res.status(200).json({ success: true, message: "Enquiry sent successfully." });
  } catch (error) {
    console.error("Email send error:", error);
    res.status(500).json({ success: false, error: "Failed to send email." });
  }

};

const contactUs = async (req, res) => {
  const { firstname, Lastname, phone, email, message, consent } = req.body;
  // console.log("res----->", req.body);



  // Set up nodemailer transporter (Gmail with env variables)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Email to admins
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: "contactus@lunchbowl.co.in, maniyarasanodi20@gmail.com",
    subject: "New Contact Us Enquiry",
    html: `
      <h2>Contact Us Enquiry Details</h2>
      <p><strong>Name:</strong> ${firstname} ${Lastname}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Message:</strong> ${message}</p>
    `,
  };

  // Email to user
  const userMailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Thank you for your enquiry!",
    html: `
      <p>Hello ${firstname},</p>
      <p>Thank you for reaching out to us through our enquiry form. We’ve received your request, and our team will get back to you shortly with the details.</p>
      <p>We look forward to assisting you soon.</p>
      <p>Best regards,<br/>Team LunchBowl</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    await transporter.sendMail(userMailOptions);
    res.status(200).json({ success: true, message: "Enquiry sent successfully." });
  } catch (error) {
    console.error("Email send error:", error);
    res.status(500).json({ success: false, error: "Failed to send email.", detail: error.message });
  }
};


const schoolServiceEnquiry = async (req, res) => {
  const { firstName, lastName, mobileNumber, schoolName, pincode, message, email } = req.body;

  // Trim values for reliability
  const cleanFirstName = firstName?.trim();
  const cleanLastName = lastName?.trim();
  const cleanMobileNumber = mobileNumber?.trim();
  const cleanSchoolName = schoolName?.trim();
  const cleanEmail = email?.trim();
  const cleanPincode = pincode?.trim();
  const cleanMessage = message?.trim();

  // Server-side validation
  if (
    !cleanFirstName ||
    !cleanLastName ||
    !cleanMobileNumber ||
    !cleanSchoolName
  ) {
    return res.status(400).json({ success: false, error: "All required fields must be filled." });
  }

  if (!/^[6-9]\d{9}$/.test(cleanMobileNumber)) {
    return res.status(400).json({ success: false, error: "Invalid mobile number." });
  }

  // Optionally validate pincode if it's required
  // if (!cleanPincode || !/^\d{6}$/.test(cleanPincode)) {
  //   return res.status(400).json({ success: false, error: "Invalid pincode." });
  // }

  // Email setup
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: "contactus@lunchbowl.co.in, maniyarasanodi20@gmail.com",
    subject: "New School Service Enquiry Received",
    html: `
      <h2>School Service Enquiry Details</h2>
      <p><strong>Name:</strong> ${cleanFirstName} ${cleanLastName}</p>
      <p><strong>Mobile:</strong> ${cleanMobileNumber}</p>
      <p><strong>School Name:</strong> ${cleanSchoolName}</p>
      ${cleanPincode ? `<p><strong>Pincode:</strong> ${cleanPincode}</p>` : ""}
      <p><strong>Message:</strong> ${cleanMessage || 'N/A'}</p>
    `,
  };

  // Thank-you mail to user, only if email is provided
  const userMailOptions = cleanEmail
    ? {
        from: process.env.EMAIL_USER,
        to: cleanEmail,
        subject: "Thank you for your enquiry!",
        html: `
          <p>Hello ${cleanFirstName},</p>
          <p>Thank you for reaching out to us through our enquiry form. We’ve received your request, and our team will get back to you shortly with the details.</p>
          <p>We look forward to assisting you soon.</p>
          <p>Best regards,<br/>Team LunchBowl</p>
        `,
      }
    : null;

  try {
    await transporter.sendMail(mailOptions);
    console.log("School service enquiry email sent successfully", mailOptions);

    if (userMailOptions) {
      await transporter.sendMail(userMailOptions);
      console.log("Thank you email sent successfully", userMailOptions);
    }

    res.status(200).json({ success: true, message: "Enquiry sent successfully." });
  } catch (error) {
    console.error("Email send error:", error);
    res.status(500).json({ success: false, error: "Failed to send email." });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  forgetPassword,
  resetPassword,
  addStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
  updatedStatus,
  addSchool,
  getAllSchools,
  getSchoolById,
  updateSchool,
  deleteSchool,
  addHoliday,
  getAllHolidays,
  updateHoliday,
  deleteHoliday,
  // sendSchoolEnquiryMail,
  talkNutrition,
  freeTrialEnquiry,
  getInTouch,
  contactUs,
  schoolServiceEnquiry,
};
