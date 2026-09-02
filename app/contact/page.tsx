import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ContactFaq } from "@/components/marketing/contact/contact-faq";
import { ContactPageContent } from "@/components/marketing/contact/contact-page-content";
import { JsonLd } from "@/components/seo/json-ld";
import { staticPageMetadata } from "@/src/lib/og-metadata";
import { getContactFaqs } from "@/src/constants/contact-faqs";
import {
  getBreadcrumbSchema,
  getFAQPageSchema,
  getPublicSiteUrl,
  getWebPageSchema,
} from "@/src/lib/schema";

const title = "Contact Us | HelloWorld Coliving & Student Hostels";
const description =
  "Have a question, need assistance, or want to explore a partnership? Contact HelloWorld by phone, email, or request a callback.";

export const metadata: Metadata = staticPageMetadata({
  title,
  description,
  url: "/contact",
  alternates: {
    canonical: "/contact",
  },
});

export default function ContactPage() {
  const baseUrl = getPublicSiteUrl();
  const faqs = getContactFaqs(baseUrl);
  const schema = {
    webPage: getWebPageSchema({
      baseUrl,
      path: "contact",
      name: title,
      description,
    }),
    breadcrumb: getBreadcrumbSchema(baseUrl, [
      { name: "Home", path: "" },
      { name: "Contact Us", path: "contact" },
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
        <ContactPageContent />
        <ContactFaq />
      </main>
      <SiteFooter />
    </div>
  );
}
