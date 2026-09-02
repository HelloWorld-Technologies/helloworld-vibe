import { HdpSectionHeading } from "@/components/marketing/hdp-section-heading";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { hdpFaqs } from "@/src/tokens/hdp-faqs";
import { cn } from "@/src/lib/cn";

export function HdpFaq({
  items,
  className,
}: {
  items?: { question: string; answer: string }[];
  className?: string;
}) {
  const faqItems =
    items && items.length > 0
      ? items.map((item, index) => ({
          id: `hdp-faq-${index}`,
          question: item.question,
          answer: item.answer,
        }))
      : hdpFaqs;

  return (
    <section
      className={cn("space-y-8", className)}
      aria-label="Frequently asked questions"
    >
      <HdpSectionHeading>Frequently Asked Questions</HdpSectionHeading>
      <FaqAccordion
        items={faqItems}
        defaultOpenId={faqItems[0]?.id}
        questionClassName="font-bold"
      />
    </section>
  );
}
