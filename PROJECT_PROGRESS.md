# 📁 CloudDrive - Project Progress Report

**Developer:** Mohammad Rizwan  
**Project:** CloudDrive - Secure Cloud Storage Application  
**Tech Stack:** Node.js, Express.js, MongoDB, Mongoose, JWT, Multer  
**Current Version:** v1.0 Backend (Core Features Complete)  
**Status:** ✅ Backend Core APIs Completed & Acceptance Tested

---

# 📅 Development Progress

# CloudDrive - Project Progress Report

**Project:** CloudDrive
**Backend:** Node.js, Express.js
**Frontend:** React (Planned)
**Database:** MongoDB
**Authentication:** JWT
**Current Day:** 16

---

# Day 1 - Project Planning

## Completed
- Finalized project idea
- Planned project architecture
- Selected technology stack
- Created GitHub repository
- Created folder structure

Status:
✅ Completed

---

# Day 2 - Project Initialization

## Completed
- Express setup
- MongoDB connection
- Environment configuration
- Installed project dependencies

Status:
✅ Completed

---

# Day 3 - Authentication

## Completed
- User Registration
- User Login
- Password hashing using bcrypt
- JWT Authentication
- Authentication middleware

Testing
- Register API ✅
- Login API ✅

Status:
✅ Completed

---

# Day 4 - User Management

## Completed
- User Profile API
- Update Profile
- Profile Picture support

Testing
- Profile API ✅

Status:
✅ Completed

---

# Day 5 - File Upload

## Completed
- Multer configuration
- Upload API
- File validation
- Local storage support

Testing
- Upload API ✅

Status:
✅ Completed

---

# Day 6 - File Download

## Completed
- Download API
- Ownership verification

Testing
- Download API ✅

Status:
✅ Completed

---

# Day 7 - File Rename

## Completed
- Rename API
- Ownership verification

Testing
- Rename API ✅

Status:
✅ Completed

---

# Day 8 - File Delete

## Completed
- Delete API
- Remove physical file
- Remove database record

Testing
- Delete API ✅

Status:
✅ Completed

---

# Day 9 - Search

## Completed
- Search files by filename
- Search endpoint

Testing
- Search API ✅

Status:
✅ Completed

---

# Day 10

## Completed
- Project cleanup
- Backend improvements
- Bug fixes

Status:
✅ Completed

---

# Day 11

## Completed
- Controller improvements
- Better project structure
- Code cleanup

Status:
✅ Completed

---

# Day 12

## Completed
- Backend testing
- API verification
- Bug fixes

Status:
✅ Completed

---

# Day 13

## Completed
- Refactoring
- Preparation for Storage Management

Status:
✅ Completed

---

# Day 14 - Storage Management

## Completed

Created:
- storageService.js

Implemented

- checkStorageLimit()
- increaseStorage()
- decreaseStorage()
- getStorageInfo()

Integrated

- Upload storage tracking
- Delete storage tracking

Testing

- Login API ✅
- Upload API ✅
- Delete API ✅
- StorageUsed verification ✅

Status

✅ Completed

---

# Day 15 - Dashboard API

## Completed

Created

- dashboardService.js
- dashboardController.js
- dashboardRoutes.js

Features

- Dashboard statistics
- Total files
- Storage usage
- Remaining storage
- Usage percentage
- VIP status
- File type statistics
- Recent uploaded files

Testing

- Dashboard API ✅

Status

✅ Completed

---

# Day 16 - Favorites

## Completed

Created

- favoriteService.js
- favoriteController.js
- favoriteRoutes.js

Modified

- File Model
- app.js

Features

- Add Favorite
- Remove Favorite
- List Favorite Files

Testing

- Add Favorite API ✅
- Remove Favorite API ✅
- Get Favorite Files API ✅

Status

✅ Completed

---

# Current Progress

Completed Features

- Authentication
- User Management
- File Upload
- File Download
- File Rename
- File Delete
- File Search
- Storage Management
- Dashboard API
- Favorites

---

# Remaining Features

- Trash & Restore
- Folder Management
- File Sharing
- AWS S3 Integration
- Security
- Validation
- Documentation
- Final Testing
- Deployment
- React Frontend Integration

---

# Project Progress

Backend Progress

85%

Overall Project Progress

55%

---

# Day 17 - Trash & Restore

**Date:** 2026-07-25

