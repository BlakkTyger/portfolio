import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono, Great_Vibes } from "next/font/google";
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

// Cursive font
const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-cursive",
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
    ${greatVibes.variable}
    antialiased
  `}
      >
        <div className="noise-overlay fixed inset-0 pointer-events-none z-50 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>
        {children}
      </body>
    </html>
  );
}