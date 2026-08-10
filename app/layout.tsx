import type { Metadata } from "next";
import { Caveat, Playfair_Display } from "next/font/google";
import localFont from "next/font/local";
import { WishlistProvider } from "@/components/wishlist/wishlist-provider";
import "./globals.css";

const satoshi = localFont({
  src: [
    { path: "../public/fonts/Satoshi-Regular.woff2", weight: "400" },
    { path: "../public/fonts/Satoshi-Medium.woff2", weight: "500" },
    { path: "../public/fonts/Satoshi-Bold.woff2", weight: "700" },
    { path: "../public/fonts/Satoshi-Black.woff2", weight: "900" },
  ],
  variable: "--font-satoshi",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat-hand",
  display: "swap",
});

export const metadata: Metadata = {
  title: "HelloWorld — Coliving that Matches Your Vibe",
  description:
    "Find premium coliving PGs across India. Just 1 month deposit, minimum lock-in, no brokerage, and instant move-in.",
  icons: {
    icon: [
      { url: "/assets/logos/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${satoshi.variable} ${playfair.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white font-satoshi text-gray-900">
        <WishlistProvider>{children}</WishlistProvider>
      </body>
    </html>
  );
}