## Objective
Implement a Trash & Restore system that allows users to safely delete files by moving them to the Trash, restore them when needed, or permanently delete them.

---

## Work Completed

### Database
Updated `File` model.

Added:
- `isTrashed`
- `trashedAt`

### Services
Created `trashService.js`

Implemented:
- moveToTrash()
- getTrashedFiles()
- restoreFile()
- permanentlyDeleteFile()

### Controllers
Created `trashController.js`

Implemented:
- Move file to Trash
- Get Trash
- Restore file
- Permanently delete file

### Routes
Created `trashRoutes.js`

Endpoints:
- PATCH /api/trash/:id
- GET /api/trash
- PATCH /api/trash/restore/:id
- DELETE /api/trash/:id

### Application
- Registered Trash routes in `app.js`

---

## Features Implemented

- Move file to Trash
- View trashed files
- Restore files
- Permanently delete files
- Delete physical file from server
- Remove file document from MongoDB
- Update user storage after permanent deletion
- JWT authentication for all Trash APIs
- User ownership verification

---

## Testing

### API Testing

✅ Move File to Trash

```
PATCH /api/trash/:id
```

Verified:
- File moved to Trash
- `isTrashed = true`
- `trashedAt` updated

---

✅ Get Trashed Files

```
GET /api/trash
```

Verified:
- Returned only trashed files

---

✅ Restore File

```
PATCH /api/trash/restore/:id
```

Verified:
- `isTrashed = false`
- `trashedAt = null`

---

✅ Permanently Delete File

```
DELETE /api/trash/:id
```

Verified:
- Physical file deleted
- MongoDB document removed
- User storage updated

---

## Bugs Fixed

- Fixed middleware import path (`middleware` vs `middlewares`).

---

## Files Created

- src/services/trashService.js
- src/controllers/trashController.js
- src/routes/trashRoutes.js

---

## Files Modified

- src/models/File.js
- src/app.js

---

## Status

✅ Trash & Restore Completed

---

## Overall Progress

Completed Features:

- Authentication
- User Management
- File Upload
- File Download
- File Rename
- File Delete
- File Search
- Storage Management
- Dashboard API
- Favorites
- Trash & Restore

Backend Completion: **~88%**

Overall Project Completion: **~60%**

---
Phase 6 - Folder Management (Completed Today)
✅ Create Folder
✅ List Folders
✅ Rename Folder
✅ Delete Folder
✅ Prevent Deleting Non-Empty Folder
✅ Upload Files to Folder
✅ Upload Files to Root
✅ Get Files by Folder
✅ Populate Folder Details
✅ Folder Ownership Validation



Day 19 – File Sharing
Created Share model
Implemented share service
Added share APIs
Implemented public download API
Added password protection support
Added expiry validation
Added download counter
Fixed accidental File.js overwrite
Tested all sharing APIs successfully

Writing one summary like this after each session will make it much easier to prepare your final project report or explain your work in interviews.

# 🎯 Current Milestone

✅ CloudDrive Backend v1.0 Completed

Core backend APIs have been implemented and successfully passed a complete acceptance testing cycle. The backend is stable and ready for refactoring, cloud storage integration, frontend development, and deployment.

---

# 📝 Notes

### Improvements Identified During Testing

- Do not return hashed password in Register API response.
- Expand supported file types beyond images and PDFs.
- Add multi-file upload support.
- Enhance input validation and error handling.

---

# 🏆 Achievement

✔ Authentication System Complete

✔ File Management System Complete

✔ MongoDB Integration Complete

✔ JWT Security Complete

✔ Acceptance Testing Passed (11/11)

✔ Backend v1.0 Successfully Completed



✅ Today's Accomplishments
Authentication
✅ Login
✅ Logout
✅ Protected Routes
Dashboard
✅ Dashboard fully connected to the backend
✅ Sidebar storage uses live data
✅ Storage overview uses live data
✅ Recent files use live data
✅ Dashboard context created to avoid duplicate API calls
My Files
✅ Display files from MongoDB
✅ Search files
✅ Upload files
✅ Auto-refresh after upload
✅ Download files
✅ Delete files
✅ Refactored into reusable components (FileRow, FileActions, etc.)
Code Quality
✅ Context API introduced
✅ Services separated
✅ Custom hooks
✅ Utility functions
✅ Reusable components