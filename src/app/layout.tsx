import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import AppWalletProvider from "../components/AppWalletProvider";
import AppNavbar from "@/components/navbar";
import { NextUIProvider } from "@nextui-org/react";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "sol-pr | Bounty Generator",
  description: "Generate bounty for your github repository",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppWalletProvider>
          <NextUIProvider>
            <main className="dark text-foreground bg-background purple-dark">
              <AppNavbar />
              {children}
            </main>
          </NextUIProvider>
        </AppWalletProvider>
      </body>
    </html>
  );
}
