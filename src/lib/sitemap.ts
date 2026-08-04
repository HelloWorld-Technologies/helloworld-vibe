/**
 * Sitemap XML generators — URL logic aligned with helloworld-next (src/utils/sitemap.ts).
 */

import type {
  NearbyPlace,
  SitemapEvent,
  SitemapProperty,
} from "@/src/models/sitemap-types";
import {
  createEventSlug,
  createHdpSlug,
  getLocalitySlug,
  srpSlug,
} from "@/src/lib/sitemap-slug";

const XML_DECLARATION = '<?xml version="1.0" encoding="UTF-8"?>';
const URLSET_OPEN =
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
const URLSET_CLOSE = "</urlset>";
const SITEMAP_INDEX_OPEN =
  '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
const SITEMAP_INDEX_CLOSE = "</sitemapindex>";

function urlEntry(loc: string, lastmod?: string): string {
  return `
  <url>
    <loc>${loc}</loc>${lastmod ? `
    <lastmod>${lastmod}</lastmod>` : ""}
  </url>`;
}

function sitemapEntry(loc: string, lastmod?: string): string {
  return `
  <sitemap>
    <loc>${loc}</loc>${lastmod ? `
    <lastmod>${lastmod}</lastmod>` : ""}
  </sitemap>`;
}

