import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mindtrail - Your Thinking Companion for the Web",
  description: "Mindtrail helps you save, organize, and recall your tabs — so you can think clearly, work better, and never lose your place again.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#0a1122] text-white`}>
        {children}
        <Footer />
      </body>
    </html>
  );
}
