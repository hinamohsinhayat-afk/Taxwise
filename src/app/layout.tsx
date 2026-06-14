import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { FooterVisibility } from "@/components/layout/FooterVisibility";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TaxWise AI - Tax Software Recommendation Platform",
  description: "Canadian rule-based tax software recommendation wizard and conversational AI tax filing assistant powered by Groq llama-3.3-70b-versatile.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable}`} suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark">
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <FooterVisibility />
        </ThemeProvider>
      </body>
    </html>
  );
}
