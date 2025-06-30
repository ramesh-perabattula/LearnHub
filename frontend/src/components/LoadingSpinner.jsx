import React from 'react';
import { BookOpen } from 'lucide-react';

function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="bg-blue-600 p-4 rounded-full animate-pulse">
            <BookOpen className="h-12 w-12 text-white" />
          </div>
          <div className="absolute inset-0 bg-blue-600 rounded-full animate-ping opacity-20"></div>
        </div>
        <h2 className="mt-4 text-xl font-semibold text-gray-900">Loading LearnHub...</h2>
        <p className="mt-2 text-gray-600">Please wait while we prepare your learning experience</p>
      </div>
    </div>
  );
}

export default LoadingSpinner; 