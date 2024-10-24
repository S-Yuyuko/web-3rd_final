"use client";

import { useState } from 'react';
import { FaGlobe } from 'react-icons/fa';
import { usePathname, useSearchParams, useRouter } from 'next/navigation'; // Hooks from 'next/navigation'

const LanguageSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false); // To toggle the submenu
  const pathname = usePathname(); // Get current path
  const searchParams = useSearchParams(); // Get query parameters
  const router = useRouter(); // For navigation

  // Get locale from URL or use a default (assuming your URLs have locales)
  const locale = pathname.split('/')[1] || 'en';

  // Toggle submenu visibility
  const toggleSubmenu = () => {
    setIsOpen(!isOpen);
  };

  // Handle language switching and update the URL with the new locale
  const switchLanguage = (lang: string) => {
    const newPathname = `/${lang}${pathname.slice(3)}`; // Update the locale in the pathname
    router.push(newPathname + searchParams.toString()); // Navigate to the new locale
    setIsOpen(false); // Close the submenu after selecting
  };

  return (
    <div className="relative inline-block text-left">
      {/* Button to toggle the language submenu */}
      <button onClick={toggleSubmenu} className="flex items-center space-x-2 focus:outline-none">
        <FaGlobe className="text-2xl" />
        <span suppressHydrationWarning>{locale === 'zh' ? '中文' : 'English'}</span>
      </button>

      {/* Submenu for language options */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-white border rounded-md shadow-lg">
          <ul className="py-1">
            <li>
              <button
                onClick={() => switchLanguage('en')}
                className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-200 ${
                  locale === 'en' ? 'font-bold text-blue-600' : ''
                }`}
              >
                English
              </button>
            </li>
            <li>
              <button
                onClick={() => switchLanguage('zh')}
                className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-200 ${
                  locale === 'zh' ? 'font-bold text-blue-600' : ''
                }`}
              >
                中文
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
