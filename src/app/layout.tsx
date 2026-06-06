import type { Metadata } from "next";
import { Outfit, Inter, JetBrains_Mono, Arizonia } from "next/font/google";
import "./globals.css";

// Heading font
const outfit = Outfit({
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
const arizonia = Arizonia({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-cursive",
  display: "swap",
});

// METADATA
export const metadata: Metadata = {
  metadataBase: new URL("https://himanshu.be"),

  // Browser tab title
  title: {
    default: "Himanshu Sharma | The Coherent State",
    template: "%s | Himanshu Sharma"
  },

  // Search engine description
  description: "Personal portfolio of Himanshu Sharma, showcasing research in quantum computing, optics, and software development.",

  keywords: ["portfolio", "physicist", "developer", "quantum computing", "AI", "Cavity QED", "interpretability"],

  // Author info
  authors: [{ name: "Himanshu Sharma", url: "https://himanshu.be" }],
  creator: "Himanshu Sharma",

  // Canonical and Alternates
  alternates: {
    canonical: "/",
  },

  // Open Graph metadata (for social media sharing)
  openGraph: {
    title: "Himanshu Sharma | The Coherent State",
    description: "Physicist and Developer working at the intersection of quantum light-matter interaction and classical AI.",
    url: "https://himanshu.be",
    siteName: "Himanshu Sharma Portfolio",
    type: "website",
    locale: "en_US",
  },

  // Twitter metadata
  twitter: {
    card: "summary_large_image",
    title: "Himanshu Sharma | The Coherent State",
    description: "Physicist and Developer working at the intersection of quantum light-matter interaction and classical AI.",
    creator: "@blakktyger",
  },

  // Search robots control
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// ROOT LAYOUT COMPONENT

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">

      <body
        suppressHydrationWarning
        className={`
    ${outfit.variable} 
    ${inter.variable} 
    ${jetbrainsMono.variable}
    ${arizonia.variable}
    antialiased
  `}
      >
        <div className="noise-overlay fixed inset-0 pointer-events-none z-50 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>
        {children}
      </body>
    </html>
  );
}