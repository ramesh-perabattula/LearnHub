import React, { useState, useEffect } from 'react';
import { BookOpen, Users, GraduationCap, Award, TrendingUp, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import ApiService from '../services/api';

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      try {
        let response;
        switch (user.role) {
          case 'user':
            response = await ApiService.getUserDashboard();
            break;
          case 'teacher':
            response = await ApiService.getTeacherDashboard();
            break;
          case 'admin':
            response = await ApiService.getAdminDashboard();
            break;
          default:
            return;
        }
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [user]);

  if (!user || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const renderUserDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Enrolled Courses" value={stats.enrolledCourses || 0} icon={BookOpen} color="blue" />
        <StatCard title="Completed Courses" value={stats.completedCourses || 0} icon={Award} color="green" />
        <StatCard title="In Progress" value={stats.inProgressCourses || 0} icon={Clock} color="orange" />
        <StatCard title="Learning Hours" value={stats.totalLearningHours || 0} icon={TrendingUp} color="purple" />
      </div>
      {stats.recentActivities && stats.recentActivities.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {stats.recentActivities.slice(0, 5).map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{activity.courseTitle}</h4>
                  <p className="text-sm text-gray-600">{activity.type === 'course_completed' ? 'Completed' : 'Enrolled'}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${activity.type === 'course_completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                    {activity.type === 'course_completed' ? 'Completed' : 'In Progress'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderTeacherDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="My Courses" value={stats.totalCourses || 0} icon={BookOpen} color="blue" />
        <StatCard title="Total Students" value={stats.totalStudents || 0} icon={Users} color="green" />
        <StatCard title="Revenue" value={`$${stats.totalRevenue || 0}`} icon={TrendingUp} color="purple" />
        <StatCard title="Avg. Rating" value={stats.avgRating || 0} icon={Award} color="orange" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {stats.recentEnrollments && stats.recentEnrollments.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Enrollments</h3>
            <div className="space-y-4">
              {stats.recentEnrollments.slice(0, 5).map((enrollment, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{enrollment.studentName}</h4>
                    <p className="text-sm text-gray-600">{enrollment.courseTitle}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-500">{new Date(enrollment.enrolledAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {stats.coursePerformance && stats.coursePerformance.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Performance</h3>
            <div className="space-y-4">
              {stats.coursePerformance.slice(0, 5).map((course, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{course.courseTitle}</h4>
                    <p className="text-sm text-gray-600">{course.enrolledStudents} students</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-green-600">{course.completionRate}% completion</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderAdminDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={stats.totalUsers || 0} icon={Users} color="blue" />
        <StatCard title="Teachers" value={stats.totalTeachers || 0} icon={GraduationCap} color="green" />
        <StatCard title="Students" value={(stats.totalUsers || 0) - (stats.totalTeachers || 0)} icon={Users} color="purple" />
        <StatCard title="Total Courses" value={stats.totalCourses || 0} icon={BookOpen} color="orange" />
      </div>
      {stats.recentActivities && stats.recentActivities.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Platform Activity</h3>
          <div className="space-y-4">
            {stats.recentActivities.slice(0, 5).map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">
                    {activity.type === 'new_user' ? `New user: ${activity.userName}` : 
                     activity.type === 'course_created' ? `New course: ${activity.courseTitle}` : 
                     activity.userName || activity.courseTitle}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {activity.type === 'new_user' ? 'User Registration' : 
                     activity.type === 'course_created' ? `By ${activity.teacherName}` : 
                     'Platform Activity'}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-500">{new Date(activity.date).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
        <p className="mt-2 text-gray-600">
          {user.role === 'user' && "Track your learning progress and continue your courses."}
          {user.role === 'teacher' && "Manage your courses and track student engagement."}
          {user.role === 'admin' && "Monitor platform statistics and manage the learning environment."}
        </p>
      </div>
      {user.role === 'user' && renderUserDashboard()}
      {user.role === 'teacher' && renderTeacherDashboard()}
      {user.role === 'admin' && renderAdminDashboard()}
    </div>
  );
}

export default Dashboard; 