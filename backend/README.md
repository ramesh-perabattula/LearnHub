# LearnHub Backend API

A comprehensive Learning Management System (LMS) backend built with Node.js, Express, and MongoDB.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **User Management**: Support for Students, Teachers, and Admins
- **Course Management**: CRUD operations for courses with file uploads
- **Enrollment System**: Course enrollment and progress tracking
- **Certificate Generation**: Automated certificate generation for completed courses
- **Dashboard Analytics**: Role-specific dashboard statistics
- **File Upload**: Image and video upload to Cloudinary
- **Search Functionality**: Full-text search for courses
 
## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Cloudinary
 - **Validation**: Express Validator

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account (recommended) or local MongoDB installation
- Cloudinary account (for file uploads)

### Installation

1. **Clone and navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/learnhub?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=7d
   NODE_ENV=development
   
   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   
   FRONTEND_URL=http://localhost:5173
   ```