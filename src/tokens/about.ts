import { pressLogos } from "@/src/tokens/press";

export const aboutPageCopy = {
  title: "About Us | HelloWorld Coliving & Student Hostels",
  description:
    "HelloWorld is building the future of co-living for India—convenience, comfort, and community across cities, backed by Aurum PropTech.",
  heroHeadlineLead: "Building the future of",
  heroHeadlineAccent: "Co-living",
  heroHeadlineTrail: "for India",
  heroSubtitle:
    "At HelloWorld, we’re on a mission to bring convenience, comfort and community accessible to every millennial by bringing exceptional stays across the country.",
  missionTitle: "Why are we here?",
  missionParagraphs: [
    "PGs and hostels often compromise on comfort, safety and reliability. HelloWorld changes that with thoughtfully designed spaces and seamless services, all accessible from your phone.",
    "Because better living should be simple, dependable and within reach.",
  ],
  aurumBody:
    "HelloWorld is part of Aurum PropTech, a new-age property technology company headquartered in Navi Mumbai. As a leader in the PropTech landscape, Aurum PropTech leverages cutting-edge technologies like AI, blockchain, and AR/VR to revolutionise the real estate industry by integrating technology, services, and capital to create value across the real estate ecosystem. Together, we’re transforming how people find, live in, and own homes, setting new standards in the real estate journey.",
  leadershipTitle: "Leading the Way",
  coreTeamTitle: "Our Core Team",
  headlinesTitle: "Making Headlines",
  principlesTitle: "6 principles we actually run on",
  principlesSubtitle:
    "A common language for hard calls, from everyday collaboration to how we hire, develop and recognise people.",
} as const;

export const aboutHeroIllustration = "/assets/about/hero-illustration.png";
export const aboutMissionCutout = "/assets/about/mission-cutout.png";
export const aboutAurumLogo = "/assets/about/aurum-logo.png";
export const aboutLinkedInIcon = "/assets/about/linkedin.svg";

export const aboutStats = [
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

export type AboutPerson = {
  name: string;
  role: string;
  image: string;
  linkedin?: string;
};

export const aboutLeadership: AboutPerson[] = [
  {
    name: "Ashish Deora",
    role: "CEO - Aurum Proptech",
    image: "/assets/about/team/ashish.png",
    linkedin: "https://www.linkedin.com/in/ashish-deora-aurumventures",
  },
  {
    name: "Jitendra Jagadev",
    role: "CEO- HelloWorld, Nestaway",
    image: "/assets/about/team/jitendra.png",
    linkedin: "https://www.linkedin.com/in/jitendrajagadev",
  },
  {
    name: "Ismail Khan",
    role: "COO- HelloWorld, Nestaway",
    image: "/assets/about/team/ismail.png",
    linkedin: "https://www.linkedin.com/in/ismail-khan-b675949/",
  },
];

export const aboutCoreTeam: AboutPerson[] = [
  {
    name: "Saurav Agarwal",
    role: "Chief Business Officer",
    image: "/assets/about/team/saurav.jpg",
  },
  {
    name: "Vinay Chaudhary",
    role: "AVP- Finance",
    image: "/assets/about/team/vinay.jpg",
  },
  {
    name: "Ankit Dayal",
    role: "AVP- Technology",
    image: "/assets/about/team/ankit.jpg",
  },
  {
    name: "Karen Labo",
    role: "Director- HR",
    image: "/assets/about/team/karen.jpg",
  },
  {
    name: "Dayal Sharan",
    role: "Senior Director- Technology",
    image: "/assets/about/team/dayal.jpg",
  },
  {
    name: "Vikram Saravag",
    role: "AVP - Business",
    image: "/assets/about/team/vikram.jpg",
  },
  {
    name: "Mayank Tripathi",
    role: "AVP - Business",
    image: "/assets/about/team/mayank.jpg",
  },
  {
    name: "Rahul Karthi",
    role: "Director- Business",
    image: "/assets/about/team/rahul.jpg",
  },
  {
    name: "Aju Philip George",
    role: "Director - Finance",
    image: "/assets/about/team/aju.jpg",
  },
];

export const aboutPressLogos = pressLogos.map((logo) => ({
  name: logo.name,
  src: logo.src,
  href: logo.href,
}));

export const aboutPrinciples = [
  {
    number: "01",
    title: "Team Spirit",
    body: "We work as one team. Ideas move freely, collaboration comes naturally, and every contribution is valued.",
  },
  {
    number: "02",
    title: "Take Ownership",
    body: "We step up, take responsibility, and see things through, because every detail makes a difference.",
  },
  {
    number: "03",
    title: "Drive Results",
    body: "We turn ideas and effort into meaningful outcomes that create real impact.",
  },
  {
    number: "04",
    title: "Think Ahead",
    body: "We make decisions with the future in mind, building experiences that continue to serve residents as their needs evolve.",
  },
  {
    number: "05",
    title: "Be Resourceful",
    body: "We look at every decision from the resident’s perspective and ask: will this make their experience better?",
  },
  {
    number: "06",
    title: "Put Residents First",
    body: "We look at every decision from the resident’s perspective and ask: will this make their experience better?",
  },
] as const;
