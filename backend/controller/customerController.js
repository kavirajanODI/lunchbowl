require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Customer = require("../models/Customer");
const UserMeal = require("../models/UserMeal");
const dayjs = require("dayjs");
const nodemailer = require("nodemailer");
const { signInToken, tokenForVerify } = require("../config/auth");
const { sendEmail } = require("../lib/email-sender/sender");
const {
  customerRegisterBody,
} = require("../lib/email-sender/templates/register");
const {
  forgetPasswordEmailBody,
} = require("../lib/email-sender/templates/forget-password");
const { sendVerificationCode } = require("../lib/phone-verification/sender");
const { sendSMS } = require("../lib/sms-sender/smsService");
const SmsLog = require("../models/SmsLog");
const Otp = require("../models/Otp");
// const Form = require("../models/formModel");
const mongoose = require("mongoose");
const HolidayPayment = require("../models/HolidayPayment");
const Form = require("../models/Form");
const Child = require("../models/childModel");
const Subscription = require("../models/subscriptionModel");
const UserPayment = require('../models/Payment');
const { Types: { ObjectId } } = mongoose;

const verifyEmailAddress = async (req, res) => {
  const isAdded = await Customer.findOne({ email: req.body.email });
  if (isAdded) {
    return res.status(403).send({
      message: "This Email already Added!",
    });
  } else {
    const token = tokenForVerify(req.body);
    const option = {
      name: req.body.name,
      email: req.body.email,
      token: token,
    };
    const body = {
      from: process.env.EMAIL_USER,
      // from: "info@demomailtrap.com",
      to: `${req.body.email}`,
      subject: "Email Activation",
      subject: "Verify Your Email",
      html: customerRegisterBody(option),
    };

    const message = "Please check your email to verify your account!";
    sendEmail(body, res, message);
  }
};

const verifyPhoneNumber = async (req, res) => {
  const phoneNumber = req.body.phone;

  // console.log("verifyPhoneNumber", phoneNumber);

  // Check if phone number is provided and is in the correct format
  if (!phoneNumber) {
    return res.status(400).send({
      message: "Phone number is required.",
    });
  }

  // Optional: Add phone number format validation here (if required)
  // const phoneRegex = /^[0-9]{10}$/; // Basic validation for 10-digit phone numbers
  // if (!phoneRegex.test(phoneNumber)) {
  //   return res.status(400).send({
  //     message: "Invalid phone number format. Please provide a valid number.",
  //   });
  // }

  try {
    // Check if the phone number is already associated with an existing customer
    const isAdded = await Customer.findOne({ phone: phoneNumber });

    if (isAdded) {
      return res.status(403).send({
        message: "This phone number is already added.",
      });
    }

    // Generate a random 6-digit verification code
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Send verification code via SMS
    const sent = await sendVerificationCode(phoneNumber, verificationCode);

    if (!sent) {
      return res.status(500).send({
        message: "Failed to send verification code.",
      });
    }

    const message = "Please check your phone for the verification code!";
    return res.send({ message });
  } catch (err) {
    console.error("Error during phone verification:", err);
    res.status(500).send({
      message: err.message,
    });
  }
};

const registerCustomer = async (req, res) => {
  const token = req.params.token;

  try {
    const { name, email, password } = jwt.decode(token);

    // Check if the user is already registered
    const isAdded = await Customer.findOne({ email });

    if (isAdded) {
      const token = signInToken(isAdded);
      return res.send({
        token,
        _id: isAdded._id,
        name: isAdded.name,
        email: isAdded.email,
        password: password,
        message: "Email Already Verified!",
      });
    }

    if (token) {
      jwt.verify(
        token,
        process.env.JWT_SECRET_FOR_VERIFY,
        async (err, decoded) => {
          if (err) {
            return res.status(401).send({
              message: "Token Expired, Please try again!",
            });
          }

          // Create a new user only if not already registered
          const existingUser = await Customer.findOne({ email });
          console.log("existingUser");

          if (existingUser) {
            return res.status(400).send({ message: "User already exists!" });
          } else {
            const newUser = new Customer({
              name,
              email,
              password: bcrypt.hashSync(password),
            });

            await newUser.save();

            // Send signup confirmation SMS if phone number is available
            if (newUser.phone) {
              try {
                const smsResult = await sendSMS(newUser.phone, 'SIGNUP_CONFIRMATION', [newUser.name]);

                // Log SMS
                const smsLog = new SmsLog({
                  mobile: newUser.phone,
                  messageType: 'SIGNUP_CONFIRMATION',
                  message: smsResult.message || '',
                  templateId: smsResult.templateId || '',
                  messageId: smsResult.messageId || '',
                  status: smsResult.success ? 'sent' : 'failed',
                  error: smsResult.error || undefined,
                  customerId: newUser._id,
                  variables: [newUser.name],
                  sentAt: new Date()
                });

                await smsLog.save();
                console.log('Signup confirmation SMS sent to:', newUser.phone);
              } catch (smsError) {
                console.error('Error sending signup confirmation SMS:', smsError);
                // Don't fail registration if SMS fails
              }
            }

            const token = signInToken(newUser);
            res.send({
              token,
              _id: newUser._id,
              name: newUser.name,
              email: newUser.email,
              message: "Email Verified, Please Login Now!",
            });
          }
        }
      );
    }
  } catch (error) {
    console.error("Error during email verification:", error);
    res.status(500).send({
      message: "Internal server error. Please try again later.",
    });
  }
};

