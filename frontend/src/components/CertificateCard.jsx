import React from 'react';
import { Download } from 'lucide-react';

function CertificateCard({ course, completedDate, onDownload }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-40 object-cover"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{course.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{course.description}</p>
        <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4">
          <span>Completed on: {new Date(completedDate).toLocaleDateString()}</span>
        </div>
        <button
          onClick={onDownload}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium"
        >
          <Download className="h-4 w-4" />
          <span>Download Certificate</span>
        </button>
      </div>
    </div>
  );
}

export default CertificateCard; 