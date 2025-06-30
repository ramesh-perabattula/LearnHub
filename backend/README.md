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
- **Notifications**: Real-time notifications for user activities

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Cloudinary
- **Security**: Helmet, CORS, Rate Limiting
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

4. **Database Setup**
   
   **Option A: MongoDB Atlas (Recommended)**
   - Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a new cluster
   - Get your connection string and update `MONGODB_URI` in `.env`
   - Whitelist your IP address in Atlas Network Access
   
   **Option B: Local MongoDB**
   - Install MongoDB locally
   - Start MongoDB service:
     ```bash
     # macOS (with Homebrew)
     brew services start mongodb-community
     
     # Linux
     sudo systemctl start mongod
     
     # Windows
     net start MongoDB
     ```
   - Use local connection string: `mongodb://localhost:27017/learnhub`

5. **Seed Database (Optional)**
   ```bash
   npm run seed
   ```

6. **Start Development Server**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:5000`

## Database Configuration

### MongoDB Atlas Setup (Cloud - Recommended)

1. **Create Account**: Sign up at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. **Create Cluster**: Choose the free tier (M0 Sandbox)
3. **Database User**: Create a database user with read/write permissions
4. **Network Access**: Add your IP address to the whitelist (or use 0.0.0.0/0 for development)
5. **Connection String**: Get your connection string from the "Connect" button
6. **Update .env**: Replace the `MONGODB_URI` with your Atlas connection string

Example Atlas connection string:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/learnhub?retryWrites=true&w=majority
```

### Local MongoDB Setup

If you prefer to run MongoDB locally:

1. **Install MongoDB**: Download from [MongoDB Community Server](https://www.mongodb.com/try/download/community)
2. **Start Service**: Follow the installation guide for your OS
3. **Connection String**: Use `mongodb://localhost:27017/learnhub`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh JWT token

### Users
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users` - Get all users (Admin only)

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses` - Create new course (Teacher/Admin)
- `PUT /api/courses/:id` - Update course (Teacher/Admin)
- `DELETE /api/courses/:id` - Delete course (Teacher/Admin)
- `GET /api/courses/teacher/my-courses` - Get teacher's courses

### Enrollments
- `POST /api/enrollments` - Enroll in course
- `GET /api/enrollments/user` - Get user enrollments
- `PUT /api/enrollments/:id/complete` - Mark course as completed
- `PUT /api/enrollments/:id/progress` - Update course progress

### Certificates
- `GET /api/certificates/user` - Get user certificates
- `POST /api/certificates/generate` - Generate certificate
- `GET /api/certificates/verify/:code` - Verify certificate

### Dashboard
- `GET /api/dashboard/user` - User dashboard stats
- `GET /api/dashboard/teacher` - Teacher dashboard stats
- `GET /api/dashboard/admin` - Admin dashboard stats

### File Upload
- `POST /api/upload/image` - Upload image
- `POST /api/upload/video` - Upload video

### Search
- `GET /api/search/courses` - Search courses

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark notification as read

## Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## User Roles

- **user**: Students who can enroll in courses
- **teacher**: Can create and manage courses
- **admin**: Full system access

## Error Handling

The API uses consistent error response format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Validation errors if applicable
}
```

## Rate Limiting

- 100 requests per 15 minutes per IP address
- Applied to all `/api/*` routes

## Development

### Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with sample data

### Database Models

- **User**: User accounts with role-based access
- **Course**: Course information and metadata
- **Enrollment**: User-course enrollment relationships
- **Certificate**: Generated certificates for completed courses
- **Notification**: User notifications and alerts

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running (local) or connection string is correct (Atlas)
   - Check network access settings in MongoDB Atlas
   - Verify username/password in connection string

2. **Environment Variables**
   - Make sure `.env` file exists and contains all required variables
   - Check that `MONGODB_URI` is properly formatted

3. **Port Already in Use**
   - Change the `PORT` in `.env` file
   - Kill existing processes using the port

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a production MongoDB instance (MongoDB Atlas recommended)
3. Configure proper CORS origins
4. Set up SSL/HTTPS
5. Use PM2 or similar for process management
6. Set up monitoring and logging

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation and sanitization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details