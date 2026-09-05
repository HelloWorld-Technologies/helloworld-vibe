import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HdpPageContent } from "@/components/marketing/hdp-page-content";
import { fetchPropertiesList } from "@/src/apis/hdp";
import {
  buildHdpStaticParamsFromProperties,
  resolveHdpPage,
} from "@/src/lib/hdp/resolve-hdp-page";
import { getPublicSiteUrl } from "@/src/lib/schema";
import type { Property } from "@/src/models/property";

export const revalidate = 120;
export const dynamicParams = true;

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
  const ogImage = config.view.galleryImages[0];

  return {
    title: config.pageTitle,
    description: config.pageMetaDescription,
    alternates: {
      canonical: `${baseUrl}/${config.canonicalPath}`,
    },
    openGraph: {
      title: config.pageTitle,
      description: config.pageMetaDescription,
      url: `${baseUrl}/${config.canonicalPath}`,
      type: "website",
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
  };
}

export default async function DynamicHdpPage({ params }: PageProps) {
  const { srp_slug, locality, hdp_slug } = await params;
  const config = await resolveHdpPage(srp_slug, locality, hdp_slug);
  if (!config) notFound();
  return <HdpPageContent config={config} />;
}
