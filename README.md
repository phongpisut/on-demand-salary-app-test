# Example : On-Demand Salary App

A React Native mobile application for technical assessment built with Expo.

## Features

- **Phone Authentication** - Sign in with phone number + OTP
- **PIN Security** - Set and verify 6-digit PIN for quick access
- **Dashboard** - View available balance and transaction history
- **Withdraw** - Request withdrawals up to 50% of available balance
- **Persistent Sessions** - JWT token storage with MMKV

## Tech Stack

### Framework & Language

| Category   | Library                   | Version |
| ---------- | ------------------------- | ------- |
| Framework  | [Expo](https://expo.dev/) | ^55.0.0 |
| Language   | TypeScript                | ~5.9.2  |
| UI Runtime | React                     | 19.2.0  |
| Runtime    | React Native              | 0.83.2  |

### Navigation & Routing

| Category   | Library                                                   | Version |
| ---------- | --------------------------------------------------------- | ------- |
| Router     | [expo-router](https://docs.expo.dev/router/introduction/) | ~55.0.5 |
| Navigation | [@react-navigation/native](https://reactnavigation.org/)  | ^7.0.0  |

### State Management & Data Fetching

| Category      | Library                                                            | Version |
| ------------- | ------------------------------------------------------------------ | ------- |
| State         | [jotai](https://jotai.org/)                                        | ^2.19.0 |
| Data Fetching | [SWR](https://swr.vercel.app/)                                     | ^2.4.1  |
| Storage       | [react-native-mmkv](https://github.com/mrousavy/react-native-mmkv) | ^4.3.0  |

### UI Components & Styling

| Category   | Library                                                                        | Version  |
| ---------- | ------------------------------------------------------------------------------ | -------- |
| Components | [@rn-primitives](https://www.rnprimitives.org/)                                | ^1.2.0   |
| Icons      | [lucide-react-native](https://lucide.dev/)                                     | ^0.545.0 |
| Styling    | [Uniwwind](https://github.com/nicholasjng/uniwind)                             | ^1.5.0   |
| Tailwind   | [tailwindcss](https://tailwindcss.com/)                                        | ^4.2.1   |
| Animation  | [react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/) | 4.2.1    |
| Animation  | [moti](https://moti.fyi/)                                                      | ^0.30.0  |

### Input & Forms

| Category   | Library                                                                         | Version |
| ---------- | ------------------------------------------------------------------------------- | ------- |
| Mask Input | [react-native-mask-input](https://github.com/benhurott/react-native-mask-input) | ^1.2.3  |

### Utilities

| Category       | Library                                                     | Version |
| -------------- | ----------------------------------------------------------- | ------- |
| Class Merge    | [tailwind-merge](https://github.com/dcastil/tailwind-merge) | ^3.5.0  |
| Class Variance | [class-variance-authority](https://github.com/joe-bell/cva) | ^0.7.1  |

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm/yarn
- iOS Simulator (macOS) or Android Emulator

### Installation

```bash
# Install dependencies
yarn

# Pre-build native modules
npx expo prebuild

# Install IOS dependencies
cd ios && pod install

```

### Environment Configuration

Create a `.env` file in the project root:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api/v1
```

### Running the App

```bash
# iOS (macOS only)
pnpm ios

# Android
pnpm android

# Web
pnpm web
```

## Mock API

This project uses a mock backend server for development. The server provides the following endpoints:

**Repository:** [Salary-Hero/server-mobile-frontend-test](https://github.com/Salary-Hero/server-mobile-frontend-test)

### API Endpoints

| Method | Endpoint                    | Description               |
| ------ | --------------------------- | ------------------------- |
| POST   | `/api/v1/signin`            | Sign in with phone number |
| GET    | `/api/v1/user/profile`      | Get user profile          |
| GET    | `/api/v1/user/transactions` | Get transaction history   |
| POST   | `/api/v1/user/withdraw`     | Submit withdrawal request |

### Starting the Mock Server

```bash
# Clone and set up the mock server
git clone https://github.com/Salary-Hero/server-mobile-frontend-test.git
cd server-mobile-frontend-test
npm install
npm start
```

The mock server runs on `http://localhost:3000`.

### Test Credentials

- **OTP:** `123456`

## Project Structure

```
├── app/                    # Expo Router pages
│   ├── (auth)/            # Auth screens (sign-in, OTP, PIN)
│   ├── (tabs)/            # Tab screens (home, withdraw, settings)
│   └── _layout.tsx        # Root layout with auth navigation
├── components/
│   └── ui/                # Reusable UI components
├── lib/
│   ├── api.ts             # API client with useSWR hooks
│   ├── auth.tsx           # Authentication context
│   ├── storage.ts         # MMKV storage utilities
│   ├── theme.ts           # Theme configuration
│   └── utils.ts           # Utility functions
└── global.css             # Global styles
```

## Authentication Flow

1. **First-time User:** Sign in → OTP verification → Set PIN → Main screen
2. **Returning User:** Sign in → → OTP verification -> Verify PIN → Main screen
3. **Session Persisted:** Valid JWT token stored in MMKV bypasses auth

## Agent Information

Time Usage : < 1D
Token Used: 5.38M tokens
Human Intervention (Coding): 30%

This project was developed with AI assistance using:

- **Model:** MiniMax M2.5 (via Crush AI)
- **Token Usage:** Full implementation including:
  - Authentication system with Jotai state management
  - MMKV storage for persistent sessions
  - PIN setup and verification screens
  - useSWR hooks for API data fetching
  - Expo Router file-based navigation
  - UI components using React Native Reusables pattern

- **MCP Tools Used:**
  - `Context7` - For up-to-date library documentation
  - `fetch` / `agentic_fetch` - For retrieving mock API info from GitHub
  - Standard file operations (read, write, edit, glob, grep)
