"use client";

import { useState, useEffect, memo } from "react";
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

interface NavLinkProps {
  href: string;
  icon: JSX.Element;
  children: React.ReactNode;
  external?: boolean; // Handle external links
}

const NavLink: React.FC<NavLinkProps> = memo(({ href, icon, children, external = false }) => (
  external ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center text-xl font-bold hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
    >
      {icon} <span className="ml-2">{children}</span>
    </a>
  ) : (
    <Link
      href={href}
      className="flex items-center text-xl font-bold hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
    >
      {icon} <span className="ml-2">{children}</span>
    </Link>
  )
));

NavLink.displayName = "NavLink";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [chatHref, setChatHref] = useState("#"); // Store the chat URL

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
      const identity = localStorage.getItem("identity") || "user"; // Default to "user" if not found
      const hashedIdentity = await hashIdentity(identity);
      const chatUrl = `http://154.44.25.125:3000?identity=${encodeURIComponent(hashedIdentity)}`;
      setChatHref(chatUrl); // Update the href state
    };

    generateChatHref();
  }, []);

  return (
    <nav
      className={`w-full p-4 flex items-center justify-between z-20 transform ${
        isScrolled
          ? "sticky top-0 bg-white/50 dark:bg-black/50 backdrop-blur-lg shadow-md text-gray-900 dark:text-gray-100"
          : "relative bg-white dark:bg-black text-gray-900 dark:text-gray-100 shadow-md"
      }`}
    >
      <div className="md:hidden flex items-center">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-2xl focus:outline-none"
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white dark:bg-black p-4 flex flex-col space-y-4 md:hidden">
          <NavLink href="/" icon={<FaHome />}>
            Home
          </NavLink>
          <NavLink href="/experiences" icon={<FaBriefcase />}>
            Experiences
          </NavLink>
          <NavLink href="/about" icon={<FaInfoCircle />}>
            About
          </NavLink>
        </div>
      )}

      <div className="hidden md:flex items-center space-x-8">
        <NavLink href="/" icon={<FaHome />}>
          Home
        </NavLink>
        <NavLink href="/experiences" icon={<FaBriefcase />}>
          Experiences
        </NavLink>
        <NavLink href="/about" icon={<FaInfoCircle />}>
          About
        </NavLink>
      </div>

      <div className="flex items-center space-x-4">
        <NavLink href={chatHref} icon={<FaComments />} external>
          Chat
        </NavLink>
        <Identity />
        <ThemeToggle />
      </div>
    </nav>
  );
}
