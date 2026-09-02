import type { Metadata } from "next";
import { SitemapListPage } from "@/components/sitemap/sitemap-list-page";
import { sitemapPageMetadata } from "@/src/lib/og-metadata";
import {
  buildGenderLocalitySectionsByCity,
  buildGeneratedAt,
  fetchAllProperties,
  getPublicBaseUrl,
} from "@/src/lib/sitemap-pages/data.server";

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = getPublicBaseUrl();
  return sitemapPageMetadata({
    title: "Sitemap: Localities (gender-specific) | HelloWorld",
    description:
      "All gender-specific locality SRP URLs on HelloWorld (gents/ladies, boys/girls for Kota).",
    canonical: `${baseUrl}/sitemap/localities-gender`,
  });
}

export default async function GenderLocalitiesSitemapPage() {
  const baseUrl = getPublicBaseUrl();
  const { iso: generatedAtIso, text: generatedAtText } = buildGeneratedAt();
  const properties = await fetchAllProperties();
  const sections = buildGenderLocalitySectionsByCity(properties).map(
    (section, index) =>
      index === 0
        ? {
            ...section,
            rightLink: { href: "/sitemap", label: "Back to sitemap" },
          }
        : section,
  );

  return (
    <SitemapListPage
      baseUrl={baseUrl}
      canonicalPath="/sitemap/localities-gender"
      title="Sitemap: Localities (gender-specific)"
      description="All gender-specific locality SRP URLs on HelloWorld (gents/ladies, boys/girls for Kota)."
      generatedAtIso={generatedAtIso}
      generatedAtText={generatedAtText}
      sections={sections}
    />
  );
}
