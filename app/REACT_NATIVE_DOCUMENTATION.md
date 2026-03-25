# LunchBowl React Native App — Frontend Flow, Backend Collaboration & Completion Status

**Application:** `app/` (React Native 0.74 + TypeScript)  
**Goal:** Mirror the complete user journey of the `store-without-stripe` web frontend as a native mobile app  
**API Base URL (dev):** `https://dev-api.lunchbowl.co.in/api`  
**API Base URL (prod):** `https://api.lunchbowl.co.in/api`

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Frontend Website Flow (store-without-stripe)](#2-frontend-website-flow-store-without-stripe)
3. [How the Frontend Collaborates with the Backend](#3-how-the-frontend-collaborates-with-the-backend)
4. [React Native App — Current Screen Inventory](#4-react-native-app--current-screen-inventory)
5. [Feature-by-Feature Completion Status](#5-feature-by-feature-completion-status)
6. [What Needs to Be Updated / Built in the React Native App](#6-what-needs-to-be-updated--built-in-the-react-native-app)
7. [API Endpoint Mapping: Web vs React Native](#7-api-endpoint-mapping-web-vs-react-native)
8. [Navigation Structure](#8-navigation-structure)
9. [State Management Architecture](#9-state-management-architecture)
10. [Known Issues & Gaps](#10-known-issues--gaps)

---

## 1. Architecture Overview

The LunchBowl platform consists of three parts that share the same backend API:

```
┌─────────────────────────────────────────────────────────────┐
│                   SHARED BACKEND API                        │
│           https://api.lunchbowl.co.in/api                   │
│  (Node.js / Express + MongoDB)                              │
└────────────┬───────────────────────────┬────────────────────┘
             │                           │
    ┌────────▼───────┐         ┌─────────▼──────────┐
    │ store-without- │         │ app/ (React Native) │
    │ stripe         │         │ iOS + Android       │
    │ (Next.js 14)   │         │ TypeScript          │
    └────────────────┘         └────────────────────┘
```

Both the web and mobile apps call the **same REST API endpoints** using Bearer JWT tokens stored in cookies (web) or AsyncStorage (mobile).

---

## 2. Frontend Website Flow (store-without-stripe)

### 2.1 Overall User Journey

The web frontend guides a parent through the following flow from first visit to daily usage:

```
[Landing Page] → [Sign Up / Login] → [Data Routing Check]
                                            ↓
                             ┌──────────────┴──────────────┐
                             │  step < 4? (Incomplete)      │  step = 4 (Complete)
                             ↓                             ↓
                  [Profile Step Form]         [Menu Calendar Page]
                  Step 1: Parent Details           ↓
                  Step 2: Child Details     [View/Edit Meal Calendar]
                  Step 3: Subscription Plan  [Saved Meals / Food List]
                  Step 4: Payment (CCAvenue)  [Holiday Management]
                             ↓
                    [Payment Success/Fail]
                             ↓
                    [Menu Calendar Page]
```

### 2.2 Authentication Flow (Web)

```
User visits /auth/login
    ↓
Option A: Phone OTP Login (Primary)
    → Enter phone number
    → POST /customer/sendOtp  { mobile, path: "logIn" }
    → Receive OTP via SMS
    → POST /customer/verifyOtp  { mobile, otp, path: "logIn-otp" }
    → Receive { success, token, _id, name, email, phone, freeTrial, role }
    → NextAuth.signIn("credentials", { token, email, name, ... })
    → Session stored in NextAuth cookie
    → Redirect → /user/DataRoutingPage

Option B: Email Verification (New Registration)
    → POST /customer/verify-email  { name, email, password }
    → Email link sent with JWT token
    → User clicks link → /auth/email-verification/[token]
    → POST /customer/register/:token
    → Session created → Redirect

Option C: OAuth (Google / GitHub / Facebook)
    → NextAuth OAuth provider flow
    → POST /customer/signup/oauth  { name, email, image }
    → Session created → Redirect

After login, /user/DataRoutingPage checks:
    → POST /customer/Step-Check  { _id, path: "Step-Check" }
    → If step == 4 → redirect /user/menuCalendarPage
    → If step < 4 → redirect /user/profile-Step-Form
```

### 2.3 Registration / Onboarding Flow (Web — Profile Step Form)

The multi-step form at `/user/profile-Step-Form` submits all data via a single endpoint:

```
POST /customer/stepForm-Register
Body: { formData, step, path, payload, _id }

Step 1 — Parent Details (path: "step-Form-ParentDetails")
    Fields: fatherFirstName, fatherLastName, motherFirstName, motherLastName,
            mobile, email, address, pincode, city, state, country
    → Backend saves to Form.parentDetails, sets step=1

Step 2 — Child Details (path: "step-Form-ChildDetails")
    Fields: childFirstName, childLastName, dob, school, location,
            lunchTime, childClass, section, allergies
    → Multiple children supported (tabs)
    → Backend saves to Form.children[], sets step=2

Step 3 — Subscription Plan (path: "step-Form-SubscriptionPlan")
    Fields: startDate, endDate, workingDays (selected from calendar),
            planType, price (calculated per day × working days)
    → GET /customer/get-plan-price/:id to calculate price
    → Backend saves to Form.subscriptionPlan, sets step=3

Step 4 — Payment (path: "step-Form-Payment")
    → CCAvenue payment gateway (WebView on mobile / redirect on web)
    → POST /ccavenue/initiate   { orderId, amount, customerId, ... }
    → Redirect to CCAvenue gateway
    → Callback: POST /ccavenue/response  (backend processes payment)
    → On success: sets Form.step=4, paymentStatus="paid"
    → Redirect to /payment/success or /payment/failed
```

### 2.4 Menu Calendar Flow (Web — Daily Use)

```
/user/menuCalendarPage   (requires step=4)
    ↓
Load calendar data:
    → POST /customer/get-Menu-Calendar  { _id, path: "get-Menu-Calendar" }
    → Returns: { childId, date, food } for all booked dates

Load saved meals:
    → POST /customer/get-saved-meals  { _id, path: "get-saved-meals" }
    → Returns meals already selected per child per date

Load menu dishes (what can be selected):
    → GET /products/get-all-menu-dishes
    → Returns active dishes with nutrition values

Load holidays:
    → GET /holidays/get-all-holidays
    → Returns blocked/holiday dates

Save meal selection:
    → POST /customer/save-Menu-Calendar  { _id, path, data: [{ childId, date, food }] }

Delete a meal:
    → POST /customer/delete-meal  { childId, date, mealId }
    → Credits wallet balance on deletion
```

### 2.5 Wallet & Transaction Flow (Web)

```
/user/wallet  →  POST /customer/get-payments  { userId }
                 Returns: payment history with wallet credits

/user/transaction-page  →  Lists all transactions, debits, credits
```

### 2.6 Order History Flow (Web)

```
/user/my-orders  →  GET /order?page=1&limit=8
                    Returns paginated order history

/order/[id]     →  GET /order/:id
                    Returns order detail + invoice data
                    → Print/download PDF invoice
                    → POST /order/customer/invoice (email invoice)
```

### 2.7 Subscription Renewal Flow (Web)

```
/user/renew-subscription
    → Repeats steps 3 (subscription plan) and 4 (payment)
    → POST /customer/stepForm-Register  path: "step-Form-Renew-SubscriptionPlan"
    → Payment via CCAvenue
    → On success, subscription extended
```

### 2.8 Account Management Flow (Web)

```
/user/update-profile  →  PUT /customer/:id
/user/change-password  →  POST /customer/change-password
/user/add-child        →  POST /customer/stepForm-Register  (new child tab)
/user/add-shipping-address  →  POST /customer/shipping/address/:id
/user/my-account       →  GET /customer/:id (profile display)
```

---

## 3. How the Frontend Collaborates with the Backend

### 3.1 Authentication Token Flow

```
Web (store-without-stripe):
  1. Login → receive token from backend
  2. NextAuth stores token in encrypted session cookie
  3. UserContext reads session, calls setToken(token)
  4. Axios instance: headers.Authorization = "Bearer {token}"
  5. All subsequent API calls include the Bearer token

Mobile (React Native):
  1. Login → receive token from backend  
  2. AuthContext stores token in AsyncStorage (key: "token")
  3. Axios interceptor: reads AsyncStorage on every request
  4. httpAxiosClient: config.headers.Authorization = "Bearer {token}"
  5. Auto-logout on 401 response (clears AsyncStorage + resets state)
```

### 3.2 Registration Step Tracking

Both web and mobile use the same `step` field in the `Form` model to track onboarding progress:

```
Backend Form model (backend/models/Form.js):
  { userId, step, parentDetails, children[], subscriptionPlan, paymentStatus }

Step values:
  0 = Account created, no form data
  1 = Parent details saved
  2 = Child details saved  
  3 = Subscription plan saved
  4 = Payment complete — user has full access to menu calendar

API: POST /customer/Step-Check  { _id, path: "Step-Check" }
Response: { success, data: { step, ... } }

Web: Checks step on every login via DataRoutingPage
Mobile: Checks step on MyPlan tab mount via RegistrationContext
```

### 3.3 CCAvenue Payment Collaboration

```
Web Flow:
  1. Frontend builds payment payload
  2. POST /ccavenue/initiate → backend returns encrypted request
  3. Browser redirected to CCAvenue gateway
  4. CCAvenue POSTs response to backend: POST /ccavenue/response
  5. Backend decrypts, validates, saves payment, updates step=4
  6. Backend redirects customer to frontend success/failure URL

Mobile Flow (React Native):
  1. Frontend reads Form data: GET /customer/form/:userId
  2. Builds CCAvenue payment object locally using crypto-js
  3. Encrypts with CCAvenue working_key (AES-128-CBC)
  4. Opens PaymentWebView → POST to CCAvenue gateway
  5. WebView intercepts redirect to /ccavenue/response URL
  6. Same backend response handler processes payment
  7. WebView navigates to MyPlan on success or Registration on failure
```

### 3.4 Key Backend Endpoints Used by Both Platforms

| Feature | Endpoint | Method | Auth Required |
|---|---|---|---|
| Send OTP | `/customer/sendOtp` | POST | No |
| Verify OTP / Login | `/customer/verifyOtp` | POST | No |
| Check registration step | `/customer/Step-Check` | POST | Yes |
| Submit form (any step) | `/customer/stepForm-Register` | POST | Yes |
| Get form data | `/customer/form/:userId` | GET | Yes |
| Get account details | `/customer/account-details` | POST | Yes |
| Get all children | `/customer/get-all-children` | POST | Yes |
| Get menu calendar | `/customer/get-Menu-Calendar` | POST | Yes |
| Save menu calendar | `/customer/save-Menu-Calendar` | POST | Yes |
| Get saved meals | `/customer/get-saved-meals` | POST | Yes |
| Delete meal | `/customer/delete-meal` | POST | Yes |
| Get holidays | `/holidays/get-all-holidays` | GET | No |
| Get menu dishes | `/products/get-all-menu-dishes` | GET | No |
| Get all schools | `/schools/get-all-schools` | GET | No |
| Get plan price | `/customer/get-plan-price/:id` | GET | Yes |
| Get payments | `/customer/get-payments` | POST | Yes |
| Get paid holidays | `/customer/get-paid-holidays` | POST | Yes |
| CCAvenue initiate | `/ccavenue/initiate` | POST | Yes |
| CCAvenue response | `/ccavenue/response` | POST | No (gateway callback) |
| Get order by ID | `/order/:id` | GET | Yes |
| Get customer orders | `/order` | GET | Yes |

---

## 4. React Native App — Current Screen Inventory

### 4.1 Onboarding & Auth Screens

| Screen | File | Status |
|---|---|---|
| Splash screen | `screens/Onboarding/SplashScreen.tsx` | ✅ Complete |
| Welcome screen | `screens/Onboarding/WelcomeScreen.tsx` | ✅ Complete |
| Walkthrough slides | `screens/Onboarding/WalkThroughScreen.tsx` | ✅ Complete |
| Login (Phone OTP) | `screens/Auth/Login/LoginScreen.tsx` | ✅ Complete |
| OTP Verification | `screens/Auth/Login/OtpVerificationScreen.tsx` | ✅ Complete |
| Sign Up | `screens/Auth/Signup/SignupScreen.tsx` | ✅ Complete |
| Google Auth | `screens/Auth/GoogleAuth/GoogleAuthScreen.tsx` | ⚠️ Partial (screen exists, integration incomplete) |
| Forgot Password — Email form | `screens/Auth/ForgotPassword/ForgotEmailFormScreen.tsx` | ❌ Commented out (all code commented) |
| Forgot Password — Enter OTP | `screens/Auth/ForgotPassword/EnterOTPScreen.tsx` | ❌ Commented out |
| Forgot Password — New Password | `screens/Auth/ForgotPassword/NewPasswordScreen.tsx` | ❌ Commented out |

### 4.2 Home / Dashboard Screens

| Screen | File | Status |
|---|---|---|
| Home screen | `screens/Dashboard/HomeScreen.tsx` | ✅ Complete |
| Promo banner carousel | `screens/Dashboard/Components/Carousel.tsx` | ✅ Complete |
| Free trial card & modal | `screens/Dashboard/Components/FreeTrialCard.tsx` + `FreeTrialModal.tsx` | ✅ Complete |
| Header with user greeting | `screens/Dashboard/Components/Header.tsx` | ✅ Complete |
| Schools marquee | `screens/Dashboard/Components/SchoolsServes.tsx` | ✅ Complete |
| Popular menus marquee | `screens/Dashboard/Components/PopularMenusMarquee.tsx` | ✅ Complete |
| Search bar | `screens/Dashboard/Components/Search.tsx` | ✅ Complete |
| Quick actions bar | `screens/Dashboard/Components/QuickActions.tsx` | ✅ Complete |
| Highlights section | `screens/Dashboard/Components/Highlights.tsx` | ✅ Complete |
| Dietary tips | `screens/Dashboard/Highlights/DietaryTips/DietaryTipsScreen.tsx` | ✅ Complete |

### 4.3 Menu Screens

| Screen | File | Status |
|---|---|---|
| Meal category & list | `screens/Menu/Menu.tsx` | ✅ Complete |
| Category item | `screens/Menu/Components/CategoryItem.tsx` | ✅ Complete |
| Meal card | `screens/Menu/Components/MealCard.tsx` | ✅ Complete |
| Meal detail | `screens/Menu/MealDetailScreen.tsx` | ✅ Complete |

### 4.4 My Plan Screens (Subscription & Calendar)

| Screen | File | Status |
|---|---|---|
| My Plan (calendar view) | `screens/MyPlan/Calender.tsx` | ✅ Complete |
| Menu calendar component | `screens/MyPlan/Components/MenueCalender.tsx` | ✅ Complete |
| Food list screen | `screens/MyPlan/FoodScreen.tsx` | ✅ Complete |
| Food list card | `screens/MyPlan/Components/FoodListCard.tsx` | ✅ Complete |
| Holiday list card | `screens/MyPlan/Components/HolidayListCard.tsx` | ✅ Complete |
| Plan summary card | `screens/MyPlan/Components/MyPlan.tsx` | ✅ Complete |
| Menu selection screen | `screens/MyPlan/MenuSelection.tsx` | ✅ Complete |
| Colors legend | `screens/MyPlan/Components/ColorsLegend.tsx` | ✅ Complete |

### 4.5 Subscription / Registration Screens

| Screen | File | Status |
|---|---|---|
| Registration multi-step form | `screens/Subscription/Registration.tsx` | ✅ Complete |
| Initial screen (before form) | `screens/Subscription/Components/InitialScreen.tsx` | ✅ Complete |
| Parent details step | `screens/Subscription/Components/forms/ParentDetails.tsx` | ✅ Complete |
| Child details step | `screens/Subscription/Components/forms/ChildDetails.tsx` | ✅ Complete |
| Subscription plan step | `screens/Subscription/Components/forms/Subscription.tsx` | ✅ Complete |
| Time range picker | `screens/Subscription/Components/TimeRangePicker.tsx` | ✅ Complete |
| Payment options step | `screens/Subscription/Components/forms/PaymentOptions.tsx` | ✅ Complete |
| CCAvenue WebView payment | `screens/PaymentWebView.tsx` | ✅ Complete |

### 4.6 History / Orders Screens

| Screen | File | Status |
|---|---|---|
| Order history list | `screens/History/OrderHistoryScreen.tsx` | ⚠️ Partial — uses **mock data**, not connected to API |
| Order history detail | `screens/History/HistoryDetailPage.tsx` | ⚠️ Partial — uses **mock data** |
| Order card | `screens/History/Components/OrderCard.tsx` | ✅ Complete (UI only) |

### 4.7 Settings Screens

| Screen | File | Status |
|---|---|---|
| Settings menu | `screens/Settings/SettingScreen.tsx` | ✅ Complete |
| Edit profile | `screens/Settings/EditProfile/EditProfileScreen.tsx` | ✅ Complete |
| Parent & child info | `screens/Settings/ParentChildInfo/ParentChildInfoScreen.tsx` | ⚠️ Partial — uses **mock data** |
| Notifications | `screens/Notification/Notifications.tsx` | ⚠️ Partial — uses **mock data** |
| Offers & Coupons | `screens/Settings/Offers/OffersScreen.tsx` | ⚠️ Partial — uses **mock data** |
| Offer detail | `screens/Settings/Offers/OfferDetailScreen.tsx` | ⚠️ Partial (UI only) |
| FAQ | `screens/Settings/Faq/Faq.tsx` | ✅ Complete (static content) |
| Help center | `screens/Settings/HelpCenter/Help.tsx` | ✅ Complete (static content) |
| About us | `screens/Settings/AboutUs/About.tsx` | ✅ Complete (static content) |
| Privacy policy | `screens/Settings/PrivacyPolicy/PrivacyPolicy.tsx` | ✅ Complete (static content) |

### 4.8 Other Screens

| Screen | File | Status |
|---|---|---|
| 404 / Under construction | `screens/404Screen.tsx` | ✅ Complete |
| Offline screen | `screens/OfflineScreen.tsx` | ✅ Complete |

---

## 5. Feature-by-Feature Completion Status

### Legend
- ✅ **Complete** — Fully implemented and connected to backend API
- ⚠️ **Partial** — UI built but using mock data OR logic incomplete
- ❌ **Missing** — Not started, screen not created, or fully commented out
- 🔄 **Needs Update** — Exists but has a bug or uses wrong API endpoint

### 5.1 Authentication

| Feature | Web Status | App Status | Notes |
|---|---|---|---|
| Phone OTP login | ✅ | ✅ | `/customer/sendOtp` + `/customer/verifyOtp` |
| OTP verification screen | ✅ | ✅ | Navigates correctly after OTP |
| Sign up (new user) | ✅ | ✅ | Same OTP flow with `path: "signUp"` |
| Google OAuth login | ✅ | ⚠️ | Screen exists but not fully integrated |
| Facebook OAuth login | ✅ | ❌ | Not implemented |
| Email/password login | ✅ | ❌ | Web uses this; RN only uses OTP |
| Forgot password (email) | ✅ | ❌ | All 3 screens fully commented out |
| Email verification flow | ✅ | ❌ | Not needed for OTP-first mobile |
| Logout | ✅ | ✅ | Clears AsyncStorage, resets auth context |
| Session persistence | ✅ | ✅ | AsyncStorage + AuthContext |
| Auto-login on reopen | ✅ | ✅ | isTokenAvailable() on app start |
| Role-based routing | ✅ | ⚠️ | userRole stored but admin route not built |

### 5.2 Onboarding Registration (Multi-Step Form)

| Feature | Web Status | App Status | Notes |
|---|---|---|---|
| Step routing (DataRoutingPage) | ✅ | ✅ | RegistrationContext checks step |
| Step 1: Parent details | ✅ | ✅ | Connected to `/customer/stepForm-Register` |
| Step 2: Child details | ✅ | ✅ | Multiple children supported |
| Step 3: Subscription plan | ✅ | ✅ | Includes working day calendar |
| Step 4: CCAvenue payment | ✅ | ✅ | WebView payment flow |
| School dropdown (from API) | ✅ | ✅ | `/schools/get-all-schools` |
| Plan price calculation | ✅ | ⚠️ | `/customer/get-plan-price/:id` exists in API but app may use hardcoded value |
| Pre-filling saved form data | ✅ | ✅ | Loads from UserDataContext |
| Add another child | ✅ | ⚠️ | UI exists but "Add Child" from Settings not fully connected |
| Payment success redirect | ✅ | ✅ | WebView detects response URL and navigates |
| Payment failure redirect | ✅ | ✅ | WebView detects cancel URL |

### 5.3 Menu Calendar (Daily Use — Core Feature)

| Feature | Web Status | App Status | Notes |
|---|---|---|---|
| Calendar view | ✅ | ✅ | Shows months, subscription dates |
| Load holidays | ✅ | ✅ | `/holidays/get-all-holidays` via calenderContext |
| Color-coded dates | ✅ | ✅ | Booked/holiday/available colors |
| Navigate months | ✅ | ✅ | Previous/next month on calendar |
| View saved meals | ✅ | ✅ | Food list via FoodContext |
| Select meal for date | ✅ | ✅ | MenuSelection → save-Menu-Calendar |
| Delete a meal | ✅ | ✅ | `/customer/delete-meal` |
| Holiday list display | ✅ | ✅ | HolidayListCard |
| Wallet credit on delete | ✅ | ❌ | Backend does this, but app has no wallet screen |

### 5.4 Menu / Dish Browsing

| Feature | Web Status | App Status | Notes |
|---|---|---|---|
| Browse all dishes | ✅ | ✅ | `/products/get-all-menu-dishes` via MealContext |
| Category filter | ✅ | ✅ | Cuisine-based categories |
| Search dishes | ✅ | ✅ | Local filter in MealCategoryScreen |
| Dish detail page | ✅ | ✅ | Nutrition values, description |
| Loading skeleton | ✅ | ✅ | MealCategorySkeleton |
| Offline handling | N/A | ✅ | OfflineNotice component |

### 5.5 Order History

| Feature | Web Status | App Status | Notes |
|---|---|---|---|
| Order history list | ✅ | ⚠️ | **MOCK DATA ONLY** — `SHOW_MOCK_DATA = true` flag |
| Order detail / invoice | ✅ | ⚠️ | **MOCK DATA ONLY** |
| Search orders | ✅ | ⚠️ | Local search on mock data |
| Sort orders | ✅ | ⚠️ | Local sort on mock data |
| Email invoice | ✅ | ❌ | Not implemented |
| Download PDF invoice | ✅ | ❌ | Not implemented |

### 5.6 User Profile & Settings

| Feature | Web Status | App Status | Notes |
|---|---|---|---|
| Edit profile (name, email) | ✅ | ✅ | Connected to `/customer/account-details` |
| Upload profile photo | ✅ | ✅ | Image picker (upload not wired to API yet) |
| Change password | ✅ | ❌ | No change-password screen in RN |
| View parent info | ✅ | ⚠️ | ParentChildInfoScreen uses **mock data** |
| View child info | ✅ | ⚠️ | ParentChildInfoScreen uses **mock data** |
| Add child (from settings) | ✅ | ⚠️ | UI exists but not connected |
| Edit child info | ✅ | ❌ | Not implemented |
| Shipping addresses | ✅ | ❌ | Not implemented (not needed for meal delivery) |

### 5.7 Wallet & Payments

| Feature | Web Status | App Status | Notes |
|---|---|---|---|
| Wallet screen | ✅ | ❌ | No wallet screen in RN |
| Transaction history | ✅ | ❌ | No transaction screen in RN |
| View paid holidays | ✅ | ❌ | Not implemented in RN |
| Holiday payment | ✅ | ❌ | Not implemented in RN |

### 5.8 Notifications

| Feature | Web Status | App Status | Notes |
|---|---|---|---|
| In-app notification list | ✅ | ⚠️ | **MOCK DATA ONLY** |
| Firebase push notifications | ❌ | ✅ | `@react-native-firebase/messaging` integrated |
| Firebase Firestore (notifications) | ❌ | ✅ | `@react-native-firebase/firestore` integrated |
| Notification bell animation | ❌ | ✅ | AnimatedBell component |
| Real-time notifications | ❌ | ✅ | useFirebaseNotifications hook |

### 5.9 Offers & Coupons

| Feature | Web Status | App Status | Notes |
|---|---|---|---|
| Offers screen | ✅ | ⚠️ | **MOCK DATA ONLY** (mockOffers array) |
| Coupon list | ✅ | ⚠️ | Mock tab in OffersScreen |
| Apply coupon at checkout | ✅ | ❌ | Not implemented |

### 5.10 Subscription Renewal

| Feature | Web Status | App Status | Notes |
|---|---|---|---|
| Renew subscription flow | ✅ | ❌ | Not implemented in RN |
| Renewal date picker | ✅ | ❌ | Not implemented |
| Renewal payment | ✅ | ❌ | Not implemented |

### 5.11 Static / Informational Pages

| Feature | Web Status | App Status | Notes |
|---|---|---|---|
| About us | ✅ | ✅ | Static content |
| FAQ | ✅ | ✅ | Static content |
| Privacy policy | ✅ | ✅ | Static content |
| Help center | ✅ | ✅ | Static content / WhatsApp button |
| Contact us | ✅ | ❌ | Not implemented (WhatsApp serves this) |
| Terms & conditions | ✅ | ✅ | TermsAndPolicyScreen |
| Free trial landing page | ✅ | ✅ | FreeTrialCard + FreeTrialModal |

---

## 6. What Needs to Be Updated / Built in the React Native App

### 6.1 HIGH PRIORITY — Core Features Missing

#### A. Connect Order History to Real API

**File:** `app/src/screens/History/OrderHistoryScreen.tsx`

The screen currently has `const SHOW_MOCK_DATA = true` and displays hardcoded orders. This needs to connect to:

```typescript
// Required: Create a new API file
// app/src/api/OrderApi/orderApi.ts
GET /order?page=1&limit=8   (customer's orders, requires auth)
GET /order/:id              (order detail)
```

**What to update:**
- Remove the `mockOrders` array and `SHOW_MOCK_DATA` flag
- Create `app/src/api/OrderApi/orderApi.ts` with `getCustomerOrders()` and `getOrderById()`
- Create `app/src/services/OrderService/orderService.ts`
- Connect `OrderHistoryScreen` to fetch real data
- Connect `HistoryDetailPage` to display real order detail

#### B. Connect Parent/Child Info Screen to Real API

**File:** `app/src/screens/Settings/ParentChildInfo/ParentChildInfoScreen.tsx`

Currently has `const USE_MOCK_DATA = true`. Should use the existing `RegistrationService.getRegisterdUserData()` and `UserDataContext`.

**What to update:**
- Remove `USE_MOCK_DATA` flag and mock data
- Use `useUserProfile()` context (already available) to get parent/children data
- Connect "Add Child" button to the Registration flow (new child step)
- Connect "Edit" button for children

#### C. Wallet & Transaction Screens

**No equivalent screens exist in RN app.**

The web app has `/user/wallet` and `/user/transaction-page`. These should be added to Settings:

```typescript
// New API calls needed:
POST /customer/get-payments  { userId }  → transaction history + wallet balance

// New screens to create:
app/src/screens/Settings/Wallet/WalletScreen.tsx
app/src/screens/Settings/Wallet/TransactionScreen.tsx
```

Add "Wallet" as a settings menu item in `SettingScreen.tsx`.

#### D. Subscription Renewal Flow

**No renewal flow exists in RN app.**

The web app has a complete renewal flow at `/user/renew-subscription` and `/user/RenewSubscriptionPage`. In the RN app, users whose subscription has ended should be prompted to renew.

**What to build:**
1. Detect expired subscription in `RegistrationContext` (check `endDate` from `profileData.subscriptionPlan`)
2. Create `screens/Subscription/RenewSubscription.tsx` — same as Registration but for renewal
3. Call the same endpoint: `POST /customer/stepForm-Register` with `path: "step-Form-Renew-SubscriptionPlan"`
4. Add renewal prompt card to `MyPlan` screen when subscription is expired

#### E. Change Password Screen

**Web:** `/user/change-password` → `POST /customer/change-password`

**What to build:**
```typescript
// New screen:
app/src/screens/Settings/ChangePassword/ChangePasswordScreen.tsx

// API call:
POST /customer/change-password  { userId, currentPassword, newPassword }
```

Add to Settings menu in `SettingScreen.tsx`.

#### F. Forgot Password Flow

**Files:** `ForgotEmailFormScreen.tsx`, `EnterOTPScreen.tsx`, `NewPasswordScreen.tsx` — all code is commented out.

**What to update:**
- The web uses email-based forgot password (`PUT /customer/forget-password`)
- The mobile app uses phone OTP for login; adapt forgot password to also use OTP:
  1. User enters phone number
  2. `POST /customer/sendOtp  { mobile, path: "forgotPassword" }`  
  3. User enters OTP → `POST /customer/verifyOtp  { mobile, otp, path: "forgotPassword-otp" }`
  4. User enters new password → `PUT /customer/reset-password  { token, password }`
- Uncomment and rewrite all three screens
- Add "Forgot Password?" link on LoginScreen

#### G. Notifications — Connect to Real API

**File:** `app/src/screens/Notification/Notifications.tsx`

Currently hardcoded with `MOCK_NOTIFICATIONS`. The app already has Firebase push notification integration (`useFirebaseNotifications`). The notification list screen should display real notifications.

**What to update:**
```typescript
// Existing API file (partially implemented):
app/src/api/notificationsApi/notificationApi.ts

// Backend endpoint (if available):
GET /notification   (admin notifications sent to customers)
```

### 6.2 MEDIUM PRIORITY — Feature Improvements

#### H. Google Auth — Complete Integration

**File:** `app/src/screens/Auth/GoogleAuth/GoogleAuthScreen.tsx`

The screen exists but the full OAuth flow needs to be completed:
- Use `@react-native-google-signin/google-signin` or `expo-auth-session`
- On success, call `POST /customer/signup/oauth  { name, email, image }`
- Store token and user in AuthContext same as OTP login

#### I. Profile Photo Upload

**File:** `app/src/screens/Settings/EditProfile/EditProfileScreen.tsx`

Image picker is integrated (`react-native-image-picker`) but the upload to the API is not connected. The backend needs to accept a multipart upload:
```typescript
// Backend:  PUT /customer/:id  with multipart/form-data
// RN: Use FormData with axios and Content-Type: multipart/form-data
```

#### J. Offers & Coupons — Connect to API

**File:** `app/src/screens/Settings/Offers/OffersScreen.tsx`

Currently uses `mockOffers`. Should connect to:
```typescript
GET /coupon/show   (active coupons visible to customers)
```

#### K. Holiday Payment Screen

The web app has a feature to pay for holiday periods. In the RN app, this is partially handled through the calendar, but a dedicated holiday payment screen would be beneficial:
```typescript
POST /ccavenue/holiday-payments  { userId, holidayId, amount }
```

#### L. Plan Price Calculation

**File:** `app/src/screens/Subscription/Components/forms/Subscription.tsx`

Verify the subscription plan step uses the backend price calculation:
```typescript
GET /customer/get-plan-price/:registrationId
```
If it uses hardcoded prices, update to fetch from API.

### 6.3 LOW PRIORITY — Polish & Improvements

#### M. Add Shipping Address (if needed)
The web app supports multiple shipping addresses. For meal delivery to schools, this may not be needed. Confirm with product requirements.

#### N. Contact Us Form
Web has `/contact-us`. The RN app provides a WhatsApp button as an alternative. If a contact form is needed, create:
```typescript
// New screen: screens/Settings/ContactUs/ContactUsScreen.tsx
POST /support/email  (or POST /notification/email)
```

#### O. Search Global (Products)
The web has a `/search` page for searching products. In RN, search is local within the Menu tab.

---

## 7. API Endpoint Mapping: Web vs React Native

| Feature | Web File | Web API Call | RN File | RN API Call | Status |
|---|---|---|---|---|---|
| Send OTP | `useLoginSubmit.js` | `POST /customer/sendOtp` | `authApi.ts` | `POST /customer/sendOtp` | ✅ Match |
| Verify OTP | `useLoginSubmit.js` | `POST /customer/verifyOtp` | `authApi.ts` | `POST /customer/verifyOtp` | ✅ Match |
| Check step | `useRegistration.js` | `POST /customer/Step-Check` | `RegistrationApi.tsx` | `POST /customer/Step-Check` | ✅ Match |
| Submit form | `useRegistration.js` | `POST /customer/stepForm-Register` | `RegistrationApi.tsx` | `POST /customer/stepForm-Register` | ✅ Match |
| Get form data | `CustomerServices.js` | `GET /customer/form/:id` | `RegistrationApi.tsx` | `GET /customer/form/:userId` | ✅ Match |
| Get account | `CustomerServices.js` | (via auth session) | `userApi.ts` | `POST /customer/account-details` | ✅ Match |
| Get children | `CustomerServices.js` | N/A (via form) | `userApi.ts` | `POST /customer/get-all-children` | ✅ |
| Get schools | `CategoryServices.js` | `GET /category/show` | `RegistrationApi.tsx` | `GET /schools/get-all-schools` | ⚠️ Different endpoint |
| Menu calendar | `CustomerServices.js` | `POST /customer/get-Menu-Calendar` | `menuApi.ts` | `POST /customer/get-Menu-Calendar` | ✅ Match |
| Save calendar | `CustomerServices.js` | `POST /customer/save-Menu-Calendar` | `menuApi.ts` | `POST /customer/save-Menu-Calendar` | ✅ Match |
| Get saved meals | `CustomerServices.js` | `POST /customer/get-saved-meals` | `foodApi.ts` | `POST /customer/get-saved-meals` | ✅ Match |
| Delete meal | `CustomerServices.js` | `POST /customer/delete-meal` | N/A | N/A | ⚠️ No RN service |
| Get holidays | `CustomerServices.js` | `GET /holidays/get-all-holidays` | `holidayApi.ts` | `GET /holidays/get-all-holidays` | ✅ Match |
| Get menu dishes | `ProductServices.js` | `GET /products/get-all-menu-dishes` | `mealsApi.tsx` | `GET /products/get-all-menu-dishes` | ✅ Match |
| Get orders | `OrderServices.js` | `GET /order` | ❌ Missing | ❌ Missing | ❌ Not connected |
| Get order detail | `OrderServices.js` | `GET /order/:id` | ❌ Missing | ❌ Missing | ❌ Not connected |
| Get payments | `CustomerServices.js` | `POST /customer/get-payments` | ❌ Missing | ❌ Missing | ❌ Not connected |
| Change password | `CustomerServices.js` | `POST /customer/change-password` | ❌ Missing | ❌ Missing | ❌ Not connected |

**Note on Schools Endpoint:** The web frontend uses `/category/show` to get schools (schools were originally modeled as categories). The RN app correctly uses `/schools/get-all-schools` which is the newer dedicated endpoint. Both work, but the RN app uses the more appropriate route.

---

## 8. Navigation Structure

### 8.1 Current RN Navigation Tree

```
MainNavigator (checks isLoggedIn)
    │
    ├── AuthNavigator (if not logged in)
    │   ├── WelcomeScreen
    │   ├── WalkThroughScreen
    │   ├── Login
    │   ├── OtpVerificationScreen
    │   ├── Signup
    │   └── GoogleAuth
    │
    └── AppNavigator (Bottom Tab — if logged in)
        │
        ├── Tab: Home (DashboardNavigator)
        │   ├── HomeScreen
        │   ├── NotificationScreen
        │   ├── MealDetailScreen
        │   ├── Settings
        │   │   ├── EditProfile
        │   │   ├── OffersScreen
        │   │   ├── OfferDetailScreen
        │   │   ├── FaqScreen
        │   │   ├── HelpCenterScreen
        │   │   ├── DietaryTipsScreen
        │   │   ├── AboutUsScreen
        │   │   ├── TermsAndPolicyScreen
        │   │   └── ParentChildInfoScreen
        │   ├── OrderHistory
        │   ├── HistoryDetailPage
        │   └── WebViewScreen (CCAvenue payment)
        │
        ├── Tab: Menu (MenueNavigator)
        │   ├── Menu (MealCategoryScreen)
        │   └── MealDetailScreen
        │
        ├── Tab: MyPlan (MyPlanNavigator — wrapped in RegistrationProvider)
        │   ├── RegistrationCheck → routes to:
        │   │   ├── Registartion (if step < 4)
        │   │   │   ├── InitialScreen
        │   │   │   ├── ParentDetails (Step 1)
        │   │   │   ├── ChildDetails (Step 2)
        │   │   │   ├── Subscription (Step 3)
        │   │   │   ├── PaymentOptions (Step 4)
        │   │   │   └── WebViewScreen (CCAvenue)
        │   │   └── MyPlan (if step >= 4)
        │   │       ├── Calender (main view)
        │   │       ├── MenuSelection
        │   │       └── FoodList
        │   └── WebViewScreen
        │
        └── Tab: History (HistoryNavigator)
            ├── OrderHistory (MOCK DATA)
            └── HistoryDetailPage (MOCK DATA)
```

### 8.2 Missing Navigation Routes to Add

```
AppNavigator (DashboardNavigator) needs:
    ├── WalletScreen          (new — under Settings)
    ├── TransactionScreen     (new — under Settings)
    ├── ChangePasswordScreen  (new — under Settings)
    └── RenewSubscriptionScreen (new — under MyPlan tab)

AuthNavigator needs:
    └── ForgotPasswordNavigator
        ├── ForgotEmailFormScreen (uncomment + rewrite)
        ├── EnterOTPScreen (uncomment + rewrite)
        └── NewPasswordScreen (uncomment + rewrite)
```

---

## 9. State Management Architecture

### 9.1 Context Providers (React Context API)

```typescript
// Root level (App.tsx)
AuthProvider                    ← Login state, user info, JWT token

// MyPlan tab level (MyPlanNavigator.tsx)
RegistrationProvider            ← Step check, registration progress
UserProfileProvider             ← Form data, parent/children/subscription info
ChildProvider                   ← Children list
MenuProvider                    ← Children for menu selection
FoodProvider                    ← Saved meals list
HolidayDateProvider             ← Holiday dates from API
ToastProvider                   ← Toast notifications

// Menu tab level (MenueNavigator.tsx)
MealProvider                    ← Menu dishes from API (MealContext)

// Home tab level (DashboardNavigator.tsx)
MealProvider                    ← Same meal data (separate instance)
```

### 9.2 Context Dependencies

```
AuthContext
    └── userId → used by:
        ├── RegistrationContext (step check)
        ├── UserProfileProvider (form data)
        ├── ChildProvider (children list)
        ├── FoodContext (saved meals)
        └── calenderContext (holidays)
```

### 9.3 AsyncStorage Keys

```typescript
// Auth
"token"       → JWT Bearer token (key from tokenConfig.ts)
"user"        → JSON stringified user object
"userId"      → Raw user ID string
"userRole"    → "customer" | "admin"
"username"    → Display name

// Registration
"@registrationStep"  → Cached registration step number (avoids API call on every render)
```

---

## 10. Known Issues & Gaps

### 10.1 Mock Data Flags (Must Fix Before Production)

These screens have hardcoded flags that prevent real API usage:

| Screen | Flag | Fix |
|---|---|---|
| `OrderHistoryScreen.tsx` | `const SHOW_MOCK_DATA = true` | Connect to `GET /order` API |
| `HistoryDetailPage.tsx` | Mock order data | Connect to `GET /order/:id` API |
| `ParentChildInfoScreen.tsx` | `const USE_MOCK_DATA = true` | Use `useUserProfile()` context |
| `Notifications.tsx` | `const SHOW_NOTIFICATIONS = true` (showing mock) | Connect to Firebase/API |
| `OffersScreen.tsx` | `const mockOffers = [...]` | Connect to `GET /coupon/show` |

### 10.2 Commented-Out Screens

The Forgot Password flow is entirely commented out across 3 files. These need to be rewritten with the OTP-based password reset approach (since the app uses phone/OTP, not email/password for auth).

### 10.3 CCAvenue Config — Hardcoded Credentials

**File:** `app/src/config/ccavenueConfig.tsx`

The merchant ID, access code, and working key are hardcoded. These should be moved to environment variables or fetched from the backend settings API (`GET /setting/store-setting/all`).

```typescript
// Current (insecure):
const ccavenueConfig = {
  merchant_id: '4381442',
  working_key: '2A561B005709D8B4BAF69D049B23546B',
  ...
};

// Should be:
// Option 1: Use .env via react-native-config
// Option 2: Fetch from GET /setting/store-setting/all (which stores gateway keys)
```

### 10.4 Delete Meal — No RN Service

The web app deletes a meal via `POST /customer/delete-meal` which also credits the wallet. The RN app's `MenuSelection` screen and calendar show delete options but there's no `deleteMeal` function in the RN service layer. Verify and add:

```typescript
// In app/src/services/MyPlansApi/MenuService.ts or FoodService.ts:
async deleteMeal(data: { childId: string; date: string; mealId: string }) {
  return await httpAxiosClient.post('/customer/delete-meal', data);
}
```

### 10.5 Screen Naming Inconsistency

`DashboardNavigator.tsx` registers `OrderHistory` and `HistoryDetailPage` routes, but `HistoryNavigator.tsx` also registers the same routes as separate stack screens. This duplication could cause navigation confusion. The History tab should be the single owner of these routes.

### 10.6 `app/src/screens/Auth/Signup/trash.tsx`

There is a file literally named `trash.tsx` in the Signup folder. This should be deleted:
```bash
rm app/src/screens/Auth/Signup/trash.tsx
app/src/screens/MyPlan/trash.tsx  (same issue)
```

### 10.7 `ChildAge.tsx` / `ChildAge.tsx` — Duplicate Files

```
app/src/api/ConfigApi/ChildAge.tsx
app/src/services/ConfigService/ChildAge.tsx
```
These appear to duplicate the child age configuration. Consolidate to one location.

---

## Summary: Overall Completion Estimate

| Feature Area | Completion |
|---|---|
| Authentication (OTP) | ~90% (missing forgot password) |
| Onboarding Registration | ~85% (plan price calc needs verification) |
| Menu Calendar (daily use) | ~85% (delete meal service gap) |
| Menu / Dish Browsing | ~95% |
| Order History | ~20% (mock data, not connected) |
| Wallet & Transactions | 0% (not started) |
| Subscription Renewal | 0% (not started) |
| Notifications | ~60% (Firebase set up, list is mock) |
| Profile & Settings | ~70% (password change missing) |
| Offers & Coupons | ~30% (mock data only) |
| Static Pages | ~95% |
| **Overall Estimate** | **~65%** |
