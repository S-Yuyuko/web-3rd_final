"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  FaHome, 
  FaInfoCircle, 
  FaBriefcase, 
  FaComments, 
  FaBars, 
  FaTimes 
} from "react-icons/fa";
import ThemeToggle from "./ThemeToggle";
import Identity from "./Identity";
import LanguageSwitcher from "../LanguageSwitcher";
import { getDictionary, SupportedLocales } from '@/app/[lang]/dictionaries'; // Import dictionary and supported locales

interface NavLinkProps {
  href: string;
  icon: JSX.Element;
  children: React.ReactNode;
  external?: boolean; // Handle external links
}

interface NavbarProps {
  lang: string; // Ensure lang is of type SupportedLocales
}

const NavLink: React.FC<NavLinkProps> = ({ href, icon, children, external = false }) => (
  external ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center w-38 h-12 text-xl font-bold hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
    >
      {icon} <span className="ml-2">{children}</span>
    </a>
  ) : (
    <Link
      href={href}
      className="flex items-center justify-center w-38 h-12 text-xl font-bold hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
    >
      {icon} <span className="ml-2">{children}</span>
    </Link>
  )
);


export default function Navbar({ lang }: NavbarProps) { 
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [chatHref, setChatHref] = useState("#");
  const [dictionary, setDictionary] = useState<Record<string, string>>({}); // Store the dictionary

  // Load the translations based on the current language
  useEffect(() => {
    const loadDictionary = async () => {
      const supportedLang: SupportedLocales = ['en', 'zh'].includes(lang) ? (lang as SupportedLocales) : 'en';
      const dict = await getDictionary(supportedLang); // Fetch dictionary based on lang
      setDictionary(dict); // Set the dictionary for use in translations
    };
    loadDictionary();
  }, [lang]);

  // Handle scroll effect for sticky header
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Utility function to hash the identity
  async function hashIdentity(identity: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(identity);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  }

  // Generate the chat link with the hashed identity
  useEffect(() => {
    const generateChatHref = async () => {
      const identity = localStorage.getItem("identity") || "user";
      const hashedIdentity = await hashIdentity(identity);
      const chatUrl = `http://154.44.25.125:3000?identity=${encodeURIComponent(hashedIdentity)}`;
      setChatHref(chatUrl);
    };

    generateChatHref();
  }, []);

  return (
    <nav
      className={`w-full p-2 flex items-center justify-between z-20 transform ${
        isScrolled
          ? "sticky top-0 bg-white/50 dark:bg-black/50 backdrop-blur-lg shadow-md text-gray-900 dark:text-gray-100"
          : "relative bg-white dark:bg-black text-gray-900 dark:text-gray-100 shadow-md"
      }`}
    >
      <div className="md:hidden flex items-center">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-2xl focus:outline-none"
          aria-label={isMenuOpen ? dictionary.navbar_close_menu : dictionary.navbar_toggle_menu}
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="absolute left-0 w-full bg-white dark:bg-black flex flex-col space-y-4 md:hidden">
          <NavLink href="/" icon={<FaHome />}>
            {dictionary.navbar_home}
          </NavLink>
          <NavLink href="/experiences" icon={<FaBriefcase />}>
            {dictionary.navbar_experiences}
          </NavLink>
          <NavLink href="/about" icon={<FaInfoCircle />}>
            {dictionary.navbar_about}
          </NavLink>
          <NavLink href={chatHref} icon={<FaComments />} external>
            {dictionary.navbar_chat}
          </NavLink>
        </div>
      )}


      <div className="hidden md:flex items-center justify-between space-x-8">
        <NavLink href="/" icon={<FaHome />}>
          {dictionary.navbar_home}
        </NavLink>
        <NavLink href="/experiences" icon={<FaBriefcase />}>
          {dictionary.navbar_experiences}
        </NavLink>
        <NavLink href="/about" icon={<FaInfoCircle />}>
          {dictionary.navbar_about}
        </NavLink>
        <NavLink href={chatHref} icon={<FaComments />} external>
          {dictionary.navbar_chat}
        </NavLink>
      </div>


      <div className="flex items-center space-x-4">
        <div className="flex items-center justify-center">
          <Identity />
        </div>
        <div className="flex items-center justify-center">
          <ThemeToggle />
        </div>
        <div className="flex items-center justify-center w-24 h-12">
          <LanguageSwitcher />
        </div>
      </div>

    </nav>
  );
}