const addAllCustomers = async (req, res) => {
  try {
    await Customer.deleteMany();
    await Customer.insertMany(req.body);
    res.send({
      message: "Added all users successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// const loginCustomer = async (req, res) => {
//   try {
//     const customer = await Customer.findOne({ email: req.body.email });

//     // console.log("loginCustomer", req.body.password, "customer", customer);

//     if (
//       customer &&
//       customer.password &&
//       bcrypt.compareSync(req.body.password, customer.password)
//     ) {
//       const token = signInToken(customer);
//       res.send({
//         token,
//         _id: customer._id,
//         name: customer.name,
//         email: customer.email,
//         address: customer.address,
//         phone: customer.phone,
//         image: customer.image,
//       });
//     } else {
//       res.status(401).send({
//         message: "Invalid user or password!",
//         error: "Invalid user or password!",
//       });
//     }
//   } catch (err) {
//     res.status(500).send({
//       message: err.message,
//       error: "Invalid user or password!",
//     });
//   }
// };

const forgetPassword = async (req, res) => {
  const isAdded = await Customer.findOne({ email: req.body.email });
  if (!isAdded) {
    return res.status(404).send({
      message: "User Not found with this email!",
    });
  } else {
    const token = tokenForVerify(isAdded);
    const option = {
      name: isAdded.name,
      email: isAdded.email,
      token: token,
    };

    const body = {
      from: process.env.EMAIL_USER,
      to: `${req.body.email}`,
      subject: "Password Reset",
      html: forgetPasswordEmailBody(option),
    };

    const message = "Please check your email to reset password!";
    sendEmail(body, res, message);
  }
};

const resetPassword = async (req, res) => {
  const token = req.body.token;
  const { email } = jwt.decode(token);
  const customer = await Customer.findOne({ email: email });

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET_FOR_VERIFY, (err, decoded) => {
      if (err) {
        return res.status(500).send({
          message: "Token expired, please try again!",
        });
      } else {
        customer.password = bcrypt.hashSync(req.body.newPassword);
        customer.save();
        res.send({
          message: "Your password change successful, you can login now!",
        });
      }
    });
  }
};

const changePassword = async (req, res) => {
  try {
    // console.log("changePassword", req.body);
    const customer = await Customer.findOne({ email: req.body.email });
    if (!customer.password) {
      return res.status(403).send({
        message:
          "For change password,You need to sign up with email & password!",
      });
    } else if (
      customer &&
      bcrypt.compareSync(req.body.currentPassword, customer.password)
    ) {
      customer.password = bcrypt.hashSync(req.body.newPassword);
      await customer.save();
      res.send({
        message: "Your password change successfully!",
      });
    } else {
      res.status(401).send({
        message: "Invalid email or current password!",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const signUpWithProvider = async (req, res) => {
  try {
    // const { user } = jwt.decode(req.body.params);
    const user = jwt.decode(req.params.token);

    // console.log("user", user);
    const isAdded = await Customer.findOne({ email: user.email });
    if (isAdded) {
      const token = signInToken(isAdded);
      res.send({
        token,
        _id: isAdded._id,
        name: isAdded.name,
        email: isAdded.email,
        address: isAdded.address,
        phone: isAdded.phone,
        image: isAdded.image,
      });
    } else {
      const newUser = new Customer({
        name: user.name,
        email: user.email,
        image: user.picture,
      });

      const signUpCustomer = await newUser.save();
      const token = signInToken(signUpCustomer);
      res.send({
        token,
        _id: signUpCustomer._id,
        name: signUpCustomer.name,
        email: signUpCustomer.email,
        image: signUpCustomer.image,
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const signUpWithOauthProvider = async (req, res) => {
  try {
    // console.log("user", user);
    // console.log("signUpWithOauthProvider", req.body);
    const isAdded = await Customer.findOne({ email: req.body.email });
    if (isAdded) {
      const token = signInToken(isAdded);
      res.send({
        token,
        _id: isAdded._id,
        name: isAdded.name,
        email: isAdded.email,
        address: isAdded.address,
        phone: isAdded.phone,
        image: isAdded.image,
      });
    } else {
      const newUser = new Customer({
        name: req.body.name,
        email: req.body.email,
        image: req.body.image,
      });

      const signUpCustomer = await newUser.save();
      const token = signInToken(signUpCustomer);
      res.send({
        token,
        _id: signUpCustomer._id,
        name: signUpCustomer.name,
        email: signUpCustomer.email,
        image: signUpCustomer.image,
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getAllCustomers = async (req, res) => {
  try {
    const users = await Customer.find({}).sort({ _id: -1 });
    res.send(users);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const getCustomerById = async (req, res) => {
  try {
    const user = await Customer.findById(req.params.id);

    const form = await Form.findOne({ user: req.params.id })
      .populate({
        path: "subscriptions",          // Populate subscriptions
        populate: {
          path: "children",             // Populate children inside each subscription
          model: "Child",
        },
      });

    const customer = { user, form };

    res.send(customer);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};


// Shipping address create or update
const addShippingAddress = async (req, res) => {
  try {
    const customerId = req.params.id;
    const newShippingAddress = req.body;

    // Find the customer by ID and update the shippingAddress field
    const result = await Customer.updateOne(
      { _id: customerId },
      {
        $set: {
          shippingAddress: newShippingAddress,
        },
      },
      { upsert: true } // Create a new document if no document matches the filter
    );

    if (result.nModified > 0 || result.upserted) {
      return res.send({
        message: "Shipping address added or updated successfully.",
      });
    } else {
      return res.status(404).send({ message: "Customer not found." });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getShippingAddress = async (req, res) => {
  try {
    const customerId = req.params.id;
    // const addressId = req.query.id;

    // console.log("getShippingAddress", customerId);
    // console.log("addressId", req.query);

    const customer = await Customer.findById(customerId);
    res.send({ shippingAddress: customer?.shippingAddress });

    // if (addressId) {
    //   // Find the specific address by its ID
    //   const address = customer.shippingAddress.find(
    //     (addr) => addr._id.toString() === addressId.toString()
    //   );

    //   if (!address) {
    //     return res.status(404).send({
    //       message: "Shipping address not found!",
    //     });
    //   }

    //   return res.send({ shippingAddress: address });
    // } else {
    //   res.send({ shippingAddress: customer?.shippingAddress });
    // }
  } catch (err) {
    // console.error("Error adding shipping address:", err);
    res.status(500).send({
      message: err.message,
    });
  }
};

const updateShippingAddress = async (req, res) => {
  try {
    const activeDB = req.activeDB;

    const Customer = activeDB.model("Customer", CustomerModel);
    const customer = await Customer.findById(req.params.id);

    if (customer) {
      customer.shippingAddress.push(req.body);

      await customer.save();
      res.send({ message: "Success" });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const deleteShippingAddress = async (req, res) => {
  try {
    const activeDB = req.activeDB;
    const { userId, shippingId } = req.params;

    const Customer = activeDB.model("Customer", CustomerModel);
    await Customer.updateOne(
      { _id: userId },
      {
        $pull: {
          shippingAddress: { _id: shippingId },
        },
      }
    );

    res.send({ message: "Shipping Address Deleted Successfully!" });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const updateCustomer = async (req, res) => {
  try {
    // Validate the input
    const { name, email, address, phone, image } = req.body;

    // Find the customer by ID
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).send({
        message: "Customer not found!",
      });
    }

    // Check if the email already exists and does not belong to the current customer
    const existingCustomer = await Customer.findOne({ email });
    if (
      existingCustomer &&
      existingCustomer._id.toString() !== customer._id.toString()
    ) {
      return res.status(400).send({
        message: "Email already exists.",
      });
    }

    // Update customer details
    customer.name = name;
    customer.email = email;
    customer.address = address;
    customer.phone = phone;
    customer.image = image;

    // Save the updated customer
    const updatedUser = await customer.save();

    // Generate a new token
    const token = signInToken(updatedUser);

    // Send the updated customer data with the new token
    res.send({
      token,
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      address: updatedUser.address,
      phone: updatedUser.phone,
      image: updatedUser.image,
      message: "Customer updated successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const deleteCustomer = (req, res) => {
  Customer.deleteOne({ _id: req.params.id }, (err) => {
    if (err) {
      res.status(500).send({
        message: err.message,
      });
    } else {
      res.status(200).send({
        message: "User Deleted Successfully!",
      });
    }
  });
};

// Send OTP
const sendOtp = async (req, res) => {
  try {
    const { email, mobile, path } = req.body;

    if (!mobile) {
      return res.status(400).json({ message: "Mobile number is required" });
    }

    // Only allow signUp or logIn for sending OTP
    if (!["signUp", "logIn"].includes(path)) {
      return res.status(400).json({ message: "Invalid path" });
    }

    // Signup flow - number must NOT exist
    if (path === "signUp") {
      const existingUser = await Customer.findOne({ phone: mobile });
      if (existingUser) {
        return res.status(400).json({ message: "Mobile number already registered" });
      }
    }

    if (path === "signUp") {
      const existingUser = await Customer.findOne({ email: email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }
    }

    // Login flow - number MUST exist
    if (path === "logIn") {
      const existingUser = await Customer.findOne({ phone: mobile });
      if (!existingUser) {
        return res.status(400).json({ message: "Mobile number is not registered" });
      }
    }

    // Generate OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 min expiry

    // Remove old OTPs for this mobile
    await Otp.deleteMany({ mobile });

    // Save new OTP
    await Otp.create({ mobile, otp, expiresAt });

    try {
      const smsResult = await sendSMS(mobile, "OTP", [otp]);
      // console.log("OTP SMS Result:", smsResult);

      const smsLog = new SmsLog({
        mobile,
        messageType: "OTP",
        message: smsResult.message || "",
        templateId: smsResult.templateId || "",
        messageId: smsResult.messageId || "",
        status: smsResult.success ? "sent" : "failed",
        error: smsResult.error || undefined,
        variables: [otp],
        sentAt: new Date(),
      });

      await smsLog.save();

      if (smsResult.success) {
        return res.status(200).json({
          success: true,
          message: "OTP sent successfully via SMS",
          smsLogId: smsLog,
          expiresAt,
        });
      } else {
        return res.status(500).json({
          message: "Failed to send OTP. Please try again.",
          error: smsResult.error,
        });
      }
    } catch (smsError) {
      console.error("Error sending OTP SMS:", smsError);
      return res.status(500).json({
        message: "Failed to send OTP. Please try again.",
        error: smsError.message,
      });
    }
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Verify OTP
const verifyOtp = async (req, res) => {
  try {
    const { firstName, lastName, email, mobile, otp, path, freeTrialCheck } = req.body;

    if (!mobile || !otp) {
      return res.status(400).json({ message: "Mobile number and OTP are required" });
    }

    // Only allow signUp-otp or logIn-otp for verification
    if (!["signUp-otp", "logIn-otp"].includes(path)) {
      return res.status(400).json({ message: "Invalid path" });
    }

    const existingOtp = await Otp.findOne({ mobile });
    if (!existingOtp) {
      return res.status(400).json({ message: "OTP not found or expired" });
    }

    if (existingOtp.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (existingOtp.expiresAt < new Date()) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    await Otp.deleteOne({ mobile }); // cleanup after successful verification

    if (path === "signUp-otp") {
      const result = await createCustomer({
        firstName,
        lastName,
        mobile,
        email,
        freeTrialCheck,
      });

      if (email) {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const smsResult = await sendSMS(mobile, 'SIGNUP_CONFIRMATION', [firstName]);


        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: "Welcome to Lunch Bowl – You're All Set!",
          html: `
            <p>Hi ${firstName} ${lastName},</p>
            <p>Your Lunch Bowl account has been successfully created. You can now explore wholesome meals for your child delivered right to their school.</p>
            <p>🎉 Start by selecting your preferred meals:</p>
            <p>🔗 <a href="https://lunchbowl.co.in">lunchbowl.co.in</a></p>
            <p>We’re happy to have you with us!</p>
            <p>– Team Lunch Bowl</p>
          `,
        };

        // Send email (do not block response if fails)
        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            console.error("Sign-Up Completion Mail Error:", err);
          }
        });
      }

      return res.status(200).json(result);
    }

    if (path === "logIn-otp") {
      const result = await loginCustomer(mobile);
      if (result && result.success) {
        return res.status(200).json(result);
      } else {
        return res.status(401).json({
          success: false,
          message: "Login failed",
        });
      }
    }

    return res.status(400).json({ message: "Invalid path" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Create Customer
const createCustomer = async ({ firstName, lastName, mobile, email, freeTrialCheck }) => {
  const newUser = new Customer({
    name: `${firstName} ${lastName}`,
    phone: mobile,
    email,
  });

  await newUser.save();

  const token = signInToken(newUser);

  return {
    success: true,
    token,
    _id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    phone: newUser.phone,
    message: "Registration successful!",
    freeTrialCheck,
  };
};

// Login Customer
const loginCustomer = async (mobile) => {
  try {
    const customer = await Customer.findOne({ phone: mobile });
    if (customer) {
      const token = signInToken(customer);
      return {
        success: true,
        token,
        _id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        freeTrial: customer.freeTrial || false,
        message: "Log in successful!",
      };
    }
    return { success: false, message: "User not found" };
  } catch (error) {
    console.error("Error during login:", error);
    return { success: false, message: "Login failed" };
  }
};




const stepFormRegister = async (req, res) => {
  try {
    const { formData, path, payload, _id, step } = req.body;

    if (!_id || !path) {
      return res
        .status(400)
        .json({ success: false, message: "Missing _id and/or path" });
    }
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user ID format" });
    }

    if (path === "step-Form-ParentDetails") {
      const form = await Form.findOneAndUpdate(
        { user: _id },
        { parentDetails: formData, step },
        { new: true, upsert: true }
      );
      return res.json({ success: true, data: form });
    }

    if (path === "step-Form-ChildDetails") {
      if (!Array.isArray(formData)) {
        return res.status(400).json({ success: false, message: "Invalid children array" });
      }

      const savedChildrenIds = [];

      for (const child of formData) {
        // Ensure the child is linked to this user
        child.user = _id;

        if (child._id && mongoose.Types.ObjectId.isValid(child._id)) {
          // Update existing child by _id and user ownership
          const updatedChild = await Child.findOneAndUpdate(
            { _id: child._id, user: _id },
            child,
            { new: true, runValidators: true } // run validators on update
          );
          if (!updatedChild) {
            // Optional: if not found, maybe create new or throw error
            // Here we can create or handle as per business logic
            const newChild = new Child(child);
            await newChild.save();
            savedChildrenIds.push(newChild._id);
          } else {
            savedChildrenIds.push(updatedChild._id);
          }
        } else {
          // Create new child document
          const newChild = new Child(child);
          await newChild.save();
          savedChildrenIds.push(newChild._id);
        }
      }

      // Update the step in Form only if 'step' is provided
      if (step != null) {
        await Form.findOneAndUpdate(
          { user: _id },
          { $set: { step } },
          { new: true, upsert: true }
        );
      }

      return res.json({ success: true, data: savedChildrenIds });
    }





    if (path === "step-Form-SubscriptionPlan") {
      if (
        !payload ||
        !payload.selectedPlan ||
        !payload.startDate ||
        !payload.endDate ||
        !payload.workingDays ||
        !payload.totalPrice ||
        !Array.isArray(payload.children)
      ) {
        return res
          .status(400)
          .json({ success: false, message: "Missing subscription fields" });
      }

      // Find form with populated subscriptions
      const form = await Form.findOne({ user: _id }).populate("subscriptions").exec();

      // Look for active subscription with same planId
      const existingSubscription = await Subscription.findOne({
        user: _id,
        status: { $in: ["active", "pending_payment"] }
      });


      if (existingSubscription) {
        existingSubscription.planId = payload.selectedPlan;
        existingSubscription.startDate = payload.startDate;
        existingSubscription.endDate = payload.endDate;
        existingSubscription.workingDays = payload.workingDays;
        existingSubscription.price = payload.totalPrice;
        existingSubscription.children = payload.children.map(id =>
          mongoose.Types.ObjectId(id)
        );

        await existingSubscription.save();
      } else {
        const subscription = new Subscription({
          user: _id,
          planId: payload.selectedPlan,
          startDate: payload.startDate,
          endDate: payload.endDate,
          workingDays: payload.workingDays,
          price: payload.totalPrice,
          status: "active",
          children: payload.children.map(id =>
            mongoose.Types.ObjectId(id)
          ),
        });

        await subscription.save();

        await Form.updateOne(
          { user: _id },
          { $push: { subscriptions: subscription._id }, $set: { step } }
        );
      }


      // Return updated form with populated subscriptions and children
      const updatedForm = await Form.findOne({ user: _id })
        .populate({
          path: "subscriptions",
          populate: { path: "children" },
        })
        .exec();

      return res.json({ success: true, data: updatedForm });
    }


    if (path === "step-Form-Renew-SubscriptionPlan") {
      if (
        !payload ||
        !payload.selectedPlan ||
        !payload.startDate ||
        !payload.endDate ||
        !payload.workingDays ||
        !payload.totalPrice ||
        !Array.isArray(payload.children)
      ) {
        return res
          .status(400)
          .json({ success: false, message: "Missing subscription fields" });
      }

      // Retrieve user form with populated subscriptions
      const form = await Form.findOne({ user: _id }).populate("subscriptions").exec();
      if (!form) {
        return res.status(404).json({ success: false, message: "Form not found" });
      }



      // Create new subscription document
      const newSubscription = new Subscription({
        user: _id,
        planId: payload.selectedPlan,
        startDate: payload.startDate,
        endDate: payload.endDate,
        workingDays: payload.workingDays,
        price: payload.totalPrice,
        status: "pending_payment",
        children: payload.children.map((id) => mongoose.Types.ObjectId(id)),
      });
      await newSubscription.save();

      // Push new subscription; only set 'step' if provided
      const update = { $push: { subscriptions: newSubscription._id } };
      if (step != null) {
        update.$set = { step };
      }
      await Form.updateOne({ user: _id }, update);

      // Return updated form with subscriptions and children populated
      const updatedForm = await Form.findOne({ user: _id })
        .populate({
          path: "subscriptions",
          populate: { path: "children" },
        })
        .exec();

      return res.json({ success: true, data: updatedForm });
    }





    if (path === "step-Form-Payment") {
      if (typeof payload.paymentStatus !== "boolean") {
        return res
          .status(400)
          .json({ success: false, message: "Invalid payment status" });
      }
      const updateObj = { paymentStatus: payload.paymentStatus };
      if (payload.paymentStatus) {
        updateObj.subscriptionCount = 1;
        await Form.updateOne(
          { user: _id, "subscriptions.status": "active" },
          {
            $set: {
              "subscriptions.$.paymentDate": new Date(),
              "subscriptions.$.paymentMethod": "CCAvenue",
              "subscriptions.$.transactionId": payload.transactionId || null,
            },
          }
        );
      }

      const form = await Form.findOneAndUpdate(
        { user: _id },
        updateObj,
        { new: true }
      );
      return res.json({ success: true, data: form });
    }

    return res.status(400).json({ success: false, message: "Invalid path" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error: err.message });
  }
};


const localPaymentSuccess = async (req, res) => {
  try {
    const { userId, orderId, transactionId } = req.body;

    if (!userId || !orderId) {
      return res.status(400).json({ success: false, message: "Missing userId or orderId" });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid userId" });
    }

    // Find the form
    const form = await Form.findOne({ user: userId }).populate("subscriptions");
    if (!form) {
      return res.status(404).json({ success: false, message: "Form not found" });
    }

    // Find subscription by orderId
    let subscriptionToUpdate = form.subscriptions.find(sub => sub.orderId === orderId);

    // If not found, fallback to most recent unpaid subscription
    if (!subscriptionToUpdate) {
      subscriptionToUpdate = form.subscriptions
        .filter(sub => !sub.paymentDate)
        .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))[0];
    }

    if (!subscriptionToUpdate) {
      return res
        .status(404)
        .json({ success: false, message: "No suitable subscription found for payment update" });
    }

    // Update the payment details in the subscription
    subscriptionToUpdate.orderId = orderId;
    subscriptionToUpdate.transactionId = transactionId || null;
    subscriptionToUpdate.paymentDate = new Date();
    subscriptionToUpdate.paymentMethod = "CCAvenue";

    await subscriptionToUpdate.save();

    // Update form
    form.paymentStatus = "Success";
    form.step = 4;
    form.subscriptionCount = (form.subscriptionCount || 0) + 1;

    await form.save();

    // Prepare payment transaction data to save in UserPayment
    const paymentTransaction = {
      order_id: orderId,
      tracking_id: transactionId || null,
      amount: subscriptionToUpdate.price || 0, // Adjust according to your schema
      order_status: "Success",
      payment_mode: subscriptionToUpdate.paymentMethod || "CCAvenue",
      card_name: "",
      bank_ref_no: "",
      billing_name: form.parentDetails ? `${form.parentDetails.fatherFirstName} ${form.parentDetails.fatherLastName}` : "",
      billing_email: form.parentDetails?.email || "",
      payment_date: new Date(),
      merchant_param1: userId,
      payment_type: "subscription-local",
    };

    console.log("Recording payment transaction:", paymentTransaction);


    // Upsert payment record
    const testing = await UserPayment.findOneAndUpdate(
      { user: userId },
      {
        $push: { payments: paymentTransaction },
        $inc: { total_amount: paymentTransaction.amount },
        $setOnInsert: { created_at: new Date() }
      },
      { upsert: true, new: true, runValidators: true }
    );

    console.log("UserPayment upsert result:", testing);


    return res.json({ success: true, data: form });
  } catch (err) {
    console.error("Local payment success error:", err);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


const localAddChildPaymentController = async (req, res) => {
  try {
    const { userId, orderId, transactionId, formData, planId } = req.body;

    if (!userId || !orderId || !planId) {
      return res.status(400).json({ success: false, message: "Missing userId, orderId or planId" });
    }
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(planId)) {
      return res.status(400).json({ success: false, message: "Invalid userId or planId" });
    }

    const form = await Form.findOne({ user: userId }).populate("subscriptions");
    if (!form) {
      return res.status(404).json({ success: false, message: "Form not found" });
    }

    // Find subscription by _id (planId)
    let subscription = form.subscriptions.find(
      (sub) => sub._id.toString() === planId.toString()
    );
    if (!subscription) {
      return res.status(404).json({ success: false, message: "Subscription not found" });
    }

    // Save or update children from formData if provided
    const savedChildrenIds = [];
    if (Array.isArray(formData) && formData.length > 0) {
      for (const child of formData) {
        if (!child.location || child.location.trim() === "") {
          return res.status(400).json({
            success: false,
            message: `Child location is required for ${child.childFirstName || "unknown"}`,
          });
        }
        child.user = userId;
        if (child._id && mongoose.Types.ObjectId.isValid(child._id)) {
          const updatedChild = await Child.findOneAndUpdate(
            { _id: child._id, user: userId },
            child,
            { new: true, runValidators: true }
          );
          if (updatedChild) {
            savedChildrenIds.push(updatedChild._id);
          } else {
            const newChild = new Child(child);
            await newChild.save();
            savedChildrenIds.push(newChild._id);
          }
        } else {
          const newChild = new Child(child);
          await newChild.save();
          savedChildrenIds.push(newChild._id);
        }
      }
    }

    // Initialize subscription children if not present
    if (!Array.isArray(subscription.children)) {
      subscription.children = [];
    }

    // Add new children IDs to subscription, avoid duplicates
    savedChildrenIds.forEach((childId) => {
      if (!subscription.children.some((cId) => cId.toString() === childId.toString())) {
        subscription.children.push(childId);
      }
    });

    // Update payment info on subscription
    subscription.orderId = orderId;
    subscription.transactionId = transactionId || null;
    subscription.paymentDate = new Date();
    subscription.paymentMethod = "CCAvenue";

    await subscription.save();

    // Update form payment status without changing step
    form.paymentStatus = "Success";
    form.subscriptionCount = (form.subscriptionCount || 0) + 1;

    await form.save();

    // Record payment in UserPayment
    const paymentTransaction = {
      order_id: orderId,
      tracking_id: transactionId || null,
      amount: subscription.price || 0, // Adjust to your schema field
      order_status: "Success",
      payment_mode: subscription.paymentMethod || "CCAvenue",
      card_name: "",
      bank_ref_no: "",
      billing_name: form.parentDetails ? `${form.parentDetails.fatherFirstName} ${form.parentDetails.fatherLastName}` : "",
      billing_email: form.parentDetails?.email || "",
      payment_date: new Date(),
      merchant_param1: userId,
      payment_type: "subscription-local-addchild",
    };

    await UserPayment.findOneAndUpdate(
      { user: userId },
      {
        $push: { payments: paymentTransaction },
        $inc: { total_amount: paymentTransaction.amount },
        $setOnInsert: { created_at: new Date() }
      },
      { upsert: true, new: true, runValidators: true }
    );

    // Return updated form with populated subscriptions and children
    const updatedForm = await Form.findById(form._id)
      .populate({
        path: "subscriptions",
        populate: { path: "children" },
      });

    return res.json({ success: true, data: updatedForm });
  } catch (err) {
    console.error("Local add child payment error:", err);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


const activateNextSubscriptionPlans = async () => {
  const now = new Date();

  // Find forms with active subscriptions that have ended
  const forms = await Form.find({
    "subscriptions.status": "active",
    "subscriptions.endDate": { $lt: now }
  });

  for (const form of forms) {
    // Deactivate the ended active plan
    await Form.updateOne(
      { _id: form._id, "subscriptions.status": "active", "subscriptions.endDate": { $lt: now } },
      { $set: { "subscriptions.$.status": "deactivated" } }
    );

    // Find the next upcoming plan where startDate is <= now (time to activate)
    const nextPlanIndex = form.subscriptions.findIndex(
      sub => sub.status === "upcoming" && sub.startDate <= now
    );
    if (nextPlanIndex !== -1) {
      // Activate the next plan only when its startDate has arrived or passed
      const subsKey = `subscriptions.${nextPlanIndex}.status`;
      await Form.updateOne(
        { _id: form._id },
        { $set: { [subsKey]: "active" } }
      );
    }
  }
};

// const getAllChildrenForUser = async (req, res) => {
//   try {
//     const { userId } = req.body;

//     if (!userId) {
//       return res
//         .status(400)
//         .json({ message: "Missing userId in request body" });
//     }

//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//       return res
//         .status(400)
//         .json({ message: "Invalid userId format" });
//     }

//     const children = await Child.find({ user: userId });

//     // Fetch the current active subscription (if any)
//     const activeSubscription = await Subscription.findOne({
//       user: userId,
//       status: "active"
//     }).sort({ endDate: -1 }); // In case multiple, prefer the latest ending

//     // Optionally pick specific fields if needed:
//     // const activeSubscription = await Subscription.findOne({ ... }).select('endDate startDate planId ...')

//     res.json({
//       success: true,
//       children,
//       activeSubscription // Will be null if none found
//     });
//   } catch (error) {
//     res
//       .status(500)
//       .json({
//         message: "Failed to get children",
//         error: error.message
//       });
//   }
// };


// Strict validator that rejects edge-case strings that ObjectId.isValid may accept
const isValidObjectIdStrict = (v) =>
  ObjectId.isValid(v) && new ObjectId(v).toString() === String(v);

// inside your handler:
const getAllChildrenForUser = async (req, res) => {
  try {
    const { userId, path } = req.body; // <-- read optional flag
    console.log("getAllChildrenForUser called with path:", path);

    if (!userId) {
      return res.status(400).json({ message: "Missing userId in request body" });
    }
    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId format" });
    }

    const userObjectId = mongoose.Types.ObjectId(userId);

    // 🧹 STEP 1: Cleanup pending_payment subscriptions before doing anything else
    const pendingSubs = await Subscription.find({
      user: userObjectId,
      status: "pending_payment",
    }).select("_id");

    if (pendingSubs.length > 0) {
      const pendingIds = pendingSubs.map((s) => s._id);

      // 🗑️ Delete from Subscription collection
      await Subscription.deleteMany({ _id: { $in: pendingIds } });

      // 🧩 Remove from Form.subscriptions array
      await Form.updateOne(
        { user: userObjectId },
        { $pull: { subscriptions: { $in: pendingIds } } }
      );

      console.log(
        `Cleaned up ${pendingIds.length} pending_payment subscriptions for user ${userId}`
      );
    }

    // STEP 2: Fetch all children for the user
    const children = await Child.find({ user: userId });

    // STEP 3: Find form (after cleanup)
    const form = await Form.findOne({ user: userId })
      .select("subscriptions")
      .lean();

    let activeSubscription = null;

    // STEP 4: If Add-Child path, find active subscription
    if (
      path === "Add-Child" &&
      form &&
      Array.isArray(form.subscriptions) &&
      form.subscriptions.length > 0
    ) {
      console.log("Looking for truly active subscription for Add_Child path");

      const validIds = form.subscriptions.filter(isValidObjectIdStrict);
      if (validIds.length > 0) {
        const now = new Date();
        activeSubscription = await Subscription.findOne({
          _id: { $in: validIds },
          $or: [
            { status: "active" },
            { startDate: { $lte: now }, endDate: { $gte: now } },
          ],
        })
          .sort({ startDate: -1, createdAt: -1 }) // prefer latest active
          .populate({ path: "children" })
          .lean();
      }
    }

    // STEP 5: Fallback — last valid subscription
    if (
      !activeSubscription &&
      form &&
      Array.isArray(form.subscriptions) &&
      form.subscriptions.length > 0
    ) {
      console.log("Falling back to last valid subscription ID");

      let lastValidId = null;
      for (let i = form.subscriptions.length - 1; i >= 0; i--) {
        const candidate = form.subscriptions[i];
        if (isValidObjectIdStrict(candidate)) {
          lastValidId = candidate;
          break;
        }
      }

      if (lastValidId) {
        activeSubscription = await Subscription.findById(lastValidId)
          .populate({ path: "children" })
          .lean();
      }
    }

    return res.json({
      success: true,
      children,
      activeSubscription,
    });
  } catch (error) {
    console.error("Error in getAllChildrenForUser:", error);
    return res.status(500).json({
      message: "Failed to get children",
      error: error.message,
    });
  }
};




const getPaymentsForUser = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "Missing userId in request body" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId format" });
    }

    // Fetch payment document for the user
    const paymentDoc = await UserPayment.findOne({ user: userId });

    if (!paymentDoc) {
      return res.status(404).json({ message: "No payment data found for user" });
    }

    res.json({
      success: true,
      payments: paymentDoc.payments,
      total_payments: paymentDoc.total_payments,
      total_amount: paymentDoc.total_amount,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get payment details",
      error: error.message,
    });
  }
};

const handleCCAvenueResponse = async (req, res) => {
  try {
    const { encResponse } = req.body;

    if (!encResponse) {
      return res
        .status(400)
        .json({ success: false, message: "No response data received" });
    }

    // Decrypt logic would be here, but it's better in the route file
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("CCAvenue response error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const verifyCCAvenuePayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    const form = await Form.findOne({ "subscriptionPlan.orderId": orderId });

    if (!form) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: form.paymentStatus,
      message: form.paymentStatus
        ? "Payment verified successfully"
        : "Payment not verified",
      data: form,
    });
  } catch (error) {
    console.error("Payment verification failed:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const stepCheck = async (req, res) => {
  try {
    const _id = req.body._id;

    if (!_id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const form = await Form.findOne({ user: mongoose.Types.ObjectId(_id) });

    const customer = await Customer.findById(_id);

    const freeTrial = customer ? customer.freeTrial : false;

    // If form not found, return step 1 as default
    // If found, return the form's step
    const step = form ? form.step : 1;

    res.status(200).json({
      success: true, data: {
        step,
        freeTrial,
      },
    });
  } catch (error) {
    console.error("Error in stepCheck:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

async function rollSubscriptionsForUserNoSession(userId) {
  // Start-of-day so endDate is treated as inclusive for the entire calendar day
  const today = new Date();
  today.setHours(0, 0, 0, 0); // normalize to local 00:00:00.000 [web:7]

  // 1) Deactivate any expired 'active' subscriptions (ended before today)
  await Subscription.updateMany(
    { user: userId, status: "active", endDate: { $lt: today } },
    { $set: { status: "deactivated" } }
  ); // bulk update without sessions [web:23]

  // 2) If there is no active subscription, activate the earliest eligible upcoming
  const hasActive = await Subscription.exists({ user: userId, status: "active" }); // quick existence check [web:30]
  if (!hasActive) {
    await Subscription.findOneAndUpdate(
      { user: userId, status: "upcoming", startDate: { $lte: today } },
      { $set: { status: "active" } },
      {
        sort: { startDate: 1 },   // pick the earliest upcoming that has started
        new: true,                // return updated doc if you want it
      }
    ); // single-doc atomic update with sort [web:6]
    // If no upcoming matches, nothing happens (as requested)
  }
}

// Your handler with the auto-roller added (no sessions)
const getMenuCalendarDate = async (req, res) => {
  try {
    const { _id } = req.body;
    if (!_id) {
      return res.status(400).json({ success: false, message: "User ID required" });
    }

    const userId = mongoose.Types.ObjectId(_id);

    // Run status roller first (no transaction/session)
    await rollSubscriptionsForUserNoSession(userId);

    // 🧹 STEP 1: Find pending payment subscriptions (to delete)
    const pendingSubs = await Subscription.find({
      user: userId,
      status: "pending_payment",
    }).select("_id");

    if (pendingSubs.length > 0) {
      const pendingIds = pendingSubs.map((s) => s._id);

      // 🗑️ Delete all pending subscriptions
      await Subscription.deleteMany({ _id: { $in: pendingIds } });

      // 🧩 Also remove them from the Form.subscriptions array
      await Form.updateOne(
        { user: userId },
        { $pull: { subscriptions: { $in: pendingIds } } }
      );

      console.log(`Cleaned up ${pendingIds.length} pending_payment subscriptions for user ${_id}`);
    }

    // STEP 2: Fetch user's form and populate subscriptions + children
    const form = await Form.findOne({ user: userId })
      .populate({
        path: "subscriptions",
        populate: {
          path: "children",
          model: "Child",
        },
      })
      .lean();

    if (!form) {
      return res.status(404).json({ success: false, message: "Form not found" });
    }

    if (!Array.isArray(form.subscriptions) || form.subscriptions.length === 0) {
      return res.status(404).json({ success: false, message: "No subscription plans found" });
    }

    // STEP 3: Filter (extra safety)
    const validSubscriptions = form.subscriptions.filter(
      (sub) => sub.status !== "pending_payment"
    );

    if (validSubscriptions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No active or upcoming subscriptions found",
      });
    }

    // STEP 4: Format and send plans
    const plans = validSubscriptions.map((plan) => ({
      id: plan._id,
      planId: plan.planId,
      startDate: plan.startDate,
      endDate: plan.endDate,
      price: plan.price,
      status: plan.status,
      children: (plan.children || []).map((child) => ({
        id: child._id,
        firstName: child.childFirstName,
        lastName: child.childLastName,
        dob: child.dob,
        lunchTime: child.lunchTime,
        school: child.school,
        location: child.location,
        childClass: child.childClass,
        section: child.section,
        allergies: child.allergies,
      })),
    }));

    return res.status(200).json({ success: true, data: { plans } });
  } catch (error) {
    console.error("Error in getMenuCalendarDate:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};




const saveMealPlans = async (req, res) => {
  try {
    const { data } = req.body;
    if (!data || !data.userId || !data.planId || !Array.isArray(data.children)) {
      return res.status(400).json({ success: false, message: "Missing required userId, planId or children" });
    }

    const userId = mongoose.Types.ObjectId(data.userId);
    const planId = String(data.planId);
    const processedChildren = data.children.map(child => {
      if (!child.childId || !Array.isArray(child.meals)) {
        throw new Error("Invalid child structure");
      }
      return {
        childId: mongoose.Types.ObjectId(child.childId),
        meals: child.meals.map(meal => {
          if (!meal.mealDate || !meal.mealName) throw new Error("Invalid meal data");

          const mealDate = new Date(meal.mealDate);
          if (isNaN(mealDate.getTime())) throw new Error("Invalid date format");

          return {
            mealDate,
            mealName: meal.mealName,
            deleted: meal.deleted === true  // <-- FIX
          };
        })

      };
    });

    let userMeal = await UserMeal.findOne({ userId });
    if (!userMeal) {
      userMeal = new UserMeal({ userId, plans: [] });
    }

    // Find existing plan or create new plan entry
    let plan = userMeal.plans.find(p => p.planId === planId);
    if (!plan) {
      userMeal.plans.push({ planId, children: processedChildren });
    } else {
      // Merge meals for each child
      processedChildren.forEach(newChild => {
        const childIndex = plan.children.findIndex(c => c.childId.equals(newChild.childId));
        if (childIndex >= 0) {
          newChild.meals.forEach(newMeal => {
            const mealIndex = plan.children[childIndex].meals.findIndex(m =>
              +new Date(m.mealDate) === +new Date(newMeal.mealDate)
            );
            if (mealIndex >= 0) {
              plan.children[childIndex].meals[mealIndex] = {
                ...plan.children[childIndex].meals[mealIndex],
                ...newMeal
              };

            } else {
              plan.children[childIndex].meals.push(newMeal);
            }
          });
        } else {
          plan.children.push(newChild);
        }
      });
    }

    await userMeal.save();

    return res.status(200).json({ success: true, message: "Meal plans saved successfully", data: userMeal });
  } catch (error) {
    console.error("Error in saveMealPlans:", error);
    return res.status(400).json({ success: false, message: error.message || "Failed to save meal plans" });
  }
};

const deleteMeal = async (req, res) => {
  try {
    const { userId, subscriptionId, childId, date } = req.body;

    if (!userId || !subscriptionId || !childId || !date) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: userId, subscriptionId, childId, date",
      });
    }

    const normalize = (d) => {
      const nd = new Date(d);
      nd.setHours(0, 0, 0, 0);
      return nd.getTime();
    };

    // ------------------
    // 1. FIND USER MEAL DOCUMENT
    // ------------------
    const userMeal = await UserMeal.findOne({ userId });
    if (!userMeal) {
      return res.status(404).json({
        success: false,
        message: "Meal data not found for this user",
      });
    }

    // ------------------
    // 2. FIND PLAN BY subscriptionId
    // ------------------
    const plan = userMeal.plans.find(p => p.planId === String(subscriptionId));
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Subscription (plan) not found",
      });
    }

    // ------------------
    // 3. FIND CHILD ENTRY
    // ------------------
    const childEntry = plan.children.find(c => c.childId.equals(childId));
    if (!childEntry) {
      return res.status(404).json({
        success: false,
        message: "Child not found in this plan",
      });
    }

    // ------------------
    // 4. FIND MEAL ENTRY BY DATE
    // ------------------
    const meal = childEntry.meals.find(
      (m) => normalize(m.mealDate) === normalize(date)
    );

    if (!meal) {
      return res.status(404).json({
        success: false,
        message: "Meal not found for the selected date",
      });
    }

    // Mark the meal as deleted
    meal.deleted = true;

    // ------------------
    // 5. Fetch Child Name from Child Schema
    // ------------------
    let childName = "Unknown Child";
    let classSection = "-";
    let schoolName = "-";

    try {
      const child = await Child.findById(childId);

      if (child) {
        childName = `${child.childFirstName} ${child.childLastName}`;
        classSection = `${child.childClass}, ${child.section}` || "-";
        schoolName = child.school || "-";
      }
    } catch (err) {
      console.log("Warning: Failed to fetch child name from Child model");
    }

    // ------------------
    // 6. WALLET UPDATE (ADD +200)
    // ------------------

    let parentName = "";
    let parentEmail = "";
    let parentMobile = "";

    const form = await Form.findOne({ user: userId });

    if (form) {
      parentName = `${form.parentDetails.fatherFirstName} ${form.parentDetails.fatherLastName}`;
      parentEmail = form.parentDetails.email || "";
      parentMobile = form.parentDetails.mobile || "";

      form.wallet.points += 200;

      form.wallet.history.push({
        change: +200,
        reason: "Meal deleted",
        childName,
        mealName: meal.mealName,
        date: new Date(),
      });

      await form.save();
    }

    // ------------------
    // 7. SAVE CHANGES
    // ------------------
    await userMeal.save();

    // ------------------
    // 8. SEND EMAILS (Using your existing email setup)
    // ------------------
    if (form && parentEmail) {
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const formattedDate = new Date(date).toLocaleDateString("en-GB");

        // ------------------------------------
        // USER EMAIL TEMPLATE
        // ------------------------------------
        const userMailOptions = {
          from: process.env.EMAIL_USER,
          to: parentEmail,
          subject: "Meal Deletion Confirmation – LunchBowl",
          html: `
        <p>Hi <strong>${parentName}</strong>,</p>

        <p>Your meal is successfully deleted.</p>

        <p><strong>${childName}</strong>’s meal booked for 
        <strong>${formattedDate}</strong> with the menu 
        <strong>${meal.mealName}</strong> has been deleted by you.</p>

        <p>The meal amount has been credited to your LunchBowl wallet and can be redeemed anytime.</p>

        <p>We look forward to making your child enjoy their meal!</p>

        <p>For any queries, contact 
        <a href="mailto:contactus@lunchbowl.co.in">contactus@lunchbowl.co.in</a></p>

        <p>Best regards,<br>
        <strong>Team Lunch Bowl and Earth Tech Concepts Pvt Ltd</strong></p>
      `,
        };

        transporter.sendMail(userMailOptions, (err) => {
          if (err) console.log("User Meal Delete Email Error:", err);
        });

        // ------------------------------------
        // CLIENT (ADMIN) EMAIL TEMPLATE
        // ------------------------------------
        const clientMailOptions = {
          from: process.env.EMAIL_USER,
          to: "contactus@lunchbowl.co.in",
          subject: "New Meal Deletion Alert",
          html: `
        <h3>Meal Deletion Details</h3>

        <p><strong>Parent Name:</strong> ${parentName}</p>
        <p><strong>Email:</strong> ${parentEmail}</p>
        <p><strong>Mobile:</strong> ${parentMobile}</p>

        <p><strong>Child Name:</strong> ${childName}</p>
        <p><strong>Class/Section:</strong> ${classSection}</p>
        <p><strong>School Name:</strong> ${schoolName}</p>

        <p><strong>Date:</strong> ${formattedDate}</p>
        <p><strong>Meal Name:</strong> ${meal.mealName}</p>
      `,
        };

        transporter.sendMail(clientMailOptions, (err) => {
          if (err) console.log("Client Meal Delete Email Error:", err);
        });

      } catch (error) {
        console.log("Email sending failed:", error);
      }
    }





    return res.status(200).json({
      success: true,
      message: "Meal deleted successfully",
      data: userMeal,
    });

  } catch (error) {
    console.error("Error deleting meal:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const getSavedMeals = async (req, res) => {
  try {
    const { _id, planId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const userMeals = await UserMeal.findOne({
      userId: mongoose.Types.ObjectId(_id),
    });

    // ⭐ If user has no meal doc — return empty data (NOT 404)
    if (!userMeals || !userMeals.plans.length) {
      return res.status(200).json({
        success: true,
        message: "No saved meals found",
        data: {},
      });
    }

    let plansToReturn = userMeals.plans;

    if (planId) {
      plansToReturn = plansToReturn.filter(
        (p) => p.planId === String(planId)
      );

      // ⭐ If zero meals for this plan — return empty object
      if (!plansToReturn.length) {
        return res.status(200).json({
          success: true,
          message: "No meals found for this plan",
          data: {},
        });
      }
    }

    const data = {};

    plansToReturn.forEach((plan) => {
      const menuSelections = {};

      plan.children.forEach((child) => {
        child.meals.forEach((meal) => {
          const dateKey = dayjs(meal.mealDate).format("YYYY-MM-DD");

          if (!menuSelections[dateKey]) {
            menuSelections[dateKey] = {};
          }

          menuSelections[dateKey][child.childId.toString()] = {
            mealName: meal.mealName,
            deleted: meal.deleted || false, // ⭐ INCLUDE DELETED FLAG
          };
        });
      });

      data[plan.planId] = menuSelections;
    });

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Error in getSavedMeals:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};


const accountDetails = async (req, res) => {
  try {
    const { userId, updateField, updateValue, wallet, page = 1, limit = 10 } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const userObjectId = mongoose.Types.ObjectId(userId);

    // 🧹 STEP 1: Cleanup pending_payment subscriptions for this user
    const pendingSubs = await Subscription.find({
      user: userObjectId,
      status: "pending_payment",
    }).select("_id");

    if (pendingSubs.length > 0) {
      const pendingIds = pendingSubs.map((s) => s._id);

      // 🗑️ Delete them from Subscription collection
      await Subscription.deleteMany({ _id: { $in: pendingIds } });

      // 🧩 Remove their references from the Form
      await Form.updateOne(
        { user: userObjectId },
        { $pull: { subscriptions: { $in: pendingIds } } }
      );

      console.log(
        `Cleaned up ${pendingIds.length} pending_payment subscriptions for user ${userId}`
      );
    }

    // 🧾 STEP 2: If updateField & updateValue provided, update both Customer + Form
    if (
      updateField &&
      ["email", "mobile"].includes(updateField) &&
      updateValue
    ) {
      const customerUpdate = {};
      if (updateField === "email") customerUpdate.email = updateValue;
      if (updateField === "mobile") customerUpdate.phone = updateValue; // assuming 'phone' field in Customer schema

      await Customer.findByIdAndUpdate(userId, customerUpdate);

      // Update Form schema parentDetails for relevant fields
      const form = await Form.findOne({ user: userId });
      if (form && form.parentDetails) {
        if (updateField === "email") form.parentDetails.email = updateValue;
        if (updateField === "mobile") form.parentDetails.mobile = updateValue;
        await form.save();
      }
    }

    let queryOptions;  // ✅ Add this line
    if (wallet) {
      const skip = (page - 1) * limit;
      queryOptions = {
        path: "subscriptions",
        populate: { path: "children" },
        options: { skip, limit },
      };
    } else {
      queryOptions = {
        path: "subscriptions",
        populate: { path: "children" },
      };
    }

    // 🧠 STEP 3: Fetch updated Form with subscriptions + children
    const user = await Form.findOne({ user: userId })
      .populate(queryOptions)  // ✅ Use queryOptions instead of hardcoded config
      .populate("user");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 📊 Calculate total pages if wallet flag is set
    // 📊 Calculate total pages if wallet flag is set
    let pagination = null;
    if (wallet && user.wallet && user.wallet.history) {
      const totalWalletRecords = user.wallet.history.length;  // ✅ 22
      const totalPages = Math.ceil(totalWalletRecords / limit);  // ✅ 3 pages

      // ✅ Paginate the history array
      const skip = (page - 1) * limit;
      user.wallet.history = user.wallet.history.slice(skip, skip + limit);

      pagination = {
        currentPage: page,
        totalPages,
        limit,
        totalRecords: totalWalletRecords,  // ✅ 22 (not 3!)
      };
    }


    return res.status(200).json({
      success: true,
      data: user,
      ...(pagination && { pagination }),
    });
  } catch (error) {
    console.error("Error fetching/updating account details:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


const getFormData = async (req, res) => {
  try {
    // ✅ 1. Fetch form by user ID and populate related fields
    const form = await Form.findOne({ user: req.params.userId })
      .populate("user")            // Include full user details
      .populate("subscriptions")   // Include full subscription details
      .lean();

    // ✅ 2. Handle case when no form exists
    if (!form) {
      return res.status(404).json({
        success: false,
        message: "Form data not found for this user",
      });
    }

    // ✅ 3. Always take the last plan in the subscriptions array
    let subscriptionPlan = null;
    if (Array.isArray(form.subscriptions) && form.subscriptions.length > 0) {
      subscriptionPlan = form.subscriptions[form.subscriptions.length - 1];
    }

    // ✅ 4. Return formatted response to the frontend
    return res.status(200).json({
      success: true,
      data: {
        subscriptionPlan: subscriptionPlan || {}, // Latest subscription or empty object
        user: form.user || {},                    // Populated user details
        parentDetails: form.parentDetails || {},  // Parent details if saved
      },
    });
  } catch (error) {
    console.error("Error fetching form data:", error);

    // ✅ 5. Proper error handling
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


const getPaidHolidays = async (req, res) => {
  try {
    const userId = req.body.userId;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Find all paid holiday records for the user where paymentStatus is "Paid"
    const paidHolidays = await HolidayPayment.find({
      userId,
      paymentStatus: "Paid",
    }).lean();

    if (!paidHolidays || paidHolidays.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No paid holidays found for this user",
      });
    }

    res.status(200).json({
      success: true,
      data: paidHolidays,
    });
  } catch (error) {
    console.error("Error fetching paid holidays:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Helper function to check if date is in current month
function isDateInCurrentMonth(date, currentMonth) {
  const mealDate = new Date(date);
  return mealDate.getMonth() === currentMonth;
}

module.exports = {
  loginCustomer,
  verifyPhoneNumber,
  registerCustomer,
  addAllCustomers,
  signUpWithProvider,
  signUpWithOauthProvider,
  verifyEmailAddress,
  forgetPassword,
  changePassword,
  resetPassword,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  addShippingAddress,
  getShippingAddress,
  updateShippingAddress,
  deleteShippingAddress,
  sendOtp,
  verifyOtp,
  stepFormRegister,
  handleCCAvenueResponse,
  verifyCCAvenuePayment,
  getMenuCalendarDate,
  saveMealPlans,
  getSavedMeals,
  stepCheck,
  accountDetails,
  getFormData,
  getPaidHolidays,
  activateNextSubscriptionPlans,
  getAllChildrenForUser,
  localPaymentSuccess,
  localAddChildPaymentController,
  getPaymentsForUser,
  deleteMeal,
};
