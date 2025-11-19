import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
  ClerkProvider
} from '@clerk/nextjs'
import { Toaster } from 'sonner';


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "NexusCreate - AI-Powered Video & Image Tools",
  description: "NexusCreate offers AI-driven tools to compress videos, generate captions, create social media posts, and resize images effortlessly.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      signInFallbackRedirectUrl="/onboarding"
      signUpFallbackRedirectUrl="/onboarding"
      signInForceRedirectUrl="/onboarding"
      signUpForceRedirectUrl="/onboarding"
    >

    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster richColors position="top-right" />

      </body>
    </html>
    </ClerkProvider>
  );
}
