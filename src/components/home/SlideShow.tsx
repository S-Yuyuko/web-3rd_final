'use client'; // Client-side component

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import Image from 'next/image';

type SlideShowProps = {
  pictures: { name: string; path: string }[];
};

const SlideShow = ({ pictures }: SlideShowProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const slideRef = useRef<HTMLDivElement | null>(null);

  // Automatically change slides every 5 seconds
  useEffect(() => {
    if (pictures.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % pictures.length);
    }, 5000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [pictures.length]);

  // Handle visibility on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.5 }
    );

    const currentSlideRef = slideRef.current;

    if (currentSlideRef) observer.observe(currentSlideRef);

    return () => {
      if (currentSlideRef) observer.unobserve(currentSlideRef);
    };
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((currentIndex + 1) % pictures.length);
  }, [currentIndex, pictures.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((currentIndex - 1 + pictures.length) % pictures.length);
  }, [currentIndex, pictures.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const currentSlide = useMemo(() => {
    if (!pictures[currentIndex]) return null;

    return (
      <div className="absolute inset-0">
        <Image
          src={pictures[currentIndex].path}
          alt={pictures[currentIndex].name}
          fill
          className="object-cover" // Center-cropped image
          priority
        />
      </div>
    );
  }, [currentIndex, pictures]);

  if (pictures.length === 0) {
    return <div>No pictures available</div>;
  }

  return (
    <div
      ref={slideRef}
      className={`relative w-full h-screen overflow-hidden transition-opacity duration-1000 ease-in-out transform ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {currentSlide}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 md:p-4 rounded-full"
        aria-label="Previous Slide"
      >
        &#10094;
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 md:p-4 rounded-full"
        aria-label="Next Slide"
      >
        &#10095;
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex space-x-2">
        {pictures.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 md:w-4 md:h-4 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-white scale-110' : 'bg-gray-400'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default SlideShow;
