import type { Metadata } from "next";
import { staticPageMetadata } from "@/src/lib/og-metadata";

export const metadata: Metadata = {
  ...staticPageMetadata({
    title: "Development | HelloWorld",
    description: "Internal development pages for HelloWorld.",
  }),
  robots: {
    index: false,
    follow: false,
  },
};

export default function DevelopmentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
