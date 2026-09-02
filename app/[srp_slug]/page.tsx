import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { SrpPageContent } from "@/components/marketing/srp-page-content";
import {
  buildOpenGraph,
  buildTwitter,
  resolveSrpOgImage,
} from "@/src/lib/og-metadata";
import { resolveSrpPage } from "@/src/lib/srp/resolve-srp-page";
import { getPublicSiteUrl } from "@/src/lib/schema";
import PRESENT_CITIES from "@/src/constants/cities";
import { isKotaCity, srpSlug } from "@/src/lib/sitemap-slug";

export const revalidate = 60;

type PageProps = {
  params: Promise<{ srp_slug: string }>;
};

export async function generateStaticParams() {
  const paths = PRESENT_CITIES.flatMap((city) => {
    const base = srpSlug(city);
    if (isKotaCity(city)) {
      return [{ srp_slug: base }];
    }
    const cityKey = String(city).toLowerCase();
    return [
      { srp_slug: base },
      { srp_slug: `pg-in-${cityKey}` },
      { srp_slug: `gents-pg-in-${cityKey}` },
      { srp_slug: `ladies-pg-in-${cityKey}` },
      { srp_slug: `pg-for-boys-in-${cityKey}` },
      { srp_slug: `pg-for-girls-in-${cityKey}` },
    ];
  });

  paths.push(
    { srp_slug: "boys-hostels-in-kota" },
    { srp_slug: "girls-hostels-in-kota" },
  );

  return paths;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { srp_slug } = await params;
  const config = await resolveSrpPage(srp_slug);
  if (!config) return {};

  const baseUrl = getPublicSiteUrl();
  const canonicalUrl = `${baseUrl}/${config.canonicalPath}`;
  const ogImage = resolveSrpOgImage(config);
  return {
    title: config.pageTitle,
    description: config.pageMetaDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: buildOpenGraph({
      title: config.pageTitle,
      description: config.pageMetaDescription,
      url: canonicalUrl,
      image: ogImage,
    }),
    twitter: buildTwitter({
      title: config.pageTitle,
      description: config.pageMetaDescription,
      image: ogImage,
    }),
  };
}

export default async function DynamicSrpPage({ params }: PageProps) {
  const { srp_slug } = await params;
  const config = await resolveSrpPage(srp_slug);
  if (!config) notFound();
  return (
    <Suspense fallback={null}>
      <SrpPageContent config={config} />
    </Suspense>
  );
}
