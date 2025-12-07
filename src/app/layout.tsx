import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Heading font
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",  // Use as var(--font-heading) in CSS
  display: "swap",
});

// Body font
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

// Code font
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

// METADATA
export const metadata: Metadata = {
  // Browser tab title
  title: "Himanshu Sharma | The Coherent State",

  // Search engine description
  description: "Personal portfolio showcasing physics research and software development",

  keywords: ["portfolio", "physicist", "developer", "quantum computing", "AI"],

  // Author info
  authors: [{ name: "Himanshu Sharma" }],

  // Open Graph metadata (for social media sharing)
  openGraph: {
    title: "Himanshu Sharma | Personal Portfolio",
    description: "Physicist, Developer, Philosopher",
    type: "website",
  },
};

// ROOT LAYOUT COMPONENT

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="no-scrollbar">

      <body
        suppressHydrationWarning
        className={`
    ${spaceGrotesk.variable} 
    ${inter.variable} 
    ${jetbrainsMono.variable}
    antialiased
  `}
      >
        {children}
      </body>
    </html>
  );
}