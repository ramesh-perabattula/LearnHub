import React, { useState } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

function VideoPlayer({ videoUrl, title, onMarkCompleted, isCompleted = false }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const handleVideoEnd = () => {
    setIsPlaying(false);
    if (onMarkCompleted && !isCompleted) {
      onMarkCompleted();
    }
  };

  return (
    <div className="bg-black rounded-lg overflow-hidden">
      <video
        className="w-full h-64 md:h-96 object-cover"
        controls
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={handleVideoEnd}
        muted={isMuted}
        poster="https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&dpr=1"
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="bg-gray-900 text-white p-4">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                const video = document.querySelector('video');
                if (video) {
                  if (isPlaying) {
                    video.pause();
                  } else {
                    video.play();
                  }
                }
              }}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md transition-colors duration-200"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>
            <button
              onClick={() => {
                setIsMuted(!isMuted);
                const video = document.querySelector('video');
                if (video) {
                  video.muted = !isMuted;
                }
              }}
              className="p-2 hover:bg-gray-800 rounded-md transition-colors duration-200"
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
          </div>
          {onMarkCompleted && !isCompleted && (
            <button
              onClick={onMarkCompleted}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Mark as Completed
            </button>
          )}
          {isCompleted && (
            <div className="bg-green-600 px-4 py-2 rounded-md text-sm font-medium">
              ✓ Completed
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VideoPlayer; 