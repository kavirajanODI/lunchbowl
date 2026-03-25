# LunchBowl – React Native App

LunchBowl is a mobile application that lets parents manage their children's school lunch subscriptions. Parents can browse menus, book meals on an interactive calendar, track order history, and pay securely — all from one place.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Environment Setup](#2-environment-setup)
3. [Running the App Locally](#3-running-the-app-locally)
   - [Android](#android)
   - [iOS](#ios)
   - [Windows Quick-Start Scripts](#windows-quick-start-scripts)
4. [Project Structure](#4-project-structure)
5. [Key Features](#5-key-features)
6. [Authentication Flow](#6-authentication-flow)
7. [Navigation Structure](#7-navigation-structure)
8. [Screens Reference](#8-screens-reference)
9. [State Management & Contexts](#9-state-management--contexts)
10. [Services & API Layer](#10-services--api-layer)
11. [Configuration Guide](#11-configuration-guide)
12. [Available Scripts](#12-available-scripts)
13. [Running Tests & Linting](#13-running-tests--linting)
14. [Troubleshooting](#14-troubleshooting)

---

## 1. Prerequisites

Before you begin, make sure the following tools are installed on your machine.

| Tool | Minimum Version | Notes |
|------|----------------|-------|
| Node.js | 18.x | Required by package.json `engines` field |
| npm | 9.x | Bundled with Node 18 |
| Java Development Kit (JDK) | 17 | Android builds require JDK 17 |
| Android Studio | Latest stable | Includes Android SDK and emulator |
| Xcode | 14+ | macOS only; required for iOS builds |
| CocoaPods | ≥ 1.13, < 1.15 | iOS dependency manager (`sudo gem install cocoapods`) |
| React Native CLI | Latest | `npm install -g react-native-cli` |

> **Tip (Windows):** Run `runDoctor.bat` from the project root to check your environment automatically:
> ```bat
> runDoctor.bat
> ```
> This executes `npx react-native doctor` and shows any missing tools.

For a full guide, follow the official [React Native Environment Setup](https://reactnative.dev/docs/environment-setup) until the _"Creating a new application"_ step.

---

## 2. Environment Setup

### Clone the repository

```bash
git clone https://github.com/opendesignsgit/lunchbowl-native-app.git
cd lunchbowl-native-app
```

### Install JavaScript dependencies

```bash
npm install
```

### iOS – Install CocoaPods

```bash
cd ios
pod install
cd ..
```

### Firebase configuration

This app uses **Firebase** for push notifications (FCM) and Firestore. You must place the native Firebase config files in the project **before** building:

| Platform | File | Location |
|----------|------|----------|
| Android | `google-services.json` | `android/app/google-services.json` |
| iOS | `GoogleService-Info.plist` | `ios/Lunchbowl/GoogleService-Info.plist` |

Download these files from your [Firebase Console](https://console.firebase.google.com/) project settings.

### API base URL

The production API is configured in `src/config/apiConfig.ts`:

```ts
export const API_URL = 'https://api.lunchbowl.co.in/api';
export const IMAGE_BASE_URL = 'https://api.lunchbowl.co.in';
```

To point to the development server, comment out the production lines and uncomment:

```ts
// export const API_URL = 'https://dev-api.lunchbowl.co.in/api';
// export const IMAGE_BASE_URL = 'https://dev-api.lunchbowl.co.in';
```

For a local backend running on an Android emulator, use:

```ts
// export const API_URL = 'http://10.0.2.2:5055/api';
```

---

## 3. Running the App Locally

### Start Metro bundler

Metro is the JavaScript bundler for React Native. Start it **first** in a dedicated terminal:

```bash
npm start
```

### Android

Open a **second terminal** and run:

```bash
npm run android
```

This builds the app and installs it on a connected Android device or running emulator.

**Requirements:**
- Android Studio installed with an AVD (Android Virtual Device) configured, **or**
- A physical Android device connected via USB with USB Debugging enabled.

### iOS

> **macOS only.**

```bash
npm run ios
```

This builds the app and launches it on the iOS Simulator (or a connected iPhone with a valid provisioning profile).

**Requirements:**
- Xcode installed with at least one iOS Simulator target.
- CocoaPods dependencies installed (`pod install` in the `ios/` directory).

### Windows Quick-Start Scripts

Two batch scripts are provided for Windows users:

| Script | Description |
|--------|-------------|
| `start.bat` | Starts Metro in a new window, then runs `react-native run-android` |
| `runDoctor.bat` | Runs `npx react-native doctor` to verify the dev environment |

Double-click the script file or run it from a Command Prompt:

```bat
start.bat
```

### Hot Reloading

Once the app is running, you can reload it instantly after code changes:

- **Android:** Press <kbd>R</kbd> twice, or open the Developer Menu with <kbd>Ctrl</kbd>+<kbd>M</kbd> (Windows/Linux) or <kbd>Cmd</kbd>+<kbd>M</kbd> (macOS) and choose **Reload**.
- **iOS:** Press <kbd>Cmd</kbd>+<kbd>R</kbd> in the Simulator.

---

## 4. Project Structure

```
lunchbowl-native-app/
├── android/                  # Android native project
├── ios/                      # iOS native project
├── src/
│   ├── api/                  # Raw HTTP API calls (Axios)
│   │   ├── authApi.ts
│   │   ├── userApi.ts
│   │   ├── ConfigApi/
│   │   ├── MealsApi/
│   │   ├── MyPlanApi/
│   │   ├── RegistrationApi/
│   │   ├── SubscriptionApi/
│   │   └── notificationsApi/
│   ├── assets/               # Images, icons, fonts, colour tokens
│   ├── components/           # Reusable UI components
│   │   ├── Alerts/
│   │   ├── Animations/
│   │   ├── Backgrounds/
│   │   ├── Error/Toast/
│   │   ├── Filters/
│   │   ├── LoadingModal/
│   │   ├── Modal/
│   │   ├── Text/
│   │   ├── Titles/
│   │   ├── buttons/
│   │   ├── inputs/
│   │   └── skeletons/
│   ├── config/               # App-wide configuration
│   │   ├── apiConfig.ts      # Base URL & image URL
│   │   ├── ccavenueConfig.tsx # Payment gateway credentials
│   │   ├── env.ts            # Environment variables
│   │   ├── httpclient.ts     # Axios instance with auth interceptors
│   │   └── tokenConfig.ts    # AsyncStorage key for JWT token
│   ├── context/              # React Context providers (global state)
│   ├── hooks/                # Custom React hooks
│   ├── model/                # TypeScript interfaces & type definitions
│   ├── navigations/          # React Navigation structure
│   ├── screens/              # Full-page screen components
│   ├── services/             # Business logic layer
│   ├── styles/               # Global styles & SVG icon definitions
│   └── utils/                # Helper utilities
├── App.tsx                   # Root component
├── index.js                  # Entry point
├── firebaseConfig.ts         # Firebase SDK initialization
├── package.json
├── tsconfig.json
├── babel.config.js
├── metro.config.js
├── jest.config.js
├── start.bat                 # Windows: start Metro + Android
└── runDoctor.bat             # Windows: run RN environment doctor
```

---

## 5. Key Features

| Feature | Description |
|---------|-------------|
| **OTP Login** | Secure phone-number-based login using one-time passwords |
| **Multi-child Management** | Parents can add and manage multiple children under one account |
| **4-Step Registration** | Guided onboarding: parent details → child details → subscription plan → payment |
| **Interactive Meal Calendar** | Colour-coded calendar to view and book meals, with holiday awareness |
| **Menu Browsing** | Browse meals by category with search and dietary filters |
| **Subscription Plans** | Select daily/weekly/monthly meal subscription tiers |
| **Secure Payments** | CCAvenue payment gateway integration (credit/debit card, UPI, net banking) |
| **Push Notifications** | Firebase Cloud Messaging (FCM) for order updates and reminders |
| **Dietary Tips** | Curated nutritional content with detailed tip pages |
| **Order History** | Full history of past orders with per-order detail view |
| **Offline Detection** | Detects loss of connectivity and notifies the user via a toast |
| **Walkthrough Tutorial** | First-launch animated walkthrough for new users |

---

## 6. Authentication Flow

Authentication is managed by `AuthContext` (`src/context/AuthContext.tsx`).

```
1. User enters phone number
        │
        ▼
2. POST /customer/sendOtp  ──► OTP sent to user's phone
        │
        ▼
3. User enters OTP on OtpVerificationScreen
        │
        ▼
4. POST /customer/verifyOtp ──► Returns { token, user }
        │
        ▼
5. JWT token saved to AsyncStorage (key: "token")
   User data saved to AsyncStorage (key: "user")
        │
        ▼
6. AuthContext sets isLoggedIn = true
        │
        ├─► isProfileSetupDone = false  ──► RegistrationScreen (4-step onboarding)
        │
        └─► isProfileSetupDone = true   ──► AppNavigator (main app)
```

**Key auth state values:**

| State | Type | Description |
|-------|------|-------------|
| `isLoggedIn` | `boolean` | Whether the user is authenticated |
| `isLoading` | `boolean` | True while checking persisted session on startup |
| `authToken` | `string` | JWT bearer token |
| `userId` | `string` | User's database ID |
| `user` | `object` | Full user object (name, email, phone, role) |
| `isProfileSetupDone` | `boolean` | Whether 4-step registration is complete |

The HTTP client (`src/config/httpclient.ts`) automatically attaches the token as an `Authorization: Bearer <token>` header via an Axios request interceptor. A 401 response clears the token and logs the user out.

---

## 7. Navigation Structure

```
MainNavigator (NavigationContainer)
│
├── [isLoading = true]  → SplashScreen
│
├── [isLoggedIn = false] → AuthNavigator
│   ├── OnBoardingNavigator
│   │   ├── SplashScreen
│   │   ├── WalkThroughScreen
│   │   └── WelcomeScreen
│   ├── LoginScreen
│   ├── OtpVerificationScreen
│   ├── SignupScreen
│   └── GoogleAuthScreen
│
└── [isLoggedIn = true] → AppNavigator (Bottom Tab Navigator)
    │
    ├── Home Tab  → DashboardNavigator (Stack)
    │   ├── HomeScreen
    │   ├── NotificationScreen
    │   ├── MealDetailScreen
    │   ├── SettingsScreen
    │   ├── EditProfileScreen
    │   ├── ParentChildInfoScreen
    │   ├── OffersScreen / OfferDetailScreen
    │   ├── FaqScreen
    │   ├── HelpCenterScreen
    │   ├── AboutUsScreen
    │   ├── PrivacyPolicyScreen
    │   ├── DietaryTipsScreen / DietaryTipsDetailsScreen
    │   └── OrderHistoryScreen / HistoryDetailPage
    │
    ├── Menu Tab  → MenueNavigator (Stack)
    │   ├── MealCategoryScreen (Menu)
    │   └── MealDetailScreen
    │
    ├── MyPlan Tab → MyPlanNavigator (Stack, wrapped in RegistrationProvider)
    │   ├── RegistrationScreen (4-step form)
    │   ├── MenuSelectionScreen
    │   ├── FoodScreen (FoodList)
    │   ├── CalenderScreen (meal booking calendar)
    │   └── PaymentWebView
    │
    └── History Tab → HistoryNavigator (Stack)
        ├── OrderHistoryScreen
        └── HistoryDetailPage
```

> **Bottom tab visibility:** The tab bar is automatically hidden on certain screens (e.g., Registration, Meal Detail, Settings). This is controlled by `src/navigations/HiddenTabRoutes.ts`.

---

## 8. Screens Reference

### Onboarding / Auth

| Screen | File | Description |
|--------|------|-------------|
| SplashScreen | `screens/Onboarding/SplashScreen.tsx` | Startup splash; shown while session is loaded |
| WalkThroughScreen | `screens/Onboarding/WalkThroughScreen.tsx` | Animated app feature walkthrough for new users |
| WelcomeScreen | `screens/Onboarding/WelcomeScreen.tsx` | Entry screen with login / sign-up options |
| LoginScreen | `screens/Auth/LoginScreen.tsx` | Phone number input; triggers OTP send |
| OtpVerificationScreen | `screens/Auth/OtpVerificationScreen.tsx` | OTP code entry and verification |
| SignupScreen | `screens/Auth/SignupScreen.tsx` | New user account creation |
| GoogleAuthScreen | `screens/Auth/GoogleAuthScreen.tsx` | Google Sign-In alternative |

### Dashboard / Home

| Screen | File | Description |
|--------|------|-------------|
| HomeScreen | `screens/Dashboard/HomeScreen.tsx` | Main landing page: banners, popular menus, school list, dietary tips |
| NotificationScreen | `screens/Notification/NotificationScreen.tsx` | In-app notification history |

### Menu

| Screen | File | Description |
|--------|------|-------------|
| MealCategoryScreen | `screens/Menu/Menu.tsx` | Browse meal categories with search and filter |
| MealDetailScreen | `screens/Menu/MealDetailScreen.tsx` | Detailed view of a single meal |

### My Plan (Subscription Journey)

| Screen | File | Description |
|--------|------|-------------|
| RegistrationScreen | `screens/MyPlan/RegistrationScreen.tsx` | 4-step guided registration form |
| MenuSelectionScreen | `screens/MyPlan/MenuSelectionScreen.tsx` | Pick meal preferences |
| FoodScreen | `screens/MyPlan/FoodScreen.tsx` | Review and confirm selected foods |
| CalenderScreen | `screens/MyPlan/CalenderScreen.tsx` | Interactive calendar for meal scheduling |
| PaymentWebView | `screens/PaymentWebView.tsx` | CCAvenue payment gateway in a WebView |

### Settings

| Screen | File | Description |
|--------|------|-------------|
| SettingsScreen | `screens/Settings/SettingsScreen.tsx` | Settings hub with links to all sub-sections |
| EditProfileScreen | `screens/Settings/EditProfileScreen.tsx` | Edit parent/child profile data |
| ParentChildInfoScreen | `screens/Settings/ParentChildInfoScreen.tsx` | View parent and child information |
| OffersScreen | `screens/Settings/OffersScreen.tsx` | Browse active offers |
| OfferDetailScreen | `screens/Settings/OfferDetailScreen.tsx` | Detail view for a single offer |
| FaqScreen | `screens/Settings/FaqScreen.tsx` | Frequently asked questions |
| HelpCenterScreen | `screens/Settings/HelpCenterScreen.tsx` | Support resources |
| AboutUsScreen | `screens/Settings/AboutUsScreen.tsx` | Company information |
| PrivacyPolicyScreen | `screens/Settings/PrivacyPolicyScreen.tsx` | Terms and privacy policy |
| DietaryTipsScreen | `screens/Settings/DietaryTipsScreen.tsx` | List of dietary/nutritional tips |
| DietaryTipsDetailsScreen | `screens/Settings/DietaryTipsDetailsScreen.tsx` | Detailed single-tip view |

### History

| Screen | File | Description |
|--------|------|-------------|
| OrderHistoryScreen | `screens/History/OrderHistoryScreen.tsx` | List of past orders |
| HistoryDetailPage | `screens/History/HistoryDetailPage.tsx` | Detailed view of a single past order |

### Utility Screens

| Screen | File | Description |
|--------|------|-------------|
| OfflineScreen | `screens/OfflineScreen.tsx` | Shown when no network is available |
| 404Screen | `screens/404Screen.tsx` | Shown for routes under construction |

---

## 9. State Management & Contexts

All global state is managed through React Context providers. They are composed at the root level in `App.tsx` and `AppNavigator.tsx`.

| Context | File | Provided State / Hooks |
|---------|------|----------------------|
| `AuthContext` | `context/AuthContext.tsx` | `isLoggedIn`, `authToken`, `user`, `userId`, `isProfileSetupDone`, `login()`, `logout()` |
| `UserDataContext` | `context/UserDataContext.tsx` | User profile data; `useUserProfile()` hook |
| `ChildContext` | `context/ChildContext.tsx` | Children list & active child; `useChildData()` hook |
| `MealContext` | `context/MealContext.tsx` | Meal categories & items; `useMeals()` hook |
| `MenuContext` | `context/MenuContext.tsx` | Currently selected menu; `useMenu()` hook |
| `FoodContext` | `context/FoodContext.tsx` | Food preferences; `useFood()` hook |
| `RegistrationContext` | `context/RegistrationContext.tsx` | 4-step registration form state |
| `HolidayDateContext` | `context/calenderContext.tsx` | Holiday dates for calendar; `useDate()` hook |
| `DataProvider` | `context/DataProvider.tsx` | General app data |
| `ToastProvider` | `components/Error/Toast/ToastProvider.tsx` | Global toast notifications; `useToast()` hook |

### Custom Hooks

| Hook | File | Description |
|------|------|-------------|
| `useNetwork` | `hooks/useNetwork.ts` | Monitors internet connectivity (`isConnected`) |
| `useFirebaseNotifications` | `hooks/useFirebaseNotifications.ts` | Sets up FCM foreground / background handlers |

---

## 10. Services & API Layer

The app separates concerns between:

- **API layer** (`src/api/`) — raw HTTP calls using Axios.
- **Service layer** (`src/services/`) — business logic that calls the API layer and transforms data for screens/contexts.

### Auth

| Function | Endpoint | Description |
|----------|----------|-------------|
| `AuthApi.sendOtp()` | `POST /customer/sendOtp` | Request OTP for a phone number |
| `AuthApi.verifyOtp()` | `POST /customer/verifyOtp` | Verify OTP and receive JWT token |
| `AuthService.doLogin()` | — | Orchestrates OTP verify + token storage |
| `AuthService.doSignup()` | — | New user registration |
| `AuthService.completeOnboarding()` | — | Marks profile setup as complete |

### User

| Function | Endpoint | Description |
|----------|----------|-------------|
| `UserApi.getAccountDetails()` | `GET /customer/account-details` | Fetch logged-in user's profile |
| `UserApi.getAllChildren()` | `GET /customer/get-all-children` | Fetch all children for the user |
| `UserApi.updateUserDetails()` | `PUT /customer/update-user-details/:userId` | Update profile fields |
| `UserApi.updatePassword()` | `PUT /customer/update-password/:userId` | Change password |

### HTTP Client

All API calls use a shared Axios instance (`src/config/httpclient.ts`) that:

1. Sets `Content-Type: application/json`.
2. Reads the JWT from AsyncStorage and adds `Authorization: Bearer <token>` to every request.
3. Logs request and response details when `loggingEnabled = true`.
4. Automatically calls `doLogout()` and clears stored credentials on a 401 Unauthorised response.

---

## 11. Configuration Guide

### API URLs (`src/config/apiConfig.ts`)

```ts
// Production (default)
export const API_URL = 'https://api.lunchbowl.co.in/api';
export const IMAGE_BASE_URL = 'https://api.lunchbowl.co.in';

// Development server (uncomment to use)
// export const API_URL = 'https://dev-api.lunchbowl.co.in/api';

// Local backend on Android emulator (uncomment to use)
// export const API_URL = 'http://10.0.2.2:5055/api';
```

### Token Storage (`src/config/tokenConfig.ts`)

The JWT is stored in AsyncStorage under the key `"token"`. The user object is stored under `"user"`.

### Payment Gateway (`src/config/ccavenueConfig.tsx`)

CCAvenue credentials live in `ccavenueConfig.tsx`. **Do not commit live working keys to source control.** For local development, replace these with sandbox credentials:

```ts
const ccavenueConfig = {
  merchant_id: '<your_merchant_id>',
  access_code: '<your_access_code>',
  working_key: '<your_working_key>',
  redirect_url: 'https://api.lunchbowl.co.in/api/ccavenue/response',
  cancel_url: 'https://api.lunchbowl.co.in/api/ccavenue/response',
  currency: 'INR',
  language: 'EN',
  endpoint: 'https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction',
};
```

### Firebase (`firebaseConfig.ts` + native files)

Firebase is initialised via the `@react-native-firebase` SDK. No manual `initializeApp()` call is needed in JavaScript — the SDK reads the native config files (`google-services.json` / `GoogleService-Info.plist`) automatically.

The following Firebase services are used:

| Package | Service |
|---------|---------|
| `@react-native-firebase/app` | Core initialization |
| `@react-native-firebase/firestore` | Real-time database |
| `@react-native-firebase/messaging` | Cloud Messaging (push notifications) |

---

## 12. Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Start Metro | `npm start` | Start the Metro JavaScript bundler |
| Run Android | `npm run android` | Build and launch on Android emulator/device |
| Run iOS | `npm run ios` | Build and launch on iOS Simulator/device |
| Lint | `npm run lint` | Run ESLint across the project |
| Test | `npm test` | Run Jest unit tests |

---

## 13. Running Tests & Linting

### Unit Tests

```bash
npm test
```

Tests live in the `__tests__/` directory and use **Jest** with `react-test-renderer`.

### Linting

```bash
npm run lint
```

The project uses **ESLint** with the `@react-native` config plus **Prettier** for formatting. Configuration files:

- `.eslintrc.js` — ESLint rules
- `.prettierrc.js` — Prettier formatting rules

---

## 14. Troubleshooting

### Environment check

Run the React Native doctor to identify missing or misconfigured tools:

```bash
npx react-native doctor
# or on Windows:
runDoctor.bat
```

### Common issues

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| Metro fails to start | Port 8081 already in use | Run `npx react-native start --port 8082` |
| Android build fails with "SDK not found" | `ANDROID_HOME` not set | Set the environment variable and restart your terminal |
| iOS build fails with "No Pods" | CocoaPods not installed | Run `cd ios && pod install` |
| App shows blank screen | Metro not running | Make sure `npm start` is running before `npm run android/ios` |
| 401 errors on every API call | Expired / missing token | Log out and log back in |
| Push notifications not received | Missing Firebase config | Ensure `google-services.json` / `GoogleService-Info.plist` are placed correctly |
| Images not loading | Wrong IMAGE_BASE_URL | Verify `src/config/apiConfig.ts` points to the correct server |

### Further resources

- [React Native Troubleshooting](https://reactnative.dev/docs/troubleshooting)
- [React Native Environment Setup](https://reactnative.dev/docs/environment-setup)
- [Firebase React Native Getting Started](https://rnfirebase.io/)
