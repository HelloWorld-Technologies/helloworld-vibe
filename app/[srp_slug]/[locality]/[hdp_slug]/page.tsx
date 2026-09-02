import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HdpPageContent } from "@/components/marketing/hdp-page-content";
import { fetchPropertiesList } from "@/src/apis/hdp";
import {
  buildHdpStaticParamsFromProperties,
  resolveHdpPage,
} from "@/src/lib/hdp/resolve-hdp-page";
import {
  buildOpenGraph,
  buildTwitter,
  resolveOgImageUrl,
} from "@/src/lib/og-metadata";
import { getPublicSiteUrl } from "@/src/lib/schema";
import type { Property } from "@/src/models/property";

export const revalidate = 120;

type PageProps = {
  params: Promise<{
    srp_slug: string;
    locality: string;
    hdp_slug: string;
  }>;
};

export async function generateStaticParams() {
  const response = await fetchPropertiesList();
  if (!response?.success || !Array.isArray(response.data)) {
    return [];
  }
  return buildHdpStaticParamsFromProperties(response.data as Property[]).slice(
    0,
    100,
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { srp_slug, locality, hdp_slug } = await params;
  const config = await resolveHdpPage(srp_slug, locality, hdp_slug);
  if (!config) return {};

  const baseUrl = getPublicSiteUrl();
  const canonicalUrl = `${baseUrl}/${config.canonicalPath}`;
  const ogImage = resolveOgImageUrl(config.view.galleryImages[0]);

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

export default async function DynamicHdpPage({ params }: PageProps) {
  const { srp_slug, locality, hdp_slug } = await params;
  const config = await resolveHdpPage(srp_slug, locality, hdp_slug);
  if (!config) notFound();
  return <HdpPageContent config={config} />;
}
