"use client"; // Ensure this component is treated as a client-side component

import { useState } from 'react';
import Image from 'next/image';
import { FaTimes, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

interface MediaGalleryProps {
  mediaUrls?: string[]; // Optional prop in case it's not passed correctly
}

const MediaGallery: React.FC<MediaGalleryProps> = ({ mediaUrls = [] }) => { // Default to an empty array
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number | null>(null);

  // Function to check if a file is a video based on its extension
  const isVideo = (src: string) => {
    const videoExtensions = ['mp4', 'mov', 'avi', 'webm', 'ogg']; 
    // Trim and sanitize the src to remove unwanted characters
    const cleanSrc = src.trim();  
    // Extract file extension, removing any non-alphanumeric characters
    const fileExtension = cleanSrc.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '');  
    // Check if the extension is one of the video extensions
    return videoExtensions.includes(fileExtension || '');
  };

  const openMedia = (index: number) => {
    setSelectedMediaIndex(index);
  };

  const closeMedia = () => {
    setSelectedMediaIndex(null);
  };

  const showPrevMedia = () => {
    if (selectedMediaIndex !== null && selectedMediaIndex > 0) {
      setSelectedMediaIndex(selectedMediaIndex - 1);
    }
  };

  const showNextMedia = () => {
    if (selectedMediaIndex !== null && selectedMediaIndex < mediaUrls.length - 1) {
      setSelectedMediaIndex(selectedMediaIndex + 1);
    }
  };

  return (
    <>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Media</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {mediaUrls.map((url: string, index: number) => (
            <div
              key={index}
              className="relative w-full h-48 cursor-pointer"
              onClick={() => openMedia(index)}
            >
              {isVideo(url) ? (
                <video
                  className="w-full h-full object-cover rounded-md"
                  src={url}
                  muted
                  loop
                  playsInline
                />
              ) : (
                <Image
                  src={url}
                  alt={`Media ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: 'cover' }}
                  className="rounded-md"
                  priority={index === 0}
                />
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Fullscreen Media Modal */}
      {selectedMediaIndex !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 z-30 flex justify-center items-center"
          onClick={closeMedia}
        >
          <div className="relative w-full h-full">
            {isVideo(mediaUrls[selectedMediaIndex]) ? (
              <video
                className="w-full h-full object-contain rounded-md"
                src={mediaUrls[selectedMediaIndex]}
                controls
                autoPlay
              />
            ) : (
              <Image
                src={mediaUrls[selectedMediaIndex]}
                alt="Full size"
                fill
                sizes="100vw"
                style={{ objectFit: 'contain' }}
                className="rounded-md"
              />
            )}
          </div>

          <button
            onClick={closeMedia}
            className="absolute top-4 right-4 rounded-full p-2 focus:outline-none text-white"
          >
            <FaTimes className="w-6 h-6" />
          </button>
          {selectedMediaIndex > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                showPrevMedia();
              }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-2xl"
            >
              <FaArrowLeft />
            </button>
          )}
          {selectedMediaIndex < mediaUrls.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                showNextMedia();
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-2xl"
            >
              <FaArrowRight />
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default MediaGallery;
