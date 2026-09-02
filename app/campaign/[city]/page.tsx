import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CampaignPageContent } from "@/components/marketing/campaign/campaign-page-content";
import { JsonLd } from "@/components/seo/json-ld";
import {
  CAMPAIGN_CITY_SLUGS,
  type CampaignCitySlug,
} from "@/src/constants/campaign-prices";
import { getCampaignCityName } from "@/src/tokens/campaign";
import {
  buildOpenGraph,
  buildTwitter,
  PAGE_OG_IMAGES,
  staticPageMetadata,
} from "@/src/lib/og-metadata";
import { getPublicSiteUrl, getBreadcrumbSchema, getWebPageSchema } from "@/src/lib/schema";

type PageProps = {
  params: Promise<{ city: string }>;
};

function isCampaignCitySlug(city: string): city is CampaignCitySlug {
  return (CAMPAIGN_CITY_SLUGS as readonly string[]).includes(city);
}

export async function generateStaticParams() {
  return CAMPAIGN_CITY_SLUGS.map((city) => ({ city }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city } = await params;
  if (!isCampaignCitySlug(city)) {
    return staticPageMetadata({
      title: "Page Not Found | HelloWorld",
      description: "The requested campaign page could not be found.",
    });
  }

  const cityName = getCampaignCityName(city);
  const title =
    city === "kota"
      ? `Luxury Stay in ${cityName} | HelloWorld`
      : `Coliving PG in ${cityName} | HelloWorld`;
  const description =
    city === "kota"
      ? `Find luxury private rooms and 1BHK stays in ${cityName}. HelloWorld offers furnished rooms and flexible stays.`
      : `Find coliving spaces in ${cityName}. HelloWorld offers furnished rooms, community living and flexible stays.`;

  return {
    title,
    description,
    robots: { index: false, follow: true },
    alternates: {
      canonical: `/campaign/${city}`,
    },
    openGraph: buildOpenGraph({
      title,
      description,
      url: `/campaign/${city}`,
      image: PAGE_OG_IMAGES.campaign,
    }),
    twitter: buildTwitter({
      title,
      description,
      image: PAGE_OG_IMAGES.campaign,
    }),
  };
}

export default async function CampaignCityPage({ params }: PageProps) {
  const { city } = await params;
  if (!isCampaignCitySlug(city)) notFound();

  const cityName = getCampaignCityName(city);
  const baseUrl = getPublicSiteUrl();
  const title =
    city === "kota"
      ? `Luxury Stay in ${cityName} | HelloWorld`
      : `Coliving PG in ${cityName} | HelloWorld`;
  const description =
    city === "kota"
      ? `Find luxury private rooms and 1BHK stays in ${cityName}. HelloWorld offers furnished rooms and flexible stays.`
      : `Find coliving spaces in ${cityName}. HelloWorld offers furnished rooms, community living and flexible stays.`;

  return (
    <>
      <JsonLd
        schema={{
          webPage: getWebPageSchema({
            baseUrl,
            path: `campaign/${city}`,
            name: title,
            description,
          }),
          breadcrumb: getBreadcrumbSchema(baseUrl, [
            { name: "Home", path: "" },
            { name: cityName, path: `campaign/${city}` },
          ]),
        }}
      />
      <CampaignPageContent citySlug={city} />
    </>
  );
}
