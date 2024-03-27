import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LolTimeFlash",
  description:
    "League of Legends Website Tool: Easily Time and Communicate Summoner Spells ⏰ THE FLASH! 🌟",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster />
        <div className="min-h-screen max-w-screen-lg mx-auto">{children}</div>
      </body>
    </html>
  );
}
