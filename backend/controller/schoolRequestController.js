const SchoolRequest = require("../models/SchoolRequest");
const { sendEmailAsync } = require("../lib/email-sender/sender");

const schoolRequestAdminEmails =
  process.env.SCHOOL_REQUEST_ADMIN_EMAILS ||
  "contactus@lunchbowl.co.in, maniyarasanodi20@gmail.com";

const requestSchool = async (req, res) => {
  try {
    const { schoolName, location, parentName, phone, email } = req.body;

    if (!schoolName || !location) {
      return res.status(400).send({
        success: false,
        message: "schoolName and location are required",
      });
    }

    const schoolRequest = await SchoolRequest.create({
      schoolName: String(schoolName).trim(),
      location: String(location).trim(),
      parentName: parentName ? String(parentName).trim() : "",
      phone: phone ? String(phone).trim() : "",
      email: email ? String(email).trim() : "",
    });

    const adminBody = {
      from: process.env.EMAIL_USER,
      to: schoolRequestAdminEmails,
      subject: "New School Request - Trial Meal",
      html: `
        <h2>New School Request</h2>
        <p><strong>School Name:</strong> ${schoolRequest.schoolName}</p>
        <p><strong>Location:</strong> ${schoolRequest.location}</p>
        <p><strong>Parent Name:</strong> ${schoolRequest.parentName || "N/A"}</p>
        <p><strong>Phone:</strong> ${schoolRequest.phone || "N/A"}</p>
        <p><strong>Email:</strong> ${schoolRequest.email || "N/A"}</p>
        <p><strong>Status:</strong> ${schoolRequest.status}</p>
      `,
    };

    await sendEmailAsync(adminBody);

    if (schoolRequest.email) {
      const userBody = {
        from: process.env.EMAIL_USER,
        to: schoolRequest.email,
        subject: "School Request Received - Lunch Bowl",
        html: `
          <p>Hi ${schoolRequest.parentName || "Parent"},</p>
          <p>We have received your school request.</p>
          <p><strong>School Name:</strong> ${schoolRequest.schoolName}</p>
          <p><strong>Location:</strong> ${schoolRequest.location}</p>
          <p>Our team will review this and get back to you.</p>
          <p>Thank you,<br/>Lunch Bowl Team</p>
        `,
      };
      await sendEmailAsync(userBody);
    }

    return res.status(201).send({
      success: true,
      message: "Request submitted successfully",
      data: schoolRequest,
    });
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  requestSchool,
};
