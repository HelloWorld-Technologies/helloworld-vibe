import type { FaqAccordionItem } from "@/components/ui/faq-accordion";

export function getContactFaqs(baseUrl: string): FaqAccordionItem[] {
  return [
    {
      id: "how-to-contact",
      question: "How do I contact HelloWorld?",
      answer: `You can reach HelloWorld at ${baseUrl}/contact. For immediate support, call 888 000 88 88. Use the contact page for enquiries about coliving, student hostels, coworking, or listing your property. Browse properties at ${baseUrl}.`,
    },
    {
      id: "what-to-ask",
      question: "What can I ask HelloWorld support?",
      answer: `HelloWorld support helps with booking, visits, rent, property enquiries, and general questions about coliving or student housing. For legal or privacy matters, email legal@thehelloworld.com. See also ${baseUrl}/tenant-policy and ${baseUrl}/policy.`,
    },
    {
      id: "where-located",
      question: "Where is HelloWorld located?",
      answer: `HelloWorld operates coliving and student housing in multiple Indian cities. Visit ${baseUrl} to see properties by city. For office or partnership enquiries, use the contact form at ${baseUrl}/contact.`,
    },
  ];
}
