# Dream Girl Foundation - JWT Authentication API Documentation

## Overview

The backend now implements JWT (JSON Web Token) authentication with secure token generation, refresh tokens, and expiration management.

## Authentication Endpoints

### 1. Admin Login

Generate JWT tokens by providing the admin password.

**Endpoint:** `POST /api/auth/login`

**Request Body:**

```json
{
  "password": "&Harsh@2511"
}
```

**Response (200 OK):**

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

**Error Response (401 Unauthorized):**

```json
{
  "success": false,
  "message": "Unauthorized: Invalid credentials",
  "error": "Unauthorized: Invalid credentials"
}
```

**Notes:**

- Admin password from `.env` file (ADMIN_PASSWORD)
- Access token expires in 15 minutes
- Refresh token expires in 7 days

---

### 2. Refresh Access Token

Generate a new access token using the refresh token (when access token expires).

**Endpoint:** `POST /api/auth/refresh-token`

**Request Body:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Access token refreshed successfully",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "15m",
  "tokenType": "Bearer"
}
```

**Error Response (401 Unauthorized):**

```json
{
  "success": false,
  "message": "Refresh token has expired",
  "error": "Refresh token has expired"
}
```

**Notes:**

- Use this endpoint when access token expires
- Refresh token is valid for 7 days
- New access token valid for 15 minutes

---

### 3. Verify Password (Legacy/Backward Compatible)

Old endpoint maintained for backward compatibility.

**Endpoint:** `POST /api/auth/verify-password`

**Request Body:**

```json
{
  "password": "&Harsh@2511"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Access granted"
}
```

---

## Using Access Token in Requests

Once logged in, include the access token in all authenticated requests using the Authorization header:

```http
Authorization: Bearer <accessToken>
```

**Example with curl:**

```bash
curl -X GET http://localhost:5000/api/donations/all-records \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Example with Postman:**

1. Go to Headers tab
2. Add header: `Authorization`
3. Value: `Bearer <your_accessToken>`

---

## Token Configuration

Configuration stored in `.env` file:

```env
# JWT Secrets (CHANGE THESE IN PRODUCTION!)
JWT_ACCESS_TOKEN_SECRET=your_super_secret_access_token_key_change_this_in_production
JWT_REFRESH_TOKEN_SECRET=your_super_secret_refresh_token_key_change_this_in_production

# Token Expiration Times
JWT_ACCESS_TOKEN_EXPIRY=15m      # Short-lived access token
JWT_REFRESH_TOKEN_EXPIRY=7d      # Long-lived refresh token
```

### Security Best Practices:

- ⚠️ **PRODUCTION**: Change the JWT secrets to strong random values
- Store tokens securely on frontend (httpOnly cookies recommended)
- Never expose tokens in logs or commit them to version control
- Use HTTPS in production
- Regenerate tokens periodically

---

## Authentication Flow

### Login Flow

```
1. User sends password → POST /api/auth/login
2. Backend verifies password
3. Backend generates JWT tokens
4. Client stores tokens (accessToken + refreshToken)
5. Client includes accessToken in Authorization header for API requests
```

### Token Refresh Flow

```
1. accessToken expires (after 15 minutes)
2. Client detects 401 Unauthorized
3. Client sends refreshToken → POST /api/auth/refresh-token
4. Backend validates refreshToken (valid for 7 days)
5. Backend generates new accessToken
6. Client updates stored accessToken
7. Client retries original request with new token
```

---

## Error Handling

| Status | Error                                     | Meaning                                   |
| ------ | ----------------------------------------- | ----------------------------------------- |
| 400    | `password is required`                    | Missing password in request               |
| 400    | `refreshToken is required`                | Missing refresh token in request          |
| 401    | `Invalid password`                        | Wrong admin password                      |
| 401    | `Access token has expired`                | Access token no longer valid              |
| 401    | `Refresh token has expired`               | Refresh token expired (re-login required) |
| 401    | `Invalid access token`                    | Malformed or tampered token               |
| 401    | `Missing or invalid Authorization header` | No token provided in request              |
| 500    | `JWT_ACCESS_TOKEN_SECRET not configured`  | Environment variable missing              |

---

## JWT Token Payload

Both accessToken and refreshToken contain:

- `role`: "admin"
- `timestamp`: ISO timestamp of token generation
- `iat`: Issued at (Unix timestamp)
- `exp`: Expiration (Unix timestamp)

**Example Decoded Payload:**

```json
{
  "role": "admin",
  "timestamp": "2026-05-24T12:02:56.872Z",
  "iat": 1779624176,
  "exp": 1779625076
}
```

Decode tokens at [jwt.io](https://jwt.io) to inspect their contents (never paste real secrets there).

---

## Implementation Files

### Core Files:

- `src/utils/jwtUtils.js` - JWT token generation and verification
- `src/middleware/authMiddleware.js` - JWT verification middleware
- `src/controllers/admin.controller.js` - Login and refresh endpoints

### Modified Files:

- `src/app.js` - Added `/api/auth/login` and `/api/auth/refresh-token` routes
- `.env` - Added JWT configuration variables
- `package.json` - Added jsonwebtoken dependency

---

## Testing the API

### 1. Login and Get Tokens

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"password":"&Harsh@2511"}'
```

### 2. Use Access Token (Example: Get Donations)

```bash
curl -X GET http://localhost:5000/api/donations/all-records \
  -H "Authorization: Bearer <accessToken>"
```

### 3. Refresh Expired Token

```bash
curl -X POST http://localhost:5000/api/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<refreshToken>"}'
```

---

## Next Steps

### Frontend Integration:

1. Call `/api/auth/login` with password
2. Store `accessToken` and `refreshToken` in localStorage/sessionStorage
3. Add `Authorization: Bearer <token>` header to all API requests
4. Implement token refresh on 401 responses
5. Clear tokens on logout

### Production Deployment:

1. Generate strong random JWT secrets
2. Store secrets securely (environment variables, secrets manager)
3. Enable HTTPS/TLS
4. Implement token rotation strategy
5. Add request rate limiting
6. Monitor token usage and anomalies
