"use client";
import Image from 'next/image';
import { useState } from 'react';

interface DescriptionRendererProps {
  content: string;
}

const DescriptionRenderer: React.FC<DescriptionRendererProps> = ({ content }) => {
  const lines = content.split('\n');

  return (
    <>
      {lines.map((line, index) => {
        if (line.startsWith('http://') || line.startsWith('https://')) {
          return (
            <a
              key={index}
              href={line}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 dark:text-blue-400 hover:underline"
            >
              {line}
            </a>
          );
        } else if (line.startsWith('/api/')) {
          return <MediaWithFullScreen key={index} src={line} />;
        } else {
          return (
            <p
              key={index}
              className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4"
            >
              {line}
            </p>
          );
        }
      })}
    </>
  );
};

interface MediaWithFullScreenProps {
  src: string;
}

const MediaWithFullScreen: React.FC<MediaWithFullScreenProps> = ({ src }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Helper function to determine if the file is a video based on extension
  const isVideo = (src: string) => {
    const videoExtensions = ['mp4', 'mov', 'avi', 'webm', 'ogg'];
  
    // Trim and sanitize the src to remove unwanted characters
    const cleanSrc = src.trim();  
    // Extract file extension, removing any non-alphanumeric characters
    const fileExtension = cleanSrc.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '');  
    // Check if the extension is one of the video extensions
    return videoExtensions.includes(fileExtension || '');
  };
  

  return (
    <>
      {/* Media Thumbnail */}
      <div
        className="flex relative h-[512px] w-full rounded-lg shadow-lg overflow-hidden cursor-pointer"
        onClick={() => setIsFullScreen(true)}
      >
        {isVideo(src) ? (
          <video 
            controls
            className="object-cover object-center w-full h-full"
            preload="metadata" // Preload video metadata to load faster
            poster="/default-poster.jpg" // Add a placeholder poster image
          >
            <source src={src} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <Image
            src={src}
            alt="Project media"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            placeholder="blur"
            blurDataURL={`${src}?w=10&q=10`}
            className="object-cover object-center"
          />
        )}
      </div>

      {/* Full-Screen Modal */}
      {isFullScreen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
          onClick={() => setIsFullScreen(false)} // Close modal on click
        >
          {isVideo(src) ? (
            <video 
              controls
              className="object-contain object-center w-full h-full"
              preload="metadata" // Preload video metadata to load faster
              poster="/default-poster.jpg" // Add a placeholder poster image  
            >
              <source src={src} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <Image
              src={src}
              alt="Project media"
              fill
              sizes="100vw"
              className="object-contain object-center cursor-pointer"
            />
          )}
        </div>
      )}
    </>
  );
};

export default DescriptionRenderer;
