import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { InvestorsPageContent } from "@/components/marketing/investors/investors-page-content";
import { JsonLd } from "@/components/seo/json-ld";
import {
  getBreadcrumbSchema,
  getPublicSiteUrl,
  getWebPageSchema,
} from "@/src/lib/schema";
import { staticPageMetadata } from "@/src/lib/og-metadata";
import { investorsPageCopy } from "@/src/tokens/investors";

const title = investorsPageCopy.title;
const description = investorsPageCopy.description;

export const metadata: Metadata = staticPageMetadata({
  title,
  description,
  url: "/investors",
  alternates: {
    canonical: "/investors",
  },
});

export default function InvestorsPage() {
  const baseUrl = getPublicSiteUrl();
  const schema = {
    webPage: getWebPageSchema({
      baseUrl,
      path: "investors",
      name: title,
      description,
    }),
    breadcrumb: getBreadcrumbSchema(baseUrl, [
      { name: "Home", path: "" },
      { name: "Investors", path: "investors" },
    ]),
  };

  return (
    <div className="bg-white">
      <JsonLd schema={schema} />
      <SiteHeader />
      <main>
        <InvestorsPageContent />
      </main>
      <SiteFooter />
    </div>
  );
}
