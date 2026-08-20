import type { Metadata } from "next";
import { Suspense } from "react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ReferFaq } from "@/components/marketing/refer/refer-faq";
import { ReferRedirect } from "@/components/marketing/refer/refer-redirect";
import { JsonLd } from "@/components/seo/json-ld";
import { getReferFaqs } from "@/src/constants/refer-faqs";
import {
  getBreadcrumbSchema,
  getFAQPageSchema,
  getPublicSiteUrl,
  getWebPageSchema,
} from "@/src/lib/schema";
import { pageLayout } from "@/src/tokens/layout";

const title = "Refer & Earn | HelloWorld Coliving & Student Hostels";
const description =
  "Refer friends to HelloWorld and earn rewards. Share coliving and student housing with your network.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/refer",
  },
};

function ReferRedirectFallback() {
  return (
    <section className={`${pageLayout.container} py-16 md:py-24`}>
      <p className="text-center text-lg text-gray-700">
        Preparing your referral…
      </p>
    </section>
  );
}

export default function ReferPage() {
  const baseUrl = getPublicSiteUrl();
  const faqs = getReferFaqs(baseUrl);
  const schema = {
    webPage: getWebPageSchema({
      baseUrl,
      path: "refer",
      name: title,
      description,
    }),
    breadcrumb: getBreadcrumbSchema(baseUrl, [
      { name: "Home", path: "" },
      { name: "Refer & Earn", path: "refer" },
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
        <Suspense fallback={<ReferRedirectFallback />}>
          <ReferRedirect />
        </Suspense>
        <ReferFaq />
      </main>
      <SiteFooter />
    </div>
  );
}
