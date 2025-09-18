# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview
AgroWatch is a smart agriculture dashboard built with React 18, TypeScript, and Vite. It provides comprehensive farming management tools including crop/soil detection, environmental monitoring, and administrative functions with dual user roles (farmers and admins).

## Development Commands

### Primary Development
```bash
# Install dependencies (preferred: pnpm)
pnpm install
# or
npm install

# Start development server (runs on http://localhost:5173)
pnpm dev
# or 
npm run dev

# Build for production
pnpm build
# or
npm run build

# Preview production build
pnpm preview
# or
npm run preview

# Lint the codebase
pnpm lint
# or
npm run lint
```

### Firebase Functions Development
```bash
# Navigate to functions directory first
cd functions

# Build TypeScript functions
npm run build

# Watch for changes during development
npm run build:watch

# Start Firebase emulator (includes functions on localhost:5001)
npm run serve

# Deploy functions to Firebase
npm run deploy

# View function logs
npm run logs
```

## Architecture Overview

### Application Structure
- **Single Page Application**: React-based SPA with client-side routing
- **Context Providers**: Global state management via React Context for authentication and language
- **Role-based Access**: Dual interfaces for farmers and admins with conditional rendering
- **Mock Authentication**: Demo system with Firebase integration for future scalability

### Core Architecture Patterns
- **Provider Pattern**: AuthProvider and LanguageProvider wrap the entire app for global state
- **Component Composition**: Main App.tsx renders different views based on user role and authentication state
- **Centralized API Layer**: Single api.js file handles all backend communication with consistent error handling
- **Firebase Integration**: Dual authentication system (custom + Firebase) for future cloud functions

### Key Components Architecture
- **App.tsx**: Root component with conditional rendering based on auth state (LandingPage → Login → Dashboard/AdminDashboard)
- **AuthContext**: Manages authentication state, localStorage persistence, and API integration
- **Navigation Flow**: Dynamic view switching without routing, controlled by state management
- **UI Components**: shadcn/ui-style components in `/src/components/ui/` directory for consistent design system

### State Management Strategy
- **Authentication**: Context + localStorage for persistence across sessions
- **Language**: Context for internationalization with translations.ts
- **View Navigation**: Local state in App.tsx with prop-based navigation callbacks
- **API State**: Currently handled via Context, prepared for React Query integration

### Backend Communication
- **API Layer**: Centralized in `/src/lib/api.js` with consistent error handling
- **Authentication API**: OTP verification, user registration, profile management
- **Base URL**: Configurable via environment variables (defaults to localhost:8001)
- **Token Management**: JWT tokens with Firebase custom token integration

## Component Organization

### Feature Components
Core feature components are in `/src/components/`:
- `Dashboard.tsx` - Main farmer dashboard with navigation callbacks
- `AdminDashboard.tsx` - Administrative interface
- `CropDetection.tsx`, `PestDetection.tsx`, `SoilDetection.tsx` - Detection panels
- `EnvironmentalPanel.tsx`, `AlertsPanel.tsx`, `TrendsChart.tsx` - Monitoring components

### Authentication Flow
- `LandingPage.tsx` → `Login.tsx` → Role-based dashboard
- `FarmerRegistration.tsx` for new farmer onboarding
- `AuthenticationFlow.tsx`, `OTPVerification.tsx` for auth process

### UI System
- `/src/components/ui/` - Reusable UI primitives following shadcn/ui patterns
- Radix UI components for accessibility
- Tailwind CSS with CSS custom properties for theming

## Configuration

### Environment Variables
```bash
# Backend API URL
REACT_APP_BACKEND_URL=http://localhost:8001

# Firebase Configuration (use VITE_ prefix for Vite)
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...
```

### Build Configuration
- **Vite Config**: Path aliases configured (`@` → `./src`)
- **TypeScript**: Strict mode enabled with multiple tsconfig files
- **Tailwind**: Custom color system with CSS custom properties
- **ESLint**: Configured for React + TypeScript with quiet mode

## Authentication System

### Demo Credentials
- **Admin**: Phone `9999912345`, OTP `123456`
- **Farmer**: Phone `9000012345`, OTP `123456`
- **Aadhar Login**: Any Aadhar number with OTP `123456`

### Authentication Architecture
- **Dual System**: Custom backend auth + Firebase custom tokens
- **Token Storage**: localStorage for session persistence
- **Automatic Validation**: Token verification on app initialization
- **Role-based Routing**: Conditional rendering based on user.role

## Firebase Integration

### Current Setup
- **Authentication**: Firebase Auth with custom token integration
- **Functions**: TypeScript-based cloud functions in `/functions/`
- **Development**: Functions emulator runs on localhost:5001
- **Configuration**: Firebase config currently hardcoded (move to env vars for production)

### Functions Architecture
- **Express-based**: Cloud functions using Express framework
- **CORS Enabled**: Cross-origin requests supported
- **Admin SDK**: Firebase Admin for server-side operations

## Development Guidelines

### Code Patterns
- **Early Returns**: Preferred for conditional rendering and error handling
- **TypeScript Strictness**: Full type safety with interface definitions
- **Component Props**: Callback-based communication between components
- **Error Boundaries**: React Error Boundary for graceful error handling

### File Organization
```
src/
├── components/           # Feature components
├── components/ui/        # Reusable UI primitives  
├── components/chatbot/   # AI chatbot components
├── components/setup/     # Onboarding/setup flows
├── lib/                  # Utilities and services
├── App.tsx              # Main application component
└── main.tsx             # Application entry point
```

### Styling Approach
- **Tailwind CSS**: Utility-first styling with custom color system
- **CSS Custom Properties**: Theme colors defined in CSS variables
- **Component Variants**: class-variance-authority for component styling
- **Responsive Design**: Mobile-first approach with responsive navigation

## External Dependencies

### Key Libraries
- **UI Framework**: React 18 with TypeScript
- **Build Tool**: Vite with SWC for fast builds
- **UI Components**: Radix UI primitives with custom styling
- **State Management**: React Context (prepared for React Query)
- **Authentication**: Firebase Auth + custom backend
- **Styling**: Tailwind CSS with custom configuration
- **Icons**: Lucide React for consistent iconography
- **Forms**: React Hook Form with Zod validation

### Backend Communication
- **API Client**: Custom fetch-based API layer
- **Authentication**: JWT tokens with automatic refresh
- **Error Handling**: Consistent error responses and logging