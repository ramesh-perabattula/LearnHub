import React from 'react';
import { Users, Calendar, Play } from 'lucide-react';
// import { Course } from '../context/AuthContext';

function CourseCard({
  course,
  onEnroll,
  onView,
  onEdit,
  onDelete,
  showEnrollButton = false,
  showViewButton = false,
  showManageButtons = false,
  isEnrolled = false,
  isCompleted = false
}) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img 
          src={course.thumbnail} 
          alt={course.title}
          className="w-full h-48 object-cover"
        />
        {isCompleted && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            Completed
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{course.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{course.description}</p>
        <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4">
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>{course.enrolledStudents} students</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{new Date(course.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="text-sm text-gray-600 mb-4">
          By {course.teacherName}
        </div>
        <div className="flex space-x-2">
          {showEnrollButton && !isEnrolled && (
            <button
              onClick={onEnroll}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              Enroll Now
            </button>
          )}
          {showViewButton && (
            <button
              onClick={onView}
              className="flex-1 flex items-center justify-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200 font-medium"
            >
              <Play className="h-4 w-4" />
              <span>View Course</span>
            </button>
          )}
          {showManageButtons && (
            <>
              <button
                onClick={onEdit}
                className="flex-1 bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-600 transition-colors duration-200 font-medium"
              >
                Edit
              </button>
              <button
                onClick={onDelete}
                className="flex-1 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-200 font-medium"
              >
                Delete
              </button>
            </>
          )}
          {isEnrolled && !showViewButton && (
            <div className="flex-1 bg-green-100 text-green-800 px-4 py-2 rounded-md text-center font-medium">
              Enrolled
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseCard;

 