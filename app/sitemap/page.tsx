import type { Metadata } from "next";
import Link from "next/link";
import { SitemapListPage } from "@/components/sitemap/sitemap-list-page";
import {
  buildBlogLinks,
  buildCityLinks,
  buildGenderLocalityLinks,
  buildGeneratedAt,
  buildLandmarkLinks,
  buildLocalityLinks,
  buildPropertyLinks,
  buildStaticLinks,
  fetchAllProperties,
  fetchNearbyPlacesByCity,
  getPublicBaseUrl,
} from "@/src/lib/sitemap-pages/data.server";

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = getPublicBaseUrl();
  return {
    title: "Sitemap | HelloWorld",
    description: "Browse HelloWorld URLs grouped by section.",
    alternates: { canonical: `${baseUrl}/sitemap` },
  };
}

export default async function SitemapPage() {
  const baseUrl = getPublicBaseUrl();
  const { iso: generatedAtIso, text: generatedAtText } = buildGeneratedAt();

  const [properties, landmarks] = await Promise.all([
    fetchAllProperties(),
    fetchNearbyPlacesByCity(),
  ]);

  const staticLinks = buildStaticLinks();
  const cityLinks = buildCityLinks();
  const propertyLinks = buildPropertyLinks(properties);
  const blogLinks = buildBlogLinks();
  const localityLinks = buildLocalityLinks(properties);
  const genderLocalityLinks = buildGenderLocalityLinks(properties);
  const landmarkLinks = buildLandmarkLinks(landmarks);

  const sitemapLinks = [
    { href: "/sitemap/blogs", label: "Blogs", count: blogLinks.length },
    {
      href: "/sitemap/landmarks",
      label: "Landmarks",
      count: landmarkLinks.length,
    },
    {
      href: "/sitemap/localities",
      label: "Localities",
      count: localityLinks.length,
    },
    {
      href: "/sitemap/localities-gender",
      label: "Localities (gender-specific)",
      count: genderLocalityLinks.length,
    },
  ];

  const sections = [
    {
      title: "Sitemap sections",
      items: sitemapLinks.map((x) => ({
        href: x.href,
        label:
          x.count != null
            ? `${x.label} (${x.count.toLocaleString()})`
            : x.label,
      })),
    },
    { title: "Static pages", items: staticLinks },
    { title: "City pages", items: cityLinks },
    { title: "Property pages", items: propertyLinks },
  ];

  return (
    <SitemapListPage
      baseUrl={baseUrl}
      canonicalPath="/sitemap"
      title="Sitemap"
      description="Browse HelloWorld URLs grouped by section."
      generatedAtIso={generatedAtIso}
      generatedAtText={generatedAtText}
      sections={sections}
      footerNote={
        <p className="text-xs text-gray-500">
          Tip: You can also visit{" "}
          <Link className="underline" href="/sitemap.xml">
            /sitemap.xml
          </Link>{" "}
          (XML) for crawlers.
        </p>
      }
    />
  );
}
