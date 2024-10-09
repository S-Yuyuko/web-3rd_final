// src/app/layout.tsx
import { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import Navbar from "@/components/header/Navbar";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer"; // Import the Footer component

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WU Zhe (Warren)",
  description: "Welcome to WU Zhe (Warren)'s personal website. Explore my portfolio, projects, and insights on web development and design.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get the theme from cookies with SSR
  const theme = cookies().get("theme")?.value === "dark" ? "dark" : "light";

  return (
    <html lang="en" className={theme}>
      <body className={`${inter.className} min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100`}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Contact />
        <Footer /> {/* Add the Footer component here */}
      </body>
    </html>
  );
}
