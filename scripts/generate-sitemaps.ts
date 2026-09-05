/**
 * Generates sitemap XML files and llms.txt into public/.
 * Run: npm run generate-sitemaps
 *
 * Requires .env with NEXT_PUBLIC_BASE_URL (API) and NEXT_PUBLIC_URL (public site).
 * URL logic matches helloworld-next/scripts/generate-sitemaps.ts.
 */

import "dotenv/config";
import axios from "axios";
import * as fs from "fs";
import * as path from "path";
import cities from "../src/constants/cities";
import { buildLlmsTxt } from "../src/lib/llms-txt";
import { getAllBlogPostsMeta } from "../src/lib/blog.server";
import {
  buildSitemapBlogXml,
  buildSitemapCitiesXml,
  buildSitemapGenderCitiesXml,
  buildSitemapGenderLocalityXml,
  buildSitemapIndexXml,
  buildSitemapLandmarksXml,
  buildSitemapLocalityXml,
  buildSitemapPropertiesXml,
  buildSitemapStaticXml,
} from "../src/lib/sitemap";
import { getApiBaseUrl, getApiOriginHeader } from "../src/lib/api";
import type {
  NearbyPlace,
  NearbyPlaceApiItem,
  NearbyPlacesApiResponse,
  SitemapProperty,
} from "../src/models/sitemap-types";

const BASE_URL = getApiBaseUrl();
const PUBLIC_URL = (process.env.NEXT_PUBLIC_URL || "https://thehelloworld.com").replace(
  /\/$/,
  "",
);

