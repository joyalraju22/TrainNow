# 🏗️ TrainNow Architecture & System Design

## Application Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        App.js                               │
│     (ErrorBoundary → ToastProvider → Router)                │
└─────────────────────────────────────────────────────────────┘
                            ↓
        ┌───────────────────┼───────────────────┐
        ↓                   ↓                   ↓
   ┌─────────────┐   ┌─────────────┐  ┌─────────────┐
   │ErrorBoundary│   │ToastProvider│  │   Router    │
   └─────────────┘   └─────────────┘  └─────────────┘
        ↓                   ↓                   ↓
   ┌─────────────┐   ┌─────────────┐  ┌─────────────┐
   │ Catches     │   │  Manages    │  │  Routes to  │
   │ Errors      │   │ Toasts      │  │  Pages      │
   └─────────────┘   └─────────────┘  └─────────────┘
```

---

## User Flow: Registration & Login

```
START
  ↓
[REGISTRATION PAGE]
  ↓
┌─────────────────────────────────────┐
│ User enters: Email, Username,       │
│ Password, Confirm Password          │
└─────────────────────────────────────┘
  ↓
[FORM VALIDATION - validators.js]
  ├─→ Email validation (RFC)
  ├─→ Username validation (3-20 chars)
  ├─→ Password strength check (5 levels)
  ├─→ Password match check
  └─→ Required field checks
  ↓
[VALIDATION RESULT]
  ├─ INVALID → Show field errors + Toast ✗
  │
  └─ VALID ↓
    ┌──────────────────────────────┐
    │ Check for duplicate accounts │
    │ Save to localStorage         │
    │ Show success toast           │
    │ Redirect to LOGIN            │
    └──────────────────────────────┘
      ↓
[LOGIN PAGE]
  ↓
┌────────────────────────────┐
│ User enters: Username,     │
│ Password (or Admin toggle) │
└────────────────────────────┘
  ↓
[VALIDATE & AUTHENTICATE]
  ├─→ Check required fields
  ├─→ Verify credentials
  └─→ Check if admin or user
  ↓
[RESULT]
  ├─ INVALID → Show error message + Toast ✗
  │
  └─ VALID → Save auth state ✓
    ├─→ Store isLoggedIn=true
    ├─→ Show success toast
    └─→ Redirect to HOME or ADMIN
      ↓
    [AUTHENTICATED]
```

---

## Data Flow: Train Services

```
┌──────────────────────────────────────────────────────────────┐
│                    TRAIN SERVICES LAYER                      │
│                  (services/trainService.js)                  │
└──────────────────────────────────────────────────────────────┘

6 Core Functions:
  1. searchTrain(query)
        ↓ Searches by train number or name
        ↓ Returns: Train object with status
        
  2. getAllTrains()
        ↓ Gets all available trains
        ↓ Returns: Array of trains
        
  3. getTrainRoute(trainNumber)
        ↓ Gets detailed route information
        ↓ Returns: Route with all stations
        
  4. getTrainLiveStatus(trainNumber)
        ↓ Gets real-time train status
        ↓ Returns: Status with last update time
        
  5. getTrainsAtStation(stationName)
        ↓ Finds trains at specific station
        ↓ Returns: Array of trains at station
        
  6. planJourney(fromStation, toStation)
        ↓ Finds connecting trains
        ↓ Returns: Array of journey options

Each function:
  ├─ Returns a Promise (async)
  ├─ Simulates API call delay
  ├─ Handles errors gracefully
  └─ Can be easily replaced with real API
```

---

## Error Handling Flow

```
┌─────────────────────────────────────┐
│      Application Runs               │
└─────────────────────────────────────┘
                ↓
        ┌───────┴───────┐
        ↓               ↓
   [COMPONENT    [ROUTE
    ERROR]       ERROR]
        ↓               ↓
   [ERROR      [ROUTER
    BOUNDARY]   CATCH-ALL]
        ↓               ↓
   ┌────────────────────────┐
   │ ErrorBoundary.js       │    NotFound.js
   │                        │        ↓
   │ Shows:                 │    Shows:
   │ • Error message    ←───┤    • 404 page
   │ • Recovery button  ←───┤    • Quick nav
   │ • Error details    ←───┤    • Home button
   └────────────────────────┘
        ↓
   [USER CLICKS RECOVERY]
        ↓
   [NAVIGATE TO HOME]
        ↓
   [APP CONTINUES]
```

---

## Toast Notification System

```
┌──────────────────────────────────────┐
│      useToast() Hook                 │
│   (From ToastContext.js)             │
└──────────────────────────────────────┘
        ↓
   Returns 4 Functions:
   ├─ showSuccess(msg, duration)    ✅
   ├─ showError(msg, duration)      ❌
   ├─ showInfo(msg, duration)       ℹ️
   └─ showWarning(msg, duration)    ⚠️
        ↓
   ┌─────────────────────────────┐
   │  Toast Context              │
   │  (Manages toast queue)      │
   │                             │
   │  State: [                   │
   │    { id, message, type },   │
   │    { id, message, type },   │
   │  ]                          │
   └─────────────────────────────┘
        ↓
   ┌──────────────────────┐
   │  Toast Component     │
   │  (Renders all       │
   │   active toasts)    │
   └──────────────────────┘
        ↓
   Each Toast:
   ├─ Auto-dismiss in X seconds
   ├─ Can be manually closed
   ├─ Has 4 styles (success/error/info/warning)
   └─ Has smooth animation
