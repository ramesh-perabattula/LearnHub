import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Calendar, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import VideoPlayer from '../components/VideoPlayer';

function CourseView() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { courses, markCourseCompleted, isCourseCompleted } = useAuth();
  const course = courses.find(c => c.id === courseId);

  useEffect(() => {
    console.log('CourseView Debug:', {
      courseId,
      totalCourses: courses.length,
      courseIds: courses.map(c => c.id),
      foundCourse: course
    });
  }, [courseId, courses, course]);

  if (!course) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Course not found</h1>
          <p className="text-gray-600 mt-2">The course you're looking for doesn't exist or you don't have access to it.</p>
          <div className="mt-4 text-sm text-gray-500">
            <p>Course ID: {courseId}</p>
            <p>Available courses: {courses.length}</p>
          </div>
          <button
            onClick={() => navigate('/enrolled-courses')}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            ← Back to enrolled courses
          </button>
        </div>
      </div>
    );
  }

  const isCompleted = isCourseCompleted(course.id);

  const handleMarkCompleted = () => {
    markCourseCompleted(course.id);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate('/enrolled-courses')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to enrolled courses</span>
        </button>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
                <p className="text-gray-600 mb-4">{course.description}</p>
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>{course.teacherName}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{course.enrolledStudents} students</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(course.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              {isCompleted && (
                <div className="ml-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    ✓ Completed
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="p-6">
            <VideoPlayer
              videoUrl={course.videoUrl}
              title={course.title}
              onMarkCompleted={handleMarkCompleted}
              isCompleted={isCompleted}
            />
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Course Overview</h3>
              <div className="prose prose-sm text-gray-600">
                <p>{course.description}</p>
                <p>
                  This comprehensive course will guide you through all the essential concepts and practical applications. 
                  By the end of this course, you'll have a solid understanding of the subject matter and be able to 
                  apply what you've learned in real-world scenarios.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseView; 