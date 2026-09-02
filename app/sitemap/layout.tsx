import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { staticPageMetadata } from "@/src/lib/og-metadata";

export const metadata: Metadata = {
  ...staticPageMetadata({
    title: "Sitemap | HelloWorld",
    description: "Browse HelloWorld URLs grouped by section.",
    url: "/sitemap",
  }),
  robots: { index: true, follow: true },
};

export default function SitemapLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="bg-white">
      <SiteHeader variant="banner" />
      {children}
      <SiteFooter />
    </div>
  );
}
