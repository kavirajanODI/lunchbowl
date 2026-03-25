# LunchBowl Admin Dashboard (Dashtar) — Complete Documentation

**Application:** `dashtar`  
**Framework:** React 18 + Vite 5  
**Purpose:** Admin panel for managing the LunchBowl meal subscription platform  

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
12. [Sidebar Navigation](#12-sidebar-navigation)
13. [Internationalization (i18n)](#13-internationalization-i18n)
14. [PWA Support](#14-pwa-support)
15. [Configuration Files](#15-configuration-files)

---

## 1. Overview

Dashtar is the **React-based admin dashboard** for the LunchBowl platform. It provides full back-office management including:

- **Catalog management** — Menu dishes, schools, holidays, and subscription table
- **Customer management** — View, search, and manage customer accounts
- **Order management** — Track all meal orders with advanced filtering
- **Staff management** — Admin user roles and permissions
- **Store configuration** — Payment gateways, email/SMS settings, branding
- **Analytics dashboard** — Revenue charts, best sellers, order statistics
- **Multi-language UI** — English, German, Bengali, Hindi

The admin panel communicates with the same backend API (`https://api.lunchbowl.co.in/api`) as the customer store.

---

## 2. Tech Stack & Dependencies

| Category | Technology |
|---|---|
| **Framework** | React 18.2.0 |
| **Build Tool** | Vite 5.x |
| **Routing** | React Router DOM v5.3.4 |
| **Styling** | Tailwind CSS 3.x, Windmill React UI |
| **State Management** | Redux Toolkit 1.9.7, Redux Persist |
| **Server State** | TanStack React Query v5 |
| **Authentication** | JWT stored in cookies (AdminContext) |
| **API Client** | Axios 1.4.0 |
| **Forms** | React Hook Form 7.x |
| **Rich Text** | Draft.js, react-draft-wysiwyg, draftjs-to-html |
| **Charts** | Chart.js 4.x, react-chartjs-2 5.x |
| **PDF** | @react-pdf/renderer |
| **Image Upload** | Cloudinary SDK, browser-image-compression |
| **Drag & Drop** | react-dnd + react-dnd-html5-backend |
| **Internationalization** | i18next 22.x, react-i18next, browser language detector |
| **Notifications** | react-toastify, SweetAlert2 |
| **Real-time** | socket.io-client 4.7.2 |
| **PWA** | vite-plugin-pwa |
| **Utilities** | dayjs, js-cookie, export-from-json, csvtojson, combinate |
| **UI Extras** | React Icons, Headless UI, RC Drawer, RC Switch, RC Tree, react-tabs |

---

## 3. Project Structure

```
dashtar/
├── src/
│   ├── App.jsx                     # Root app — routing, providers, toasts
│   ├── main.jsx                    # Vite entry point
│   ├── config.js                   # API base URL config (dev/prod)
│   ├── i18n.js                     # i18next configuration
│   ├── vite.config.js              # Vite configuration
│   │
│   ├── pages/                      # Route-level page components
│   │   ├── Dashboard.jsx           # Analytics dashboard
│   │   ├── Products.jsx            # Menu/dish management
│   │   ├── ProductDetails.jsx      # Product / dish editor
│   │   ├── Category.jsx            # School management (mapped to categories)
│   │   ├── ChildCategory.jsx       # Sub-category management
│   │   ├── Attributes.jsx          # Holiday management (mapped to attributes)
│   │   ├── ChildAttributes.jsx     # Attribute values
│   │   ├── Coupons.jsx             # Subscription table management
│   │   ├── Staff.jsx               # Staff management
│   │   ├── Customers.jsx           # Customer list
│   │   ├── CustomerOrder.jsx       # Orders for a specific customer
│   │   ├── Orders.jsx              # All orders management
│   │   ├── OrderInvoice.jsx        # Order invoice detail
│   │   ├── Languages.jsx           # Language/locale configuration
│   │   ├── Currencies.jsx          # Currency configuration
│   │   ├── Setting.jsx             # General/store settings
│   │   ├── StoreSetting.jsx        # Store branding settings
│   │   ├── StoreHome.jsx           # Store homepage customization
│   │   ├── EditProfile.jsx         # Admin profile editor
│   │   ├── Notifications.jsx       # Notification centre
│   │   ├── ComingSoon.jsx          # Placeholder page
│   │   ├── Login.jsx               # Admin login
│   │   ├── SignUp.jsx              # Admin registration
│   │   ├── ForgotPassword.jsx      # Password recovery
│   │   ├── ResetPassword.jsx       # Password reset
│   │   └── 404.jsx                 # Not found
│   │
│   ├── components/                 # Reusable UI components
│   │   ├── AccessibleNavigationAnnouncer.jsx  # Accessibility route announcer
│   │   ├── header/                 # Top navigation bar
│   │   ├── sidebar/                # Left collapsible sidebar
│   │   ├── product/                # Product/dish forms and tables
│   │   ├── category/               # Category/school forms and lists
│   │   ├── attribute/              # Attribute/holiday management
│   │   ├── customer/               # Customer list and detail
│   │   ├── order/                  # Order table, detail, invoice
│   │   ├── coupon/                 # Coupon/subscription form and table
│   │   ├── currency/               # Currency configuration
│   │   ├── common/                 # Shared form fields, buttons
│   │   ├── form/                   # Form input components
│   │   ├── dashboard/              # Dashboard charts and stat cards
│   │   ├── chart/                  # Chart.js chart wrappers
│   │   ├── drawer/                 # Slide-out drawers
│   │   ├── image-uploader/         # Cloudinary image uploader
│   │   ├── invoice/                # PDF invoice generator
│   │   ├── language/               # Language selector
│   │   ├── login/                  # Login form, PrivateRoute guard
│   │   ├── modal/                  # Modal dialogs
│   │   ├── order/                  # Order status, filters
│   │   ├── preloader/              # Loading spinners and skeletons
│   │   ├── settings/               # Settings panels
│   │   ├── sidebar/                # Sidebar navigation
│   │   ├── staff/                  # Staff management forms
│   │   ├── store-home/             # Store customization panels
│   │   ├── table/                  # Data table wrappers with pagination
│   │   ├── theme/                  # Theme/dark mode components
│   │   ├── tooltip/                # Tooltip components
│   │   └── Typography/             # Text components
│   │
│   ├── context/
│   │   ├── AdminContext.jsx        # Admin auth state (useReducer + cookies)
│   │   ├── SidebarContext.jsx      # Sidebar collapse/expand state
│   │   └── ThemeContext.js         # Dark/light mode preference
│   │
│   ├── reduxStore/
│   │   ├── store.js                # Redux + Redux Persist (localStorage)
│   │   └── slice/
│   │       ├── dynamicDataSlice.js # Generic API data cache reducer
│   │       └── settingSlice.js     # App settings reducer
│   │
│   ├── services/                   # API service layer (Axios)
│   │   ├── httpService.js          # Axios instance + request interceptors
│   │   ├── AdminServices.js        # Admin auth and staff management
│   │   ├── ProductServices.js      # Product/dish CRUD
│   │   ├── CategoryServices.js     # Category/school CRUD
│   │   ├── AttributeServices.js    # Attribute/holiday CRUD
│   │   ├── OrderServices.js        # Order management + search
│   │   ├── CustomerServices.js     # Customer management
│   │   ├── CouponServices.js       # Coupon/subscription CRUD
│   │   ├── CurrencyServices.js     # Currency configuration
│   │   ├── LanguageServices.js     # Language management
│   │   ├── NotificationServices.js # Notifications
│   │   ├── SettingServices.js      # Store settings
│   │   ├── SchoolServices.js       # School management
│   │   ├── HolidayServices.js      # Holiday calendar
│   │   └── TextTranslateServices.js # API-based text translation
│   │
│   ├── routes/
│   │   ├── index.js                # Route definitions array
│   │   └── sidebar.js              # Sidebar navigation items
│   │
│   ├── layout/
│   │   ├── Layout.jsx              # Main app shell (header + sidebar + content)
│   │   └── Main.jsx                # Main content area wrapper
│   │
│   ├── hooks/                      # Custom React hooks
│   ├── utils/                      # Utility functions
│   └── assets/                     # Images, icons, fonts
│
├── public/                         # Static assets
├── vite.config.js                  # Vite build configuration
├── tailwind.config.js              # Tailwind CSS configuration
├── postcss.config.js               # PostCSS configuration
├── index.html                      # HTML entry point
└── package.json
```

---

## 4. Environment Variables

Create a `.env` file in the `dashtar/` directory:

```env
# Application mode (controls API base URL in config.js)
# MODE is set automatically by Vite (development | production)
# No manual env vars required — config.js handles the URL switch
```

**`config.js` (URL switching logic):**
```js
const IS_PROD = import.meta.env.MODE === "production";
const config = {
  BASE_URL: IS_PROD
    ? "https://api.dashboard.lunchbowl.co.in"
    : "http://localhost:5055",
  SOCKET_URL: IS_PROD
    ? "https://api.dashboard.lunchbowl.co.in"
    : "http://localhost:5055",
};
```

> **Note:** `httpService.js` currently uses a **hardcoded production URL** (`https://api.lunchbowl.co.in/api`) regardless of environment. Update this if you need to point to a local backend during development.

---

## 5. Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Running backend server (see `backend/` directory)

### Installation

```bash
cd dashtar
npm install
```

### Development

```bash
npm run dev
# Starts Vite dev server at http://localhost:4100
# Dev proxy: /api/ → http://localhost:5065
```

### Production Build

```bash
npm run build
# Output: dist/ directory
npm run preview
# Preview the production build locally
```

### Testing

```bash
npm run test
# Runs Vitest test suite
```

---

## 6. Pages & Routes

### Public Routes (No Login Required)

| Path | Component | Description |
|---|---|---|
| `/login` | `Login.jsx` | Admin login form |
| `/signup` | `SignUp.jsx` | Admin registration |
| `/forgot-password` | `ForgotPassword.jsx` | Password recovery request |
| `/reset-password/:token` | `ResetPassword.jsx` | Password reset with token |

### Protected Routes (Login Required via `PrivateRoute`)

All protected routes are rendered inside `Layout.jsx` which provides the Header + Sidebar shell.

#### Dashboard

| Path | Component | Description |
|---|---|---|
| `/dashboard` | `Dashboard.jsx` | Analytics overview — order stats, revenue charts, best sellers |

#### Catalog Management

| Path | Component | Description |
|---|---|---|
| `/products` | `Products.jsx` | **Menu management** — list and manage dish/menu items |
| `/product/:id` | `ProductDetails.jsx` | Edit a specific product or dish |
| `/categories` | `Category.jsx` | **School management** — add/edit/delete schools |
| `/categories/:id` | `ChildCategory.jsx` | Sub-category management |
| `/attributes` | `Attributes.jsx` | **Holiday management** — add/edit/delete holidays |
| `/attributes/:id` | `ChildAttributes.jsx` | Attribute values management |
| `/coupons` | `Coupons.jsx` | **Subscription table** — view all subscriptions |

#### Customer & Order Management

| Path | Component | Description |
|---|---|---|
| `/customers` | `Customers.jsx` | Customer list with search and filters |
| `/customer-order/:id` | `CustomerOrder.jsx` | View all orders for a specific customer |
| `/orders` | `Orders.jsx` | All orders with advanced filtering |
| `/order/:id` | `OrderInvoice.jsx` | Order invoice detail, print, and email |

#### Staff Management

| Path | Component | Description |
|---|---|---|
| `/our-staff` | `Staff.jsx` | Admin staff list — add, edit, delete, set roles |

#### Store Configuration

| Path | Component | Description |
|---|---|---|
| `/settings` | `Setting.jsx` | General settings — store info, payment, email, SMS |
| `/store/customization` | `StoreHome.jsx` | Store UI customization — colors, layout |
| `/store/store-settings` | `StoreSetting.jsx` | Store branding and policies |
| `/languages` | `Languages.jsx` | Multi-language setup |
| `/currencies` | `Currencies.jsx` | Supported currencies and exchange rates |

#### Admin Account

| Path | Component | Description |
|---|---|---|
| `/edit-profile` | `EditProfile.jsx` | Edit admin profile info |
| `/notifications` | `Notifications.jsx` | Admin notification centre |
| `/coming-soon` | `ComingSoon.jsx` | Placeholder for future features |
| `/404` | `404.jsx` | Not found page |

> **Default redirect:** Navigating to `/` automatically redirects to `/dashboard`.

---

## 7. Authentication

### How It Works

1. Admin visits `/login` and submits email + password
2. `AdminServices.loginAdmin(body)` → `POST /api/admin/login`
3. On success, the response contains `{ token, _id, name, email, role, ... }`
4. The `adminInfo` object is:
   - Stored in **AdminContext** (React state)
   - Persisted in a **cookie** (`adminInfo`) via js-cookie
5. Subsequent API calls include `Authorization: Bearer <token>` via Axios interceptor

### `PrivateRoute` Component
Located at `src/components/login/PrivateRoute.jsx`

```jsx
// Checks AdminContext for adminInfo
// Redirects to /login if not authenticated
const PrivateRoute = ({ children }) => {
  const { state } = useContext(AdminContext);
  return state.adminInfo ? children : <Redirect to="/login" />;
};
```

### `AdminContext`
Located at `src/context/AdminContext.jsx`

**State:**
- `adminInfo` — admin profile object with JWT token

**Actions:**
- `USER_LOGIN` — store admin info after login
- `USER_LOGOUT` — clear admin info on logout

**Persistence:** adminInfo cookie (via js-cookie)

### Session Lifecycle
```
Login form submit
    ↓
AdminServices.loginAdmin()  →  POST /api/admin/login
    ↓
AdminContext dispatch(USER_LOGIN, adminInfo)
    ↓
Cookies.set("adminInfo", JSON.stringify(adminInfo))
    ↓
Axios interceptor reads cookie on each request
    ↓
headers.authorization = "Bearer <token>"
```

### Password Recovery
1. Submit email on `/forgot-password` → `AdminServices.forgetPassword()` → `PUT /api/admin/forget-password`
2. Email received with JWT reset link
3. Visit `/reset-password/:token`
4. Submit new password → `AdminServices.resetPassword()` → `PUT /api/admin/reset-password`

---

## 8. State Management

### Redux Store (`reduxStore/`)

Redux Toolkit + Redux Persist stored in **localStorage** (persistent across sessions).

**Slices:**

#### `dynamicDataSlice` (data)
A generic reducer for caching API-fetched collections.

| Action | Description |
|---|---|
| `addData(key, data)` | Add or replace a collection by key (e.g., `"products"`, `"orders"`) |
| `addSingleData(key, item)` | Update a single item by `_id` within a collection |
| `removeData(key)` | Remove a collection by key |

**Usage:**
```js
import { addData, removeData } from "@/reduxStore/slice/dynamicDataSlice";

// After fetching products
dispatch(addData({ key: "products", data: productList }));

// After updating an order
dispatch(addSingleData({ key: "orders", data: updatedOrder }));
```

#### `settingSlice` (setting)
Stores application-level settings and preferences.

### Context API

#### `AdminContext`
- `adminInfo` — current logged-in admin object
- Persisted in cookies for session survival across browser refreshes

#### `SidebarContext`
- `isSidebarOpen` — whether the sidebar is expanded
- `closeSidebar()` — collapse sidebar (auto-called on route change)
- `navBar` — whether the navigation bar is visible

#### `ThemeContext`
- Manages dark/light mode preference
- Persisted in localStorage

### React Query (TanStack Query v5)
Used for server-side data fetching with caching:
- 1 retry on failure
- No refetch on window focus
- Used for products, orders, customers, and settings queries

---

## 9. API Service Layer

All services use the shared Axios instance from `httpService.js`.

### HTTP Client (`httpService.js`)

```js
Base URL: 'https://api.lunchbowl.co.in/api'  (hardcoded production URL)
Timeout: 50 seconds
Request interceptor reads:
  - Cookies.get("adminInfo") → sets Authorization: Bearer <token>
  - Cookies.get("company")   → sets company header (multi-tenant)
```

Methods available: `get`, `post`, `put`, `patch`, `delete`

### Service Methods

#### `AdminServices`

| Method | API Call | Description |
|---|---|---|
| `registerAdmin(body)` | `POST /admin/register` | Register a new admin |
| `loginAdmin(body)` | `POST /admin/login` | Admin login |
| `forgetPassword(body)` | `PUT /admin/forget-password` | Request password reset |
| `resetPassword(body)` | `PUT /admin/reset-password` | Submit new password |
| `addStaff(body)` | `POST /admin/add` | Add new staff member |
| `getAllStaff(body)` | `GET /admin` | List all staff |
| `getStaffById(id, body)` | `POST /admin/:id` | Get staff by ID |
| `updateStaff(id, body)` | `PUT /admin/:id` | Update staff |
| `updateStaffStatus(id, body)` | `PUT /admin/update-status/:id` | Activate/deactivate staff |
| `deleteStaff(id)` | `DELETE /admin/:id` | Delete staff |

#### `ProductServices`

| Method | API Call | Description |
|---|---|---|
| `getAllProducts({page, limit, category, title, price})` | `GET /products` | List all products with filters |
| `getAllDishes({page, limit, cuisine, title, status})` | `GET /products/get-all-menu` | List all menu dishes |
| `addDish(formData)` | `POST /products/add-dish` | Add dish (multipart/form-data) |
| `updateDish(id, formData)` | `PUT /products/update-dish/:id` | Update dish with images |
| `getProductById(id)` | `POST /products/:id` | Get product detail |
| `addProduct(body)` | `POST /products/add` | Add product |
| `addAllProducts(body)` | `POST /products/all` | Bulk insert products |
| `updateProduct(id, body)` | `PATCH /products/:id` | Update product |
| `updateManyProducts(body)` | `PATCH /products/update/many` | Bulk update |
| `updateStatus(id, body)` | `PUT /products/status/:id` | Toggle visibility |
| `deleteProduct(id)` | `DELETE /products/:id` | Delete product |
| `deleteManyProducts(body)` | `PATCH /products/delete/many` | Bulk delete |

#### `OrderServices`

| Method | API Call | Description |
|---|---|---|
| `getAllOrders({customerName, status, page, limit, day, method, startDate, endDate})` | `GET /orders` | List orders with filters |
| `getAllFoodOrders({page, limit})` | `GET /orders/get-all/food-order` | List food/meal orders |
| `searchOrders({childName, date, page, limit})` | `GET /orders/search` | Search orders by child/date |
| `getAllOrdersTwo({invoice})` | `GET /orders/all` | List orders by invoice |
| `getRecentOrders({page, limit, startDate, endDate})` | `GET /orders/recent` | Recent orders |
| `getOrderCustomer(id, body)` | `GET /orders/customer/:id` | Orders for a customer |
| `getOrderById(id, body)` | `GET /orders/:id` | Order detail |
| `getDashboardOrdersData()` | `GET /orders/dashboard` | Dashboard stats |
| `getDashboardRecentOrdersData()` | `GET /orders/dashboard-recent-order` | Recent orders widget |
| `getDashboardAmount()` | `GET /orders/dashboard-amount` | Revenue totals |
| `getDashboardCount()` | `GET /orders/dashboard-count` | Order count by status |
| `getBestSellerProductChart()` | `GET /orders/best-seller/chart` | Best seller data |
| `getUserSubscription({...})` | `GET /orders/get-All/user-Subscription` | All subscriptions |
| `searchUserSubscription({...})` | `GET /orders/get-All/user-Subscription/search` | Search subscriptions |
| `updateOrder(id, body)` | `PUT /orders/:id` | Update order status |
| `deleteOrder(id)` | `DELETE /orders/:id` | Delete order |
| `sendEmailInvoiceToCustomer(data)` | `POST /order/customer/invoice` | Email invoice |

#### `CustomerServices` (Admin)

| Method | API Call | Description |
|---|---|---|
| `getAllCustomers()` | `GET /customer` | List all customers |
| `getCustomerById(id)` | `GET /customer/:id` | Customer detail |
| `updateCustomer(id, body)` | `PUT /customer/:id` | Update customer |
| `deleteCustomer(id)` | `DELETE /customer/:id` | Delete customer |

#### `CategoryServices`

| Method | API Call | Description |
|---|---|---|
| `getAllCategory()` | `GET /category/all` | All categories/schools |
| `getShowingCategory()` | `GET /category/show` | Visible categories |
| `getCategoryById(id)` | `GET /category/:id` | Get category |
| `addCategory(body)` | `POST /category/add` | Create category |
| `addAllCategory(body)` | `POST /category/all` | Bulk insert |
| `updateCategory(id, body)` | `PUT /category/:id` | Update category |
| `updateManyCategory(body)` | `PATCH /category/update/many` | Bulk update |
| `updateStatus(id, body)` | `PUT /category/status/:id` | Toggle visibility |
| `deleteCategory(id)` | `DELETE /category/:id` | Delete category |
| `deleteManyCategory(body)` | `PATCH /category/delete/many` | Bulk delete |

#### `AttributeServices`

| Method | API Call | Description |
|---|---|---|
| `getAllAttributes(page, limit)` | `GET /attributes` | All attributes/holidays |
| `getAttributeById(id)` | `GET /attributes/:id` | Get attribute |
| `addAttribute(body)` | `POST /attributes/add` | Create attribute |
| `addChildAttribute(id, body)` | `PUT /attributes/add/child/:id` | Add value to attribute |
| `updateAttribute(id, body)` | `PUT /attributes/:id` | Update attribute |
| `updateChildAttribute(attrId, childId, body)` | `PUT /attributes/update/child/:attrId/:childId` | Update attribute value |
| `updateStatus(id, body)` | `PUT /attributes/status/:id` | Toggle attribute visibility |
| `deleteAttribute(id)` | `DELETE /attributes/:id` | Delete attribute |
| `deleteChildAttribute(attrId, childId)` | `PUT /attributes/delete/child/:attrId/:childId` | Delete attribute value |

#### `CouponServices`

| Method | API Call | Description |
|---|---|---|
| `getAllCoupons()` | `GET /coupon` | All coupons/subscriptions |
| `getCouponById(id)` | `GET /coupon/:id` | Get coupon |
| `addCoupon(body)` | `POST /coupon/add` | Create coupon |
| `updateCoupon(id, body)` | `PUT /coupon/:id` | Update coupon |
| `updateStatus(id, body)` | `PUT /coupon/status/:id` | Toggle coupon visibility |
| `deleteCoupon(id)` | `DELETE /coupon/:id` | Delete coupon |
| `deleteManyCoupons(body)` | `PATCH /coupon/delete/many` | Bulk delete |

#### `SettingServices`

| Method | API Call | Description |
|---|---|---|
| `getGlobalSetting()` | `GET /setting/global/all` | Get global settings |
| `addGlobalSetting(body)` | `POST /setting/global/add` | Add global settings |
| `updateGlobalSetting(body)` | `PUT /setting/global/update` | Update global settings |
| `getStoreSetting()` | `GET /setting/store-setting/all` | Get store settings |
| `addStoreSetting(body)` | `POST /setting/store-setting/add` | Add store settings |
| `updateStoreSetting(body)` | `PUT /setting/store-setting/update` | Update store settings |
| `getStoreCustomizationSetting()` | `GET /setting/store/customization/all` | Get UI customization |
| `addStoreCustomizationSetting(body)` | `POST /setting/store/customization/add` | Add customization |
| `updateStoreCustomizationSetting(body)` | `PUT /setting/store/customization/update` | Update customization |

#### `SchoolServices`

| Method | API Call | Description |
|---|---|---|
| `addSchool(body)` | `POST /schools/add-school` | Create school |
| `getAllSchools()` | `GET /schools/get-all-schools` | All schools |
| `getSchoolById(id)` | `GET /schools/get-school/:id` | Get school |
| `updateSchool(id, body)` | `PUT /schools/update-school/:id` | Update school |
| `deleteSchool(id)` | `DELETE /schools/delete-school/:id` | Delete school |

#### `HolidayServices`

| Method | API Call | Description |
|---|---|---|
| `addHoliday(body)` | `POST /holidays/add-holiday` | Create holiday |
| `getAllHolidays()` | `GET /holidays/get-all-holidays` | All holidays |
| `updateHoliday(id, body)` | `PUT /holidays/update-holiday/:id` | Update holiday |
| `deleteHoliday(id)` | `DELETE /holidays/delete-holiday/:id` | Delete holiday |

---

## 10. Key Features

### 10.1 Analytics Dashboard (`/dashboard`)
The dashboard provides real-time business insights:
- **Order Count Cards** — total, pending, processing, delivered orders
- **Revenue Summary** — total revenue, daily/weekly/monthly trends
- **Order Volume Chart** — line/bar chart of orders over time (Chart.js)
- **Best Seller Products Chart** — top-selling products by revenue
- **Recent Orders Table** — last N orders with status

### 10.2 Menu Management (`/products`)
Admin manages the school lunch menu:
- View all dishes in a paginated table
- Add new dish with:
  - Title, short description, full description, additional info
  - Main image + secondary image (uploaded via multipart form-data)
  - Cuisine type, nutritional values (array)
  - Status (active/inactive)
- Edit existing dish via drag-and-drop image replacement
- Toggle dish visibility (active/inactive)
- Delete individual or multiple dishes

### 10.3 School Management (`/categories`)
Mapped to the categories API endpoint:
- Add/edit/delete schools with name, location, and lunch time
- Schools appear as location options during customer enrollment

### 10.4 Holiday Management (`/attributes`)
Mapped to the attributes API endpoint:
- Add holiday dates with a name
- Holidays are used in the meal calendar to block those dates
- Dates stored in UTC to avoid timezone issues

### 10.5 Subscription Table (`/coupons`)
Mapped to the coupons API endpoint:
- View all active meal subscriptions
- Filter by status, date range, customer
- Admin can modify subscription parameters

### 10.6 Order Management (`/orders`)

Advanced order management with filters:
- **Filters available:** customer name, order status, payment method, date range, day
- **Search:** search by child name, specific date
- **Order statuses:** Pending → Processing → Delivered | Cancel
- **Actions:** update status, delete order, email invoice to customer
- **Invoice page** (`/order/:id`): full invoice with print functionality

### 10.7 Customer Management (`/customers`)
- Paginated customer list
- Search by name, email, or phone
- View customer profile details
- See all orders for a specific customer (`/customer-order/:id`)
- Delete customer account

### 10.8 Staff Management (`/our-staff`)
- Add new admin/staff members with role assignment
- Roles: Admin, Super Admin, Cashier, Manager, CEO, Driver, Security Guard, Accountant
- Set access permissions per staff member (access_list)
- Activate/deactivate staff
- Delete staff

### 10.9 Store Settings (`/settings`)
Configures the entire platform:

| Setting Category | What It Controls |
|---|---|
| **General** | Store name, logo, contact, address |
| **Payment Gateways** | Stripe keys, PayPal keys, Razorpay keys, CCAvenue keys |
| **Email** | SMTP settings, email templates |
| **SMS** | SMS gateway API keys, templates |
| **OAuth Providers** | Google, GitHub, Facebook OAuth client IDs and secrets |
| **SEO** | Meta title, description, OG image |

### 10.10 Multi-Language & Multi-Currency

**Languages (`/languages`):**
- Add/remove supported languages
- Toggle language visibility in the store
- Language ISO code management

**Currencies (`/currencies`):**
- Add multiple currencies with symbol and ISO code
- Enable/disable currencies
- Toggle live exchange rate updates

---

## 11. Components Reference

### Layout Components

| Component | Location | Description |
|---|---|---|
| `Layout` | `layout/Layout.jsx` | App shell — renders Header, Sidebar, and content |
| `Header` | `components/header/` | Top bar with user menu, theme toggle, notifications |
| `Sidebar` | `components/sidebar/` | Left collapsible navigation sidebar |
| `Main` | `layout/Main.jsx` | Main content area with scroll container |

### Navigation

| Component | Location | Description |
|---|---|---|
| `PrivateRoute` | `components/login/PrivateRoute.jsx` | Auth guard — redirects to `/login` if not authenticated |
| `SidebarContent` | `components/sidebar/` | Renders sidebar navigation from `routes/sidebar.js` |

### Data Tables

| Component | Location | Description |
|---|---|---|
| Products table | `components/product/` | Paginated product/dish list with actions |
| Orders table | `components/order/` | Advanced order list with multi-filter |
| Customers table | `components/customer/` | Customer list with search |
| Staff table | `components/staff/` | Staff list with role display |
| Coupon table | `components/coupon/` | Coupon/subscription table |

### Form Components

| Component | Location | Description |
|---|---|---|
| Product/Dish form | `components/product/` | Full product creation/edit form |
| Category form | `components/category/` | School/category form |
| Attribute form | `components/attribute/` | Holiday/attribute form |
| Coupon form | `components/coupon/` | Coupon/subscription form |
| Settings panels | `components/settings/` | Store configuration forms |

### Charts

| Component | Location | Description |
|---|---|---|
| Order chart | `components/chart/` | Order volume over time (line/bar) |
| Revenue chart | `components/dashboard/` | Revenue trends |
| Best seller chart | `components/chart/` | Top products by sales |

### Utilities

| Component | Location | Description |
|---|---|---|
| Image uploader | `components/image-uploader/` | Cloudinary upload with compression |
| Invoice | `components/invoice/` | PDF invoice generator with print |
| Loading skeleton | `components/preloader/` | Skeleton loading states |
| Modal | `components/modal/` | Confirmation and detail modals |
| Drawer | `components/drawer/` | Slide-out panel (RC Drawer) |

---

## 12. Sidebar Navigation

The sidebar navigation is defined in `src/routes/sidebar.js`. Currently active navigation items:

| Section | Menu Item | Route |
|---|---|---|
| **Catalog** | Menu | `/products` |
| **Catalog** | School | `/categories` |
| **Catalog** | Holidays | `/attributes` |
| **Catalog** | Subscription Table | `/coupons` |
| *(direct)* | Customers | `/customers` |
| *(direct)* | Orders | `/orders` |

> **Note:** Several navigation items are currently commented out in `sidebar.js` (Staff, Settings, Languages, Currencies, Online Store sections). They are still accessible via direct URL.

**Route Access List** (for role-based access control):
```js
["dashboard", "products", "categories", "attributes", "coupons",
 "customers", "orders", "our-staff", "settings", "languages",
 "currencies", "store", "customization", "store-settings",
 "product", "order", "edit-profile", "customer-order",
 "notifications", "coming-soon"]
```
These are assigned to staff members via `access_list` field to restrict which sections they can access.

---

## 13. Internationalization (i18n)

**Configuration (`src/i18n.js`):**
```js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Languages: English, German, Bengali, Hindi
// Detection: browser language → cookie → localStorage
// Fallback: English
```

**Usage in components:**
```jsx
import { useTranslation } from "react-i18next";

const { t } = useTranslation();
<span>{t("Orders")}</span>
<span>{t("Products")}</span>
```

**Language switching:**
```jsx
import i18n from "i18next";
i18n.changeLanguage("de"); // Switch to German
```

---

## 14. PWA Support

Configured with `vite-plugin-pwa`:

```js
// vite.config.js
VitePWA({
  registerType: "autoUpdate",
  manifest: {
    name: "Dashtar | React eCommerce Admin Dashboard",
    short_name: "Dashtar - E-Commerce Website",
    theme_color: "#FFFFFF",
    display: "standalone",
    orientation: "portrait",
  },
  workbox: {
    globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
    maximumFileSizeToCacheInBytes: 10MB,
  },
})
```

**Features:**
- Auto-update service worker on new deployments
- Offline caching of all static assets
- Installable as a standalone app on desktop and mobile

---

## 15. Configuration Files

### `vite.config.js`

```js
plugins: [react(), cssInjectedByJsPlugin(), VitePWA(), compression(), visualizer()]
build: {
  chunkSizeWarningLimit: 10MB,
  assetsDir: "@/assets",
}
server: {
  proxy: { "/api/": "http://localhost:5065" },
  allowedHosts: ["dashboard.lunchbowl.co.in", "lunchbowl.co.in", "localhost"],
  port: 4100,
}
resolve: {
  alias: { "@": "./src/" }
}
test: {
  environment: "jsdom",
  setupFiles: ["./src/setupTest.js"],
}
```

### `tailwind.config.js`
- **Dark mode:** class-based (`dark:` prefix)
- **Fonts:** Open Sans (default), Inter (alternate)
- **Custom breakpoints:** xs, sm, md, lg, xl, 2xl, ipad
- **Extended colors:** custom brand palette
- **Custom shadows:** elevation utilities

### `config.js`
```js
const IS_PROD = import.meta.env.MODE === "production";
const config = {
  BASE_URL: IS_PROD
    ? "https://api.dashboard.lunchbowl.co.in"
    : "http://localhost:5055",
  SOCKET_URL: IS_PROD
    ? "https://api.dashboard.lunchbowl.co.in"
    : "http://localhost:5055",
};
export default config;
```

### Path Alias
All imports can use the `@/` prefix to resolve from `src/`:
```js
import AdminServices from "@/services/AdminServices";
import { AdminContext } from "@/context/AdminContext";
import PrivateRoute from "@/components/login/PrivateRoute";
```
