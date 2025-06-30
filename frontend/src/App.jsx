import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import PrivateRoute from './components/PrivateRoute';
import LoadingSpinner from './components/LoadingSpinner';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import EnrolledCourses from './pages/EnrolledCourses';
import CourseView from './pages/CourseView';
import Certificates from './pages/Certificates';
import MyCourses from './pages/MyCourses';
import CreateCourse from './pages/CreateCourse';
import ManageCourses from './pages/ManageCourses';
import ManageUsers from './pages/ManageUsers';

function AppContent() {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Navigate to="/home" replace />} />
        {/* Protected Routes */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        {/* Student Routes */}
        <Route
          path="/courses"
          element={
            <PrivateRoute allowedRoles={['user']}>
              <Courses />
            </PrivateRoute>
          }
        />
        <Route
          path="/enrolled-courses"
          element={
            <PrivateRoute allowedRoles={['user']}>
              <EnrolledCourses />
            </PrivateRoute>
          }
        />
        <Route
          path="/certificates"
          element={
            <PrivateRoute allowedRoles={['user']}>
              <Certificates />
            </PrivateRoute>
          }
        />
        <Route
          path="/course/:courseId"
          element={
            <PrivateRoute allowedRoles={['user']}>
              <CourseView />
            </PrivateRoute>
          }
        />
        {/* Teacher Routes */}
        <Route
          path="/my-courses"
          element={
            <PrivateRoute allowedRoles={['teacher']}>
              <MyCourses />
            </PrivateRoute>
          }
        />
        <Route
          path="/create-course"
          element={
            <PrivateRoute allowedRoles={['teacher']}>
              <CreateCourse />
            </PrivateRoute>
          }
        />
        {/* Admin Routes */}
        <Route
          path="/manage-courses"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <ManageCourses />
            </PrivateRoute>
          }
        />
        <Route
          path="/manage-users"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <ManageUsers />
            </PrivateRoute>
          }
        />
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App; 