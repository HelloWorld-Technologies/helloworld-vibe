import { FaqAccordion } from "@/components/ui/faq-accordion";
import { getHelloWorldLivingFaqs } from "@/src/constants/hello-world-living-faqs";
import { getPublicSiteUrl } from "@/src/lib/schema";
import { pageLayout } from "@/src/tokens/layout";

export function HelloWorldLivingFaq() {
  const faqs = getHelloWorldLivingFaqs(getPublicSiteUrl());

  return (
    <section className="border-t border-gray-200 bg-white py-12 md:py-16">
      <div className={pageLayout.container}>
        <h2 className="font-satoshi text-2xl font-bold text-gray-900 md:text-3xl">
          Frequently asked questions
        </h2>
        <FaqAccordion
          items={faqs}
          defaultOpenId={faqs[0]?.id}
          className="mt-8"
        />
      </div>
    </section>
  );
}
