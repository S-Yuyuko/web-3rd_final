import { getDictionary, SupportedLocales } from '@/app/[lang]/dictionaries'; // Adjust the path as necessary

interface FooterProps {
  lang: string; // Language parameter
}

const Footer = async ({ lang }: FooterProps) => {
  // Ensure the lang is a valid locale, otherwise default to 'en'
  const supportedLang: SupportedLocales = ['en', 'zh'].includes(lang) ? (lang as SupportedLocales) : 'en';

  const dict = await getDictionary(supportedLang); // Fetch the dictionary based on the locale

  return (
    <footer className="bg-gray-100 dark:bg-gray-800 text-center p-4">
      <p className="text-gray-800 dark:text-gray-300">
        &copy; {new Date().getFullYear()} {dict.footer_text} {/* Dynamically load footer text */}
      </p>
    </footer>
  );
};

export default Footer;
