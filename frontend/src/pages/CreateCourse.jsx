import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function CreateCourse() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { createCourse } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !thumbnail || !videoUrl) {
      alert('Please fill in all fields');
      return;
    }

    // Simple client-side check for Cloudinary or YouTube
    if (!(
      videoUrl.startsWith('https://res.cloudinary.com/') ||
      videoUrl.includes('youtube.com') ||
      videoUrl.includes('youtu.be')
    )) {
      alert('Video URL must be a Cloudinary or YouTube link');
      return;
    }

    setIsSubmitting(true);
    
    try {
      createCourse({
        title,
        description,
        thumbnail,
        videoUrl
      });
      
      navigate('/my-courses');
    } catch (error) {
      console.error('Error creating course:', error);
      alert('Failed to create course. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const sampleImages = [
    'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1',
    'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1',
    'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1',
    'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1'
  ];

  const sampleVideos = [
    'https://res.cloudinary.com/demo/video/upload/v1/samples/elephants.mp4',
    'https://res.cloudinary.com/demo/video/upload/v1/samples/sea-turtle.mp4',
    'https://res.cloudinary.com/demo/video/upload/v1/samples/cld-sample-video.mp4',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate('/my-courses')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to my courses</span>
        </button>
        
        <h1 className="text-3xl font-bold text-gray-900">Create New Course</h1>
        <p className="mt-2 text-gray-600">Share your knowledge by creating an engaging course.</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Course Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter course title"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Course Description *
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe what students will learn in this course"
              required
            />
          </div>

          <div>
            <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-2">
              Course Thumbnail URL *
            </label>
            <input
              type="url"
              id="thumbnail"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://example.com/image.jpg"
              required
            />
            
            <div className="mt-3">
              <p className="text-sm text-gray-600 mb-2">Sample thumbnails:</p>
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {sampleImages.map((url, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setThumbnail(url)}
                    className="flex-shrink-0 w-20 h-12 border border-gray-300 rounded-md overflow-hidden hover:border-blue-500 transition-colors duration-200"
                  >
                    <img src={url} alt={`Sample ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {thumbnail && (
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-2">Preview:</p>
                <img src={thumbnail} alt="Thumbnail preview" className="w-32 h-20 object-cover rounded-md border border-gray-300" />
              </div>
            )}
          </div>

          <div>
            <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 mb-2">
              Video URL (Cloudinary or YouTube) *
            </label>
            <input
              type="url"
              id="videoUrl"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://res.cloudinary.com/demo/video/upload/... or https://www.youtube.com/watch?v=..."
              required
            />
            
            <div className="mt-3">
              <p className="text-sm text-gray-600 mb-2">Sample video URLs:</p>
              <div className="space-y-1">
                {sampleVideos.map((url, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setVideoUrl(url)}
                    className="block w-full text-left text-sm text-blue-600 hover:text-blue-800 py-1 px-2 rounded hover:bg-blue-50 transition-colors duration-200"
                  >
                    Sample Video {index + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex space-x-4 pt-6">
            <button
              type="button"
              onClick={() => navigate('/my-courses')}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition-colors duration-200"
            >
              {isSubmitting ? 'Creating...' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateCourse; 