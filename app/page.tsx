import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { HomepageAppDownload } from "@/components/marketing/homepage-app-download";
import { HomepageBenefits } from "@/components/marketing/homepage-benefits";
import { HomepageFeed } from "@/components/marketing/homepage-feed";
import { HomepageHero } from "@/components/marketing/homepage-hero";
import { HomepagePress } from "@/components/marketing/homepage-press";
import { HomepageProperties } from "@/components/marketing/homepage-properties";
import { HomepageTestimonials } from "@/components/marketing/homepage-testimonials";
import { HomepageWeekends } from "@/components/marketing/homepage-weekends";
import { JsonLd } from "@/components/seo/json-ld";
import {
  getBreadcrumbSchema,
  getPublicSiteUrl,
  getWebPageSchema,
} from "@/src/lib/schema";

const title = "HelloWorld Coliving & Student Hostels";
const description =
  "HelloWorld provides coliving, student housing, coworking, social spaces and natural habitats to those exploring the evolution of humanity through positive impact.";

export const metadata: Metadata = {
  title: {
    absolute: title,
  },
  description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title,
    description,
    url: "/",
  },
};

export default function Home() {
  const baseUrl = getPublicSiteUrl();
  const schema = {
    webPage: getWebPageSchema({
      baseUrl,
      path: "",
      name: title,
      description,
    }),
    breadcrumb: getBreadcrumbSchema(baseUrl, [{ name: "Home", path: "" }]),
  };

  return (
    <div className="bg-white">
      <JsonLd schema={schema} />
      <SiteHeader variant="banner" />
      <HomepageHero />
      <HomepageBenefits />
      <main>
        <HomepageWeekends />
        <HomepageProperties />
        <HomepageTestimonials />
        <HomepagePress />
        <HomepageFeed />
        <HomepageAppDownload />
      </main>
      <SiteFooter />
    </div>
  );
}
