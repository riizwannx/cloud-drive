# 🚀 CloudDrive - Project Progress

## 📌 Project Overview

CloudDrive is a secure cloud storage platform built using the MERN Stack and AWS Cloud Services. The goal of this project is to build a scalable, secure, and production-ready cloud storage application where users can register, authenticate, upload, manage, and securely access their files from anywhere.

The project follows industry-standard backend architecture, REST API principles, secure authentication practices, and clean coding standards.

---

# 📅 Day 1 – Project Planning & System Design

## 🎯 Objective

Plan the complete CloudDrive application.

### ✅ Completed

- Finalized CloudDrive project idea
- Planned complete application architecture
- Designed Version 1 features
- Planned MongoDB database
- Planned REST APIs
- Planned Authentication Flow
- Planned AWS S3 Integration
- Created GitHub Repository
- Created Development Roadmap

### 📚 Concepts Learned

- Software Architecture
- Database Design
- REST API Planning
- GitHub Project Setup

---

# 📅 Day 2 – Backend Foundation

## 🎯 Objective

Initialize backend development.

### ✅ Completed

- Initialized Node.js Project
- Installed Express.js
- Configured dotenv
- Configured CORS
- Created backend structure
- Built first API
- Tested backend successfully

### 📚 Technologies

- Node.js
- Express.js
- dotenv
- CORS

---

# 📅 Day 3 – Professional Backend Structure

## 🎯 Objective

Build scalable backend architecture.

### ✅ Completed

Created professional MVC folder structure.

```
server/

├── src/
│
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── services/
├── uploads/
├── utils/
│
├── app.js
└── server.js

package.json
.env
```

### 📚 Concepts Learned

- MVC Architecture
- Clean Folder Structure
- Backend Organization

---

# 📅 Day 4 – Express Application Setup

## 🎯 Objective

Configure Express Application.

### ✅ Completed

- Configured Express App
- Added Middleware
- Configured Routes
- Created Root Route
- Created Health API

### APIs

```
GET /
GET /api/health
```

### 📚 Concepts Learned

- Express Routing
- Middleware
- Request & Response Lifecycle

---

# 📅 Day 5 – MongoDB Atlas Integration

## 🎯 Objective

Connect CloudDrive with MongoDB Atlas.

### ✅ Completed

- Created MongoDB Atlas Cluster
- Configured Database User
- Configured Network Access
- Connected MongoDB Atlas
- Configured Mongoose
- Successfully Connected Database

### Debugging

Resolved

- MongoDB Connection Errors
- DNS Issues
- Environment Variables
- Connection String Problems

### 📚 Concepts Learned

- MongoDB Atlas
- Mongoose
- Database Connections
- Environment Variables

---

# 📅 Day 6 – User Model & First API

## 🎯 Objective

Create User Model and First API.

### ✅ Completed

Created User Schema

Fields

- Username
- Email
- Password
- Profile Picture
- Phone
- Bio
- Storage Used
- Storage Limit
- VIP Status
- CreatedAt
- UpdatedAt

Created

- User Model
- User Controller
- User Routes

Successfully inserted first document into MongoDB Atlas.

### API

```
POST /api/users/register
```

### 📚 Concepts Learned

- Mongoose Schema
- Mongoose Models
- Controllers
- Routes
- MongoDB Documents

---

# 📅 Day 7 – Secure User Registration

## 🎯 Objective

Develop secure registration system.

### ✅ Completed

- Dynamic Registration
- Input Validation
- Duplicate Username Check
- Duplicate Email Check
- Password Hashing using bcrypt

### API Testing

Successfully Tested

- Registration
- Missing Fields
- Duplicate Username
- Duplicate Email
- Password Encryption

### 📚 Concepts Learned

- req.body
- Validation
- bcrypt
- findOne()
- Secure Registration

---

# 📅 Day 8 – Login API & JWT Authentication

## 🎯 Objective

Implement secure login using JWT.

### ✅ Completed

- Login API
- Password Verification
- JWT Token Generation
- Environment Variables
- Token Expiration

### API

```
POST /api/users/login
```

### API Testing

Successfully Tested

- Login
- Wrong Password
- User Not Found
- JWT Generation

### 📚 Concepts Learned

- Authentication
- Authorization
- JWT
- bcrypt.compare()
- jwt.sign()

---

# 📅 Day 9 – Authentication Middleware & Protected Routes

## 🎯 Objective

Protect private APIs.

### ✅ Completed

Created Authentication Middleware.

Implemented

- Authorization Header
- Bearer Token Validation
- JWT Verification
- req.user
- Protected Routes

### Protected API

```
GET /api/users/profile
```

### API Testing

Successfully Tested

- Valid Token
- Invalid Token
- Missing Token
- Protected Route

### 📚 Concepts Learned

- Middleware
- Authorization Header
- Bearer Token
- jwt.verify()
- Protected Routes

---

# 📅 Day 10 – Current User Profile API

## 🎯 Objective

Return complete authenticated user profile.

### ✅ Completed

Improved Profile API.

Implemented

- MongoDB findById()
- User fetched using req.user.id
- Password removed from response
- __v removed from response
- Production-style Profile API

### Protected API

```
GET /api/users/profile
```

### API Testing

Successfully Tested

