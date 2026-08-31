import type { Metadata } from "next";
import { Caveat, Playfair_Display } from "next/font/google";
import localFont from "next/font/local";
import { WishlistProvider } from "@/components/wishlist/wishlist-provider";
import { getPublicSiteUrl } from "@/src/lib/schema";
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

const siteUrl = getPublicSiteUrl();
const DEFAULT_OG_IMAGE =
  "https://hw-prod-static-assets.s3.ap-south-1.amazonaws.com/marketing/share.jpg";
const DEFAULT_TITLE = "HelloWorld Coliving & Student Hostels";
const DEFAULT_DESCRIPTION =
  "HelloWorld provides coliving, student housing, coworking, social spaces and natural habitats to those exploring the evolution of humanity through positive impact.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: DEFAULT_TITLE,
    template: "%s | HelloWorld",
  },
  description: DEFAULT_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "HelloWorld",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: siteUrl,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
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
