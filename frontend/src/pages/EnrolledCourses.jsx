import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CourseCard from '../components/CourseCard';

function EnrolledCourses() {
  const { getUserEnrolledCourses, isCourseCompleted } = useAuth();
  const navigate = useNavigate();
  const enrolledCourses = getUserEnrolledCourses();

  const handleViewCourse = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Enrolled Courses</h1>
        <p className="mt-2 text-gray-600">
          Continue learning from your enrolled courses and track your progress.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enrolledCourses.map(course => (
          <CourseCard
            key={course.id}
            course={course}
            showViewButton={true}
            isCompleted={isCourseCompleted(course.id)}
            onView={() => handleViewCourse(course.id)}
          />
        ))}
      </div>
      {enrolledCourses.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">No enrolled courses</h3>
          <p className="text-gray-500">
            <span className="block">You haven't enrolled in any courses yet.</span>
            <button
              onClick={() => navigate('/courses')}
              className="mt-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              Browse available courses →
            </button>
          </p>
        </div>
      )}
    </div>
  );
}

export default EnrolledCourses; 