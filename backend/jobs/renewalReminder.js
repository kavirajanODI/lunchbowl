// const cron = require("node-cron");
// const Form = require("../models/Form");
// const nodemailer = require("nodemailer");
// const { sendSMS } = require("../lib/sms-sender/smsService");
// const SmsLog = require("../models/SmsLog");

// // Run every hour
// cron.schedule("0 * * * *", async () => {
//   const now = new Date();
//   const next24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

//   // Find forms where subscription ends in the next 24 hours and paymentStatus is true
//   const expiringForms = await Form.find({
//     "subscriptionPlan.endDate": {
//       $gte: now,
//       $lte: next24h,
//     },
//     paymentStatus: true,
//   });

//   for (const form of expiringForms) {
//     const parentName = `${form.parentDetails.fatherFirstName} ${form.parentDetails.fatherLastName}`;
//     const endDate = new Date(form.subscriptionPlan.endDate).toLocaleDateString("en-IN");
//     const childNames = form.children
//       .map(
//         (child) => `${child.childFirstName} ${child.childLastName}`
//       )
//       .join(", ");

//     const email = form.parentDetails.email;

//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: "Renewal Reminder – Keep the Lunches Coming!",
//       html: `
//         <p>Hi ${parentName},</p>
//         <p>Your Lunch Bowl subscription is due to expire on <strong>${endDate}</strong>.</p>
//         <p>To ensure ${childNames} continues receiving their favorite healthy meals, kindly renew before the deadline.</p>
//         <p>👉 <a href="https://lunchbowl.co.in/user/userDashBoard">Renew My Subscription Now</a></p>
//         <p>We’re here to keep the lunchbox full and the child smiling!</p>
//         <p>– Team Lunch Bowl</p>
//       `,
//     };

//     transporter.sendMail(mailOptions, (err, info) => {
//       if (err) {
//         console.error("Renewal Reminder Mail Error:", err);
//       }
//     });

//     // Send SMS renewal reminder
//     const parentPhone = form.parentDetails?.fatherMobile || form.parentDetails?.motherMobile;
//     if (parentPhone) {
//       try {
//         const smsResult = await sendSMS(parentPhone, 'SUBSCRIPTION_RENEWAL', [parentName, endDate]);
        
//         // Log SMS
//         const smsLog = new SmsLog({
//           mobile: parentPhone,
//           messageType: 'SUBSCRIPTION_RENEWAL',
//           message: smsResult.message || '',
//           templateId: smsResult.templateId || '',
//           messageId: smsResult.messageId || '',
//           status: smsResult.success ? 'sent' : 'failed',
//           error: smsResult.error || undefined,
//           customerId: form.user,
//           variables: [parentName, endDate],
//           sentAt: new Date()
//         });
        
//         await smsLog.save();
//         console.log('Renewal reminder SMS sent to:', parentPhone);
//       } catch (smsError) {
//         console.error('Error sending renewal reminder SMS:', smsError);
//       }
//     }
//   }
// });