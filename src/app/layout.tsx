import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StartGerman — Master German A1–A2",
  description: "AI-powered German learning platform with Goethe-aligned curriculum, spaced repetition, and real conversation practice.",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col relative">
        {/* Ambient background glow - Optimized for 60fps with CSS radial gradients instead of heavy blur filters */}
        <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full opacity-30" 
               style={{ background: 'radial-gradient(circle at center, rgba(245, 158, 11, 0.15) 0%, transparent 70%)' }} />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full opacity-30" 
               style={{ background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.15) 0%, transparent 70%)' }} />
        </div>
        <div className="relative z-10 flex-1 flex flex-col">{children}</div>
      </body>
    </html>
  );
}
