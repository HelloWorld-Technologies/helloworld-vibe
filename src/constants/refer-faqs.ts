import type { FaqAccordionItem } from "@/components/ui/faq-accordion";

export function getReferFaqs(baseUrl: string): FaqAccordionItem[] {
  return [
    {
      id: "how-refer-earn-works",
      question: "How does HelloWorld refer and earn work?",
      answer: `You can refer friends to HelloWorld and earn rewards when they move in. Share coliving or student housing with your network via ${baseUrl}/refer. Browse properties at ${baseUrl} to share with friends.`,
    },
    {
      id: "where-to-refer",
      question: "Where do I refer someone to HelloWorld?",
      answer: `Use ${baseUrl}/refer to refer friends to HelloWorld coliving or student hostels. You'll get details on rewards and how to share your link.`,
    },
  ];
}
