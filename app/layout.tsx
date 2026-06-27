import type { Metadata } from "next";
import { Cairo, Inter } from "next/font/google";
import "./globals.css";

const cairo = Cairo({ subsets: ["arabic", "latin"], variable: "--font-cairo" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "AHMED SHAWQI MANSOUR | Software Engineer & AI Portfolio",
  description:
    "Portfolio website for AHMED SHAWQI MANSOUR, Software Engineer, Backend and Full-Stack Developer, with AI Project Assistant for client requirement collection.",
  keywords: [
    "AHMED SHAWQI MANSOUR",
    "Software Engineer",
    "Backend Developer",
    "Full-Stack Developer",
    "Flutter",
    "Laravel",
    "AI Assistant",
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.variable} ${inter.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
