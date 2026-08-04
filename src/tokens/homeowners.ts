import type { FaqAccordionItem } from "@/components/ui/faq-accordion";

export const homeownersPageCopy = {
  title: "For Homeowners | HelloWorld Property Management",
  description:
    "Own a residential building? HelloWorld manages it end to end—rent, tenants, maintenance, and paperwork—so you can sit back and relax.",
  heroLine1: "Own a Residential Building?",
  heroLine2Before: "We'll manage it ",
  heroLine2Accent: "End to End!",
  heroBadge: "Sit back and relax!",
  heroCta: "List Your Property",
  differentTitleLead: "How is ",
  differentTitleBrand: "HelloWorld",
  differentTitleTrail: " Different?",
  differentSubtitle: "India's Leading Property Management Service",
  formTitle: "Let's Grow your Rental Income",
  formCta: "Request Callback",
  partnersTitle: "What Our Partners Say",
  faqTitle: "Frequently Asked Questions",
  afterLabel: "After HelloWorld",
  beforeLabel: "Before HelloWorld",
} as const;

export const homeownersStats = [
  {
    label: "16+ Cities",
    icon: "/assets/homepage-website/cities.svg",
  },
  {
    label: "250+ Coliving Spaces",
    icon: "/assets/homepage-website/coliving-spaces.svg",
  },
  {
    label: "50k+ Happy Tenants",
    icon: "/assets/homepage-website/happy-tenants.svg",
  },
] as const;

export const homeownersFeatures = [
  {
    title: "Maintenance Support",
    description: "We provide on-demand & periodic property repairs",
    image: "/assets/homeowners/features/maintenance.png",
  },
  {
    title: "Guided Visits",
    description: "We give guided tour of your Property to interested tenants",
    image: "/assets/homeowners/features/guided-visits.png",
  },
  {
    title: "Rent & Payment Management",
    description: "We guarantee timely rent, every month",
    image: "/assets/homeowners/features/rent-payment.png",
  },
  {
    title: "Paperwork, Handled",
    description:
      "We Handle all the paperwork for you from Agreement to Onboarding",
    image: "/assets/homeowners/features/paperwork.png",
  },
  {
    title: "Property Safety",
    description: "We ensure to keep your property in good condition",
    image: "/assets/homeowners/features/safety.png",
  },
  {
    title: "Marketing & Support",
    description: "We promote through ads and other rental platforms",
    image: "/assets/homeowners/features/marketing.png",
  },
] as const;

export const homeownersAfterImage = "/assets/homeowners/after-helloworld.png";
export const homeownersBeforeImage = "/assets/homeowners/before-helloworld.png";
export const homeownersScrollVideo =
  "/assets/homeowners/helloworld-scroll.mp4";
export const homeownersFormIllustration =
  "/assets/homeowners/form-illustration.png";
export const homeownersReviewAvatar = "/assets/homeowners/review-avatar.png";
export const homeownersPartnerLogo = "/assets/logos/gradient-monogram.svg";

export const homeownersPartners = [
  {
    name: "Rajesh Mehta",
    avatar: "/assets/homeowners/avatars/rajesh.png",
    quote:
      "HelloWorld took over tenant sourcing and rent collection for my building in HSR. Occupancy stayed high and I stopped chasing monthly dues.",
  },
  {
    name: "Anita Sharma",
    avatar: "/assets/homeowners/avatars/anita.png",
    quote:
      "Maintenance tickets are closed quickly and the on-ground team keeps the property presentable. Listing with HelloWorld was a clear upgrade.",
  },
  {
    name: "Vikram Rao",
    avatar: "/assets/homeowners/avatars/vikram.png",
    quote:
      "From agreements to move-ins, paperwork is handled cleanly. I get clear reports and predictable rent without day-to-day involvement.",
  },
  {
    name: "Sneha Iyer",
    avatar: "/assets/homeowners/avatars/sneha.png",
    quote:
      "Their marketing fills rooms faster than my previous operator. Guided visits and professional support made partnering simple.",
  },
] as const;

export function getHomeownersFaqs(baseUrl: string): FaqAccordionItem[] {
  return [
    {
      id: "how-to-list",
      question: "How can I list my property with HelloWorld?",
      answer: `Property owners can partner with HelloWorld by visiting ${baseUrl}/owner. Submit your name, phone, and city to request a callback, and our partnerships team will help you list and manage your residential building. See our properties at ${baseUrl}.`,
    },
    {
      id: "what-does-helloworld-offer",
      question: "What does HelloWorld offer to property owners?",
      answer: `HelloWorld manages your property end to end—tenant sourcing, guided visits, rent collection, agreements, maintenance, property safety, and marketing—so you can sit back and grow rental income. Learn more at ${baseUrl}/owner.`,
    },
    {
      id: "who-to-contact",
      question: "Who do I contact to list my property with HelloWorld?",
      answer: `Visit ${baseUrl}/owner to start, or use ${baseUrl}/contact and mention property listing. You can also call 888 000 88 88 for owner enquiries.`,
    },
  ];
}
