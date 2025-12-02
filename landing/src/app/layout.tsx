import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // Agar sizda global css bo'lsa

// Fontni sozlash (agar sizda default font bo'lsa)
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Security Developer",
  description: "Corporate technology company website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // html ga suppressHydrationWarning qo'shilgan
    <html lang="en" suppressHydrationWarning>
      <body 
        className={inter.className} 
        suppressHydrationWarning={true} // <-- MUHIM: Bu yerni ham qo'shing
      >
        {children}
      </body>
    </html>
  );
}