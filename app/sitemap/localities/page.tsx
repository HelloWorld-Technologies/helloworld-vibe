import type { Metadata } from "next";
import { SitemapListPage } from "@/components/sitemap/sitemap-list-page";
import { sitemapPageMetadata } from "@/src/lib/og-metadata";
import {
  buildGeneratedAt,
  buildLocalitySectionsByCity,
  fetchAllProperties,
  getPublicBaseUrl,
} from "@/src/lib/sitemap-pages/data.server";

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = getPublicBaseUrl();
  return sitemapPageMetadata({
    title: "Sitemap: Localities | HelloWorld",
    description: "All locality SRP URLs on HelloWorld.",
    canonical: `${baseUrl}/sitemap/localities`,
  });
}

export default async function LocalitiesSitemapPage() {
  const baseUrl = getPublicBaseUrl();
  const { iso: generatedAtIso, text: generatedAtText } = buildGeneratedAt();
  const properties = await fetchAllProperties();
  const sections = buildLocalitySectionsByCity(properties);

  return (
    <SitemapListPage
      baseUrl={baseUrl}
      canonicalPath="/sitemap/localities"
      title="Sitemap: Localities"
      description="All locality SRP URLs on HelloWorld."
      generatedAtIso={generatedAtIso}
      generatedAtText={generatedAtText}
      headerRightLink={{ href: "/sitemap", label: "Back to sitemap" }}
      sections={sections}
    />
  );
}