function normalizePathPart(value: string): string {
  return (value || "")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeHdpSlug(value: string): string {
  return (value || "")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getSitemapLocalitySlug(property: SitemapProperty): string {
  const direct = normalizePathPart(getLocalitySlug(property));
  if (direct) return direct;
  const fallback = normalizePathPart(
    property?.address?.line2 || property?.locality || "",
  );
  return fallback || "unknown-locality";
}

/** Static paths for sitemap-static.xml (no properties, no cities). */
export const SITEMAP_STATIC_LIST = [
  "about-us",
  "owner",
  "contact",
  "policy",
  "tenant-policy",
  "sitemap",
  "campaign",
  "student-hostel-in-kota",
  "kota-meridian-height",
  "refer",
  "safety",
  "coworking",
  "events",
  "feedback",
  "hello-world-living",
  "blogs",
] as const;

export function getSitemapLastmod(): string {
  return new Date().toISOString().split("T")[0];
}

export function buildSitemapStaticXml(baseUrl: string, lastmod?: string): string {
  const base = baseUrl.replace(/\/$/, "");
  const mod = lastmod || getSitemapLastmod();
  const urls = [base, ...SITEMAP_STATIC_LIST.map((slug) => `${base}/${slug}`)];
  return `${XML_DECLARATION}
${URLSET_OPEN}
${urls.map((loc) => urlEntry(loc, mod)).join("")}
${URLSET_CLOSE}
`;
}

export function buildSitemapCitiesXml(
  baseUrl: string,
  cities: string[],
  lastmod?: string,
): string {
  const base = baseUrl.replace(/\/$/, "");
  const mod = lastmod || getSitemapLastmod();
  const urls = cities.map((city) => `${base}/${srpSlug(city)}`);
  return `${XML_DECLARATION}
${URLSET_OPEN}
${urls.map((loc) => urlEntry(loc, mod)).join("")}
${URLSET_CLOSE}
`;
}

export function buildSitemapPropertiesXml(
  baseUrl: string,
  properties: SitemapProperty[],
  lastmod?: string,
): string {
  const base = baseUrl.replace(/\/$/, "");
  const defaultMod = lastmod || getSitemapLastmod();
  const entries: string[] = [];
  const seen = new Set<string>();
  for (const p of properties) {
    const city = p.address?.city ?? p.city;
    if (!city) continue;
    const srp = srpSlug(city);
    const loc = getSitemapLocalitySlug(p);
    const hdp = normalizeHdpSlug(createHdpSlug(p));
    if (!hdp) continue;
    const locUrl = encodeURI(`${base}/${srp}/${loc}/${hdp}`);
    if (seen.has(locUrl)) continue;
    seen.add(locUrl);
    const mod =
      p.updatedAt && !Number.isNaN(Date.parse(p.updatedAt))
        ? p.updatedAt.split("T")[0]
        : defaultMod;
    entries.push(urlEntry(locUrl, mod));
  }
  return `${XML_DECLARATION}
${URLSET_OPEN}
${entries.join("")}
${URLSET_CLOSE}
`;
}

export function buildSitemapLocalityXml(
  baseUrl: string,
  localities: { city: string; localitySlug: string }[],
  lastmod?: string,
  extraSingleSegmentPaths?: string[],
): string {
  const base = baseUrl.replace(/\/$/, "");
  const mod = lastmod || getSitemapLastmod();
  const seen = new Set<string>();
  const urls = localities
    .map(({ city, localitySlug }) => {
      const normalized = normalizePathPart(localitySlug);
      if (!city || !normalized) return "";
      const srp = srpSlug(city);
      if (srp.startsWith("coliving-in-")) {
        const cityPart = normalizePathPart(city);
        let locSeg = normalized;
        if (cityPart === "bangalore" && normalized === "doddanekundi") {
          locSeg = "hsr-layout";
        }
        return encodeURI(`${base}/coliving-in-${locSeg}-${cityPart}`);
      }
      const cityPart = normalizePathPart(city);
      if (cityPart === "kota" && srp === "hostels-in-kota") {
        return encodeURI(`${base}/hostels-in-${normalized}-kota`);
      }
      return encodeURI(`${base}/${srp}/${normalized}`);
    })
    .filter((u) => {
      if (!u || seen.has(u)) return false;
      seen.add(u);
      return true;
    });
  for (const rel of extraSingleSegmentPaths ?? []) {
    const trimmed = String(rel || "")
      .trim()
      .replace(/^\/+|\/+$/g, "");
    if (!trimmed) continue;
    const u = encodeURI(`${base}/${trimmed}`);
    if (seen.has(u)) continue;
    seen.add(u);
    urls.push(u);
  }
  return `${XML_DECLARATION}
${URLSET_OPEN}
${urls.map((loc) => urlEntry(loc, mod)).join("")}
${URLSET_CLOSE}
`;
}

export function buildSitemapGenderCitiesXml(
  baseUrl: string,
  cities: string[],
  lastmod?: string,
): string {
  const base = baseUrl.replace(/\/$/, "");
  const mod = lastmod || getSitemapLastmod();
  const urls = cities.flatMap((cityRaw) => {
    const city = normalizePathPart(cityRaw);
    if (!city) return [];
    return [
      encodeURI(`${base}/pg-for-boys-in-${city}`),
      encodeURI(`${base}/pg-for-girls-in-${city}`),
    ];
  });
  return `${XML_DECLARATION}
${URLSET_OPEN}
${urls.map((loc) => urlEntry(loc, mod)).join("")}
${URLSET_CLOSE}
`;
}

export function buildSitemapGenderLocalityXml(
  baseUrl: string,
  localities: { city: string; localitySlug: string }[],
  lastmod?: string,
): string {
  const base = baseUrl.replace(/\/$/, "");
  const mod = lastmod || getSitemapLastmod();
  const seen = new Set<string>();
  const urls = localities
    .flatMap(({ city: cityRaw, localitySlug }) => {
      const city = normalizePathPart(cityRaw);
      const normalizedLocality = normalizePathPart(localitySlug);
      if (!city || !normalizedLocality) return [];
      if (city === "kota") {
        return [
          encodeURI(`${base}/boys-hostel-in-${normalizedLocality}-${city}`),
          encodeURI(`${base}/girls-hostel-in-${normalizedLocality}-${city}`),
          encodeURI(`${base}/pg-for-boys-in-${normalizedLocality}-${city}`),
          encodeURI(`${base}/pg-for-girls-in-${normalizedLocality}-${city}`),
        ];
      }
      return [
        encodeURI(`${base}/pg-for-boys-in-${normalizedLocality}-${city}`),
        encodeURI(`${base}/pg-for-girls-in-${normalizedLocality}-${city}`),
      ];
    })
    .filter(Boolean);
  const deduped = [...urls].filter((u) => {
    if (!u || seen.has(u)) return false;
    seen.add(u);
    return true;
  });
  return `${XML_DECLARATION}
${URLSET_OPEN}
${deduped.map((loc) => urlEntry(loc, mod)).join("")}
${URLSET_CLOSE}
`;
}

export function buildSitemapEventsXml(
  baseUrl: string,
  events: SitemapEvent[],
  lastmod?: string,
): string {
  const base = baseUrl.replace(/\/$/, "");
  const mod = lastmod || getSitemapLastmod();
  const urls = events.map(
    (e) => `${base}/events/${e.city}/${createEventSlug(e)}`,
  );
  return `${XML_DECLARATION}
${URLSET_OPEN}
${urls.map((loc) => urlEntry(loc, mod)).join("")}
${URLSET_CLOSE}
`;
}

export function buildSitemapLandmarksXml(
  baseUrl: string,
  landmarks: NearbyPlace[],
  lastmod?: string,
): string {
  const base = baseUrl.replace(/\/$/, "");
  const mod = lastmod || getSitemapLastmod();
  const seen = new Set<string>();
  const urls = landmarks
    .flatMap((landmark) => {
      const slug = normalizePathPart(landmark?.slug || landmark?.name || "");
      if (!slug) return [];
      const city = normalizePathPart(landmark?.city || "");
      if (city === "kota") {
        return [
          encodeURI(`${base}/hostel-near-${slug}`),
          encodeURI(`${base}/room-for-rent-near-${slug}`),
        ];
      }
      return [
        encodeURI(`${base}/pg-near-${slug}`),
        encodeURI(`${base}/room-for-rent-near-${slug}`),
      ];
    })
    .filter((u) => {
      if (!u || seen.has(u)) return false;
      seen.add(u);
      return true;
    });
  return `${XML_DECLARATION}
${URLSET_OPEN}
${urls.map((loc) => urlEntry(loc, mod)).join("")}
${URLSET_CLOSE}
`;
}

export function buildSitemapBlogXml(
  baseUrl: string,
  posts: { slug: string; date: string; updated?: string }[],
  lastmod?: string,
): string {
  const base = baseUrl.replace(/\/$/, "");
  const defaultMod = lastmod || getSitemapLastmod();
  const entries = [
    urlEntry(`${base}/blogs/topics`, defaultMod),
    ...posts.map((p) => {
      const loc = `${base}/blogs/${p.slug}`;
      const mod = p.updated || p.date || defaultMod;
      return urlEntry(loc, mod);
    }),
  ];
  return `${XML_DECLARATION}
${URLSET_OPEN}
${entries.join("")}
${URLSET_CLOSE}
`;
}

export function buildSitemapIndexXml(
  baseUrl: string,
  childNames: string[] = [
    "sitemap-static.xml",
    "sitemap-cities.xml",
    "sitemap-locality.xml",
    "sitemap-gender-cities.xml",
    "sitemap-gender-locality.xml",
    "sitemap-properties.xml",
    "sitemap-events.xml",
    "sitemap-landmarks.xml",
    "sitemap-blog.xml",
  ],
  lastmod?: string,
): string {
  const base = baseUrl.replace(/\/$/, "");
  const mod = lastmod || getSitemapLastmod();
  return `${XML_DECLARATION}
${SITEMAP_INDEX_OPEN}
${childNames.map((name) => sitemapEntry(`${base}/${name}`, mod)).join("")}
${SITEMAP_INDEX_CLOSE}
`;
}
