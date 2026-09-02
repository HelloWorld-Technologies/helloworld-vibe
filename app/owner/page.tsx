import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { HomeownersPageContent } from "@/components/marketing/homeowners/homeowners-page-content";
import { JsonLd } from "@/components/seo/json-ld";
import { staticPageMetadata } from "@/src/lib/og-metadata";
import { homeownersPageCopy } from "@/src/tokens/homeowners";
import {
  getBreadcrumbSchema,
  getPublicSiteUrl,
  getWebPageSchema,
} from "@/src/lib/schema";

const title = homeownersPageCopy.title;
const description = homeownersPageCopy.description;

export const metadata: Metadata = staticPageMetadata({
  title,
  description,
  url: "/owner",
  alternates: {
    canonical: "/owner",
  },
});

export default function OwnerPage() {
  const baseUrl = getPublicSiteUrl();
  const schema = {
    webPage: getWebPageSchema({
      baseUrl,
      path: "owner",
      name: title,
      description,
    }),
    breadcrumb: getBreadcrumbSchema(baseUrl, [
      { name: "Home", path: "" },
      { name: "For Homeowners", path: "owner" },
    ]),
  };

  return (
    <div className="bg-white">
      <JsonLd schema={schema} />
      <SiteHeader />
      <main>
        <HomeownersPageContent />
      </main>
      <SiteFooter />
    </div>
  );
}
