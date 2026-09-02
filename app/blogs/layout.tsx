import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { staticPageMetadata } from "@/src/lib/og-metadata";

export const metadata: Metadata = {
  ...staticPageMetadata({
    title: "Blogs | HelloWorld",
    description:
      "Guides and updates on coliving, student housing, and living better with HelloWorld.",
    url: "/blogs",
  }),
  robots: { index: true, follow: true },
};

export default function BlogsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-white">
      <SiteHeader variant="banner" />
      {children}
      <SiteFooter />
    </div>
  );
}
