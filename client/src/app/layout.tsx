import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import AuthProvider from "@/components/providers/session-provider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "WASPY - AI-powered WhatsApp Support Platform",
    template: "%s | WASPY",
  },
  description:
    "Build, deploy, and scale AI-powered WhatsApp bots with our enterprise platform. Create intelligent support operations with no coding required.",
  keywords: [
    "WhatsApp",
    "AI",
    "chatbot",
    "customer support",
    "automation",
    "enterprise",
    "support platform",
  ],
  authors: [{ name: "WASPY Team" }],
  creator: "WASPY",
  publisher: "WASPY",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://waspy.ai"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "WASPY - AI-powered WhatsApp Support Platform",
    description:
      "Build, deploy, and scale AI-powered WhatsApp bots with our enterprise platform. Create intelligent support operations with no coding required.",
    siteName: "WASPY",
  },
  twitter: {
    card: "summary_large_image",
    title: "WASPY - AI-powered WhatsApp Support Platform",
    description:
      "Build, deploy, and scale AI-powered WhatsApp bots with our enterprise platform. Create intelligent support operations with no coding required.",
    creator: "@waspyai",
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
