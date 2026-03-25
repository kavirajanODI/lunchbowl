# LunchBowl Customer Store — Complete Documentation

**Application:** `store-without-stripe`  
**Framework:** Next.js 14 (React 18)  
**Purpose:** Customer-facing e-commerce store for the LunchBowl kids' meal subscription service  
**Live Site:** https://lunchBowl-store.vercel.app/  

---

## Table of Contents

1. [Overview](#1-overview)
2. [Tech Stack & Dependencies](#2-tech-stack--dependencies)
3. [Project Structure](#3-project-structure)
4. [Environment Variables](#4-environment-variables)
5. [Getting Started](#5-getting-started)
6. [Pages & Routes](#6-pages--routes)
7. [Authentication](#7-authentication)
8. [State Management](#8-state-management)
9. [API Service Layer](#9-api-service-layer)
10. [Key Features](#10-key-features)
11. [Components Reference](#11-components-reference)
12. [Internationalization (i18n)](#12-internationalization-i18n)
13. [PWA Support](#13-pwa-support)
14. [Analytics & Tracking](#14-analytics--tracking)
15. [Configuration Files](#15-configuration-files)

---

## 1. Overview

The LunchBowl store is a **Next.js** customer-facing application that allows parents to:

- Browse and subscribe to nutritious school lunch meal plans for their children
- Register children and select weekly meal calendars
- Manage subscriptions, holiday payments, and wallet credits
- Place product orders through multiple payment gateways (Stripe, PayPal, Razorpay, CCAvenue)
- Track orders and download invoices
- Manage their profile, shipping addresses, and preferences

The store supports **multi-language** (English, Spanish, French, German), is **PWA-enabled** (installable as a mobile app), and integrates with **Google Analytics** and **Facebook Pixel** for marketing analytics.

---

## 2. Tech Stack & Dependencies

| Category | Technology |
|---|---|
| **Framework** | Next.js 14.2.3 |
| **UI Library** | React 18.2.0 |
| **Styling** | Tailwind CSS 3.x, Material-UI 7.x, Emotion |
| **State Management** | Redux Toolkit 1.9.7, Redux Persist, Redux Thunk |
| **Authentication** | NextAuth 4.24.7 (OAuth + Credentials) |
| **API Client** | Axios 1.4.0 |
| **Server State** | TanStack React Query v5 |
| **Payment** | Stripe, PayPal, Razorpay, CCAvenue |
| **Forms** | React Hook Form 7.x, Yup validation |
| **Internationalization** | next-translate 2.6.2 |
| **PWA** | next-pwa 5.6.0 |
| **SEO** | next-seo 4.28.1 |
| **Charts/PDF** | @react-pdf/renderer |
| **Real-time** | socket.io-client 4.4.0 |
| **Analytics** | react-ga4, Facebook Pixel |
| **UI Extras** | React Icons, Headless UI, RC Drawer, React Responsive Carousel, Swiper |
| **Utilities** | js-cookie, jwt-decode, dayjs, date-fns, phone validator |
| **Cart** | react-use-cart 1.13.0 |
| **Image Processing** | Sharp, browser-image-compression |
| **Live Chat** | Tawk.to Messenger |

---

## 3. Project Structure

```
store-without-stripe/
├── src/
│   ├── pages/                      # Next.js file-based routing
│   │   ├── _app.js                 # App wrapper — providers, session, analytics
│   │   ├── _document.js            # Custom HTML document structure
│   │   ├── _offline.js             # Offline PWA fallback page
│   │   ├── 404.js                  # Not found page
│   │   ├── index.js                # Redirect to /home
│   │   ├── home.js                 # Main landing page
│   │   ├── about-us.js             # About page
│   │   ├── contact-us.js           # Contact form page
│   │   ├── faq.js                  # FAQ accordion page
│   │   ├── free-trial.js           # Free trial signup
│   │   ├── offer.js                # Promotions / offers page
│   │   ├── checkout.js             # Shopping cart checkout
│   │   ├── search.js               # Product search results
│   │   ├── privacy-policy.js       # Privacy policy
│   │   ├── terms-and-conditions.js # Terms page
│   │   ├── refund-cancellation-policy.js  # Refund policy
│   │   ├── kids-nutritious-lunch-subscription-menu.js  # Subscription menu page
│   │   ├── school-kids-lunch-subscription-service-in-chennai-pricing.js  # Pricing page
│   │   ├── under_Construction.js   # Maintenance placeholder
│   │   ├── auth/                   # Authentication pages
│   │   │   ├── login.js            # Email/password login
│   │   │   ├── signup.js           # Email registration
│   │   │   ├── phone-signup.js     # OTP-based phone signup
│   │   │   ├── forget-password.js  # Password reset request
│   │   │   └── email-verification/
│   │   │       └── [token].js      # Email verification callback
│   │   ├── user/                   # Authenticated user dashboard
│   │   │   ├── userDashBoard.js    # Main dashboard hub
│   │   │   ├── DataRoutingPage.js  # Data navigation utility page
│   │   │   ├── my-account.js       # Account overview
│   │   │   ├── my-orders.js        # Order history list
│   │   │   ├── recent-order.js     # Latest order detail
│   │   │   ├── menuCalendarPage.js # Weekly meal calendar selector
│   │   │   ├── profile-Step-Form.js # Multi-step profile & child setup
│   │   │   ├── add-child.js        # Add a new child profile
│   │   │   ├── wallet.js           # Digital wallet with points
│   │   │   ├── transaction-page.js # Payment transaction history
│   │   │   ├── add-shipping-address.js  # Add delivery address
│   │   │   ├── change-password.js  # Password update
│   │   │   ├── update-profile.js   # Edit profile info
│   │   │   ├── renew-subscription.js    # Subscription renewal flow
│   │   │   └── RenewSubscriptionPage.js # Renewal management UI
│   │   ├── product/
│   │   │   └── [slug].js           # Product detail page (SEO-friendly)
│   │   ├── order/
│   │   │   └── [id].js             # Order detail / invoice view
│   │   └── payment/
│   │       ├── success.js          # Payment success callback
│   │       ├── failed.js           # Payment failure page
│   │       └── subscriptionFailed.js  # Subscription payment failure
│   │
│   ├── components/                 # Reusable React components
│   │   ├── header/                 # Site header, search bar, cart icon
│   │   ├── footer/                 # Site footer
│   │   ├── navbar/                 # Navigation menu
│   │   ├── home/                   # Homepage sections (hero, how-it-works, team)
│   │   ├── product/                # Product cards, listing, detail
│   │   ├── cart/                   # Shopping cart sidebar
│   │   ├── checkout/               # Checkout steps and payment forms
│   │   ├── order/                  # Order display, invoice
│   │   ├── category/               # Category browsing
│   │   ├── coupon/                 # Coupon input and validation
│   │   ├── login/                  # Login/signup form components
│   │   ├── form/                   # Reusable form fields, error display
│   │   ├── common/                 # Shared utilities (modals, loaders)
│   │   ├── banner/                 # Promotional banners
│   │   ├── carousel/               # Image carousels
│   │   ├── MenuCalendar/           # Weekly meal plan calendar UI
│   │   ├── addChild/               # Child enrollment form components
│   │   ├── profile-Step-Form/      # Multi-step parent registration form
│   │   ├── image-uploader/         # Image upload with compression
│   │   ├── modal/                  # Modal dialogs
│   │   ├── invoice/                # PDF invoice generator
│   │   ├── preloader/              # Loading spinners, skeletons
│   │   └── renew-subflow/          # Subscription renewal components
│   │
│   ├── layout/
│   │   ├── Layout.jsx              # Main layout wrapper
│   │   ├── header/
│   │   │   └── Mainheader.jsx      # Full-page header with SEO meta
│   │   ├── footer/
│   │   │   └── Mainfooter.jsx      # Site-wide footer
│   │   └── navbar/                 # Navigation bar layout
│   │
│   ├── redux/                      # Redux state management
│   │   ├── store.js                # Redux + Redux Persist store config
│   │   └── slice/
│   │       ├── dynamicDataSlice.js # Generic API data cache reducer
│   │       └── settingSlice.js     # Application settings reducer
│   │
│   ├── services/                   # API service layer (Axios)
│   │   ├── httpServices.js         # Axios instance + token management
│   │   ├── CustomerServices.js     # Customer auth & profile API calls
│   │   ├── ProductServices.js      # Product catalog API calls
│   │   ├── OrderServices.js        # Order management API calls
│   │   ├── CategoryServices.js     # Category API calls
│   │   ├── CouponServices.js       # Coupon validation API calls
│   │   ├── AttributeServices.js    # Product attribute API calls
│   │   ├── SettingServices.js      # Store settings API calls
│   │   ├── EmailService.js         # Email sending API calls
│   │   ├── SmsServices.js          # SMS API calls
│   │   ├── NotificationServices.js # Notification API calls
│   │   └── AccountServices.js      # Account-specific API calls
│   │
│   ├── context/
│   │   ├── UserContext.js          # User auth context (useReducer + cookies)
│   │   └── SidebarContext.js       # Mobile sidebar toggle state
│   │
│   ├── hooks/                      # Custom React hooks
│   ├── lib/
│   │   ├── next-auth-options.js    # Dynamic NextAuth configuration
│   │   ├── auth.js                 # Auth helpers
│   │   ├── analytics.js            # Google Analytics helpers
│   │   ├── fb-pixel.js             # Facebook Pixel helpers
│   │   └── stripe.js               # Stripe utilities
│   │
│   ├── utils/                      # Utility functions
│   ├── styles/                     # Global CSS styles
│   ├── jsonHelper/                 # Static JSON data helpers
│   └── middleware.js               # Next.js route middleware
│
├── public/                         # Static assets (images, icons, manifest)
├── locales/                        # i18n translation files
│   ├── en/common.json
│   ├── es/common.json
│   ├── fr/common.json
│   └── de/common.json
├── next.config.js                  # Next.js config (PWA, i18n, images)
├── tailwind.config.js              # Tailwind CSS config
├── postcss.config.js               # PostCSS config
├── i18n.json                       # next-translate i18n settings
├── jsconfig.json                   # Path aliases (@components, @services, etc.)
└── package.json
```

---

## 4. Environment Variables

Create a `.env.local` file in the `store-without-stripe/` directory with:

```env
# Backend API
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret_key
NEXTAUTH_URL=http://localhost:3000

# Google Analytics
NEXT_PUBLIC_GA_KEY=G-XXXXXXXXXX

# Stripe (for Stripe payment)
STRIPE_PUBLIC_KEY=pk_test_...

# PayPal
PAYPAL_CLIENT_ID=your_paypal_client_id
```

> **Note:** OAuth provider credentials (Google, GitHub, Facebook) are configured dynamically from the store settings API, not directly in `.env`.

---

## 5. Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Running backend server (`/home/runner/work/lunchbowNew/lunchbowNew/backend`)

### Installation

```bash
cd store-without-stripe
npm install
```

### Development

```bash
npm run dev
# Starts Next.js dev server at http://localhost:3000
```

### Production Build

```bash
npm run build
npm run start
```

### Linting

```bash
npm run lint
```

---

## 6. Pages & Routes

### Public Pages (No Login Required)

| Route | File | Description |
|---|---|---|
| `/` | `pages/index.js` | Redirects to `/home` |
| `/home` | `pages/home.js` | Landing page with hero, features, FAQ |
| `/about-us` | `pages/about-us.js` | Company information |
| `/contact-us` | `pages/contact-us.js` | Contact form submission |
| `/faq` | `pages/faq.js` | Frequently asked questions (accordion) |
| `/free-trial` | `pages/free-trial.js` | Free trial signup form |
| `/offer` | `pages/offer.js` | Current promotions and offers |
| `/search` | `pages/search.js` | Product search results |
| `/checkout` | `pages/checkout.js` | Shopping cart & checkout |
| `/product/[slug]` | `pages/product/[slug].js` | Product detail page |
| `/kids-nutritious-lunch-subscription-menu` | `pages/kids-nutritious-lunch-subscription-menu.js` | Menu / subscription details |
| `/school-kids-lunch-subscription-service-in-chennai-pricing` | `pages/school-kids-lunch-...` | Pricing page |
| `/privacy-policy` | `pages/privacy-policy.js` | Privacy policy |
| `/terms-and-conditions` | `pages/terms-and-conditions.js` | Terms of service |
| `/refund-cancellation-policy` | `pages/refund-cancellation-policy.js` | Refund & cancellation policy |
| `/404` | `pages/404.js` | Not found page |

### Authentication Pages

| Route | File | Description |
|---|---|---|
| `/auth/login` | `pages/auth/login.js` | Email/password login form |
| `/auth/signup` | `pages/auth/signup.js` | New customer registration |
| `/auth/phone-signup` | `pages/auth/phone-signup.js` | Phone OTP-based signup |
| `/auth/forget-password` | `pages/auth/forget-password.js` | Request password reset email |
| `/auth/email-verification/[token]` | `pages/auth/email-verification/[token].js` | Email verification from link |

### User Dashboard Pages (Login Required)

| Route | File | Description |
|---|---|---|
| `/user/userDashBoard` | `pages/user/userDashBoard.js` | Main user dashboard |
| `/user/DataRoutingPage` | `pages/user/DataRoutingPage.js` | Data routing hub page |
| `/user/my-account` | `pages/user/my-account.js` | Account profile overview |
| `/user/my-orders` | `pages/user/my-orders.js` | Order history list |
| `/user/recent-order` | `pages/user/recent-order.js` | Most recent order detail |
| `/user/menuCalendarPage` | `pages/user/menuCalendarPage.js` | Weekly meal calendar selection |
| `/user/profile-Step-Form` | `pages/user/profile-Step-Form.js` | Multi-step parent/child enrollment |
| `/user/add-child` | `pages/user/add-child.js` | Add a new child profile |
| `/user/wallet` | `pages/user/wallet.js` | Wallet points and balance |
| `/user/transaction-page` | `pages/user/transaction-page.js` | Transaction history |
| `/user/add-shipping-address` | `pages/user/add-shipping-address.js` | Add delivery address |
| `/user/change-password` | `pages/user/change-password.js` | Change account password |
| `/user/update-profile` | `pages/user/update-profile.js` | Edit profile information |
| `/user/renew-subscription` | `pages/user/renew-subscription.js` | Renew meal subscription |
| `/user/RenewSubscriptionPage` | `pages/user/RenewSubscriptionPage.js` | Full subscription renewal UI |

### Order & Payment Pages

| Route | File | Description |
|---|---|---|
| `/order/[id]` | `pages/order/[id].js` | Order detail and invoice |
| `/payment/success` | `pages/payment/success.js` | Payment success confirmation |
| `/payment/failed` | `pages/payment/failed.js` | Payment failure page |
| `/payment/subscriptionFailed` | `pages/payment/subscriptionFailed.js` | Subscription payment failure |

---

## 7. Authentication

### Authentication Methods

#### 1. Email / Password (Credentials Provider)
- User submits email and password on `/auth/login`
- The frontend calls `CustomerServices.loginCustomer()` → `POST /api/customer/login`
- On success, a JWT token is received and passed to NextAuth Credentials Provider
- NextAuth creates a session cookie

#### 2. Email Verification Flow (New Registration)
- User fills in name, email, password on `/auth/signup`
- Frontend calls `CustomerServices.verifyEmailAddress()` → `POST /api/customer/verify-email`
- Backend sends a verification email with a JWT-based link
- User clicks the link → `/auth/email-verification/[token]`
- Frontend calls `CustomerServices.registerCustomer(token)` → `POST /api/customer/register/:token`
- Account is created and user is auto-logged in

#### 3. Phone OTP Flow
- User visits `/auth/phone-signup`
- Frontend calls `CustomerServices.sendOtp()` → `POST /api/customer/sendOtp`
- User enters OTP → `CustomerServices.verifyOtp()` → `POST /api/customer/verifyOtp`
- On success, a JWT + user info is returned and session is created

#### 4. OAuth (Google / GitHub / Facebook)
- OAuth provider credentials are fetched dynamically from store settings API
- User clicks OAuth button → NextAuth redirects to provider
- On callback, `CustomerServices.signUpWithOauthProvider()` → `POST /api/customer/signup/oauth`
- User is created or updated in the database

### Session Management

```
NextAuth Session (SessionProvider)
    ↓
UserContext (React Context + useReducer)
    ↓
Token set in Axios headers via setToken()
    ↓
All API calls include: Authorization: Bearer <token>
```

**State stored in `UserContext`:**
- `userInfo` — user profile object (persisted in cookies)
- `shippingAddress` — selected delivery address (persisted in cookies)
- `couponInfo` — applied coupon details (persisted in cookies)

**Actions:**
- `USER_LOGIN` — set user info after login
- `USER_LOGOUT` — clear user info on logout
- `SAVE_SHIPPING_ADDRESS` — store selected address
- `SAVE_COUPON` — store applied coupon

---

## 8. State Management

### Redux Store

The Redux store manages cached API data and app settings using **Redux Toolkit** + **Redux Persist**.

**Persistence:** SessionStorage (cleared when tab is closed)

**Slices:**

#### `dynamicDataSlice` (data)
A generic reducer for caching collections fetched from the API.

| Action | Description |
|---|---|
| `addData(key, data)` | Add or replace a data collection by key |
| `addSingleData(key, item)` | Update a single item within a collection by `_id` |
| `removeData(key)` | Remove a collection by key |

**Usage example:**
```js
dispatch(addData({ key: "products", data: productList }))
dispatch(addSingleData({ key: "orders", data: updatedOrder }))
```

#### `settingSlice` (setting)
Stores application configuration (theme, store settings).

### Context API

#### `UserContext`
Manages user authentication state, shipping address, and coupon.
- Reads from and writes to **cookies** via js-cookie
- Integrates with **NextAuth session** to sync token

#### `SidebarContext`
Controls mobile sidebar open/close state.

### React Query (TanStack Query)
Used for server-side state where SWR behaviour is needed:
- **Store settings** — fetched once and cached for 4 minutes
- **OAuth provider configuration** — loaded during auth setup
- Configuration: 1 retry, no refetch on window focus

---

## 9. API Service Layer

All API services live in `src/services/`. They use a shared Axios instance from `httpServices.js`.

### HTTP Client (`httpServices.js`)

```js
Base URL: process.env.NEXT_PUBLIC_API_BASE_URL
Timeout: 50 seconds
Default headers: Accept: application/json, Content-Type: application/json
Auth: Bearer token set via setToken() after login
```

### Service Methods

#### `CustomerServices`

| Method | API Call | Description |
|---|---|---|
| `loginCustomer(body)` | `POST /customer/login` | Login with email/password |
| `verifyEmailAddress(body)` | `POST /customer/verify-email` | Check email and send verification |
| `verifyPhoneNumber(body)` | `POST /customer/verify-phone` | Send phone OTP |
| `registerCustomer(token, body)` | `POST /customer/register/:token` | Complete registration |
| `signUpWithOauthProvider(body)` | `POST /customer/signup/oauth` | OAuth signup |
| `signUpWithProvider(token, body)` | `POST /customer/signup/:token` | Provider signup |
| `forgetPassword(body)` | `PUT /customer/forget-password` | Request password reset |
| `resetPassword(body)` | `PUT /customer/reset-password` | Submit new password |
| `changePassword(body)` | `POST /customer/change-password` | Change password |
| `updateCustomer(id, body)` | `PUT /customer/:id` | Update profile |
| `getShippingAddress({userId})` | `GET /customer/shipping/address/:userId` | Get saved addresses |
| `addShippingAddress({userId, data})` | `POST /customer/shipping/address/:userId` | Add address |
| `sendOtp(body)` | `POST /customer/sendOtp` | Send OTP SMS |
| `verifyOtp(body)` | `POST /customer/verifyOtp` | Verify OTP |
| `stepFormRegister(body)` | `POST /customer/stepForm-Register` | Submit enrollment form |
| `checkStep(body)` | `POST /customer/Step-Check` | Check registration step |
| `getMenuCalendar(body)` | `POST /customer/get-Menu-Calendar` | Get meal calendar data |
| `saveMenuCalendar(body)` | `POST /customer/save-Menu-Calendar` | Save meal selections |
| `getSavedMeals(body)` | `POST /customer/get-saved-meals` | Get saved meals |
| `getHolidayPayments(body)` | `POST /ccavenue/holiday-payments` | Get holiday payment records |
| `getPaidHolidays(body)` | `POST /customer/get-paid-holidays` | Get paid holiday dates |
| `getCustomerFormData(id)` | `GET /customer/form/:id` | Get parent form data |
| `deleteMeal(body)` | `POST /customer/delete-meal` | Delete a meal from plan |

#### `ProductServices`

| Method | API Call | Description |
|---|---|---|
| `getShowingProducts()` | `GET /products/show` | Get visible products |
| `getShowingStoreProducts({category, title, slug})` | `GET /products/store` | Get store products with filters |
| `getProductBySlug(slug)` | `GET /products/:slug` | Get product by slug |
| `getAllMenuDishes()` | `GET /products/get-all-menu-dishes` | Get active menu dishes |

#### `OrderServices`

| Method | API Call | Description |
|---|---|---|
| `addOrder(body, headers)` | `POST /order/add` | Place a new order |
| `createPaymentIntent(body)` | `POST /order/create-payment-intent` | Create Stripe PaymentIntent |
| `addRazorpayOrder(body)` | `POST /order/add/razorpay` | Save Razorpay order |
| `createOrderByRazorPay(body)` | `POST /order/create/razorpay` | Create Razorpay order |
| `getOrderCustomer({page, limit})` | `GET /order` | Get customer's orders |
| `getOrderById(id, body)` | `GET /order/:id` | Get order by ID |
| `sendEmailInvoiceToCustomer(body)` | `POST /order/customer/invoice` | Email invoice |

#### `CategoryServices`
- `GET /category/show` — Get visible categories

#### `CouponServices`
- `GET /coupon/show` — Get active coupons

#### `AttributeServices`
- `GET /attributes/show` — Get visible product attributes

#### `SettingServices`
- `GET /setting/store-setting/all` — Get store settings
- `GET /setting/global/all` — Get global settings
- `GET /setting/store/customization/all` — Get UI customization

---

## 10. Key Features

### 10.1 Meal Subscription System
The core feature of LunchBowl is the kids' lunch subscription service:

1. **Registration Flow (Multi-Step):**
   - Step 1: Parent details (father/mother name, contact, address)
   - Step 2: Child details (name, DOB, school, class, section, allergies)
   - Step 3: Subscription plan selection (start date, end date, working days, price)
   - Step 4: Payment (CCAvenue integration)
   - Page: `/user/profile-Step-Form`

2. **Menu Calendar:**
   - Parents select meals for each school day
   - Calendar shows available dishes by date
   - Meals are saved per child
   - Page: `/user/menuCalendarPage`

3. **Wallet System:**
   - Parents earn wallet points when they delete a meal
   - Points can be used as credits
   - Full transaction history available
   - Page: `/user/wallet`

4. **Holiday Management:**
   - School holidays are tracked by the system
   - Parents can view paid holiday dates
   - Holiday payment adjustments handled via CCAvenue

### 10.2 E-commerce Store
- Product catalog with categories and search
- Product detail pages with variant selection
- Shopping cart powered by `react-use-cart` (persisted in local storage)
- Multi-step checkout with address selection and coupon application

### 10.3 Multi-Payment Support
| Gateway | Integration |
|---|---|
| **Stripe** | `@stripe/react-stripe-js` — Payment Elements |
| **PayPal** | `@paypal/react-paypal-js` — PayPal Buttons |
| **Razorpay** | `react-razorpay` — Razorpay Checkout |
| **CCAvenue** | Custom redirect flow (used for subscriptions) |

### 10.4 User Account Management
- Edit profile (name, email, phone, address)
- Change password
- Manage shipping addresses (add/edit/delete/set default)
- View order history with order status
- Download/print invoice as PDF
- Add and manage multiple children

### 10.5 PWA Features
- Installable on mobile home screen
- Offline support via service worker caching
- App manifest with icons (192x192, 256x256, 384x384, 512x512)
- Auto-updates service worker on new deployments

### 10.6 Internationalization
- Languages: English (en), Spanish (es), French (fr), German (de)
- Default: English
- Translations in `locales/{lang}/common.json`
- Language switching via Next.js locale routing

---

## 11. Components Reference

### Header & Navigation

| Component | Location | Description |
|---|---|---|
| `Mainheader` | `layout/header/Mainheader` | Full page header with SEO meta tags |
| `Header` | `components/header/` | Site top bar with search, cart, account |
| `Mainfooter` | `layout/footer/Mainfooter` | Site footer with links and contact |
| `Navbar` | `components/navbar/` | Main navigation links |

### Home Page

| Component | Location | Description |
|---|---|---|
| `HomeProductCard` | `components/product/HomeProductCard` | Featured product card |
| `Letsfindout` | `components/home/Letsfindout` | "How it works" section |
| `Htoworkslider` | `components/home/Htoworkslider` | Process slider component |
| `Hoteamsslide` | `components/home/Hoteamsslide` | Team showcase slider |
| `Accordion` | `components/faq/Accordion` | FAQ accordion component |

### Authentication

| Component | Location | Description |
|---|---|---|
| `InputArea` | `components/form/InputArea` | Styled form input field |
| `Error` | `components/form/Error` | Form validation error display |
| `BottomNavigation` | `components/login/BottomNavigation` | Login/signup bottom links |
| `LoadingForSession` | `components/preloader/LoadingForSession` | Session loading spinner |

### Product

| Component | Location | Description |
|---|---|---|
| Product listing | `components/product/` | Grid/list of product cards |
| Product detail | `components/product/` | Full product info with variants |
| Category filter | `components/category/` | Category sidebar/tabs |

### Cart & Checkout

| Component | Location | Description |
|---|---|---|
| Cart sidebar | `components/cart/` | Slide-out cart drawer |
| Checkout steps | `components/checkout/` | Multi-step checkout flow |
| Coupon input | `components/coupon/` | Apply discount code |
| Invoice | `components/invoice/` | PDF invoice renderer |

### User Dashboard

| Component | Location | Description |
|---|---|---|
| `MenuCalendar` | `components/MenuCalendar/` | Weekly meal selection calendar |
| Add child form | `components/addChild/` | Child enrollment form |
| Step form | `components/profile-Step-Form/` | Multi-step parent registration |
| Renewal flow | `components/renew-subflow/` | Subscription renewal components |

---

## 12. Internationalization (i18n)

**Configuration (`i18n.json`):**
```json
{
  "locales": ["en", "de", "fr"],
  "defaultLocale": "en",
  "pages": {
    "*": ["common"]
  }
}
```

**Next.js config (`next.config.js`):**
```js
i18n: {
  locales: ["en", "es", "fr", "de"],
  defaultLocale: "en",
}
```

**Using translations in components:**
```js
import useTranslation from "next-translate/useTranslation";

const { t } = useTranslation("common");
// Usage
<h1>{t("hero.title")}</h1>
```

**Adding a new translation key:**
1. Add the key to `locales/en/common.json`
2. Add the translated value to all other locale files

---

## 13. PWA Support

Configured with `next-pwa`:

```js
// next.config.js
const withPWA = require("next-pwa")({
  dest: "public",         // Service worker destination
  register: true,          // Auto-register service worker
  skipWaiting: true,       // Immediately activate new service worker
  sw: "service-worker.js", // Service worker filename
  disable: process.env.NODE_ENV === "development", // Disabled in dev
});
```

**Features:**
- Offline cache of all static assets
- Background sync for API requests
- Install prompt on mobile browsers
- App-like experience when installed

---

## 14. Analytics & Tracking

### Google Analytics (GA4)
```js
// lib/analytics.js
import ReactGA from "react-ga4";
ReactGA.initialize(process.env.NEXT_PUBLIC_GA_KEY);
```
- Tracks page views, events, and conversions
- Initialized in `_app.js`

### Facebook Pixel
```js
// lib/fb-pixel.js
// FB Pixel for conversion tracking
```
- Tracks purchases, signups, and funnel events
- Initialized on app load

### Tawk.to Live Chat
```js
import TawkMessengerReact from "@tawk.to/tawk-messenger-react";
// Embedded in _app.js or layout
```
- Real-time customer support chat widget
- Shown on all pages

---

## 15. Configuration Files

### `next.config.js`
```js
module.exports = withPWA({
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },  // ESLint errors don't block builds
  i18n: {
    locales: ["en", "es", "fr", "de"],
    defaultLocale: "en",
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  ...nextTranslate(),  // Integrates next-translate
});
```

### `tailwind.config.js`
- Custom fonts: Open Sans (default), Inter
- Custom heights and spacing utilities
- Background image utilities for hero banners
- Tailwind plugins: `@tailwindcss/typography`, `@tailwindcss/forms`, `@tailwindcss/aspect-ratio`
- Font family `DejaVu` included for PDF invoice generation

### `jsconfig.json` — Path Aliases
```json
{
  "@services": "src/services",
  "@components": "src/components",
  "@pages": "src/pages",
  "@hooks": "src/hooks",
  "@context": "src/context",
  "@layout": "src/layout",
  "@redux": "src/redux",
  "@utils": "src/utils"
}
```
