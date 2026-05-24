# Frontend JWT Integration Guide

## Overview

Frontend has been updated to use JWT authentication with automatic token injection and refresh handling.

## Files Created/Modified

### 1. **src/utils/axiosConfig.js** (NEW)

Centralized axios configuration with JWT interceptors:

- `setupAxiosInterceptors()` - Adds request/response interceptors
- `initializeJWTToken()` - Loads token from localStorage on app start
- `clearJWTToken()` - Clears tokens on logout

**Features:**

- ✅ Automatically injects JWT token in Authorization header
- ✅ Auto-refreshes expired access tokens
- ✅ Handles 401 errors with token refresh
- ✅ Clears tokens and redirects to login on refresh failure

### 2. **src/App.jsx** (UPDATED)

- Added useEffect to initialize JWT interceptors on app mount
- Updated handleLogout to clear JWT tokens
- Imports axiosConfig utilities

### 3. **src/admin/AdminLogin.jsx** (UPDATED)

- Changed endpoint from `/api/admin/verify-password` to `/api/auth/login`
- Stores accessToken and refreshToken in localStorage
- Configures axios Authorization header

## How It Works

### Login Flow

```
1. User enters password
2. Frontend calls POST /api/auth/login
3. Backend returns {accessToken, refreshToken}
4. Frontend stores tokens in localStorage
5. Frontend sets Authorization header
6. User redirected to dashboard
```

### API Request Flow

```
1. Component makes axios request (e.g., GET /api/donations/all-records)
2. Request interceptor adds: Authorization: Bearer <accessToken>
3. Backend receives request with token
4. Backend validates token and processes request
5. Response returned to component
```

### Token Refresh Flow

```
1. Access token expires (after 15 minutes)
2. Backend returns 401 Unauthorized
3. Response interceptor detects 401
4. Interceptor calls POST /api/auth/refresh-token with refreshToken
5. Backend returns new accessToken
6. Interceptor retries original request with new token
7. Original request completes successfully
```

### Logout Flow

```
1. User clicks "Exit Admin Session"
2. handleLogout() called
3. clearJWTToken() removes tokens from localStorage
4. Authorization header cleared
5. User redirected to login
```

## Component API Calls

### All components automatically include JWT token:

- `DonarList.jsx` - GET /api/donations/all-records
- `AdminCashEntry.jsx` - POST /api/donations/record-cash
- `OnlineDonation.jsx` - POST /api/donations/initiate-online

### No manual token handling needed!

```javascript
// Components can make requests normally
const response = await axios.get("/api/donations/all-records");
// Token is automatically included by interceptor
```

## Token Storage

### localStorage Keys

```javascript
localStorage.accessToken; // JWT access token (15m expiry)
localStorage.refreshToken; // JWT refresh token (7d expiry)
localStorage.tokenExpiry; // Expiry time string (e.g., "15m")
```

### Check if User is Logged In

```javascript
const isLoggedIn = !!localStorage.getItem("accessToken");
```

## Error Handling

### Automatic Handling

- ✅ 401 errors trigger automatic token refresh
- ✅ Invalid tokens redirect to login
- ✅ Network errors bubble up to components

### Component Error Handling

```javascript
try {
  const response = await axios.get("/api/donations/all-records");
  // Handle success
} catch (error) {
  if (error.response?.status === 401) {
    // Token refresh failed, user needs to re-login
  } else if (error.response?.status === 400) {
    // Validation error
  } else {
    // Network or server error
  }
}
```

## Testing JWT Authentication

### 1. Login

Open browser console and run:

```javascript
// Make login request
const loginRes = await fetch("/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ password: "&Harsh@2511" }),
});
const data = await loginRes.json();
console.log("Tokens:", data.accessToken, data.refreshToken);
```

### 2. Check Stored Tokens

```javascript
console.log("Access Token:", localStorage.getItem("accessToken"));
console.log("Refresh Token:", localStorage.getItem("refreshToken"));
```

### 3. Make Authenticated Request

```javascript
// This should work without manually adding Authorization header
const donationsRes = await fetch("/api/donations/all-records", {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  },
});
const donations = await donationsRes.json();
console.log("Donations:", donations);
```

## Troubleshooting

### CORS Errors

- ✅ Vite proxy configured for /api routes
- ✅ Backend CORS enabled for localhost:5173
- Solution: Ensure backend is running on port 5000

### Token Not Included in Requests

- Check: `localStorage.getItem('accessToken')` should exist
- Solution: Re-login to get new tokens

### 401 Unauthorized After Login

- Possible causes:
  - Token expired (auto-refresh should handle)
  - Invalid token format
  - Backend JWT secret changed
- Solution: Clear localStorage and re-login

### Refresh Token Failed

- Check: `localStorage.getItem('refreshToken')` should exist
- Check: Refresh token hasn't expired (7 days)
- Solution: Re-login with password

## Production Checklist

- [ ] Change JWT secrets in backend .env
- [ ] Enable HTTPS only in production
- [ ] Use httpOnly cookies instead of localStorage
- [ ] Add CSRF protection if needed
- [ ] Implement token rotation
- [ ] Add request rate limiting
- [ ] Monitor token usage
- [ ] Set up proper error logging

## File Structure

```
frontend/src/
├── App.jsx (UPDATED - JWT setup)
├── main.jsx
├── index.css
├── admin/
│   ├── AdminLogin.jsx (UPDATED - new endpoint)
│   ├── AdminDashboard.jsx
│   └── AdminCashEntry.jsx
├── components/
│   └── OnlineDonation.jsx
├── donar/
│   └── DonarList.jsx
└── utils/
    └── axiosConfig.js (NEW - JWT interceptors)
```

## Summary

Frontend now has complete JWT authentication integration with:

- ✅ Automatic token injection in all requests
- ✅ Automatic token refresh on expiry
- ✅ Centralized logout with token cleanup
- ✅ No manual token handling in components
- ✅ Proper error handling and redirects
