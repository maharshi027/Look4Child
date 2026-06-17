# Dream Girl Foundation

An NGO platform dedicated to protecting children and providing educational knowledge to help underprivileged girls. This application includes donation management, payment integration, and certificate generation.

## 📋 Table of Contents

- [Overview](#overview)
- [What's New - JWT Authentication](#whats-new---jwt-authentication)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Running the Project](#running-the-project)
- [API Endpoints](#api-endpoints)
- [JWT Authentication Guide](#-jwt-authentication-guide)
- [Features](#features)
- [Security Best Practices](#-security-best-practices)
- [Troubleshooting](#-troubleshooting)
- [Additional Resources](#-additional-resources)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

The **Look4Child Foundation** platform acts as a secure bridge between our supporters and the communities we serve. Our organization works tirelessly to address barriers in:
- 👧 **Girls' Education**: Nurturing confidence, literacy, and future careers for young women.
- 📚 **Student Empowerment**: Distributing school kits, coaching resources, and digital literacy.
- 🧸 **Children's Protection**: Offering safe spaces, healthcare camps, and nutritious mid-day meals.
- 🤝 **Help for Needy Families**: Direct outreach programs for food security, emergency aid, and resource distribution.

---

## 🌟 What We Offer

Our platform offers a complete suite of services designed to make donating and managing contributions effortless and transparent:

1. **Secure Online Contributions**: Integrated payment processing for instant and safe transactions.
2. **Transparent Donation Metrics**: Live tracker for public/admin visibility into donor records.
3. **80G Tax Exemption**: Registered under Section 80G of the Income Tax Act, offering instant benefits.
4. **Automated Receipts & Certificates**: Downloadable PDF transaction receipts and official certificates generated on successful donation.
5. **Internal CMS Console**: A secure administrative panel for records tracking, cash entry validation, and database updates.

---

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens) with automated access/refresh cycle
- **PDF Generation**: PDFKit (Vector layout engine)
- **File Management**: Multer

### Frontend
- **Build Tool**: Vite
- **Framework**: React.js
- **Styling**: Modern Vanilla CSS Design System (supporting responsive layout and animations)
- **HTTP Client**: Axios with interceptors

---

## 📁 Project Structure

```
Look4Child/
├── backend/
│   ├── src/
│   │   ├── app.js                    # Core express configurations and routes
│   │   ├── config/
│   │   │   └── db.js                 # Database connector
│   │   ├── models/
│   │   │   └── donation.models.js    # Mongoose data schema
│   │   ├── controllers/
│   │   │   ├── admin.controller.js   # Admin Auth & token controllers
│   │   │   ├── donation.controller.js# Donor operations controllers
│   │   │   ├── receipt.controller.js # Single-page A4 PDF Receipt generator
│   │   │   └── certificate.controller.js # Landscape PDF Certificate generator
│   │   ├── middleware/
│   │   │   └── authMiddleware.js     # Admin verification handlers
│   │   └── utils/
│   │       ├── jwtUtils.js           # JWT token generation
│   │       └── errorHandler.js       # Centralized exception logging
│   └── server.js                     # Backend application entry point
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   │   └── logo.png              # Official brand logo
│   │   ├── utils/
│   │   │   └── axiosConfig.js        # Axios interceptors for JWT
│   │   ├── components/
│   │   │   ├── OnlineDonation.jsx    # Donation form block
│   │   │   └── footer/               # Site footer directory
│   │   ├── admin/
│   │   │   ├── AdminLogin.jsx        # Admin secure login
│   │   │   ├── AdminDashboard.jsx    # Admin dashboard panel
│   │   │   └── AdminCashEntry.jsx    # Offline transaction record form
│   │   ├── donar/
│   │   │   └── DonarList.jsx         # Donor records list
│   │   ├── assets/                   # Static assets
│   │   ├── App.jsx                   # JWT initialization
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js                # Proxy to backend
│   ├── JWT_INTEGRATION_GUIDE.md      # Frontend JWT setup
│   └── .gitignore
├── .gitignore                        # Root-level git ignore
├── SETUP_COMPLETE.md                 # Complete setup guide
└── README.md                         # This file
```

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd "Dream Girl Foundation"
```

### 2. Dependency Installation
Run in both directories:
```bash
# For backend
cd backend
npm install

# For frontend
cd ../frontend
npm install
```

## ⚙️ Environment Setup

### Backend Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

```env
# MongoDB Connection
MONGODB_URI=mongodb://127.0.0.1:27017/dreamgirl
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dreamgirl

# Server Configuration
PORT=5000
NODE_ENV=development

# Admin Authentication
ADMIN_PASSWORD=&Harsh@2511

# JWT Authentication (⚠️ CHANGE IN PRODUCTION!)
JWT_ACCESS_TOKEN_SECRET=your_super_secret_access_token_key_change_this_in_production
JWT_REFRESH_TOKEN_SECRET=your_super_secret_refresh_token_key_change_this_in_production
JWT_ACCESS_TOKEN_EXPIRY=15m
JWT_REFRESH_TOKEN_EXPIRY=7d

# Razorpay Payment Gateway
RAZORPAY_KEY_ID=your_razorpay_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here
```

**⚠️ Important Security Notes:**

- Never commit `.env` file to Git
- Keep credentials private and secure
- Use strong passwords for production
- **CHANGE JWT secrets to strong random values in production**
- Rotate API keys regularly
- Use MongoDB Atlas for production databases
- Use HTTPS only in production
- Store tokens in httpOnly cookies in production (not localStorage)

### Get Razorpay Credentials

1. Sign up at [Razorpay](https://razorpay.com/)
2. Navigate to Settings → API Keys
3. Copy your Key ID and Key Secret
4. Add them to your `.env` file

## 🏃 Running the Project

### Backend Server

```bash
# Start backend API (typically runs on port 5000)
cd backend
npm run dev

<<<<<<< HEAD
# Start frontend application (runs on http://localhost:5173)
cd ../frontend
=======
# Production mode
npm start

# Server will run on http://localhost:XXXX
```

### Frontend Application

```bash
cd frontend

# Development mode
>>>>>>> 4c5ffdaf6d76bbf731f92d6492f1cf28a8cc22e5
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Frontend will typically run on http://localhost:5173
```

## 📡 API Endpoints

### Authentication Routes

```
POST /api/auth/verify-password
Body: { password: "string" }
Response: { success: boolean, message: string }
```

### Donation Routes (Require JWT Token)

```
POST /api/donations/initiate-online
Headers: { Authorization: "Bearer <accessToken>" }
Body: { name, email, phone, amount }
Response: { success, order, donationId, isMock }

POST /api/donations/verify-online
Headers: { Authorization: "Bearer <accessToken>" }
Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
Response: { success, message, donationId }

POST /api/donations/record-cash
Headers: { Authorization: "Bearer <accessToken>" }
Body: { name, email, phone, amount }
Response: { success, message, donationId }

GET /api/donations/all-records
Headers: { Authorization: "Bearer <accessToken>" }
Response: [{ id, donorName, amount, paymentMode, paymentStatus, ... }]

PUT /api/donations/update/:id
Headers: { Authorization: "Bearer <accessToken>" }
Body: { donorName, donorEmail, donorPhone, amount, paymentMode, paymentStatus }
Response: { success, message, donation }

DELETE /api/donations/delete/:id
Headers: { Authorization: "Bearer <accessToken>" }
Response: { success, message }
```

### Certificate Routes (Require JWT Token)

```
GET /api/certificate/download-certificate/:id
Headers: { Authorization: "Bearer <accessToken>" }
Response: PDF file (binary)
Note: Only works for donations with paymentStatus = "SUCCESS"
```

## 🔐 JWT Authentication Guide

### How JWT Authentication Works

1. **Login**: Send admin password to `/api/auth/login`
   - Backend verifies password
   - Backend returns `accessToken` (15m) and `refreshToken` (7d)
   - Frontend stores both tokens in localStorage

2. **Authenticated Requests**: Include token in Authorization header
   - Format: `Authorization: Bearer <accessToken>`
   - Axios automatically injects token via interceptor
   - Backend validates token before processing request

3. **Token Expiry**: Access token expires after 15 minutes
   - Frontend detects 401 Unauthorized response
   - Axios interceptor automatically calls `/api/auth/refresh-token`
   - Backend returns new access token
   - Axios retries original request with new token
   - **No manual intervention needed!**

4. **Logout**: Clear stored tokens
   - Remove tokens from localStorage
   - Clear Authorization header
   - User redirected to login

### Token Details

**Access Token**:

- Valid for 15 minutes
- Used for all API requests
- Short-lived for security
- Automatically refreshed when expired

**Refresh Token**:

- Valid for 7 days
- Used to get new access tokens
- Stored safely and not sent with every request
- User must re-login after 7 days

### Using JWT in Requests

**Frontend (Automatic)**:

```javascript
// No manual token handling needed!
// Axios interceptor automatically adds token
const response = await axios.get("/api/donations/all-records");
```

**Postman (Manual)**:

1. Get access token from `/api/auth/login`
2. Go to Headers tab
3. Add: `Authorization: Bearer <accessToken>`
4. Make request

**cURL (Manual)**:

```bash
curl -X GET http://localhost:5000/api/donations/all-records \
  -H "Authorization: Bearer <accessToken>"
```

## ✨ Features

<<<<<<< HEAD
- **Double-Token Auth**: Clean JWT validation using access tokens (15-minute life) and refresh tokens (7-day life) with automated refresh requests.
- **PDF Compilation**: Direct compilation of vectors and images using PDFKit to generate standard portrait receipts (single A4 page) and landscape certificates.
- **Custom Design Tokens**: Curated layout styling using dynamic HSL color variables, smooth micro-interactions, and glassmorphism cards.
=======
- ✅ **JWT Authentication**: Secure token-based authentication with automatic refresh
- ✅ **Access Control**: Separate access tokens (15m) and refresh tokens (7d)
- ✅ **Donation Management**: Record and manage donations (online & cash)
- ✅ **Payment Integration**: Secure Razorpay payment processing
- ✅ **Certificate Generation**: Auto-generate PDF certificates for donors
- ✅ **Admin Dashboard**: Secure admin panel with JWT protection
- ✅ **Donor Tracking**: Complete donation history and records
- ✅ **Responsive Design**: Works on desktop and mobile devices
- ✅ **Error Handling**: Comprehensive error messages and logging with centralized error handler
- ✅ **Security**: JWT-based authentication, input validation, environment-based configuration

## 🔐 Security Best Practices

1. **JWT Security**:
   - Generate strong random JWT secrets: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
   - Change `JWT_ACCESS_TOKEN_SECRET` and `JWT_REFRESH_TOKEN_SECRET` in production
   - Use HTTPS to prevent token interception
   - Store tokens in httpOnly cookies in production (not localStorage)
   - Implement token rotation strategy

2. **Environment Variables**: Store all sensitive data in `.env`

3. **API Keys**: Never commit API keys to version control

4. **Database**: Use MongoDB Atlas with IP whitelisting in production

5. **CORS**: Configure CORS properly for your domain

6. **Validation**: Always validate user inputs on both frontend and backend

7. **HTTPS**: Use HTTPS in production (required for httpOnly cookies)

8. **.gitignore**: Ensure sensitive files are in `.gitignore`

9. **Rate Limiting**: Implement rate limiting on authentication endpoints

10. **Monitoring**: Monitor failed login attempts and suspicious activity

## 📝 Available Scripts

### Backend

```bash
npm start    # Production mode
npm run dev  # Development mode with nodemon
```

### Frontend

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🐛 Troubleshooting

### JWT Authentication Issues

**Cannot login / "Invalid credentials" error**:

- Verify admin password in `.env`
- Check backend server is running on port XXXX
- Verify request is going to `/api/auth/login` endpoint

**401 Unauthorized on API calls**:

- Check if access token exists: Open browser DevTools → Application → localStorage
- Verify token is in valid JWT format
- If expired , refresh token should auto-refresh
- Check JWT secrets are configured in `.env`

**Token refresh not working**:

- Verify `refreshToken` exists in localStorage
- Check `JWT_REFRESH_TOKEN_SECRET` is configured in `.env`
- If refresh token older than 7 days, must re-login
- Check backend is returning valid refresh token response

**ECONNREFUSED error**:

- Ensure backend is running: `npm run dev` in backend folder
- Verify backend is on port XXXX (check `.env` PORT setting)
- Check Vite proxy config in `frontend/vite.config.js`

### MongoDB Connection Issues

- Ensure MongoDB is running locally or MongoDB Atlas is accessible
- Check `MONGODB_URI` in `.env`
- Verify network access for MongoDB Atlas

### Port Already in Use

- Backend default: XXXX - Change `PORT` in `.env`
- Frontend default: XXXX - Vite will use next available port

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Razorpay Documentation](https://razorpay.com/docs/)
- [Vite Documentation](https://vitejs.dev/)
- [JWT (JSON Web Tokens) Guide](https://jwt.io/)
- [JWT.io Debugger](https://jwt.io/#debugger) - Inspect your tokens
- [Node.js Crypto Module](https://nodejs.org/api/crypto.html) - For generating secrets
- [Backend JWT Documentation](./backend/JWT_AUTHENTICATION.md)
- [Frontend JWT Integration Guide](./frontend/JWT_INTEGRATION_GUIDE.md)
- [Complete Setup Guide](./SETUP_COMPLETE.md)

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

- **Harshit** - Initial development

## 📞 Support

For questions or support, please contact the development team or create an issue in the repository.
>>>>>>> 4c5ffdaf6d76bbf731f92d6492f1cf28a8cc22e5

---

## 📞 Support & NGO Contacts

For organization information or donation inquiries:
- **Office**: Room No.1, Opp. Sarpanch Anant House, Tigra Village, Sec-57, Gurgaon
- **Email**: info@look4child.ngo
- **Phone**: +91 98998 18585
- **Web**: www.look4child.ngo

---

## 📄 License

This project is licensed under the ISC License. All Rights Reserved.
