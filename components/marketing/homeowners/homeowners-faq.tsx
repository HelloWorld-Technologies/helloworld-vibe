import { FaqAccordion } from "@/components/ui/faq-accordion";
import { getPublicSiteUrl } from "@/src/lib/schema";
import { getHomeownersFaqs, homeownersPageCopy } from "@/src/tokens/homeowners";
import { pageLayout } from "@/src/tokens/layout";

export function HomeownersFaq() {
  const faqs = getHomeownersFaqs(getPublicSiteUrl());

  return (
    <section className="border-t border-gray-200 bg-white py-12 md:py-16">
      <div className={pageLayout.container}>
        <h2 className="font-satoshi text-2xl font-bold text-gray-900 md:text-3xl">
          {homeownersPageCopy.faqTitle}
        </h2>
        <FaqAccordion items={faqs} className="mt-8" />
      </div>
    </section>
  );
}
