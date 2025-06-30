import React, { createContext, useContext, useState, useEffect } from 'react';
import ApiService from '../services/api';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('learnhub_token');
      if (token) {
        try {
          const response = await ApiService.getProfile();
          setUser(response.data);
        } catch (error) {
          console.error('Failed to get user profile:', error);
          localStorage.removeItem('learnhub_token');
          setUser(null);
        }
      }
      setLoading(false);
    };
    initializeAuth();
  }, []);

  useEffect(() => {
    if (user) {
      getCourses();
      if (user.role === 'user') {
        getUserEnrollments();
        getUserCertificates();
      }
    }
  }, [user]);

  const login = async (email, password) => {
    try {
      const response = await ApiService.login(email, password);
      const { token, user: userData } = response.data;
      localStorage.setItem('learnhub_token', token);
      setUser(userData);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const register = async (userData) => {
    try {
      const response = await ApiService.register(userData);
      const { token, user: newUser } = response.data;
      localStorage.setItem('learnhub_token', token);
      setUser(newUser);
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('learnhub_token');
    setUser(null);
    setCourses([]);
    setEnrollments([]);
    setCertificates([]);
  };

  const updateProfile = async (userData) => {
    try {
      const response = await ApiService.updateProfile(userData);
      setUser(response.data);
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  };

  // Course methods
  const getCourses = async () => {
    try {
      const response = await ApiService.getCourses();
      const coursesData = response.data?.courses || response.data || [];
      setCourses(Array.isArray(coursesData) ? coursesData : []);
    } catch (error) {
      console.error('Failed to get courses:', error);
      setCourses([]);
    }
  };

  const getCourseById = async (id) => {
    try {
      const response = await ApiService.getCourseById(id);
      return response.data;
    } catch (error) {
      console.error('Failed to get course:', error);
      return null;
    }
  };

  const createCourse = async (courseData) => {
    try {
      const response = await ApiService.createCourse(courseData);
      setCourses(prev => [response.data, ...prev]);
    } catch (error) {
      console.error('Failed to create course:', error);
      throw error;
    }
  };

  const updateCourse = async (courseId, courseData) => {
    try {
      const response = await ApiService.updateCourse(courseId, courseData);
      setCourses(prev => prev.map(course => 
        course.id === courseId ? response.data : course
      ));
    } catch (error) {
      console.error('Failed to update course:', error);
      throw error;
    }
  };

  const deleteCourse = async (courseId) => {
    try {
      await ApiService.deleteCourse(courseId);
      setCourses(prev => prev.filter(course => course.id !== courseId));
      setEnrollments(prev => prev.filter(enrollment => enrollment.courseId !== courseId));
    } catch (error) {
      console.error('Failed to delete course:', error);
      throw error;
    }
  };

  const getTeacherCourses = async () => {
    try {
      const response = await ApiService.getTeacherCourses();
      return response.data.courses;
    } catch (error) {
      console.error('Failed to get teacher courses:', error);
      return [];
    }
  };

  // Enrollment methods
  const enrollInCourse = async (courseId) => {
    try {
      await ApiService.enrollInCourse(courseId);
      await getUserEnrollments();
      await getCourses();
    } catch (error) {
      console.error('Failed to enroll in course:', error);
      throw error;
    }
  };

  const getUserEnrollments = async () => {
    try {
      const response = await ApiService.getUserEnrollments();
      const enrollmentsData = response.data?.enrollments || response.data || [];
      setEnrollments(Array.isArray(enrollmentsData) ? enrollmentsData : []);
    } catch (error) {
      console.error('Failed to get enrollments:', error);
      setEnrollments([]);
    }
  };

  const markCourseCompleted = async (courseId) => {
    try {
      const enrollment = enrollments.find(e => e.courseId === courseId);
      if (enrollment) {
        await ApiService.markCourseCompleted(enrollment.id);
        await getUserEnrollments();
      }
    } catch (error) {
      console.error('Failed to mark course completed:', error);
      throw error;
    }
  };

  const isEnrolledInCourse = (courseId) => {
    return enrollments.some(e => e.courseId === courseId);
  };

  const isCourseCompleted = (courseId) => {
    const enrollment = enrollments.find(e => e.courseId === courseId);
    return enrollment?.completed || false;
  };

  const getUserEnrolledCourses = () => {
    return enrollments
      .map(enrollment => {
        if (enrollment.course) {
          return enrollment.course;
        }
        return courses.find(course => course.id === enrollment.courseId);
      })
      .filter(course => course !== undefined);
  };

  // Certificate methods
  const getUserCertificates = async () => {
    try {
      const response = await ApiService.getUserCertificates();
      const certificatesData = response.data?.certificates || response.data || [];
      setCertificates(Array.isArray(certificatesData) ? certificatesData : []);
    } catch (error) {
      console.error('Failed to get certificates:', error);
      setCertificates([]);
    }
  };

  const generateCertificate = async (courseId) => {
    try {
      await ApiService.generateCertificate(courseId);
      await getUserCertificates();
    } catch (error) {
      console.error('Failed to generate certificate:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      updateProfile,
      courses,
      getCourses,
      getCourseById,
      createCourse,
      updateCourse,
      deleteCourse,
      getTeacherCourses,
      enrollments,
      enrollInCourse,
      getUserEnrollments,
      markCourseCompleted,
      isEnrolledInCourse,
      isCourseCompleted,
      getUserEnrolledCourses,
      certificates,
      getUserCertificates,
      generateCertificate
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 