function normalizePathPart(value: string): string {
  return (value || "")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function main() {
  if (!BASE_URL) {
    console.warn("NEXT_PUBLIC_BASE_URL not set. API fetches may fail.");
  }

  const publicDir = path.join(process.cwd(), "public");
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const staticXml = buildSitemapStaticXml(PUBLIC_URL);
  fs.writeFileSync(path.join(publicDir, "sitemap-static.xml"), staticXml, "utf8");
  console.warn("Wrote public/sitemap-static.xml");

  const citiesXml = buildSitemapCitiesXml(PUBLIC_URL, [...cities]);
  fs.writeFileSync(path.join(publicDir, "sitemap-cities.xml"), citiesXml, "utf8");
  console.warn("Wrote public/sitemap-cities.xml");

  let properties: SitemapProperty[] = [];
  try {
    if (!BASE_URL) throw new Error("NEXT_PUBLIC_BASE_URL not set");
    const client = axios.create({
      baseURL: BASE_URL,
      timeout: 30000,
      headers: { origin: getApiOriginHeader() },
    });
    const res = await client.get("property/all");
    const body = res.data;
    if (Array.isArray(body)) {
      properties = body;
    } else if (Array.isArray(body?.data)) {
      properties = body.data;
    } else {
      console.warn("Unexpected property/all response shape");
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Failed to fetch properties:", message);
  }

  const propertiesXml = buildSitemapPropertiesXml(PUBLIC_URL, properties);
  fs.writeFileSync(path.join(publicDir, "sitemap-properties.xml"), propertiesXml, "utf8");
  console.warn(`Wrote public/sitemap-properties.xml (${properties.length} properties)`);

  const localities: { city: string; localitySlug: string }[] = [];
  try {
    const seen = new Set<string>();
    for (const p of properties) {
      const city = (p?.address?.city || p?.city || "").toString();
      const locRaw = (p?.locality || p?.address?.line2 || "").toString();
      const localitySlug = normalizePathPart(locRaw);
      if (!city || !localitySlug) continue;
      const key = `${city.toLowerCase()}|${localitySlug}`;
      if (seen.has(key)) continue;
      seen.add(key);
      localities.push({ city, localitySlug });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Failed to derive localities from properties:", message);
  }

  const localityXml = buildSitemapLocalityXml(
    PUBLIC_URL,
    localities,
    undefined,
    localities.flatMap(({ city, localitySlug }) => {
      const cityPart = normalizePathPart(city);
      let locSeg = normalizePathPart(localitySlug);
      if (!cityPart || !locSeg) return [];
      if (cityPart === "bangalore" && locSeg === "doddanekundi") {
        locSeg = "hsr-layout";
      }
      return [`room-for-rent-in-${locSeg}-${cityPart}`];
    }),
  );
  fs.writeFileSync(path.join(publicDir, "sitemap-locality.xml"), localityXml, "utf8");
  console.warn(`Wrote public/sitemap-locality.xml (${localities.length} localities)`);

  const genderCitiesXml = buildSitemapGenderCitiesXml(PUBLIC_URL, [...cities]);
  fs.writeFileSync(
    path.join(publicDir, "sitemap-gender-cities.xml"),
    genderCitiesXml,
    "utf8",
  );
  console.warn("Wrote public/sitemap-gender-cities.xml");

  const genderLocalityXml = buildSitemapGenderLocalityXml(PUBLIC_URL, localities);
  fs.writeFileSync(
    path.join(publicDir, "sitemap-gender-locality.xml"),
    genderLocalityXml,
    "utf8",
  );
  console.warn("Wrote public/sitemap-gender-locality.xml");

  let landmarks: NearbyPlace[] = [];
  try {
    if (!BASE_URL) throw new Error("NEXT_PUBLIC_BASE_URL not set");
    const client = axios.create({
      baseURL: BASE_URL,
      timeout: 30000,
      headers: { origin: getApiOriginHeader() },
    });
    const bySlug = new Map<string, NearbyPlace>();
    for (const city of cities) {
      const res = await client.get("property/nearby-places", { params: { city } });
      const body = res.data as NearbyPlacesApiResponse | Record<string, unknown>;
      const localityMap =
        body &&
        typeof body === "object" &&
        "data" in body &&
        body.data &&
        typeof body.data === "object"
          ? (body.data as Record<string, NearbyPlaceApiItem[]>)
          : {};
      for (const list of Object.values(localityMap)) {
        if (!Array.isArray(list)) continue;
        for (const item of list) {
          const name = String(item?.display_name || "").trim();
          const slug = normalizePathPart(String(item?.slug || ""));
          if (!slug) continue;
          if (!bySlug.has(slug)) {
            bySlug.set(slug, { name: name || slug, slug, city: item?.city || city });
          }
        }
      }
    }
    landmarks = Array.from(bySlug.values());
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Failed to fetch nearby landmarks:", message);
  }

  const landmarksXml = buildSitemapLandmarksXml(PUBLIC_URL, landmarks);
  fs.writeFileSync(path.join(publicDir, "sitemap-landmarks.xml"), landmarksXml, "utf8");
  console.warn(`Wrote public/sitemap-landmarks.xml (${landmarks.length} landmarks)`);

  const blogPosts = getAllBlogPostsMeta()
    .filter((p) => !p.noindex)
    .map((p) => ({ slug: p.slug, date: p.date, updated: p.updated }));
  const blogXml = buildSitemapBlogXml(PUBLIC_URL, blogPosts);
  fs.writeFileSync(path.join(publicDir, "sitemap-blog.xml"), blogXml, "utf8");
  console.warn(`Wrote public/sitemap-blog.xml (${blogPosts.length} blog posts)`);

  const indexXml = buildSitemapIndexXml(PUBLIC_URL);
  fs.writeFileSync(path.join(publicDir, "sitemap.xml"), indexXml, "utf8");
  console.warn("Wrote public/sitemap.xml (sitemap index)");

  const llmsTxt = buildLlmsTxt(PUBLIC_URL, { cities: [...cities] });
  fs.writeFileSync(path.join(publicDir, "llms.txt"), llmsTxt, "utf8");
  console.warn("Wrote public/llms.txt");

  console.warn("Done. Commit public/sitemap*.xml and public/llms.txt when URLs change.");
}

main();
