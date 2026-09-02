import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { PrivacyPolicyContent } from "@/components/marketing/privacy-policy/privacy-policy-content";
import { PrivacyPolicyFaq } from "@/components/marketing/privacy-policy/privacy-policy-faq";
import { PrivacyPolicyHero } from "@/components/marketing/privacy-policy/privacy-policy-hero";
import { JsonLd } from "@/components/seo/json-ld";
import { staticPageMetadata } from "@/src/lib/og-metadata";
import { getPrivacyPolicyFaqs } from "@/src/constants/privacy-policy-faqs";
import {
  getBreadcrumbSchema,
  getFAQPageSchema,
  getPublicSiteUrl,
  getWebPageSchema,
} from "@/src/lib/schema";

const title = "Privacy Policy | HelloWorld Coliving & Student Hostels";
const description =
  "HelloWorld privacy policy. How we collect, use, and protect your personal information on our website and mobile app.";

export const metadata: Metadata = staticPageMetadata({
  title,
  description,
  url: "/policy",
  alternates: {
    canonical: "/policy",
  },
});

export default function PrivacyPolicyPage() {
  const baseUrl = getPublicSiteUrl();
  const faqs = getPrivacyPolicyFaqs(baseUrl);
  const schema = {
    webPage: getWebPageSchema({
      baseUrl,
      path: "policy",
      name: title,
      description,
    }),
    breadcrumb: getBreadcrumbSchema(baseUrl, [
      { name: "Home", path: "" },
      { name: "Privacy Policy", path: "policy" },
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
        <PrivacyPolicyHero />
        <PrivacyPolicyContent />
        <PrivacyPolicyFaq />
      </main>
      <SiteFooter />
    </div>
  );
}
