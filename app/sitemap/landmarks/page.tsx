import type { Metadata } from "next";
import { SitemapListPage } from "@/components/sitemap/sitemap-list-page";
import { sitemapPageMetadata } from "@/src/lib/og-metadata";
import {
  buildGeneratedAt,
  buildLandmarkCityIndexLinks,
  fetchNearbyPlacesGroupedByCity,
  getPublicBaseUrl,
} from "@/src/lib/sitemap-pages/data.server";

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = getPublicBaseUrl();
  return sitemapPageMetadata({
    title: "Sitemap: Landmarks | HelloWorld",
    description:
      "Landmark SRP URLs: PG near landmarks, room for rent near landmarks, and Kota hostel-near pages.",
    canonical: `${baseUrl}/sitemap/landmarks`,
  });
}

export default async function LandmarksSitemapPage() {
  const baseUrl = getPublicBaseUrl();
  const { iso: generatedAtIso, text: generatedAtText } = buildGeneratedAt();
  const groupedByCity = await fetchNearbyPlacesGroupedByCity();
  const cityLinks = buildLandmarkCityIndexLinks(groupedByCity);

  return (
    <SitemapListPage
      baseUrl={baseUrl}
      canonicalPath="/sitemap/landmarks"
      title="Sitemap: Landmarks"
      description="Landmark SRP URLs: PG near landmarks, room for rent near landmarks, and Kota hostel-near pages. Open a city to browse by locality."
      generatedAtIso={generatedAtIso}
      generatedAtText={generatedAtText}
      sections={[
        {
          title: "Cities",
          items: cityLinks,
          rightLink: { href: "/sitemap", label: "Back to sitemap" },
        },
      ]}
    />
  );
}
