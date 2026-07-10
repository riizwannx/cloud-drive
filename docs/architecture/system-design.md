# CloudDrive - System Design

## Overview

CloudDrive follows a modern client-server architecture.

The frontend communicates with the backend through REST APIs.

The backend handles authentication, business logic, and communication with the database and cloud storage.

---

## High-Level Architecture

User

↓

React Frontend

↓

Node.js + Express Backend

↓

MongoDB Database

↓

AWS S3 Storage

---

## Components

### Frontend

Responsibilities:

- User Interface
- Authentication
- Dashboard
- File Upload
- File Management

Technology:

- React
- Vite
- Tailwind CSS

---

### Backend

Responsibilities:

- REST API
- Authentication
- Authorization
- File Management
- Database Operations

Technology:

- Node.js
- Express.js

---

### Database

Responsibilities:

- Store user information
- Store folder information
- Store file metadata

Technology:

- MongoDB

---

### Cloud Storage

Responsibilities:

- Store uploaded files

Technology:

- AWS S3

---

### Deployment

Frontend

↓

Nginx

↓

Backend

↓

MongoDB

↓

AWS S3