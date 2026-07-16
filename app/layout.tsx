import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import { Toaster } from "sonner";

const nunito = localFont({
  src: "../fonts/Nunito-Variable.ttf",
  weight: "200 1000",
  variable: "--font-nunito",
  display: "swap",
});

const iranSansXV = localFont({
  src: "../fonts/IRANSansXV.ttf",
  weight: "100 900",
  variable: "--font-iranxv",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
});

export const metadata: Metadata = {
  title: "Yellow Hood App",
  description: "Yellow Hood App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${nunito.className} ${nunito.variable} ${iranSansXV.variable}`}>
        <Providers>
          <div className="min-h-screen bg-background text-foreground">
            <Navbar />
            <main className="container mx-auto px-4 py-8 pb-32">
              {children}
            </main>
            <BottomNav />
            <Toaster position="top-right" richColors />
          </div>
        </Providers>
      </body>
    </html>
  );
}