```

---

## Form Validation Architecture

```
┌─────────────────────────────────────────────┐
│         validators.js (Utilities)           │
└─────────────────────────────────────────────┘

1. VALIDATOR FUNCTIONS
   validators.email(value)          → true/false
   validators.password(value)       → true/false
   validators.username(value)       → true/false
   validators.phoneNumber(value)    → true/false
   validators.required(value)       → true/false
   validators.minLength(v, min)     → true/false
   validators.maxLength(v, max)     → true/false
   validators.match(v1, v2)         → true/false
   validators.passwordStrength(pwd) → { score, label, color }

2. VALIDATION RULES (Predefined)
   rules.email        [{ validate, message }, ...]
   rules.password     [{ validate, message }, ...]
   rules.username     [{ validate, message }, ...]
   rules.fullName     [{ validate, message }, ...]
   rules.phoneNumber  [{ validate, message }, ...]

3. VALIDATE FORM (Main function)
   validateForm(formData, rules) → { isValid, errors }

4. COMPONENT USAGE
   ┌─────────────────────────────┐
   │  Input Field                │
   │  ├─ onChange → setState     │
   │  └─ onBlur → Validate       │
   └─────────────────────────────┘
        ↓
   ┌─────────────────────────────┐
   │  Display Errors             │
   │  ├─ Field-level errors      │
   │  ├─ Red border on input     │
   │  └─ Error message below     │
   └─────────────────────────────┘
```

---

## Component Integration Points

### Login Component
```
Login.js
├─ useState: username, password, errors, loading
├─ useToast: for notifications
├─ Validators: email, password rules
├─ Services: localStorage (auth)
└─ OnSuccess: Toast + navigate
```

### Registration Component
```
Registration.js
├─ useState: email, username, password, confirmPassword, errors, loading
├─ useToast: for notifications
├─ Validators: email, username, password, match
├─ Password Strength: Real-time indicator
├─ Services: localStorage (user storage)
└─ OnSuccess: Toast + navigate to login
```

### Error Boundary
```
ErrorBoundary.js
├─ Try-Catch at component level
├─ getDerivedStateFromError: Catch errors
├─ componentDidCatch: Log errors
├─ Render: Error UI with recovery
└─ Reset: Navigate to home
```

### Toast Component
```
Toast.js
├─ useToast: Get active toasts
├─ Map: Render each toast
├─ Each Toast
│  ├─ Icon (emoji based on type)
│  ├─ Message
│  ├─ Close button
│  └─ Auto-dismiss timer
└─ CSS: Animations & styling
```

---

## Data Persistence

```
┌──────────────────────────────────┐
│      localStorage                │
└──────────────────────────────────┘
        ↓
   Keys Used:
   ├─ user (user registration data)
   │   └─ { email, username, password, createdAt }
   │
   ├─ isLoggedIn (auth state)
   │   └─ true/false
   │
   ├─ isAdmin (admin flag)
   │   └─ true/false
   │
   ├─ selectedTrain (app state)
   │   └─ train number
   │
   ├─ lastViewedRoute (cache)
   │   └─ route data
   │
   └─ lastTrainSearch (search history)
       └─ search query
```

---

## Security Considerations

```
Password Security:
├─ Minimum 8 characters
├─ Must contain uppercase
├─ Must contain lowercase
├─ Must contain number
├─ Stored as hash (crypto.js)
└─ Never stored in plain text

Authentication:
├─ Check against stored hash
├─ isLoggedIn flag (localStorage)
├─ Admin role check
└─ Route protection (future)

Input Validation:
├─ Email format validation
├─ Username restrictions
├─ Required field checks
└─ XSS prevention (React escaping)
```

---

## Performance Optimizations

```
Current:
├─ Component lazy loading (not yet)
├─ Toast auto-dismiss (reduces DOM)
├─ Services simulate async (ready for API)
└─ CSS transitions (GPU accelerated)

Future:
├─ Code splitting by route
├─ Image optimization
├─ Memoization of heavy components
├─ Virtual scrolling for long lists
└─ Service worker for offline support
```

---

## Testing Strategy

```
Unit Tests:
├─ validators.js - All validation rules
├─ trainService.js - All service functions
└─ formatters - Any helper functions

Component Tests:
├─ Login flow (valid/invalid)
├─ Registration flow (validation)
├─ Error boundary (error catching)
└─ Toast notifications (display)

Integration Tests:
├─ Full registration → login flow
├─ Navigation with auth
├─ Error recovery
└─ Data persistence
```

---

## Deployment Checklist

```
Before Production:
☐ Remove console.logs
☐ Update API endpoints
☐ Configure environment variables
☐ Test on all browsers
☐ Test on mobile devices
☐ Set up error tracking (Sentry, etc)
☐ Enable HTTPS
☐ Set up SSL certificate
☐ Configure CORS properly
☐ Review security headers
☐ Test 404 handling
☐ Verify toast notifications work
☐ Check form validation
☐ Performance audit (Lighthouse)
☐ Accessibility audit
```

---

**Document Version:** 1.0  
**Last Updated:** January 2026  
**Status:** Complete & Documented
