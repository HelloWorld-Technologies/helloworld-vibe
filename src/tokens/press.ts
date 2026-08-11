/** Press / headlines logos shared by homepage and about. */
export const pressLogos = [
  {
    id: "economic-times",
    name: "The Economic Times",
    src: "/assets/about/press/economic-times.png",
    homepageSrc: "/assets/homepage-website/economic-teams.png",
    href: "https://economictimes.indiatimes.com/industry/services/property-/-cstruction/aurum-proptech-buys-goldman-sachs-backed-cos-arm-helloworld-careersocially/articleshow/91817318.cms?from=mdr",
  },
  {
    id: "business-line",
    name: "BusinessLine",
    src: "/assets/about/press/business-line.png",
    homepageSrc: "/assets/homepage-website/business-line.png",
    href: "https://www.thehindubusinessline.com/companies/hello-world-launches-contactless-home-rental-solutions-for-the-covid-era/article31834483.ece",
  },
  {
    id: "inc42",
    name: "Inc42",
    src: "/assets/about/press/inc42.png",
    homepageSrc: "/assets/homepage-website/inc-42.png",
    href: "https://inc42.com/buzz/nestaways-hello-world-acquires-stayabode-to-strengthen-co-living-presence/",
  },
  {
    id: "yourstory",
    name: "YourStory",
    src: "/assets/about/press/yourstory.png",
    homepageSrc: "/assets/homepage-website/your-story.png",
    href: "https://yourstory.com/2019/09/nestaway-co-living-startup-student-housing-hello-world/amp",
  },
  {
    id: "et-realty",
    name: "ET Realty",
    src: "/assets/about/press/realty.png",
    homepageSrc: "/assets/homepage-website/et-realty.png",
    href: "https://www.rprealtyplus.com/amp/allied/nestaway-acquires-three-co-living-operators-74881.html",
  },
] as const;

export type PressLogo = (typeof pressLogos)[number];
