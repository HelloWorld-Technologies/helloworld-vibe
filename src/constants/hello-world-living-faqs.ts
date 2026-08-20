import type { FaqAccordionItem } from "@/components/ui/faq-accordion";

export function getHelloWorldLivingFaqs(
  baseUrl: string,
): FaqAccordionItem[] {
  return [
    {
      id: "what-is-hello-world-living",
      question: "What is Hello World Living?",
      answer: `Hello World Living is HelloWorld's take on coliving and community living—spaces designed for connection and convenience. Explore at ${baseUrl}/hello-world-living. Browse properties at ${baseUrl} and community events at ${baseUrl}/community.`,
    },
    {
      id: "how-different-from-rental",
      question: "How is Hello World Living different from regular rental?",
      answer: `Hello World Living focuses on community, shared amenities, and events alongside your private room. It's coliving by HelloWorld. See ${baseUrl}/hello-world-living and ${baseUrl} for properties.`,
    },
  ];
}
