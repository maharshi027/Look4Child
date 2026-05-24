# Dream Girl Foundation

An NGO platform dedicated to protecting children and providing educational knowledge to help underprivileged girls. This application includes donation management, payment integration, and certificate generation.

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Running the Project](#running-the-project)
- [API Endpoints](#api-endpoints)
- [Features](#features)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

Dream Girl Foundation is a full-stack web application that enables:

- Secure donation management (online and cash)
- Razorpay payment integration
- Certificate generation for donors
- Admin verification system
- Comprehensive donation tracking and reporting

## 🛠 Tech Stack

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Payment Gateway**: Razorpay
- **PDF Generation**: PDFKit
- **Environment Management**: dotenv

### Frontend

- **Build Tool**: Vite
- **Framework**: React
- **Styling**: CSS
- **HTTP Client**: Axios
- **Linter**: ESLint

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local or cloud instance like MongoDB Atlas)
- **Git**

## 📁 Project Structure

```
Dream Girl Foundation/
├── backend/
│   ├── src/
│   │   ├── app.js                 # Main application with all routes
│   │   ├── config/
│   │   │   └── db.js              # MongoDB connection
│   │   ├── models/
│   │   │   └── donation.models.js # Donation schema
│   │   ├── controllers/           # Business logic (legacy)
│   │   ├── routes/                # Route definitions (legacy)
│   │   └── middleware/            # Custom middleware
│   ├── server.js                  # Server entry point
│   ├── package.json
│   ├── .env                       # Environment variables (not in git)
│   └── .gitignore
├── frontend/
│   ├── src/
│   │   ├── components/            # React components
│   │   ├── admin/                 # Admin pages
│   │   ├── donar/                 # Donor pages
│   │   ├── assets/                # Static assets
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── .gitignore
├── .gitignore                     # Root-level git ignore
└── README.md                      # This file
```

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd "Dream Girl Foundation"
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
npm install
```

### 3. Frontend Setup

Navigate to the frontend directory:

```bash
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
ADMIN_PASSWORD=admin123

# Razorpay Payment Gateway
RAZORPAY_KEY_ID=your_razorpay_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here
```

**⚠️ Important Security Notes:**

- Never commit `.env` file to Git
- Keep credentials private and secure
- Use strong passwords for production
- Rotate API keys regularly
- Use MongoDB Atlas for production databases

### Get Razorpay Credentials

1. Sign up at [Razorpay](https://razorpay.com/)
2. Navigate to Settings → API Keys
3. Copy your Key ID and Key Secret
4. Add them to your `.env` file

## 🏃 Running the Project

### Backend Server

```bash
cd backend

# Development mode (with auto-reload)
npm run dev

# Production mode
npm start

# Server will run on http://localhost:5000
```

### Frontend Application

```bash
cd frontend

# Development mode
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

### Donation Routes

```
POST /api/donations/initiate-online
Body: { name, email, phone, amount }
Response: { success, order, donationId, simulation }

POST /api/donations/verify-online
Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
Response: { success, message, donationId }

POST /api/donations/record-cash
Body: { name, email, phone, amount }
Response: { success, message, donationId }

GET /api/donations/all-records
Response: [{ id, donorName, amount, paymentMode, ... }]

PUT /api/donations/update/:id
Body: { donorName, donorEmail, donorPhone, amount, paymentMode, paymentStatus }
Response: { success, message, donation }

DELETE /api/donations/delete/:id
Response: { success, message }
```

### Certificate Routes

```
GET /api/certificate/download-certificate/:id
Response: PDF file (binary)
```

## ✨ Features

- ✅ **Donation Management**: Record and manage donations (online & cash)
- ✅ **Payment Integration**: Secure Razorpay payment processing
- ✅ **Certificate Generation**: Auto-generate PDF certificates for donors
- ✅ **Admin Dashboard**: Secure admin verification system
- ✅ **Donor Tracking**: Complete donation history and records
- ✅ **Responsive Design**: Works on desktop and mobile devices
- ✅ **Error Handling**: Comprehensive error messages and logging
- ✅ **Security**: Environment-based configuration, input validation

## 🔐 Security Best Practices

1. **Environment Variables**: Store all sensitive data in `.env`
2. **API Keys**: Never commit API keys to version control
3. **Database**: Use MongoDB Atlas with IP whitelisting in production
4. **CORS**: Configure CORS properly for your domain
5. **Validation**: Always validate user inputs on both frontend and backend
6. **HTTPS**: Use HTTPS in production
7. **.gitignore**: Ensure sensitive files are in `.gitignore`

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

### MongoDB Connection Issues

- Ensure MongoDB is running locally or MongoDB Atlas is accessible
- Check `MONGODB_URI` in `.env`
- Verify network access for MongoDB Atlas

### Port Already in Use

- Backend default: 5000 - Change `PORT` in `.env`
- Frontend default: 5173 - Vite will use next available port

### Razorpay Not Working

- Verify `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are correct
- Check Razorpay account is activated
- Use simulation mode if keys are missing

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Razorpay Documentation](https://razorpay.com/docs/)
- [Vite Documentation](https://vitejs.dev/)

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

---

**Last Updated**: May 24, 2026

**Status**: Active Development
