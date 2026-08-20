import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { HelloWorldLivingContent } from "@/components/marketing/hello-world-living/hello-world-living-content";
import { HelloWorldLivingFaq } from "@/components/marketing/hello-world-living/hello-world-living-faq";
import { JsonLd } from "@/components/seo/json-ld";
import { getHelloWorldLivingFaqs } from "@/src/constants/hello-world-living-faqs";
import {
  getBreadcrumbSchema,
  getFAQPageSchema,
  getPublicSiteUrl,
  getWebPageSchema,
} from "@/src/lib/schema";
import { helloWorldLivingPageCopy } from "@/src/tokens/hello-world-living";

const title = helloWorldLivingPageCopy.title;
const description = helloWorldLivingPageCopy.description;

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/hello-world-living",
  },
};

export default function HelloWorldLivingPage() {
  const baseUrl = getPublicSiteUrl();
  const faqs = getHelloWorldLivingFaqs(baseUrl);
  const schema = {
    webPage: getWebPageSchema({
      baseUrl,
      path: "hello-world-living",
      name: title,
      description,
    }),
    breadcrumb: getBreadcrumbSchema(baseUrl, [
      { name: "Home", path: "" },
      { name: "Hello World Living", path: "hello-world-living" },
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
        <HelloWorldLivingContent />
        <HelloWorldLivingFaq />
      </main>
      <SiteFooter />
    </div>
  );
}
