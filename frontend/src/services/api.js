const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  getAuthHeaders() {
    const token = localStorage.getItem('learnhub_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options
    };

    console.log('🌐 Making API request to:', url);
    console.log('📋 Request config:', { method: config.method || 'GET', headers: config.headers });

    try {
      const response = await fetch(url, config);
      console.log('📡 Response status:', response.status);
      
      const data = await response.json();

      if (!response.ok) {
        console.error('❌ API Error Response:', data);
        throw new Error(data.message || 'API request failed');
      }

      console.log('✅ API request successful');
      return data;
    } catch (error) {
      console.error('🚨 API Error:', error);
      console.error('🔗 Failed URL:', url);
      console.error('📋 Request config:', config);
      
      // Provide more specific error messages
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        throw new Error('Unable to connect to the server. Please check if the backend is running on port 5000.');
      }
      
      throw error;
    }
  }

  // Authentication
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST'
    });
  }

  // Users
  async getProfile() {
    return this.request('/users/profile');
  }

  async updateProfile(userData) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  }

  async getAllUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/users?${queryString}`);
  }

  // Courses
  async getCourses(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/courses?${queryString}`);
  }

  async getCourseById(id) {
    return this.request(`/courses/${id}`);
  }

  async createCourse(courseData) {
    return this.request('/courses', {
      method: 'POST',
      body: JSON.stringify(courseData)
    });
  }

  async updateCourse(id, courseData) {
    return this.request(`/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(courseData)
    });
  }

  async deleteCourse(id) {
    return this.request(`/courses/${id}`, {
      method: 'DELETE'
    });
  }

  async getTeacherCourses() {
    return this.request('/courses/teacher/my-courses');
  }

  // Enrollments
  async enrollInCourse(courseId) {
    return this.request('/enrollments', {
      method: 'POST',
      body: JSON.stringify({ courseId })
    });
  }

  async getUserEnrollments() {
    return this.request('/enrollments/user');
  }

  async markCourseCompleted(enrollmentId) {
    return this.request(`/enrollments/${enrollmentId}/complete`, {
      method: 'PUT'
    });
  }

  async updateProgress(enrollmentId, progress) {
    return this.request(`/enrollments/${enrollmentId}/progress`, {
      method: 'PUT',
      body: JSON.stringify({ progress })
    });
  }

  // Certificates
  async getUserCertificates() {
    return this.request('/certificates/user');
  }

  async generateCertificate(courseId) {
    return this.request('/certificates/generate', {
      method: 'POST',
      body: JSON.stringify({ courseId })
    });
  }

  async verifyCertificate(verificationCode) {
    return this.request(`/certificates/verify/${verificationCode}`);
  }

  // Dashboard
  async getUserDashboard() {
    return this.request('/dashboard/user');
  }

  async getTeacherDashboard() {
    return this.request('/dashboard/teacher');
  }

  async getAdminDashboard() {
    return this.request('/dashboard/admin');
  }

  // Search
  async searchCourses(params) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/search/courses?${queryString}`);
  }

  // Notifications
  async getNotifications(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/notifications?${queryString}`);
  }

  async markNotificationRead(id) {
    return this.request(`/notifications/${id}/read`, {
      method: 'PUT'
    });
  }

  // File Upload
  async uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);

    return this.request('/upload/image', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('learnhub_token')}`
      },
      body: formData
    });
  }
}

export default new ApiService();