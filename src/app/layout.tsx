import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "aiGuide – Career Guidance for Indian Students",
  description:
    "AI-powered career guidance platform for Indian students in Class 6–12. Discover your ideal career path through scientific assessments.",
  keywords: [
    "career guidance",
    "India",
    "students",
    "aptitude test",
    "career counseling",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
