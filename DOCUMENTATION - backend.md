# LunchBowl Backend API Documentation

**Base URL:** `http://localhost:5000`
**Content-Type:** `application/json`
**Authentication:** Bearer Token (JWT) — include `Authorization: Bearer <token>` in request headers where required.

---

## Table of Contents

1. [Admin & Staff APIs](#1-admin--staff-apis)
2. [Customer APIs](#2-customer-apis)
3. [Shipping Address APIs](#3-shipping-address-apis)
4. [Customer Order APIs](#4-customer-order-apis)
5. [Admin Order APIs](#5-admin-order-apis)
6. [Product APIs](#6-product-apis)
7. [Dish / Menu APIs](#7-dish--menu-apis)
8. [Category APIs](#8-category-apis)
9. [Coupon APIs](#9-coupon-apis)
10. [Attribute APIs](#10-attribute-apis)
11. [School APIs](#11-school-apis)
12. [Holiday APIs](#12-holiday-apis)
13. [Setting APIs](#13-setting-apis)
14. [Currency APIs](#14-currency-apis)
15. [Language APIs](#15-language-apis)
16. [Notification APIs](#16-notification-apis)
17. [SMS APIs](#17-sms-apis)
18. [Payment / CCAvenue APIs](#18-payment--ccavenue-apis)
19. [Error Responses](#error-responses)
20. [Data Models Summary](#data-models-summary)

---

## 1. Admin & Staff APIs

### 1.1 Register Admin

| Field | Value |
|---|---|
| **Method** | POST |
| **Endpoint** | `/api/admin/register` |
| **Purpose** | Register a new admin or staff member |
| **Auth Required** | No |

**Request Body:**
```json
{
  "name": "string (required)",
  "email": "string (required)",
  "role": "string (required) — Admin | Super Admin | Cashier | Manager | CEO | Driver | Security Guard | Accountant",
  "password": "string (required)"
}
```
**Response (200):**
```json
{
  "token": "JWT token string",
  "_id": "string",
  "name": "string",
  "email": "string",
  "role": "string",
  "joiningData": "ISO date string"
}
```

---

### 1.2 Login Admin

| Field | Value |
|---|---|
| **Method** | POST |
| **Endpoint** | `/api/admin/login` |
| **Purpose** | Authenticate admin/staff and return JWT token |
| **Auth Required** | No |

**Request Body:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```
**Response (200):**
```json
{
  "token": "JWT token string",
  "_id": "string",
  "name": "string",
  "phone": "string",
  "email": "string",
  "image": "string",
  "iv": "string",
  "data": "string (encrypted access list)"
}
```

---

### 1.3 Admin Forgot Password

| Field | Value |
|---|---|
| **Method** | PUT |
| **Endpoint** | `/api/admin/forget-password` |
| **Purpose** | Send password reset email to admin |
| **Auth Required** | No |

**Request Body:**
```json
{ "verifyEmail": "string (required)" }
```
**Response (200):**
```json
{ "message": "Please check your email to reset password!" }
```

---

### 1.4 Admin Reset Password

| Field | Value |
|---|---|
| **Method** | PUT |
| **Endpoint** | `/api/admin/reset-password` |
| **Purpose** | Reset admin password using token received via email |
| **Auth Required** | No |

**Request Body:**
```json
{
  "token": "string (required) — JWT from reset email",
  "newPassword": "string (required)"
}
```
**Response (200):**
```json
{ "message": "Your password change successful, you can login now!" }
```

---

### 1.5 Talk to Nutrition Enquiry

| Field | Value |
|---|---|
| **Method** | POST |
| **Endpoint** | `/api/admin/talk-nutrition` |
| **Purpose** | Submit a nutrition consultation inquiry |
| **Auth Required** | No |

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "message": "string"
}
```
**Response (200):**
```json
{ "message": "string" }
```

---

### 1.6 Free Trial Enquiry

| Field | Value |
|---|---|
| **Method** | POST |
| **Endpoint** | `/api/admin/free-trial-enquiry` |
| **Purpose** | Submit a free trial request |
| **Auth Required** | No |

**Request Body:**
```json
{ "name": "string", "email": "string", "phone": "string", "message": "string" }
```
**Response (200):**
```json
{ "message": "string" }
```

---

### 1.7 Get In Touch

| Field | Value |
|---|---|
| **Method** | POST |
| **Endpoint** | `/api/admin/get-in-touch` |
| **Purpose** | General contact inquiry form |
| **Auth Required** | No |

**Request Body:**
```json
{ "name": "string", "email": "string", "phone": "string", "message": "string" }
```
**Response (200):**
```json
{ "message": "string" }
```

---

### 1.8 Contact Us

| Field | Value |
|---|---|
| **Method** | POST |
| **Endpoint** | `/api/admin/contact-us` |
| **Purpose** | Contact us form submission |
| **Auth Required** | No |

**Request Body:**
```json
{ "name": "string", "email": "string", "phone": "string", "message": "string" }
```
**Response (200):**
```json
{ "message": "string" }
```

---

### 1.9 School Service Enquiry

| Field | Value |
|---|---|
| **Method** | POST |
| **Endpoint** | `/api/admin/get-school-enquiry` |
| **Purpose** | School service inquiry form submission |
| **Auth Required** | No |

**Request Body:**
```json
{ "name": "string", "email": "string", "phone": "string", "schoolName": "string", "message": "string" }
```
**Response (200):**
```json
{ "message": "string" }
```

---

### 1.10 Add Staff

| Field | Value |
|---|---|
| **Method** | POST |
| **Endpoint** | `/api/admin/add` |
| **Purpose** | Create a new staff member |
| **Auth Required** | No |

**Request Body:**
```json
{
  "name": "object (required) — e.g. { en: 'John Doe' }",
  "email": "string (required)",
  "password": "string (required)",
  "phone": "string",
  "joiningDate": "ISO date string",
  "role": "string — Admin | Super Admin | Cashier | Manager | CEO | Driver | Security Guard | Accountant",
  "image": "string (URL)",
  "access_list": ["string"]
}
```
**Response (200):**
```json
{ "message": "Staff Added Successfully!" }
```

---

### 1.11 Get All Staff

| Field | Value |
|---|---|
| **Method** | GET |
| **Endpoint** | `/api/admin/` |
| **Purpose** | Retrieve all admin/staff members |
| **Auth Required** | No |

**Response (200):**
```json
[
  {
    "_id": "string",
    "name": "object",
    "email": "string",
    "phone": "string",
    "role": "string",
    "status": "Active | Inactive",
    "image": "string",
    "access_list": ["string"],
    "joiningData": "date",
    "createdAt": "date"
  }
]
```

---

### 1.12 Get Staff by ID

| Field | Value |
|---|---|
| **Method** | POST |
| **Endpoint** | `/api/admin/:id` |
| **Purpose** | Retrieve a staff member by ID |
| **Auth Required** | No |

**URL Params:** `id` — MongoDB ObjectId

**Response (200):** Staff object (same fields as Get All Staff item)

---

### 1.13 Update Staff

| Field | Value |
|---|---|
| **Method** | PUT |
| **Endpoint** | `/api/admin/:id` |
| **Purpose** | Update staff member information |
| **Auth Required** | No |

**Request Body:**
```json
{
  "name": "object",
  "email": "string",
  "phone": "string",
  "role": "string",
  "access_list": ["string"],
  "joiningDate": "ISO date string",
  "image": "string (URL)"
}
```
**Response (200):**
```json
{ "message": "Staff Updated Successfully!" }
```

---

### 1.14 Update Staff Status

| Field | Value |
|---|---|
| **Method** | PUT |
| **Endpoint** | `/api/admin/update-status/:id` |
| **Purpose** | Activate or deactivate a staff member |
| **Auth Required** | No |

**Request Body:**
```json
{ "status": "Active | Inactive" }
```
**Response (200):**
```json
{ "message": "Status Updated Successfully!" }
```

---

### 1.15 Delete Staff

| Field | Value |
|---|---|
| **Method** | DELETE |
| **Endpoint** | `/api/admin/:id` |
| **Purpose** | Delete a staff member |
| **Auth Required** | No |

**Response (200):**
```json
{ "message": "Staff Deleted Successfully!" }
```

---

### 1.16 Send Trial Feedback SMS

| Field | Value |
|---|---|
| **Method** | POST |
| **Endpoint** | `/api/admin/send-trial-feedback-sms` |
| **Purpose** | Send trial food feedback request SMS to a parent |
| **Auth Required** | No |

**Request Body:**
```json
{
  "mobile": "string (required)",
  "parentName": "string (required)",
  "childName": "string (required)",
  "feedbackLink": "string (required)"
}
```
**Response (200):**
```json
{ "message": "string", "success": true }
```

---

### 1.17 Get Trial Customers

| Field | Value |
|---|---|
| **Method** | GET |
| **Endpoint** | `/api/admin/trial-customers` |
| **Purpose** | Retrieve customers on free trial |
| **Auth Required** | No |

**Response (200):**
```json
[
  { "_id": "string", "name": "string", "email": "string", "phone": "string", "freeTrial": true }
]
```

---

## 2. Customer APIs

### 2.1 Verify Email Address

| Field | Value |
|---|---|
| **Method** | POST |
| **Endpoint** | `/api/customer/verify-email` |
| **Purpose** | Check email uniqueness and send verification link |
| **Auth Required** | No |

**Request Body:**
```json
{ "name": "string (required)", "email": "string (required)", "password": "string (required)" }
```
**Response (200):**
```json
{ "message": "Please check your email to verify your account!" }
```

---

### 2.2 Verify Phone Number

| Field | Value |
|---|---|
| **Method** | POST |
| **Endpoint** | `/api/customer/verify-phone` |
| **Purpose** | Verify phone number uniqueness and send OTP |
| **Auth Required** | No |

**Request Body:**
```json
{ "phone": "string (required) — 10-digit mobile number" }
```
**Response (200):**
```json
{ "message": "Please check your phone for the verification code!" }
```

---

### 2.3 Register Customer

| Field | Value |
|---|---|
| **Method** | POST |
| **Endpoint** | `/api/customer/register/:token` |
| **Purpose** | Complete customer registration after email verification |
| **Auth Required** | No |

**URL Params:** `token` — JWT from verification email

**Response (200):**
```json
{
  "token": "JWT auth token",
  "_id": "string",
  "name": "string",
  "email": "string",
  "message": "Email Verified, Please Login Now!"
}
```

---

### 2.4 Customer Login

| Field | Value |
|---|---|
| **Method** | POST |
| **Endpoint** | `/api/customer/login` |
| **Purpose** | Authenticate customer with phone+OTP or email+password |
| **Auth Required** | No |

**Request Body:**
```json
{
  "phone": "string (required for OTP login)",
  "email": "string (required for password login)",
  "password": "string (required for password login)"
}
```
**Response (200):**
```json
{
  "token": "JWT auth token",
  "_id": "string",
  "name": "string",
  "email": "string",
  "phone": "string",
  "image": "string"
}
```

---

### 2.5 OAuth Signup / Login

| Field | Value |
|---|---|
| **Method** | POST |
| **Endpoint** | `/api/customer/signup/oauth` |
| **Purpose** | Register or login via Google/Facebook OAuth |
| **Auth Required** | No |

**Request Body:**
```json
{ "name": "string (required)", "email": "string (required)", "image": "string" }
```
**Response (200):**
```json
{ "token": "JWT auth token", "_id": "string", "name": "string", "email": "string", "image": "string" }
```

---

### 2.6 Provider Signup

| Field | Value |
|---|---|
| **Method** | POST |
| **Endpoint** | `/api/customer/signup/:token` |
| **Purpose** | Complete signup via social provider token |
| **Auth Required** | No |

**URL Params:** `token` — provider JWT token

**Response (200):**
```json
{ "token": "JWT auth token", "_id": "string", "name": "string", "email": "string" }
```

---

### 2.7 Customer Forgot Password

| Field | Value |
|---|---|
| **Method** | PUT |
| **Endpoint** | `/api/customer/forget-password` |
| **Purpose** | Send password reset email to customer |
| **Auth Required** | No |

**Request Body:**
```json
{ "verifyEmail": "string (required)" }
```
**Response (200):**
```json
{ "message": "Please check your email to reset password!" }
```

---

### 2.8 Customer Reset Password

| Field | Value |
|---|---|
| **Method** | PUT |
| **Endpoint** | `/api/customer/reset-password` |
| **Purpose** | Reset customer password using token from email |
| **Auth Required** | No |

**Request Body:**
```json
{ "token": "string (required)", "newPassword": "string (required)" }
```
**Response (200):**
```json
{ "message": "Your password change successful, you can login now!" }
```

---

### 2.9 Change Password

| Field | Value |
|---|---|
| **Method** | POST |
| **Endpoint** | `/api/customer/change-password` |
| **Purpose** | Change customer password while logged in |
| **Auth Required** | No |

**Request Body:**
```json
{ "email": "string (required)", "currentPassword": "string (required)", "newPassword": "string (required)" }
```
**Response (200):**
```json
{ "message": "Password Updated Successfully!" }
```

---

### 2.10 Get All Customers

| Field | Value |
|---|---|
| **Method** | GET |
| **Endpoint** | `/api/customer/` |
| **Purpose** | Retrieve all registered customers (admin) |
| **Auth Required** | No |

**Response (200):**
```json
[
  {
    "_id": "string",
    "name": "string",
    "email": "string",
    "phone": "string",
    "address": "string",
    "city": "string",
    "country": "string",
    "image": "string",
    "freeTrial": false,
    "createdAt": "date"
  }
]
```

---

### 2.11 Get Customer by ID

| Field | Value |
|---|---|
| **Method** | GET |
| **Endpoint** | `/api/customer/:id` |
| **Purpose** | Retrieve a single customer |
| **Auth Required** | No |

**URL Params:** `id` — MongoDB ObjectId

**Response (200):** Customer object (see 2.10)

---

### 2.12 Get Form Data by User ID

| Field | Value |
|---|---|
| **Method** | GET |
| **Endpoint** | `/api/customer/form/:userId` |
| **Purpose** | Retrieve parent registration form and wallet data |
| **Auth Required** | No |

**URL Params:** `userId` — MongoDB ObjectId

**Response (200):**
```json
{
  "_id": "string",
  "user": "string",
  "step": 1,
  "parentDetails": {
    "fatherFirstName": "string",
    "fatherLastName": "string",
    "motherFirstName": "string",
    "motherLastName": "string",
    "mobile": "string",
    "email": "string",
    "address": "string",
    "pincode": "string",
    "city": "string",
    "state": "string",
    "country": "string"
  },
  "subscriptions": ["Subscription ObjectId"],
  "paymentStatus": "string",
  "subscriptionCount": 0,
  "wallet": {
    "points": 0,
    "history": [
      { "date": "date", "change": 0, "reason": "string", "childName": "string", "mealName": "string" }
    ]
  }
}
```

---

### 2.13 Update Customer

| Field | Value |
|---|---|
| **Method** | PUT |
| **Endpoint** | `/api/customer/:id` |
| **Purpose** | Update customer profile |
| **Auth Required** | No |

**Request Body:**
```json
{ "name": "string", "email": "string", "phone": "string", "address": "string", "city": "string", "country": "string", "image": "string" }
```
**Response (200):**
```json
{ "message": "Customer Updated Successfully!" }
```

---

### 2.14 Delete Customer

| Field | Value |
|---|---|
| **Method** | DELETE |
| **Endpoint** | `/api/customer/:id` |
| **Purpose** | Delete a customer account |
| **Auth Required** | No |

**Response (200):**
```json
{ "message": "Customer Deleted Successfully!" }
```

---

### 2.15 Send OTP

| Field | Value |
|---|---|
| **Method** | POST |
| **Endpoint** | `/api/customer/sendOtp` |
| **Purpose** | Send OTP to customer mobile number |
| **Auth Required** | No |

**Request Body:**
```json
{ "mobile": "string (required) — 10-digit number" }
```
**Response (200):**
```json
{ "message": "OTP sent successfully" }
```

---

### 2.16 Verify OTP

| Field | Value |
|---|---|
| **Method** | POST |
| **Endpoint** | `/api/customer/verifyOtp` |
| **Purpose** | Verify OTP and log in customer |
| **Auth Required** | No |

**Request Body:**
```json
{ "mobile": "string (required)", "otp": "string (required)" }
```
**Response (200):**
```json
{ "message": "OTP verified successfully", "token": "JWT auth token", "_id": "string", "name": "string", "email": "string", "phone": "string" }
```

---

### 2.17 Step Form Registration

| Field | Value |
|---|---|
| **Method** | POST |
| **Endpoint** | `/api/customer/stepForm-Register` |
| **Purpose** | Submit multi-step parent and child enrollment form |
| **Auth Required** | No |

**Request Body:**
```json
{
  "userId": "string (required)",
  "step": "number",
  "parentDetails": {
    "fatherFirstName": "string (required)",
    "fatherLastName": "string (required)",
    "motherFirstName": "string (required)",
    "motherLastName": "string (required)",
    "mobile": "string (required, 10 digits)",
    "email": "string (required)",
    "address": "string (required)",
    "pincode": "string (required, 6 digits)",
    "city": "string (required)",
    "state": "string (required)",
    "country": "string (default: India)"
  },
  "children": [
    {
      "childFirstName": "string (required)",
      "childLastName": "string (required)",
      "dob": "ISO date string (required)",
      "lunchTime": "string (required)",
      "school": "string (required)",
      "location": "string (required)",
      "childClass": "string (required)",
      "section": "string (required)",
      "allergies": "string"
    }
  ],
  "planId": "string",
  "startDate": "ISO date string",
  "endDate": "ISO date string",
  "workingDays": "number",
  "price": "number"
}
```
**Response (200):**
```json
{ "message": "Form submitted successfully", "formId": "string", "step": "number" }
```

---

### 2.18 Get Menu Calendar

| Field | Value |
|---|---|
| **Method** | POST |
| **Endpoint** | `/api/customer/get-Menu-Calendar` |
| **Purpose** | Retrieve available menu items for a date range |
| **Auth Required** | No |

**Request Body:**
```json
{ "userId": "string (required)", "startDate": "ISO date string", "endDate": "ISO date string" }
```
**Response (200):**
```json
{ "menuCalendar": [{ "date": "ISO date string", "dishes": ["Dish objects"] }] }
```

---

### 2.19 Save Meal Plans

| Field | Value |
|---|---|
| **Method** | POST |
| **Endpoint** | `/api/customer/save-Menu-Calendar` |
| **Purpose** | Save selected meal plans for a child |
| **Auth Required** | No |

**Request Body:**
```json
{ "userId": "string (required)", "childId": "string (required)", "meals": [{ "date": "ISO date string", "dishId": "string" }] }
```
**Response (200):**
```json
{ "message": "Meal plans saved successfully" }
```

---

### 2.20 Get Saved Meals

| Field | Value |
|---|---|
| **Method** | POST |
| **Endpoint** | `/api/customer/get-saved-meals` |
| **Purpose** | Retrieve saved meal selections |
| **Auth Required** | No |

**Request Body:**
```json
{ "userId": "string (required)", "childId": "string (required)" }
```
**Response (200):**
```json
{ "savedMeals": [{ "date": "ISO date string", "dish": "Dish object" }] }
```

---

### 2.21 Step Check

| Field | Value |
|---|---|
| **Method** | POST |
| **Endpoint** | `/api/customer/Step-Check` |
| **Purpose** | Check the current registration step for a user |
| **Auth Required** | No |

**Request Body:**
```json
{ "userId": "string (required)" }
```
**Response (200):**
```json
{ "step": "number", "paymentStatus": "string" }
```

---

### 2.22 Account Details

| Field | Value |
|---|---|
| **Method** | POST |
| **Endpoint** | `/api/customer/account-details` |
| **Purpose** | Retrieve full account — customer, form, children, subscriptions, wallet |
| **Auth Required** | No |

**Request Body:**
```json
{ "userId": "string (required)" }
```
**Response (200):**
```json
{
  "customer": "Customer object",
  "form": "Form object",
  "children": ["Child objects"],
  "subscriptions": ["Subscription objects"],
  "wallet": { "points": "number", "history": [] }
}
```

---

### 2.23 Verify CCAvenue Payment

| Field | Value |
|---|---|
| **Method** | POST |
| **Endpoint** | `/api/customer/payment/verify` |
| **Purpose** | Verify a CCAvenue payment transaction |
| **Auth Required** | No |

**Request Body:**
```json
{ "orderId": "string (required)", "userId": "string (required)" }
```
**Response (200):**
```json
{ "message": "Payment verified", "status": "string" }
```

---

### 2.24 Handle CCAvenue Payment Response

| Field | Value |
|---|---|
| **Method** | POST |
| **Endpoint** | `/api/customer/payment/response` |
| **Purpose** | Handle redirect callback from CCAvenue payment gateway |
| **Auth Required** | No |

**Request Body:** CCAvenue encrypted form POST (`encResp` field)

**Response:** Redirect or JSON status

---

### 2.25 Get Paid Holidays

| Field | Value |
|---|---|
| **Method** | POST |
| **Endpoint** | `/api/customer/get-paid-holidays` |
| **Purpose** | Get holiday dates relevant to a user |
| **Auth Required** | No |

**Request Body:**
```json
{ "userId": "string (required)" }
```
**Response (200):**
```json
{ "holidays": [{ "date": "ISO date string", "name": "string" }] }
```

---

### 2.26 Get All Children

| Field | Value |
|---|---|
| **Method** | POST |
| **Endpoint** | `/api/customer/get-all-children` |
| **Purpose** | Get all children enrolled under a user |
| **Auth Required** | No |

**Request Body:**
```json
{ "userId": "string (required)" }
```
**Response (200):**
```json
[
  {
    "_id": "string",
    "childFirstName": "string",
    "childLastName": "string",
    "dob": "date",
    "lunchTime": "string",
    "school": "string",
    "location": "string",
    "childClass": "string",
    "section": "string",
    "allergies": "string"
  }
]
```

---

### 2.27 Local Payment Success

| Field | Value |
|---|---|
| **Method** | POST |
| **Endpoint** | `/api/customer/local-success` |
| **Purpose** | Record a local/offline subscription payment |
| **Auth Required** | No |

**Request Body:**
```json
{ "userId": "string (required)", "orderId": "string (required)", "amount": "number (required)", "transactionId": "string" }
```
**Response (200):**
```json
{ "message": "Payment recorded successfully" }
```

---

### 2.28 Add Child Payment Locally

| Field | Value |
|---|---|
| **Method** | POST |
| **Endpoint** | `/api/customer/local-success/local-add-childPayment` |
| **Purpose** | Record local payment when adding a new child |
| **Auth Required** | No |

**Request Body:**
```json
{ "userId": "string (required)", "childId": "string (required)", "amount": "number (required)", "orderId": "string", "transactionId": "string" }
```
**Response (200):**
```json
{ "message": "Child payment recorded successfully" }
```

---

### 2.29 Get Payments for User

| Field | Value |
|---|---|
| **Method** | POST |
| **Endpoint** | `/api/customer/get-payments` |
| **Purpose** | Retrieve all payment history for a user |
| **Auth Required** | No |

**Request Body:**
```json
{ "userId": "string (required)" }
```
**Response (200):**
```json
[{ "_id": "string", "orderId": "string", "amount": "number", "date": "date", "status": "string", "method": "string" }]
```

---

### 2.30 Delete Meal

| Field | Value |
|---|---|
| **Method** | POST |
| **Endpoint** | `/api/customer/delete-meal` |
| **Purpose** | Remove a meal from a child's plan and refund wallet points |
| **Auth Required** | No |

**Request Body:**
```json
{ "userId": "string (required)", "childId": "string (required)", "mealDate": "ISO date string (required)", "mealName": "string" }
```
**Response (200):**
```json
{ "message": "Meal deleted successfully", "walletPoints": "number" }
```

---

## 3. Shipping Address APIs

### 3.1 Add Shipping Address

| Field | Value |
|---|---|
| **Method** | POST |
| **Endpoint** | `/api/customer/shipping/address/:id` |
| **Purpose** | Add a shipping address for a customer |
| **Auth Required** | No |

**URL Params:** `id` — Customer ObjectId

**Request Body:**
```json
{ "name": "string", "contact": "string", "email": "string", "address": "string", "country": "string", "city": "string", "area": "string", "zipCode": "string", "isDefault": "boolean" }
```
**Response (200):**
```json
{ "message": "Shipping address added successfully" }
```

---

### 3.2 Get Shipping Addresses

| Field | Value |
|---|---|
| **Method** | GET |
| **Endpoint** | `/api/customer/shipping/address/:id` |
| **Purpose** | Retrieve all shipping addresses for a customer |
| **Auth Required** | No |

**URL Params:** `id` — Customer ObjectId

**Response (200):**
```json
[{ "name": "string", "contact": "string", "email": "string", "address": "string", "country": "string", "city": "string", "area": "string", "zipCode": "string", "isDefault": "boolean" }]
```

---

### 3.3 Update Shipping Address

| Field | Value |
|---|---|
| **Method** | PUT |
| **Endpoint** | `/api/customer/shipping/address/:userId/:shippingId` |
| **Purpose** | Update a shipping address |
| **Auth Required** | No |

**URL Params:** `userId`, `shippingId`

**Request Body:** Same fields as Add Shipping Address

**Response (200):**
```json
{ "message": "Shipping address updated successfully" }
```

---

### 3.4 Delete Shipping Address

| Field | Value |
|---|---|
| **Method** | DELETE |
| **Endpoint** | `/api/customer/shipping/address/:userId/:shippingId` |
| **Purpose** | Delete a shipping address |
| **Auth Required** | No |

**Response (200):**
```json
{ "message": "Shipping address deleted successfully" }
```

---

## 4. Customer Order APIs

> All endpoints require `Authorization: Bearer <token>`.

### 4.1 Create Order

| Field | Value |
|---|---|
| **Method** | POST |
| **Endpoint** | `/api/order/add` |
| **Purpose** | Place a new customer order |
| **Auth Required** | Yes |

**Request Body:**
```json
{
  "cart": [{ "productId": "string", "title": "string", "price": "number", "quantity": "number" }],
  "user_info": { "name": "string", "email": "string", "contact": "string", "address": "string", "city": "string", "country": "string", "zipCode": "string" },
  "subTotal": "number (required)",
  "shippingCost": "number (required)",
  "discount": "number (default: 0)",
  "total": "number (required)",
  "shippingOption": "string",
  "paymentMethod": "string (required)",
  "cardInfo": "object"
}
```
**Response (201):**
```json
{
  "_id": "string",
  "invoice": "number (auto-incremented from 10000)",
  "user": "string",
  "cart": [],
  "subTotal": "number",
  "shippingCost": "number",
  "discount": "number",
  "total": "number",
  "paymentMethod": "string",
  "status": "Pending",
  "createdAt": "date"
}
```

---

### 4.2 Create Stripe Payment Intent

| Field | Value |
|---|---|
| **Method** | POST |
| **Endpoint** | `/api/order/create-payment-intent` |
| **Purpose** | Create a Stripe PaymentIntent for checkout |
| **Auth Required** | Yes |

**Request Body:**
```json
{ "total": "number (required)", "cardInfo": { "id": "string (optional)" }, "email": "string" }
```
**Response (200):** Stripe PaymentIntent object
```json
{ "id": "string", "client_secret": "string", "amount": "number", "currency": "usd", "status": "string" }
```

---

### 4.3 Create Razorpay Order

| Field | Value |
|---|---|
| **Method** | POST |
| **Endpoint** | `/api/order/create/razorpay` |
| **Purpose** | Create a Razorpay order for checkout |
| **Auth Required** | Yes |

**Request Body:**
```json
{ "amount": "number (required) — in INR" }
```
**Response (200):**
```json
{ "id": "string", "entity": "order", "amount": "number (paise)", "currency": "INR", "status": "created" }
```

---

### 4.4 Add Razorpay Order

| Field | Value |
|---|---|
| **Method** | POST |
| **Endpoint** | `/api/order/add/razorpay` |
| **Purpose** | Save order after successful Razorpay payment |
| **Auth Required** | Yes |

**Request Body:** Same as Create Order (4.1)

**Response (201):** Same as Create Order (4.1)

---

### 4.5 Get Customer Orders

| Field | Value |
|---|---|
| **Method** | GET |
| **Endpoint** | `/api/order/` |
| **Purpose** | Retrieve all orders for authenticated customer |
| **Auth Required** | Yes |

**Query Params:** `page` (default: 1), `limit` (default: 8)

**Response (200):**
```json
{
  "orders": [],
  "totalDoc": "number",
  "totalPendingOrder": [{ "total": "number", "count": "number" }],
  "totalProcessingOrder": [{ "total": "number", "count": "number" }],
  "totalDeliveredOrder": [{ "total": "number", "count": "number" }]
}
```

---

### 4.6 Get Order by ID

| Field | Value |
|---|---|
| **Method** | GET |
| **Endpoint** | `/api/order/:id` |
| **Purpose** | Retrieve a specific order |
| **Auth Required** | Yes |

**Response (200):** Order object

---

### 4.7 Send Email Invoice

| Field | Value |
|---|---|
| **Method** | POST |
| **Endpoint** | `/api/order/customer/invoice` |
| **Purpose** | Email an order invoice to the customer |
| **Auth Required** | Yes |

**Request Body:**
```json
{ "orderId": "string (required)", "email": "string (required)" }
```
**Response (200):**
```json
{ "message": "Invoice sent to your email!" }
```

---

## 5. Admin Order APIs

### 5.1 Get All Orders

| Field | Value |
|---|---|
| **Method** | GET |
| **Endpoint** | `/api/orders/` |
| **Purpose** | Retrieve all orders (admin) |
| **Auth Required** | No |

**Query Params:** `page`, `limit`, `status`

**Response (200):**
```json
{ "orders": [], "totalDoc": "number" }
```

---

### 5.2 Search Orders

| Field | Value |
|---|---|
| **Method** | GET |
| **Endpoint** | `/api/orders/search` |
| **Purpose** | Search orders by text or filters |
| **Auth Required** | No |

**Query Params:** `searchText`, `page`, `limit`

---

### 5.3 Dashboard Orders Summary

| Field | Value |
|---|---|
| **Method** | GET |
| **Endpoint** | `/api/orders/dashboard` |
| **Purpose** | Orders summary for dashboard |
| **Auth Required** | No |

---

### 5.4 Dashboard Recent Orders

| Field | Value |
|---|---|
| **Method** | GET |
| **Endpoint** | `/api/orders/dashboard-recent-order` |
| **Purpose** | Most recent orders for dashboard widget |
| **Auth Required** | No |

---

### 5.5 Dashboard Order Count

| Field | Value |
|---|---|
| **Method** | GET |
| **Endpoint** | `/api/orders/dashboard-count` |
| **Purpose** | Total order count by status |
| **Auth Required** | No |

**Response (200):**
```json
{ "pending": "number", "processing": "number", "delivered": "number", "cancel": "number" }
```

---

### 5.6 Dashboard Order Amount

| Field | Value |
|---|---|
| **Method** | GET |
| **Endpoint** | `/api/orders/dashboard-amount` |
| **Purpose** | Revenue totals by status |
| **Auth Required** | No |

---

### 5.7 Best Seller Chart

| Field | Value |
|---|---|
| **Method** | GET |
| **Endpoint** | `/api/orders/best-seller/chart` |
| **Purpose** | Product sales data for best seller chart |
| **Auth Required** | No |

---

### 5.8 Get Orders by Customer (Admin)

| Field | Value |
|---|---|
| **Method** | GET |
| **Endpoint** | `/api/orders/customer/:id` |
| **Purpose** | Orders placed by a specific customer |
| **Auth Required** | No |

---

### 5.9 Get Order by ID (Admin)

| Field | Value |
|---|---|
| **Method** | GET |
| **Endpoint** | `/api/orders/:id` |
| **Purpose** | Retrieve an order by ID |
| **Auth Required** | No |

---

### 5.10 Update Order

| Field | Value |
|---|---|
| **Method** | PUT |
| **Endpoint** | `/api/orders/:id` |
| **Purpose** | Update order status |
| **Auth Required** | No |

**Request Body:**
```json
{ "status": "Pending | Processing | Delivered | Cancel" }
```

---

### 5.11 Delete Order

| Field | Value |
|---|---|
| **Method** | DELETE |
| **Endpoint** | `/api/orders/:id` |
| **Purpose** | Delete an order |
| **Auth Required** | No |

---

### 5.12 Get All Food Orders

| Field | Value |
|---|---|
| **Method** | GET |
| **Endpoint** | `/api/orders/get-all/food-order` |
| **Purpose** | Retrieve all food/meal subscription orders |
| **Auth Required** | No |

---

### 5.13 Get User Subscriptions

| Field | Value |
|---|---|
| **Method** | GET |
| **Endpoint** | `/api/orders/get-All/user-Subscription` |
| **Purpose** | Retrieve all user meal subscriptions |
| **Auth Required** | No |

---

### 5.14 Search User Subscriptions

| Field | Value |
|---|---|
| **Method** | GET |
| **Endpoint** | `/api/orders/get-All/user-Subscription/search` |
| **Purpose** | Search user subscriptions with filters |
| **Auth Required** | No |

**Query Params:** `searchText`, `status`, `page`, `limit`

---

## 6. Product APIs

### 6.1 Add Product

| Field | Value |
|---|---|
| **Method** | POST |
| **Endpoint** | `/api/products/add` |
| **Purpose** | Create a new product |
| **Auth Required** | No |

**Request Body:**
```json
{
  "title": "object (required) — e.g. { en: 'Product Name' }",
  "slug": "string (required)",
  "description": "object",
  "category": "string (required) — Category ObjectId",
  "categories": ["Category ObjectId"],
  "sku": "string",
  "barcode": "string",
  "image": ["string (URLs)"],
  "stock": "number",
  "tag": ["string"],
  "prices": { "originalPrice": "number (required)", "price": "number (required)", "discount": "number" },
  "variants": ["object"],
  "isCombination": "boolean (required)",
  "status": "show | hide"
}
```

---

### 6.2 Add Multiple Products

| Field | Value |
|---|---|
| **Method** | POST |
| **Endpoint** | `/api/products/all` |
| **Purpose** | Bulk insert products |
| **Auth Required** | No |

**Request Body:** Array of product objects

---

### 6.3 Get All Products

| Field | Value |
|---|---|
| **Method** | GET |
| **Endpoint** | `/api/products/` |
| **Purpose** | Retrieve all products |
| **Auth Required** | No |

---

### 6.4 Get Showing Products

| Field | Value |
|---|---|
| **Method** | GET |
| **Endpoint** | `/api/products/show` |
| **Purpose** | Retrieve visible (status=show) products |
| **Auth Required** | No |

---

### 6.5 Get Store Products

| Field | Value |
|---|---|
| **Method** | GET |
| **Endpoint** | `/api/products/store` |
| **Purpose** | Retrieve products for customer store |
| **Auth Required** | No |

---

### 6.6 Get Product by Slug

| Field | Value |
|---|---|
| **Method** | GET |
| **Endpoint** | `/api/products/product/:slug` |
| **Purpose** | Retrieve a single product by slug |
| **Auth Required** | No |

---

### 6.7 Update Product

| Field | Value |
|---|---|
| **Method** | PATCH |
| **Endpoint** | `/api/products/:id` |
| **Purpose** | Update a product |
| **Auth Required** | No |

---

### 6.8 Update Many Products

| Field | Value |
|---|---|
| **Method** | PATCH |
| **Endpoint** | `/api/products/update/many` |
| **Purpose** | Bulk update products |
| **Auth Required** | No |

**Request Body:**
```json
{ "ids": ["Product ObjectId"], "status": "show | hide" }
```

---

### 6.9 Update Product Status

| Field | Value |
|---|---|
| **Method** | PUT |
| **Endpoint** | `/api/products/status/:id` |
| **Purpose** | Toggle product visibility |
| **Auth Required** | No |

**Request Body:**
```json
{ "status": "show | hide" }
```

---

### 6.10 Delete Product

| Field | Value |
|---|---|
| **Method** | DELETE |
| **Endpoint** | `/api/products/:id` |
| **Purpose** | Delete a product |
| **Auth Required** | No |

---

### 6.11 Delete Many Products

| Field | Value |
|---|---|
| **Method** | PATCH |
| **Endpoint** | `/api/products/delete/many` |
| **Purpose** | Bulk delete products |
| **Auth Required** | No |

**Request Body:**
```json
{ "ids": ["Product ObjectId"] }
```

---

## 7. Dish / Menu APIs

### 7.1 Get All Menu

| Field | Value |
|---|---|
| **Method** | GET |
| **Endpoint** | `/api/products/get-all-menu` |
| **Purpose** | Retrieve all dish/menu items |
| **Auth Required** | No |

**Response (200):** Array of Dish objects

---

### 7.2 Get All Menu Dishes

| Field | Value |
|---|---|
| **Method** | GET |
| **Endpoint** | `/api/products/get-all-menu-dishes` |
| **Purpose** | Retrieve active dishes for menu display |
| **Auth Required** | No |

---

### 7.3 Add Dish

| Field | Value |
|---|---|
| **Method** | POST |
| **Endpoint** | `/api/products/add-dish` |
| **Purpose** | Create a new dish/menu item with image upload |
| **Auth Required** | No |
| **Content-Type** | multipart/form-data |

**Request Fields (form-data):**

| Field | Type | Required | Description |
|---|---|---|---|
| primaryDishTitle | string | Yes | Main title of the dish |
| shortDescription | string | Yes | Short summary |
| description | string | Yes | Full description |
| Idescription | string | Yes | Additional info description |
| image | file | Yes | Main dish image |
| dishImage2 | file | No | Secondary dish image |
| cuisine | string | Yes | Cuisine type (e.g. Indian) |
| status | string | Yes | `active` or `inactive` |
| nutritionValues | string[] | Yes | At least one nutrition value |

**Response (201):**
```json
{
  "_id": "string",
  "primaryDishTitle": "string",
  "shortDescription": "string",
  "description": "string",
  "Idescription": "string",
  "image": "string (URL)",
  "dishImage2": "string (URL)",
  "cuisine": "string",
  "status": "active | inactive",
  "nutritionValues": ["string"],
  "createdAt": "date",
  "updatedAt": "date"
}
```

---

### 7.4 Update Dish

| Field | Value |
|---|---|
| **Method** | PUT |
| **Endpoint** | `/api/products/update-dish/:id` |
| **Purpose** | Update an existing dish/menu item |
| **Auth Required** | No |
| **Content-Type** | multipart/form-data |

**URL Params:** `id` — Dish ObjectId

**Request Fields:** Same as Add Dish (all optional for update)

**Response (200):** Updated Dish object

---

## 8. Category APIs

### 8.1 Add Category

| Field | Value |
|---|---|
| **Method** | POST |
| **Endpoint** | `/api/category/add` |
| **Purpose** | Create a product category |
| **Auth Required** | No |

**Request Body:**
```json
{ "name": "object (required)", "description": "object", "slug": "string", "parentId": "string", "parentName": "string", "icon": "string", "status": "show | hide" }
```

---

### 8.2 Get All Categories

| Field | Value |
|---|---|
| **Method** | GET |
| **Endpoint** | `/api/category/` or `/api/category/all` |
| **Purpose** | Retrieve all categories |
| **Auth Required** | No |

---

### 8.3 Get Showing Categories

| Field | Value |
|---|---|
| **Method** | GET |
| **Endpoint** | `/api/category/show` |
| **Purpose** | Retrieve visible categories only |
| **Auth Required** | No |

---

### 8.4 Get Category by ID

| Field | Value |
|---|---|
| **Method** | GET |
| **Endpoint** | `/api/category/:id` |
| **Purpose** | Retrieve a single category |
| **Auth Required** | No |

---

### 8.5 Update Category

| Field | Value |
|---|---|
| **Method** | PUT |
| **Endpoint** | `/api/category/:id` |
| **Purpose** | Update a category |
| **Auth Required** | No |

---

### 8.6 Update Category Status

| Field | Value |
|---|---|
| **Method** | PUT |
| **Endpoint** | `/api/category/status/:id` |
| **Purpose** | Toggle category visibility |
| **Auth Required** | No |

**Request Body:** `{ "status": "show | hide" }`

---

### 8.7 Delete Category

| Field | Value |
|---|---|
| **Method** | DELETE |
| **Endpoint** | `/api/category/:id` |
| **Purpose** | Delete a category |
| **Auth Required** | No |

---

### 8.8 Delete Many Categories

| Field | Value |
|---|---|
| **Method** | PATCH |
| **Endpoint** | `/api/category/delete/many` |
| **Purpose** | Bulk delete categories |
| **Auth Required** | No |

**Request Body:** `{ "ids": ["Category ObjectId"] }`

---

### 8.9 Update Many Categories

| Field | Value |
|---|---|
| **Method** | PATCH |
| **Endpoint** | `/api/category/update/many` |
| **Purpose** | Bulk update categories |
| **Auth Required** | No |

---

## 9. Coupon APIs

### 9.1 Add Coupon

| Field | Value |
|---|---|
| **Method** | POST |
| **Endpoint** | `/api/coupon/add` |
| **Purpose** | Create a discount coupon |
| **Auth Required** | No |

**Request Body:**
```json
{ "title": "object (required)", "couponCode": "string (required)", "startTime": "ISO date string", "endTime": "ISO date string (required)", "discountType": "object", "minimumAmount": "number (required)", "productType": "string", "logo": "string", "status": "show | hide" }
```

---

### 9.2 Add Multiple Coupons

| Field | Value |
|---|---|
| **Method** | POST |
| **Endpoint** | `/api/coupon/add/all` |
| **Purpose** | Bulk insert coupons |
| **Auth Required** | No |

---

### 9.3 Get All Coupons

| Field | Value |
|---|---|
| **Method** | GET |
| **Endpoint** | `/api/coupon/` |
| **Purpose** | Retrieve all coupons |
| **Auth Required** | No |

---

### 9.4 Get Showing Coupons

| Field | Value |
|---|---|
| **Method** | GET |
| **Endpoint** | `/api/coupon/show` |
| **Purpose** | Retrieve enabled coupons |
| **Auth Required** | No |

---

### 9.5 Get Coupon by ID

| Field | Value |
|---|---|
| **Method** | GET |
| **Endpoint** | `/api/coupon/:id` |
| **Purpose** | Retrieve a coupon |
| **Auth Required** | No |

---

### 9.6 Update Coupon

| Field | Value |
|---|---|
| **Method** | PUT |
| **Endpoint** | `/api/coupon/:id` |
| **Purpose** | Update a coupon |
| **Auth Required** | No |

---

### 9.7 Update Coupon Status

| Field | Value |
|---|---|
| **Method** | PUT |
| **Endpoint** | `/api/coupon/status/:id` |
| **Purpose** | Toggle coupon visibility |
| **Auth Required** | No |

---

### 9.8 Delete Coupon

| Field | Value |
|---|---|
| **Method** | DELETE |
| **Endpoint** | `/api/coupon/:id` |
| **Purpose** | Delete a coupon |
| **Auth Required** | No |

---

### 9.9 Delete Many Coupons

| Field | Value |
|---|---|
| **Method** | PATCH |
| **Endpoint** | `/api/coupon/delete/many` |
| **Purpose** | Bulk delete coupons |
| **Auth Required** | No |

---

### 9.10 Update Many Coupons

| Field | Value |
|---|---|
| **Method** | PATCH |
| **Endpoint** | `/api/coupon/update/many` |
| **Purpose** | Bulk update coupons |
| **Auth Required** | No |

---

## 10. Attribute APIs

### 10.1 Add Attribute

| Field | Value |
|---|---|
| **Method** | POST |
| **Endpoint** | `/api/attributes/add` |
| **Purpose** | Create a product attribute (e.g. Size, Color) |
| **Auth Required** | No |

**Request Body:**
```json
{ "name": "object (required)", "status": "show | hide", "variants": [] }
```

---

### 10.2 Add Multiple Attributes

| Field | Value |
|---|---|
| **Method** | POST |
| **Endpoint** | `/api/attributes/add/all` |
| **Purpose** | Bulk insert attributes |
| **Auth Required** | No |

---

### 10.3 Add Child Attribute

| Field | Value |
|---|---|
| **Method** | PUT |
| **Endpoint** | `/api/attributes/add/child/:id` |
| **Purpose** | Add a child value to an attribute |
| **Auth Required** | No |

**URL Params:** `id` — parent Attribute ObjectId

**Request Body:**
```json
{ "name": "string (required)", "status": "show | hide" }
```

---

### 10.4 Get All Attributes

| Field | Value |
|---|---|
| **Method** | GET |
| **Endpoint** | `/api/attributes/` |
| **Purpose** | Retrieve all attributes |
| **Auth Required** | No |

---

### 10.5 Get Showing Attributes

| Field | Value |
|---|---|
| **Method** | GET |
| **Endpoint** | `/api/attributes/show` |
| **Purpose** | Retrieve visible attributes |
| **Auth Required** | No |

---

### 10.6 Get Attribute by ID

| Field | Value |
|---|---|
| **Method** | GET |
| **Endpoint** | `/api/attributes/:id` |
| **Purpose** | Retrieve a single attribute |
| **Auth Required** | No |

---

### 10.7 Get Child Attribute by ID

| Field | Value |
|---|---|
| **Method** | GET |
| **Endpoint** | `/api/attributes/child/:id/:ids` |
| **Purpose** | Retrieve a child attribute |
| **Auth Required** | No |

---

### 10.8 Update Attribute

| Field | Value |
|---|---|
| **Method** | PUT |
| **Endpoint** | `/api/attributes/:id` |
| **Purpose** | Update an attribute |
| **Auth Required** | No |

---

### 10.9 Update Child Attribute

| Field | Value |
|---|---|
| **Method** | PUT |
| **Endpoint** | `/api/attributes/update/child/:attributeId/:childId` |
| **Purpose** | Update a child attribute value |
| **Auth Required** | No |

---

### 10.10 Update Attribute Status

| Field | Value |
|---|---|
| **Method** | PUT |
| **Endpoint** | `/api/attributes/status/:id` |
| **Purpose** | Toggle attribute visibility |
| **Auth Required** | No |

---

### 10.11 Update Child Attribute Status

| Field | Value |
|---|---|
| **Method** | PUT |
| **Endpoint** | `/api/attributes/status/child/:id` |
| **Purpose** | Toggle child attribute visibility |
| **Auth Required** | No |

---

### 10.12 Delete Attribute

| Field | Value |
|---|---|
| **Method** | DELETE |
| **Endpoint** | `/api/attributes/:id` |
| **Purpose** | Delete an attribute |
| **Auth Required** | No |

---

### 10.13 Delete Child Attribute

| Field | Value |
|---|---|
| **Method** | PUT |
| **Endpoint** | `/api/attributes/delete/child/:attributeId/:childId` |
| **Purpose** | Remove a child value from an attribute |
| **Auth Required** | No |

---

### 10.14 Delete Many Attributes

| Field | Value |
|---|---|
| **Method** | PATCH |
| **Endpoint** | `/api/attributes/delete/many` |
| **Purpose** | Bulk delete attributes |
| **Auth Required** | No |

---

### 10.15 Delete Many Child Attributes

| Field | Value |
|---|---|
| **Method** | PATCH |
| **Endpoint** | `/api/attributes/delete/child/many` |
| **Purpose** | Bulk delete child attributes |
| **Auth Required** | No |

---

### 10.16 Update Many Attributes

| Field | Value |
|---|---|
| **Method** | PATCH |
| **Endpoint** | `/api/attributes/update/many` |
| **Purpose** | Bulk update attributes |
| **Auth Required** | No |

---

### 10.17 Update Many Child Attributes

| Field | Value |
|---|---|
| **Method** | PATCH |
| **Endpoint** | `/api/attributes/update/child/many` |
| **Purpose** | Bulk update child attributes |
| **Auth Required** | No |

---

## 11. School APIs

### 11.1 Add School

| Field | Value |
|---|---|
| **Method** | POST |
| **Endpoint** | `/api/schools/add-school` |
| **Purpose** | Register a school |
| **Auth Required** | No |

**Request Body:**
```json
{ "name": "string (required, max 100 chars)", "location": "string (required, max 200 chars)", "lunchTime": "string (required) — HH:MM format" }
```
**Response (201):**
```json
{ "_id": "string", "name": "string", "location": "string", "lunchTime": "string", "createdAt": "date", "updatedAt": "date" }
```

---

### 11.2 Get All Schools

| Field | Value |
|---|---|
| **Method** | GET |
| **Endpoint** | `/api/schools/get-all-schools` |
| **Purpose** | Retrieve all schools |
| **Auth Required** | No |

**Response (200):** Array of School objects

---

### 11.3 Get School by ID

| Field | Value |
|---|---|
| **Method** | GET |
| **Endpoint** | `/api/schools/get-school/:id` |
| **Purpose** | Retrieve a single school |
| **Auth Required** | No |

---

### 11.4 Update School

| Field | Value |
|---|---|
| **Method** | PUT |
| **Endpoint** | `/api/schools/update-school/:id` |
| **Purpose** | Update school info |
| **Auth Required** | No |

**Request Body:**
```json
{ "name": "string", "location": "string", "lunchTime": "string — HH:MM" }
```

---

### 11.5 Delete School

| Field | Value |
|---|---|
| **Method** | DELETE |
| **Endpoint** | `/api/schools/delete-school/:id` |
| **Purpose** | Delete a school |
| **Auth Required** | No |

**Response (200):**
```json
{ "message": "School deleted successfully" }
```

---

## 12. Holiday APIs

### 12.1 Add Holiday

| Field | Value |
|---|---|
| **Method** | POST |
| **Endpoint** | `/api/holidays/add-holiday` |
| **Purpose** | Add a holiday date |
| **Auth Required** | No |

**Request Body:**
```json
{ "date": "ISO date string (required, unique)", "name": "string (required)" }
```
**Response (201):**
```json
{ "_id": "string", "date": "ISO date string", "name": "string", "createdAt": "date" }
```

---

### 12.2 Get All Holidays

| Field | Value |
|---|---|
| **Method** | GET |
| **Endpoint** | `/api/holidays/get-all-holidays` |
| **Purpose** | Retrieve all holidays |
| **Auth Required** | No |

**Response (200):** Array of Holiday objects

---

### 12.3 Update Holiday

| Field | Value |
|---|---|
| **Method** | PUT |
| **Endpoint** | `/api/holidays/update-holiday/:id` |
| **Purpose** | Update a holiday date or name |
| **Auth Required** | No |

**Request Body:**
```json
{ "date": "ISO date string", "name": "string" }
```

---

### 12.4 Delete Holiday

| Field | Value |
|---|---|
| **Method** | DELETE |
| **Endpoint** | `/api/holidays/delete-holiday/:id` |
| **Purpose** | Delete a holiday |
| **Auth Required** | No |

**Response (200):**
```json
{ "message": "Holiday deleted successfully" }
```

---

## 13. Setting APIs

### 13.1 Add Global Setting

| Field | Value |
|---|---|
| **Method** | POST |
| **Endpoint** | `/api/setting/global/add` |
| **Purpose** | Create global application settings |
| **Auth Required** | No |

**Request Body:**
```json
{ "name": "string (required) — 'globalSetting'", "setting": "object" }
```

---

### 13.2 Get Global Setting

| Field | Value |
|---|---|
| **Method** | GET |
| **Endpoint** | `/api/setting/global/all` |
| **Purpose** | Retrieve global settings |
| **Auth Required** | No |

**Response (200):** Setting object `{ name, setting }`

---

### 13.3 Update Global Setting

| Field | Value |
|---|---|
| **Method** | PUT |
| **Endpoint** | `/api/setting/global/update` |
| **Purpose** | Update global settings |
| **Auth Required** | No |

---

### 13.4 Add Store Setting

| Field | Value |
|---|---|
| **Method** | POST |
| **Endpoint** | `/api/setting/store-setting/add` |
| **Purpose** | Create store settings (payment keys, etc.) |
| **Auth Required** | No |

**Request Body:**
```json
{ "name": "storeSetting", "setting": { "stripe_secret": "string", "razorpay_id": "string", "razorpay_secret": "string" } }
```

---

### 13.5 Get Store Setting

| Field | Value |
|---|---|
| **Method** | GET |
| **Endpoint** | `/api/setting/store-setting/all` |
| **Purpose** | Retrieve store settings |
| **Auth Required** | No |

---

### 13.6 Get Store SEO Setting

| Field | Value |
|---|---|
| **Method** | GET |
| **Endpoint** | `/api/setting/store-setting/seo` |
| **Purpose** | Retrieve SEO settings |
| **Auth Required** | No |

---

### 13.7 Update Store Setting

| Field | Value |
|---|---|
| **Method** | PUT |
| **Endpoint** | `/api/setting/store-setting/update` |
| **Purpose** | Update store settings |
| **Auth Required** | No |

---

### 13.8 Add Store Customization

| Field | Value |
|---|---|
| **Method** | POST |
| **Endpoint** | `/api/setting/store/customization/add` |
| **Purpose** | Create UI customization settings |
| **Auth Required** | No |

---

### 13.9 Get Store Customization

| Field | Value |
|---|---|
| **Method** | GET |
| **Endpoint** | `/api/setting/store/customization/all` |
| **Purpose** | Retrieve UI customization settings |
| **Auth Required** | No |

---

### 13.10 Update Store Customization

| Field | Value |
|---|---|
| **Method** | PUT |
| **Endpoint** | `/api/setting/store/customization/update` |
| **Purpose** | Update UI customization settings |
| **Auth Required** | No |

---

## 14. Currency APIs

> All endpoints require `Authorization: Bearer <token>`.

### 14.1 Add Currency

| Field | Value |
|---|---|
| **Method** | POST |
| **Endpoint** | `/api/currency/add` |
| **Purpose** | Add a currency |
| **Auth Required** | Yes |

**Request Body:**
```json
{ "name": "string (required)", "symbol": "string (required)", "isoCode": "string", "status": "show | hide" }
```

---

### 14.2 Add Multiple Currencies

| Field | Value |
|---|---|
| **Method** | POST |
| **Endpoint** | `/api/currency/add/all` |
| **Purpose** | Bulk insert currencies |
| **Auth Required** | Yes |

---

### 14.3 Get All Currencies

| Field | Value |
|---|---|
| **Method** | GET |
| **Endpoint** | `/api/currency/` |
| **Purpose** | Retrieve all currencies |
| **Auth Required** | Yes |

---

### 14.4 Get Showing Currencies

| Field | Value |
|---|---|
| **Method** | GET |
| **Endpoint** | `/api/currency/show` |
| **Purpose** | Retrieve enabled currencies |
| **Auth Required** | Yes |

---

### 14.5 Get Currency by ID

| Field | Value |
|---|---|
| **Method** | GET |
| **Endpoint** | `/api/currency/:id` |
| **Purpose** | Retrieve a currency |
| **Auth Required** | Yes |

---

### 14.6 Update Currency

| Field | Value |
|---|---|
| **Method** | PUT |
| **Endpoint** | `/api/currency/:id` |
| **Purpose** | Update a currency |
| **Auth Required** | Yes |

---

### 14.7 Update Currency Enabled Status

| Field | Value |
|---|---|
| **Method** | PUT |
| **Endpoint** | `/api/currency/status/enabled/:id` |
| **Purpose** | Enable or disable a currency |
| **Auth Required** | Yes |

---

### 14.8 Update Live Exchange Rates Status

| Field | Value |
|---|---|
| **Method** | PUT |
| **Endpoint** | `/api/currency/status/live-exchange-rates/:id` |
| **Purpose** | Toggle live exchange rates for a currency |
| **Auth Required** | Yes |

---

### 14.9 Delete Currency

| Field | Value |
|---|---|
| **Method** | DELETE |
| **Endpoint** | `/api/currency/:id` |
| **Purpose** | Delete a currency |
| **Auth Required** | Yes |

---

### 14.10 Delete Many Currencies

| Field | Value |
|---|---|
| **Method** | PATCH |
| **Endpoint** | `/api/currency/delete/many` |
| **Purpose** | Bulk delete currencies |
| **Auth Required** | Yes |

---

### 14.11 Update Many Currencies

| Field | Value |
|---|---|
| **Method** | PATCH |
| **Endpoint** | `/api/currency/update/many` |
| **Purpose** | Bulk update currencies |
| **Auth Required** | Yes |

---

## 15. Language APIs

### 15.1 Add Language

| Field | Value |
|---|---|
| **Method** | POST |
| **Endpoint** | `/api/language/add` |
| **Purpose** | Add a language |
| **Auth Required** | No |

**Request Body:**
```json
{ "name": "string (required)", "isoCode": "string", "status": "show | hide" }
```

---

### 15.2 Add Multiple Languages

| Field | Value |
|---|---|
| **Method** | POST |
| **Endpoint** | `/api/language/add/all` |
| **Purpose** | Bulk insert languages |
| **Auth Required** | No |

---

### 15.3 Get All Languages

| Field | Value |
|---|---|
| **Method** | GET |
| **Endpoint** | `/api/language/all` |
| **Purpose** | Retrieve all languages |
| **Auth Required** | No |

---

### 15.4 Get Showing Languages

| Field | Value |
|---|---|
| **Method** | GET |
| **Endpoint** | `/api/language/show` |
| **Purpose** | Retrieve active languages |
| **Auth Required** | No |

---

### 15.5 Get Language by ID

| Field | Value |
|---|---|
| **Method** | GET |
| **Endpoint** | `/api/language/:id` |
| **Purpose** | Retrieve a language |
| **Auth Required** | No |

---

### 15.6 Update Language

| Field | Value |
|---|---|
| **Method** | PUT |
| **Endpoint** | `/api/language/:id` |
| **Purpose** | Update a language |
| **Auth Required** | No |

---

### 15.7 Update Language Status

| Field | Value |
|---|---|
| **Method** | PUT |
| **Endpoint** | `/api/language/status/:id` |
| **Purpose** | Toggle language visibility |
| **Auth Required** | No |

---

### 15.8 Update Many Languages

| Field | Value |
|---|---|
| **Method** | PATCH |
| **Endpoint** | `/api/language/update/many` |
| **Purpose** | Bulk update languages |
| **Auth Required** | No |

---

### 15.9 Delete Language

| Field | Value |
|---|---|
| **Method** | PATCH |
| **Endpoint** | `/api/language/:id` |
| **Purpose** | Delete a language |
| **Auth Required** | No |

---

### 15.10 Delete Many Languages

| Field | Value |
|---|---|
| **Method** | PATCH |
| **Endpoint** | `/api/language/delete/many` |
| **Purpose** | Bulk delete languages |
| **Auth Required** | No |

---

## 16. Notification APIs

> All endpoints require `Authorization: Bearer <token>`.

### 16.1 Add Notification

| Field | Value |
|---|---|
| **Method** | POST |
| **Endpoint** | `/api/notification/add` |
| **Purpose** | Create a notification record |
| **Auth Required** | Yes |

**Request Body:**
```json
{ "title": "string", "message": "string", "productId": "string (optional)" }
```

---

### 16.2 Get All Notifications

| Field | Value |
|---|---|
| **Method** | GET |
| **Endpoint** | `/api/notification/` |
| **Purpose** | Retrieve all notifications |
| **Auth Required** | Yes |

---

### 16.3 Update Notification Status

| Field | Value |
|---|---|
| **Method** | PUT |
| **Endpoint** | `/api/notification/:id` |
| **Purpose** | Mark notification as read |
| **Auth Required** | Yes |

---

### 16.4 Update Many Notification Statuses

| Field | Value |
|---|---|
| **Method** | PATCH |
| **Endpoint** | `/api/notification/update/many` |
| **Purpose** | Bulk update notification statuses |
| **Auth Required** | Yes |

---

### 16.5 Delete Notification by ID

| Field | Value |
|---|---|
| **Method** | DELETE |
| **Endpoint** | `/api/notification/:id` |
| **Purpose** | Delete a notification |
| **Auth Required** | Yes |

---

### 16.6 Delete Notification by Product ID

| Field | Value |
|---|---|
| **Method** | DELETE |
| **Endpoint** | `/api/notification/product-id/:id` |
| **Purpose** | Delete all notifications for a product |
| **Auth Required** | Yes |

---

### 16.7 Delete Many Notifications

| Field | Value |
|---|---|
| **Method** | PATCH |
| **Endpoint** | `/api/notification/delete/many` |
| **Purpose** | Bulk delete notifications |
| **Auth Required** | Yes |

---

## 17. SMS APIs

### 17.1 Send Generic SMS

| Field | Value |
|---|---|
| **Method** | POST |
| **Endpoint** | `/api/sms/send` |
| **Purpose** | Send a templated SMS notification |
| **Auth Required** | No |

**Request Body:**
```json
{
  "mobile": "string (required)",
  "messageType": "string (required) — OTP | SIGNUP_CONFIRMATION | PAYMENT_CONFIRMATION | SUBSCRIPTION_RENEWAL | TRIAL_FOOD_CONFIRMATION | TRIAL_FOOD_SMS",
  "variables": ["string (template variables)"],
  "customerId": "string (optional)",
  "orderId": "string (optional)"
}
```
**Response (200):**
```json
{ "message": "SMS sent successfully", "smsLogId": "string", "messageId": "string" }
```

---

### 17.2 Send OTP SMS

| Field | Value |
|---|---|
| **Method** | POST |
| **Endpoint** | `/api/sms/send-otp` |
| **Purpose** | Send OTP via SMS |
| **Auth Required** | No |

**Request Body:**
```json
{ "mobile": "string (required)", "otp": "string (required)", "customerId": "string (optional)" }
```
**Response (200):**
```json
{ "message": "OTP SMS sent successfully", "success": true, "smsLogId": "string" }
```

---

### 17.3 Send Signup Confirmation SMS

| Field | Value |
|---|---|
| **Method** | POST |
| **Endpoint** | `/api/sms/send-signup-confirmation` |
| **Purpose** | Send account creation confirmation SMS |
| **Auth Required** | No |

**Request Body:**
```json
{ "mobile": "string (required)", "customerName": "string (required)", "customerId": "string (optional)" }
```
**Response (200):**
```json
{ "message": "Signup confirmation SMS sent successfully", "success": true, "smsLogId": "string" }
```

---

### 17.4 Send Payment Confirmation SMS

| Field | Value |
|---|---|
| **Method** | POST |
| **Endpoint** | `/api/sms/send-payment-confirmation` |
| **Purpose** | Notify customer of successful payment via SMS |
| **Auth Required** | No |

**Request Body:**
```json
{ "mobile": "string (required)", "amount": "string | number (required)", "customerId": "string (optional)", "orderId": "string (optional)" }
```
**Response (200):**
```json
{ "message": "Payment confirmation SMS sent successfully", "success": true, "smsLogId": "string" }
```

---

### 17.5 Send Trial Food Confirmation SMS

| Field | Value |
|---|---|
| **Method** | POST |
| **Endpoint** | `/api/sms/send-trial-food-confirmation` |
| **Purpose** | Notify parent about trial food schedule |
| **Auth Required** | No |

**Request Body:**
```json
{ "mobile": "string (required)", "childName": "string (required)", "date": "string (required)", "location": "string (required)", "customerId": "string (optional)" }
```
**Response (200):**
```json
{ "message": "Trial food confirmation SMS sent successfully", "success": true, "smsLogId": "string" }
```

---

### 17.6 Send Trial Food Feedback SMS

| Field | Value |
|---|---|
| **Method** | POST |
| **Endpoint** | `/api/sms/send-trial-food-feedback` |
| **Purpose** | Send trial food feedback request to parent |
| **Auth Required** | No |

**Request Body:**
```json
{ "mobile": "string (required)", "parentName": "string (required)", "childName": "string (required)", "feedbackLink": "string (required)", "customerId": "string (optional)" }
```
**Response (200):**
```json
{ "message": "Trial food feedback SMS sent successfully", "success": true, "smsLogId": "string" }
```

---

### 17.7 Get SMS Logs

| Field | Value |
|---|---|
| **Method** | GET |
| **Endpoint** | `/api/sms/logs` |
| **Purpose** | Retrieve SMS logs for authenticated user |
| **Auth Required** | Yes |

**Query Params:** `customerId`, `page` (default: 1), `limit` (default: 10)

**Response (200):**
```json
{
  "smsLogs": [
    { "_id": "string", "mobile": "string", "messageType": "string", "message": "string", "status": "sent | failed | pending", "sentAt": "date", "customerId": "object", "orderId": "object" }
  ],
  "totalPages": "number",
  "currentPage": "number",
  "total": "number"
}
```

---

### 17.8 Get SMS Logs (Admin)

| Field | Value |
|---|---|
| **Method** | GET |
| **Endpoint** | `/api/sms/admin/logs` |
| **Purpose** | Retrieve all SMS logs (admin only) |
| **Auth Required** | Yes (Admin role) |

**Query Params:** Same as 17.7

**Response (200):** Same as 17.7

---

## 18. Payment / CCAvenue APIs

### 18.1 CCAvenue Payment Response

| Field | Value |
|---|---|
| **Method** | POST |
| **Endpoint** | `/api/ccavenue/response` |
| **Purpose** | Handle CCAvenue callback after subscription payment |
| **Auth Required** | No |

**Request Body:** `encResp=<encrypted string>` (CCAvenue form POST)

**Response:** Redirect or JSON status

---

### 18.2 Holiday Payment Response

| Field | Value |
|---|---|
| **Method** | POST |
| **Endpoint** | `/api/ccavenue/response/holiydayPayment` _(note: "holiyday" is a typo in the route definition)_ |
| **Purpose** | Handle CCAvenue callback for holiday payment |
| **Auth Required** | No |

**Request Body:** `encResp=<encrypted string>`

---

### 18.3 Add Child Payment Response

| Field | Value |
|---|---|
| **Method** | POST |
| **Endpoint** | `/api/ccavenue/response/addChildPayment` |
| **Purpose** | Handle CCAvenue callback for add-child payment |
| **Auth Required** | No |

**Request Body:** `encResp=<encrypted string>`

---

### 18.4 Get Holiday Payments by Date

| Field | Value |
|---|---|
| **Method** | POST |
| **Endpoint** | `/api/ccavenue/holiday-payments` |
| **Purpose** | Retrieve holiday payments for a date and user |
| **Auth Required** | No |

**Request Body:**
```json
{ "date": "ISO date string (required)", "userId": "string (required)" }
```
**Response (200):**
```json
[{ "_id": "string", "userId": "string", "date": "date", "amount": "number", "status": "string", "transactionId": "string" }]
```

---

### 18.5 Local Payment Success

| Field | Value |
|---|---|
| **Method** | POST |
| **Endpoint** | `/api/ccavenue/local-success` |
| **Purpose** | Record a local/offline subscription payment |
| **Auth Required** | No |

**Request Body:**
```json
{ "userId": "string (required)", "orderId": "string (required)", "amount": "number (required)", "transactionId": "string" }
```
**Response (200):**
```json
{ "message": "Payment recorded successfully" }
```

---

### 18.6 Local Add Child Payment

| Field | Value |
|---|---|
| **Method** | POST |
| **Endpoint** | `/api/ccavenue/local-success/local-add-childPayment` |
| **Purpose** | Record local payment for adding a new child |
| **Auth Required** | No |

**Request Body:**
```json
{ "userId": "string (required)", "childId": "string (required)", "amount": "number (required)", "orderId": "string", "transactionId": "string" }
```
**Response (200):**
```json
{ "message": "Child payment recorded successfully" }
```

---

## Error Responses

| HTTP Status | Meaning |
|---|---|
| `200` | Success |
| `201` | Resource created |
| `400` | Bad request — missing or invalid fields |
| `401` | Unauthorized — invalid or missing JWT token |
| `403` | Forbidden — resource already exists |
| `404` | Not found |
| `429` | Too many requests — rate limit exceeded |
| `500` | Internal server error |

**Error Response Body:**
```json
{ "message": "Human-readable error description" }
```

---

## Authentication

1. Call `/api/admin/login` or `/api/customer/login` (or `/api/customer/verifyOtp`) to receive a `token`.
2. Include in subsequent requests:
   ```
   Authorization: Bearer <token>
   ```
**Token expiry:** 1 day

**Protected route groups:**
- `/api/order/*` — customer JWT required
- `/api/currency/*` — JWT required
- `/api/notification/*` — JWT required
- `/api/sms/logs` — JWT required
- `/api/sms/admin/logs` — JWT + Admin role required

---

## Data Models Summary

| Model | Key Fields |
|---|---|
| **Customer** | name, email, phone, address, city, country, image, freeTrial |
| **Admin** | name, email, phone, role (Admin/Super Admin/etc.), status, access_list, image |
| **Product** | title, slug, category, prices (originalPrice, price, discount), variants, isCombination, status |
| **Dish** | primaryDishTitle, shortDescription, description, Idescription, image, cuisine, status, nutritionValues |
| **Order** | user, cart, user_info, subTotal, shippingCost, discount, total, paymentMethod, status (Pending/Processing/Delivered/Cancel) |
| **Category** | name, slug, parentId, parentName, icon, status |
| **Coupon** | title, couponCode, startTime, endTime, discountType, minimumAmount, productType, status |
| **Form** | user, step, parentDetails, subscriptions, paymentStatus, subscriptionCount, wallet |
| **Subscription** | user, planId, startDate, endDate, workingDays, price, orderId, status (active/upcoming/deactivated/pending_payment), children |
| **Child** | user, childFirstName, childLastName, dob, school, location, lunchTime, childClass, section, allergies |
| **School** | name, location, lunchTime |
| **Holiday** | date (unique), name |
| **SmsLog** | mobile, messageType, message, status (sent/failed/pending), customerId, orderId, sentAt |
| **Otp** | mobile, otp, expiresAt |
| **Setting** | name, setting (flexible JSON object) |
| **Currency** | name, symbol, isoCode, status, liveExchangeRates |
| **Language** | name, isoCode, status |
| **Notification** | title, message, productId, status |
