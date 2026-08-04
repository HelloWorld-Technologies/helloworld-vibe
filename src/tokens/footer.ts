export const footerProductLinks = [
  { label: "Co living", href: "/coliving-in-bangalore" },
  { label: "Student living", href: "/student-living" },
  { label: "Community", href: "/community" },
] as const;

export const footerAboutLinks = [
  { label: "About us", href: "/about-us" },
  { label: "Work with us", href: "/careers" },
  { label: "For home owners", href: "/owner" },
  { label: "Contact", href: "/contact" },
  { label: "Blog", href: "/blog" },
  { label: "Sitemap", href: "/sitemap" },
] as const;

export const footerAboutLinksMobile = footerAboutLinks.filter(
  (link) => link.label !== "About us",
);

const footerCities = [
  { label: "Bangalore", slug: "bangalore" },
  { label: "Delhi", slug: "delhi" },
  { label: "Hyderabad", slug: "hyderabad" },
  { label: "Jaipur", slug: "jaipur" },
  { label: "Kota", slug: "kota" },
  { label: "Noida", slug: "noida" },
  { label: "Pune", slug: "pune" },
  { label: "Coimbatore", slug: "coimbatore" },
  { label: "Gurugram", slug: "gurugram" },
  { label: "Indore", slug: "indore" },
  { label: "Kolkata", slug: "kolkata" },
  { label: "Mumbai", slug: "mumbai" },
  { label: "Greater Noida", slug: "greater-noida" },
  { label: "Visakhapatnam", slug: "visakhapatnam" },
] as const;

export const footerCityLinks = footerCities.map((city) => ({
  label: city.label,
  href: `/coliving-in-${city.slug}`,
}));

export const footerCityColumns = [
  footerCityLinks.slice(0, 7),
  footerCityLinks.slice(7),
] as const;

export const footerContact = {
  address:
    "1184, 5th Main Rd, Rajiv Gandhinagar Sector 7, HSR Layout, Bangalore, Karnataka 560102",
  phone: "888 000 88 88",
  phoneHref: "tel:8880008888",
  email: "care@thehelloworld.com",
  emailHref: "mailto:care@thehelloworld.com",
} as const;

export const socialLinks = [
  {
    id: "facebook",
    label: "Facebook",
    href: "https://www.facebook.com/helloworldliving",
  },
  {
    id: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/helloworld_living/",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/helloworld-living/",
  },
] as const;
