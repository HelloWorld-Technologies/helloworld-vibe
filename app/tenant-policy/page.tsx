import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { JsonLd } from "@/components/seo/json-ld";
import { TenantPolicyContent } from "@/components/marketing/tenant-policy/tenant-policy-content";
import { TenantPolicyFaq } from "@/components/marketing/tenant-policy/tenant-policy-faq";
import { TenantPolicyHero } from "@/components/marketing/tenant-policy/tenant-policy-hero";
import { staticPageMetadata } from "@/src/lib/og-metadata";
import { getTenantPolicyFaqs } from "@/src/constants/tenant-policy-faqs";
import {
  getBreadcrumbSchema,
  getFAQPageSchema,
  getPublicSiteUrl,
  getWebPageSchema,
} from "@/src/lib/schema";

const title = "Tenancy Policy | HelloWorld Coliving & Student Hostels";
const description =
  "HelloWorld tenancy policy. Rules, guidelines, and expectations for residents in our coliving and student housing spaces.";

export const metadata: Metadata = staticPageMetadata({
  title,
  description,
  url: "/tenant-policy",
  alternates: {
    canonical: "/tenant-policy",
  },
});

export default function TenantPolicyPage() {
  const baseUrl = getPublicSiteUrl();
  const faqs = getTenantPolicyFaqs(baseUrl);
  const schema = {
    webPage: getWebPageSchema({
      baseUrl,
      path: "tenant-policy",
      name: title,
      description,
    }),
    breadcrumb: getBreadcrumbSchema(baseUrl, [
      { name: "Home", path: "" },
      { name: "Tenancy Policy", path: "tenant-policy" },
    ]),
    faqPage: getFAQPageSchema(
      faqs.map((faq) => ({
        question: faq.question,
        answer: faq.answer,
      })),
    ),
  };

  return (
    <div className="bg-white">
      <JsonLd schema={schema} />
      <SiteHeader />
      <main>
        <TenantPolicyHero />
        <TenantPolicyContent />
        <TenantPolicyFaq />
      </main>
      <SiteFooter />
    </div>
  );
}
