/**
 * Builds llms.txt content for AI/LLM crawlers (llms.txt spec v1.1.1).
 */

import { SITEMAP_STATIC_LIST } from "@/src/lib/sitemap";
import { srpSlug } from "@/src/lib/sitemap-slug";

const SITE_FULL_NAME = "HelloWorld Coliving & Student Hostels";
const SUMMARY =
  "HelloWorld provides coliving, student housing, coworking, and community spaces across India. We offer furnished rooms, flexible stays, and social habitats for students and professionals exploring coliving and affordable quality living.";

export interface BuildLlmsTxtOptions {
  cities?: string[];
}

export function buildLlmsTxt(
  baseUrl: string,
  options: BuildLlmsTxtOptions = {},
): string {
  const base = baseUrl.replace(/\/$/, "");
  const { cities = [] } = options;

  const lines: string[] = [
    `# ${SITE_FULL_NAME}`,
    "",
    `> ${SUMMARY}`,
    "",
    "## Contact",
    "",
    `- [Contact page](${base}/contact): Enquiries, support, and property questions`,
    "- Legal and privacy: legal@thehelloworld.com",
    "",
    "## Services",
    "",
    `- [Coliving](${base}/campaign): Furnished coliving spaces with community and flexible stays`,
    `- [Student housing](${base}/student-hostel-in-kota): Student hostels and PG in Kota and other cities`,
    `- [Coworking](${base}/coworking): HelloWorld Cowork – flexible coworking at our locations`,
    `- [Community events](${base}/events): Workshops, meetups, and experiences at HelloWorld spaces`,
    "",
    "## Key Information",
    "",
    `- [About Us](${base}/about-us): Company and mission`,
    `- [Blog](${base}/blogs): Guides and updates`,
    `- [For property owners](${base}/owner): List your property with HelloWorld`,
    `- [Safety](${base}/safety): How we keep spaces secure`,
    `- [Privacy policy](${base}/policy): Data and privacy`,
    `- [Tenant policy](${base}/tenant-policy): Resident guidelines`,
    `- [Refer & earn](${base}/refer): Referral program`,
    `- [HTML sitemap](${base}/sitemap): Browse all URLs`,
  ];

  if (cities.length > 0) {
    lines.push("", "## Locations", "");
    for (const city of cities.slice(0, 20)) {
      const slug = srpSlug(city);
      const label = city.charAt(0).toUpperCase() + city.slice(1).replace(/_/g, " ");
      const linkLabel =
        city.toLowerCase() === "kota"
          ? `Student hostels in ${label}`
          : `Coliving PG in ${label}`;
      lines.push(`- [${linkLabel}](${base}/${slug})`);
    }
    if (cities.length > 20) {
      lines.push(`- [All cities and properties](${base}/campaign)`);
    }
  }

  lines.push(
    "",
    "## What We Do Not Do",
    "",
    "HelloWorld does not provide legal, financial, or tax advice. We are a coliving and student housing operator in India; we do not operate outside India. Property listings and availability are subject to our terms and tenant policy.",
    "",
    "## AI Discovery Files",
    "",
    `- [Sitemap index](${base}/sitemap.xml): Full site structure and URLs`,
    `- [Robots](${base}/robots.txt): Crawl and AI crawler rules`,
    `- [This file](${base}/llms.txt): Identity and key links for AI systems`,
    "",
    "## Static pages",
    "",
    ...SITEMAP_STATIC_LIST.map(
      (slug) => `- [${slug}](${base}/${slug})`,
    ),
  );

  return lines.join("\n");
}