- JWT Authentication
- MongoDB Query
- Password Hidden
- __v Hidden
- User Profile Retrieval

### 📚 Concepts Learned

- findById()
- select("-password -__v")
- Secure API Response
- Production API Design

---

# 📂 Current Project Structure

```
cloud-drive/

├── server/
│
├── src/
│   ├── config/
│   ├── controllers/
│   │   └── userController.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   └── User.js
│   │
│   ├── routes/
│   │   └── userRoutes.js
│   │
│   ├── services/
│   ├── uploads/
│   ├── utils/
│   │
│   ├── app.js
│   └── server.js
│
├── package.json
├── package-lock.json
├── .env
├── .gitignore
├── README.md
└── PROJECT_PROGRESS.md
```

---

# 🛠 Technologies Used

## Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- bcrypt
- JSON Web Token (JWT)

## Development Tools

- Git
- GitHub
- VS Code
- Postman

## Upcoming

- Multer
- AWS S3
- React
- Docker
- Nginx
- Amazon EC2

---

# 📈 Current Project Progress

```
Project Planning                 ✅ 100%
Backend Setup                    ✅ 100%
Express.js                       ✅ 100%
MongoDB Atlas                    ✅ 100%
Database Design                  ✅ 100%
User Model                       ✅ 100%
Registration API                 ✅ 100%
Input Validation                 ✅ 100%
Duplicate Validation             ✅ 100%
Password Hashing                 ✅ 100%
Login API                        ✅ 100%
JWT Authentication               ✅ 100%
Authentication Middleware        ✅ 100%
Protected Routes                 ✅ 100%
Current User Profile API         ✅ 100%

File Upload API                  ⏳ Pending
File Management                  ⏳ Pending
AWS S3 Integration               ⏳ Pending
React Frontend                   ⏳ Pending
Docker                           ⏳ Pending
Nginx                            ⏳ Pending
EC2 Deployment                   ⏳ Pending
```

---

# 🎯 Version 1 Features

## Authentication

- User Registration ✅
- User Login ✅
- Password Encryption ✅
- JWT Authentication ✅
- Authentication Middleware ✅
- Protected Routes ✅
- Current User Profile ✅

## Storage

- File Upload ⏳
- File Download ⏳
- File Delete ⏳
- Folder Management ⏳

## Cloud

- AWS S3 Integration ⏳

---

# 📅 Upcoming Milestones

## Day 11

- Multer Installation
- Upload Middleware
- File Upload API

## Day 12

- Local File Upload
- File Metadata

## Day 13

- AWS S3 Upload

## Day 14

- File Listing
- Download API
- Delete API

## Day 15

- Folder Management
- Search API

## Future

- React Frontend
- Dashboard
- Docker
- Nginx
- EC2 Deployment
# 📅 Day 11 – File Upload Module

## 🎯 Objective
Implement a secure file upload system for authenticated users using Multer middleware.

---

## ✅ Work Completed

- Installed Multer package.
- Created the `uploads` folder for storing uploaded files.
- Configured Multer using `diskStorage()`.
- Implemented automatic unique filename generation using `Date.now()`.
- Added file type validation (JPG, JPEG, PNG, PDF).
- Added maximum file size limit of 5 MB.
- Created `uploadMiddleware.js` for handling file uploads.
- Created `fileController.js` to process uploaded files.
- Created `fileRoutes.js` for upload endpoints.
- Protected the upload route using JWT Authentication Middleware.
- Successfully tested file upload using Postman.
- Verified that uploaded files are stored in the `src/uploads` directory.

---

## 📂 Files Created

- `src/middleware/uploadMiddleware.js`
- `src/controllers/fileController.js`
- `src/routes/fileRoutes.js`
- `src/uploads/`

---

## 🌐 API Implemented

### Upload File

**Method:** `POST`

**Endpoint:**
```
/api/files/upload
```

**Authentication:**
```
Bearer Token (JWT Required)
```

**Request Body:**
```
form-data

Key : file
Type : File
```

---

## 📤 Response

Returns:

- Upload status
- Original file name
- Generated file name
- File type
- File size
- File storage path

---

## 🧠 Concepts Learned

- Multer Middleware
- multipart/form-data
- File Upload in Express.js
- diskStorage Configuration
- File Validation
- File Size Limitation
- JWT Protected Routes
- req.file Object
- File Upload Testing using Postman

---

## ✅ Status

Day 11 completed successfully.

CloudDrive now supports authenticated file uploads with validation and local file storage.
---

# 🚀 Current Status

## Project Version

CloudDrive v1.0 (Authentication Module Complete)

## Overall Status

CloudDrive now includes a complete authentication system with secure user registration, password hashing using bcrypt, JWT-based login, authentication middleware, protected routes, and a production-style Current User Profile API. Sensitive information such as passwords and internal Mongoose fields are excluded from responses. The next phase of development focuses on implementing file upload functionality, AWS S3 integration, file management features, frontend development, containerization with Docker, and deployment on Amazon EC2.

---

# 🎯 Final Goal

Build a production-ready cloud storage platform using the MERN Stack and AWS that demonstrates secure authentication, scalable backend architecture, cloud file storage, clean API design, and deployment best practices. The completed project will serve as a professional portfolio project showcasing backend engineering, cloud integration, and full-stack development skills.