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
        } else if (line.startsWith('/uploads/')) {
          return <ImageWithFullScreen key={index} src={line} />;
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

interface ImageWithFullScreenProps {
  src: string;
}

const ImageWithFullScreen: React.FC<ImageWithFullScreenProps> = ({ src }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  return (
    <>
      {/* Image Thumbnail */}
      <div
        className=" flex relative h-[512px] w-full rounded-lg shadow-lg overflow-hidden cursor-pointer"
        onClick={() => setIsFullScreen(true)}
      >
        <Image
          src={src}
          alt="Project media"
          fill
          placeholder="blur"
          blurDataURL={`${src}?w=10&q=10`}
          className="object-cover object-center"
        />
      </div>

      {/* Full-Screen Modal */}
      {isFullScreen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
          onClick={() => setIsFullScreen(false)} // Close modal on click
        >
          <Image
            src={src}
            alt="Project media"
            fill
            className="object-contain object-center cursor-pointer"
          />
        </div>
      )}
    </>
  );
};

export default DescriptionRenderer;
