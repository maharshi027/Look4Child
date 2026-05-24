# Quick JWT Authentication Guide

## 🔐 Login to Dashboard

### Step 1: Get JWT Tokens

```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "password": "&Harsh@2511"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "15m",
  "tokenType": "Bearer"
}
```

### Step 2: Store Tokens (Frontend)

```javascript
// Store in localStorage
localStorage.setItem("accessToken", response.accessToken);
localStorage.setItem("refreshToken", response.refreshToken);
```

### Step 3: Use Access Token in Requests

```bash
GET http://localhost:5000/api/donations/all-records
Authorization: Bearer <accessToken>
```

---

## 🔄 Token Refresh (When Access Token Expires)

```bash
POST http://localhost:5000/api/auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**

```json
{
  "success": true,
  "message": "Access token refreshed successfully",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "15m",
  "tokenType": "Bearer"
}
```

---

## ⏱️ Token Lifetimes

| Token         | Lifetime       | Use                  | Refresh?               |
| ------------- | -------------- | -------------------- | ---------------------- |
| Access Token  | **15 minutes** | API requests         | Yes (auto-refresh)     |
| Refresh Token | **7 days**     | Get new access token | No (re-login after 7d) |

---

## 🚀 Frontend Implementation Example

### React/JavaScript:

```javascript
// Step 1: Login
async function login(password) {
  const response = await fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  const data = await response.json();

  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("refreshToken", data.refreshToken);
  return data;
}

// Step 2: Make API request with token
async function makeRequest(endpoint) {
  let token = localStorage.getItem("accessToken");

  let response = await fetch(`http://localhost:5000${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  // If 401, refresh token and retry
  if (response.status === 401) {
    const refreshed = await refreshToken();
    token = refreshed.accessToken;
    response = await fetch(`http://localhost:5000${endpoint}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  return await response.json();
}

// Step 3: Refresh token
async function refreshToken() {
  const refreshToken = localStorage.getItem("refreshToken");
  const response = await fetch("http://localhost:5000/api/auth/refresh-token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });
  const data = await response.json();

  localStorage.setItem("accessToken", data.accessToken);
  return data;
}

// Usage
login("&Harsh@2511").then(() => {
  makeRequest("/api/donations/all-records").then((data) => console.log(data));
});
```

---

## ❌ Common Errors & Solutions

| Error                                           | Cause                     | Solution                            |
| ----------------------------------------------- | ------------------------- | ----------------------------------- |
| 400 - `password is required`                    | No password sent          | Include password in request body    |
| 401 - `Invalid password`                        | Wrong password            | Use correct admin password          |
| 401 - `Access token has expired`                | Token expired (after 15m) | Use refresh token to get new one    |
| 401 - `Refresh token has expired`               | Not used for 7 days       | Re-login with password              |
| 401 - `Invalid access token`                    | Malformed/tampered token  | Clear cookies and re-login          |
| 401 - `Missing or invalid Authorization header` | No Authorization header   | Add `Authorization: Bearer <token>` |

---

## 🔒 Security Checklist

- ✅ Access token valid for only 15 minutes
- ✅ Refresh token valid for 7 days max
- ✅ Tokens include role and timestamp
- ✅ Password never returned to frontend
- ✅ Server verifies every token before processing
- ✅ Failed attempts return generic error message
- ⚠️ TODO: Change JWT secrets in production
- ⚠️ TODO: Use HTTPS only in production
- ⚠️ TODO: Store tokens in httpOnly cookies (not localStorage)

---

## 📝 Environment Variables

```env
# Admin login credentials
ADMIN_PASSWORD=&Harsh@2511

# JWT Configuration (CHANGE THESE IN PRODUCTION!)
JWT_ACCESS_TOKEN_SECRET=your_super_secret_access_token_key_change_this_in_production
JWT_REFRESH_TOKEN_SECRET=your_super_secret_refresh_token_key_change_this_in_production
JWT_ACCESS_TOKEN_EXPIRY=15m
JWT_REFRESH_TOKEN_EXPIRY=7d
```

⚠️ **IMPORTANT**: Generate strong random secrets for production!

Example with Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
