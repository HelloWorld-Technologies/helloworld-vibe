import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { sitemapPageMetadata } from "@/src/lib/og-metadata";
import cities from "@/src/constants/cities";
import { SitemapListPage } from "@/components/sitemap/sitemap-list-page";
import {
  buildGeneratedAt,
  buildLandmarkSectionsForCity,
  fetchNearbyPlacesForCity,
  getPublicBaseUrl,
} from "@/src/lib/sitemap-pages/data.server";

export const revalidate = 86400;

type PageProps = {
  params: Promise<{ city: string }>;
};

function titleize(value: string): string {
  return String(value || "")
    .replace(/[-_]+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function generateStaticParams() {
  return cities.map((city) => ({ city: String(city).toLowerCase() }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city } = await params;
  const cityKey = String(city || "")
    .trim()
    .toLowerCase();
  const baseUrl = getPublicBaseUrl();
  const cityLabel = titleize(cityKey);
  const canonical = `${baseUrl}/sitemap/landmarks/${cityKey}`;
  return sitemapPageMetadata({
    title: `Sitemap: Landmarks in ${cityLabel} | HelloWorld`,
    description: `PG near landmarks, room for rent near landmarks, and Kota hostel-near URLs in ${cityLabel}, grouped by locality.`,
    canonical,
  });
}

export default async function LandmarkCitySitemapPage({ params }: PageProps) {
  const { city } = await params;
  const cityKey = String(city || "")
    .trim()
    .toLowerCase();
  if (!cityKey || !cities.includes(cityKey as (typeof cities)[number])) {
    notFound();
  }

  const baseUrl = getPublicBaseUrl();
  const { iso: generatedAtIso, text: generatedAtText } = buildGeneratedAt();
  const localities = await fetchNearbyPlacesForCity(cityKey);
  const sections = buildLandmarkSectionsForCity(cityKey, localities);
  const cityLabel = titleize(cityKey);

  return (
    <SitemapListPage
      baseUrl={baseUrl}
      canonicalPath={`/sitemap/landmarks/${cityKey}`}
      title={`Sitemap: Landmarks in ${cityLabel}`}
      description={`PG near landmarks, room for rent near landmarks, and Kota hostel-near URLs in ${cityLabel}, grouped by locality.`}
      generatedAtIso={generatedAtIso}
      generatedAtText={generatedAtText}
      sections={sections}
      headerRightLink={{
        href: "/sitemap/landmarks",
        label: "Back to landmark cities",
      }}
    />
  );
}
