import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { MyVisitsAppDownload } from "@/components/visits/my-visits-app-download";
import { staticPageMetadata } from "@/src/lib/og-metadata";

export const metadata: Metadata = staticPageMetadata({
  title: "My Visits | HelloWorld",
  description:
    "Download the HelloWorld app to manage your property tours and visits.",
  url: "/my-visits",
});

export default function MyVisitsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <MyVisitsAppDownload />
      </main>
      <SiteFooter />
    </div>
  );
}
