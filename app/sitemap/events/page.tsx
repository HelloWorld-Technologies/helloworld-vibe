import type { Metadata } from "next";
import { SitemapListPage } from "@/components/sitemap/sitemap-list-page";
import { sitemapPageMetadata } from "@/src/lib/og-metadata";
import {
  buildEventLinks,
  buildGeneratedAt,
  fetchAllEvents,
  getPublicBaseUrl,
} from "@/src/lib/sitemap-pages/data.server";

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = getPublicBaseUrl();
  return sitemapPageMetadata({
    title: "Sitemap: Events | HelloWorld",
    description: "All event URLs on HelloWorld.",
    canonical: `${baseUrl}/sitemap/events`,
  });
}

export default async function EventsSitemapPage() {
  const baseUrl = getPublicBaseUrl();
  const { iso: generatedAtIso, text: generatedAtText } = buildGeneratedAt();
  const events = await fetchAllEvents();
  const eventLinks = buildEventLinks(events);

  return (
    <SitemapListPage
      baseUrl={baseUrl}
      canonicalPath="/sitemap/events"
      title="Sitemap: Events"
      description="All event URLs on HelloWorld."
      generatedAtIso={generatedAtIso}
      generatedAtText={generatedAtText}
      sections={[
        {
          title: "Events",
          items: eventLinks,
          rightLink: { href: "/sitemap", label: "Back to sitemap" },
        },
      ]}
    />
  );
}
