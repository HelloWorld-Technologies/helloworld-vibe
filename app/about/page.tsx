import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { AboutPageContent } from "@/components/marketing/about/about-page-content";
import { JsonLd } from "@/components/seo/json-ld";
import { aboutPageCopy } from "@/src/tokens/about";
import {
  getBreadcrumbSchema,
  getPublicSiteUrl,
  getWebPageSchema,
} from "@/src/lib/schema";

const title = aboutPageCopy.title;
const description = aboutPageCopy.description;

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  const baseUrl = getPublicSiteUrl();
  const schema = {
    webPage: getWebPageSchema({
      baseUrl,
      path: "about",
      name: title,
      description,
    }),
    breadcrumb: getBreadcrumbSchema(baseUrl, [
      { name: "Home", path: "" },
      { name: "About Us", path: "about" },
    ]),
  };

  return (
    <div className="bg-white">
      <JsonLd schema={schema} />
      <SiteHeader />
      <main>
        <AboutPageContent />
      </main>
      <SiteFooter />
    </div>
  );
}
