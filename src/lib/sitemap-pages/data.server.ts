import cities from "@/src/constants/cities";
import { getAllBlogPostsMeta } from "@/src/lib/blog.server";
import { getApiBaseUrl, getApiOriginHeader } from "@/src/lib/api";
import { getHdpPageTitle } from "@/src/lib/hdp-page-title";
import {
  colivingFlatLocalityPath,
  createEventSlug,
  createHdpSlug,
  getLocalitySlug,
  isKotaCity,
  kotaHostelsFlatLocalityPath,
  kotaPgFlatLocalityPath,
  roomForRentFlatLocalityPath,
  srpSlug,
} from "@/src/lib/sitemap-slug";
import { SITEMAP_STATIC_LIST } from "@/src/lib/sitemap";
import type {
  NearbyPlace,
  NearbyPlaceApiItem,
  NearbyPlacesApiResponse,
  SitemapEvent,
  SitemapProperty,
} from "@/src/models/sitemap-types";

export type SitemapLinkItem = {
  href: string;
  label: string;
};

export type SitemapSection = {
  title: string;
  items: SitemapLinkItem[];
  rightLink?: { href: string; label: string };
};

function mapColivingNestedLocalityToFlatHref(
  srp: string,
  localitySlug: string,
  defaultHref: string,
): { href: string; localityLabelOverride?: string } {
  if (!srp.startsWith("coliving-in-")) return { href: defaultHref };
  const cityKey = srp.slice("coliving-in-".length);
  const flat = colivingFlatLocalityPath(cityKey, localitySlug);
  if (!flat) return { href: defaultHref };
  return { href: flat };
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

function localitySegmentFromColivingFlatHref(
  href: string,
  cityKey: string,
): string | null {
  const prefix = "/coliving-in-";
  const suffix = `-${cityKey}`;
  if (!href.startsWith(prefix) || !href.endsWith(suffix)) return null;
  return href.slice(prefix.length, -suffix.length).replace(/^-+|-+$/g, "") || null;
}

function roomForRentHrefForLocality(
  city: string,
  primaryLocalityHref: string,
  localitySlugFromProperty: string,
): string {
  const cityKey = normalizePathPart(city);
  const locRaw = normalizePathPart(localitySlugFromProperty);
  let seg =
    localitySegmentFromColivingFlatHref(primaryLocalityHref, cityKey) ?? locRaw;
  if (cityKey === "bangalore" && seg === "doddanekundi") seg = "hsr-layout";
  if (!cityKey || !seg) return "";
  return roomForRentFlatLocalityPath(cityKey, seg);
}

function titleize(value: string): string {
  const s = String(value || "")
    .replace(/[-_]+/g, " ")
    .replace(/[.]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!s) return "";
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

export function getPublicBaseUrl(): string {
  return getApiOriginHeader();
}

async function apiGet<T>(path: string, params?: Record<string, string>): Promise<T | null> {
  const api = getApiBaseUrl();
  if (!api) return null;

  const url = new URL(path.replace(/^\//, ""), `${api}/`);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }
  }

  const res = await fetch(url, {
    headers: { origin: getApiOriginHeader() },
    next: { revalidate: 86400 },
  });
  if (!res.ok) return null;
  return (await res.json()) as T;
}

export async function fetchAllProperties(): Promise<SitemapProperty[]> {
  const body = await apiGet<unknown>("property/all");
  if (Array.isArray(body)) return body as SitemapProperty[];
  if (body && typeof body === "object" && Array.isArray((body as { data?: unknown }).data)) {
    return (body as { data: SitemapProperty[] }).data;
  }
  return [];
}

export async function fetchAllEvents(): Promise<SitemapEvent[]> {
  const body = await apiGet<unknown>("hello/event/list", { city: "", type: "all" });
  if (Array.isArray(body)) return body as SitemapEvent[];
  if (body && typeof body === "object" && Array.isArray((body as { data?: unknown }).data)) {
    return (body as { data: SitemapEvent[] }).data;
  }
  return [];
}

export async function fetchNearbyPlacesByCity(): Promise<NearbyPlace[]> {
  const bySlug = new Map<string, NearbyPlace>();
  for (const city of cities) {
    const body = await apiGet<NearbyPlacesApiResponse>("property/nearby-places", {
      city,
    });
    const localityMap =
      body && typeof body === "object" && body.data && typeof body.data === "object"
        ? body.data
        : {};
    for (const list of Object.values(localityMap)) {
      if (!Array.isArray(list)) continue;
      for (const item of list) {
        const name = String(item?.display_name || "").trim();
        const slug = normalizePathPart(String(item?.slug || ""));
        if (!slug) continue;
        if (!bySlug.has(slug)) {
          bySlug.set(slug, {
            name: name || slug,
            slug,
            city: String(item?.city || city || "")
              .trim()
              .toLowerCase(),
          });
        }
      }
    }
  }
  return Array.from(bySlug.values());
}

function normalizeSlugPart(value: string): string {
  return normalizePathPart(value);
}

function buildLandmarkUrlFamily(slug: string, city?: string): string[] {
  const cityKey = normalizeSlugPart(city || "");
  if (cityKey === "kota") {
    return [`/hostel-near-${slug}`, `/room-for-rent-near-${slug}`];
  }
  return [`/pg-near-${slug}`, `/room-for-rent-near-${slug}`];
}

function formatLandmarkUrlLabel(href: string): string {
  const raw = String(href || "").trim();
  if (raw.startsWith("/room-for-rent-near-")) {
    const slug = raw.slice("/room-for-rent-near-".length);
    return `Room for rent near ${titleize(slug.replace(/-/g, " "))}`;
  }
  if (raw.startsWith("/pg-near-")) {
    const slug = raw.slice("/pg-near-".length);
    return `PG near ${titleize(slug.replace(/-/g, " "))}`;
  }
  if (raw.startsWith("/hostel-near-")) {
    const slug = raw.slice("/hostel-near-".length);
    return `Hostel near ${titleize(slug.replace(/-/g, " "))}`;
  }
  return String(href || "")
    .replace(/\//g, " ")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function fetchNearbyPlacesForCity(
  city: string,
): Promise<Record<string, NearbyPlace[]>> {
  const cityKey = normalizeSlugPart(city);
  if (!cityKey) return {};

  const body = await apiGet<NearbyPlacesApiResponse>("property/nearby-places", {
    city: cityKey,
  });
  const localityMap =
    body && typeof body === "object" && body.data && typeof body.data === "object"
      ? body.data
      : {};

  const out: Record<string, NearbyPlace[]> = {};
  for (const [localityRaw, list] of Object.entries(localityMap)) {
    if (!Array.isArray(list)) continue;
    const locality = titleize(localityRaw);
    const bySlug = new Map<string, NearbyPlace>();
    for (const item of list) {
      const name = String(item?.display_name || "").trim();
      const slug = normalizeSlugPart(String(item?.slug || ""));
      if (!slug || bySlug.has(slug)) continue;
      bySlug.set(slug, {
        name: name || slug,
        slug,
        city: cityKey,
      });
    }
    out[locality] = Array.from(bySlug.values());
  }
  return out;
}

export async function fetchNearbyPlacesGroupedByCity(): Promise<
  Record<string, Record<string, NearbyPlace[]>>
> {
  const out: Record<string, Record<string, NearbyPlace[]>> = {};
  for (const city of cities) {
    out[city] = await fetchNearbyPlacesForCity(city);
  }
  return out;
}

export function buildStaticLinks() {
  const items = [
    { href: "/", label: "Home" },
    ...SITEMAP_STATIC_LIST.map((slug) => ({
      href: `/${slug}`,
      label: titleize(slug),
    })),
  ];
  const byHref = new Map(items.map((x) => [x.href, x.label]));
  byHref.set("/about-us", "About Us");
  byHref.set("/owner", "For Homeowners");
  byHref.set("/tenant-policy", "Tenant Policy");
  byHref.set("/policy", "Privacy Policy");
  byHref.set("/student-hostel-in-kota", "Student Hostel in Kota");
  byHref.set("/hello-world-living", "HelloWorld Living");
  byHref.set("/refer", "Refer & Earn");
  byHref.set("/sitemap", "Sitemap");
  return items.map((x) => ({ ...x, label: byHref.get(x.href) || x.label }));
}

export function buildCityLinks() {
  return cities.map((city) => {
    const srp = srpSlug(city);
    const cityLabel = titleize(city);
    if (srp.startsWith("hostels-in-")) {
      return { href: `/${srp}`, label: `Hostels in ${cityLabel}` };
    }
    return { href: `/${srp}`, label: `Coliving in ${cityLabel}` };
  });
}

export function buildPropertyLinks(properties: SitemapProperty[]) {
  const out: { href: string; label: string }[] = [];
  const seen = new Set<string>();
  for (const p of properties) {
    const city = String(p.address?.city || p.city || "").trim();
    if (!city) continue;
    const srp = srpSlug(city);
    const locality = getLocalitySlug(p);
    const hdp = createHdpSlug(p);
    if (!hdp) continue;
    const href = locality ? `/${srp}/${locality}/${hdp}` : `/${srp}/${hdp}`;
    if (seen.has(href)) continue;
    seen.add(href);
    const label = getHdpPageTitle({ ...p, locality }, srp);
    out.push({ href: encodeURI(href), label });
  }
  return out;
}

export function buildLocalityLinks(properties: SitemapProperty[]) {
  const out: { href: string; label: string }[] = [];
  const seen = new Set<string>();

  for (const p of properties) {
    const city = String(p.address?.city || p.city || "").trim();
    const loc = getLocalitySlug(p);
    if (!city || !loc) continue;
    const srp = srpSlug(city);
    const defaultHref = `/${srp}/${loc}`;
    let mapped = mapColivingNestedLocalityToFlatHref(srp, loc, defaultHref);
    if (srp === "hostels-in-kota") {
      const flat = kotaHostelsFlatLocalityPath(loc);
      if (flat) mapped = { ...mapped, href: flat };
    }
    const href = mapped.href;
    if (seen.has(href)) continue;
    seen.add(href);
    const cityLabel = titleize(city);
    const localityLabel = mapped.localityLabelOverride ?? titleize(loc);
    const label = srp.startsWith("hostels-in-")
      ? `Hostels in ${localityLabel}, ${cityLabel}`
      : `Coliving PG in ${localityLabel}, ${cityLabel}`;
    out.push({ href: encodeURI(href), label });

    const roomHref = roomForRentHrefForLocality(city, href, loc);
    if (roomHref && !seen.has(roomHref)) {
      seen.add(roomHref);
      out.push({
        href: encodeURI(roomHref),
        label: `Room for rent in ${localityLabel}, ${cityLabel}`,
      });
    }

    if (isKotaCity(city)) {
      const pgFlat = kotaPgFlatLocalityPath(loc);
      if (pgFlat && !seen.has(pgFlat)) {
        seen.add(pgFlat);
        out.push({
          href: encodeURI(pgFlat),
          label: `PG in ${localityLabel}, ${cityLabel}`,
        });
      }
    }
  }

  return out;
}

export function buildLocalitySectionsByCity(
  properties: SitemapProperty[],
): SitemapSection[] {
  const seenHref = new Set<string>();
  const byCity = new Map<
    string,
    { cityLabel: string; items: { href: string; label: string }[] }
  >();

  for (const p of properties) {
    const cityRaw = String(p.address?.city || p.city || "").trim();
    const loc = getLocalitySlug(p);
    if (!cityRaw || !loc) continue;
    const srp = srpSlug(cityRaw);
    const defaultHref = `/${srp}/${loc}`;
    let mapped = mapColivingNestedLocalityToFlatHref(srp, loc, defaultHref);
    if (srp === "hostels-in-kota") {
      const flat = kotaHostelsFlatLocalityPath(loc);
      if (flat) mapped = { ...mapped, href: flat };
    }
    const href = mapped.href;
    if (seenHref.has(href)) continue;
    seenHref.add(href);

    const cityKey = cityRaw.toLowerCase().replace(/\s+/g, "_");
    const cityLabel = titleize(cityRaw);
    const localityLabel = mapped.localityLabelOverride ?? titleize(loc);
    const label = srp.startsWith("hostels-in-")
      ? `Hostels in ${localityLabel}, ${cityLabel}`
      : `Coliving PG in ${localityLabel}, ${cityLabel}`;
    const item = { href: encodeURI(href), label };

    const roomHref = roomForRentHrefForLocality(cityRaw, href, loc);
    const roomItem =
      roomHref && !seenHref.has(roomHref)
        ? {
            href: encodeURI(roomHref),
            label: `Room for rent in ${localityLabel}, ${cityLabel}`,
          }
        : null;

    const bucket = byCity.get(cityKey);
    if (bucket) {
      bucket.items.push(item);
      if (roomItem) {
        seenHref.add(roomHref);
        bucket.items.push(roomItem);
      }
    } else {
      const items = [item];
      if (roomItem) {
        seenHref.add(roomHref);
        items.push(roomItem);
      }
      byCity.set(cityKey, { cityLabel, items });
    }

    if (isKotaCity(cityRaw)) {
      const pgFlat = kotaPgFlatLocalityPath(loc);
      if (pgFlat && !seenHref.has(pgFlat)) {
        seenHref.add(pgFlat);
        const pgItem = {
          href: encodeURI(pgFlat),
          label: `PG in ${localityLabel}, ${cityLabel}`,
        };
        const kotaBucket = byCity.get(cityKey);
        if (kotaBucket) {
          kotaBucket.items.push(pgItem);
        }
      }
    }
  }

  return Array.from(byCity.entries())
    .sort((a, b) =>
      a[1].cityLabel.localeCompare(b[1].cityLabel, undefined, {
        sensitivity: "base",
      }),
    )
    .map(([, { cityLabel, items }]) => ({
      title: cityLabel,
      items: items.sort((x, y) =>
        x.label.localeCompare(y.label, undefined, { sensitivity: "base" }),
      ),
    }));
}

export function buildGenderLocalityLinks(properties: SitemapProperty[]) {
  const out: { href: string; label: string }[] = [];
  const seen = new Set<string>();

  for (const p of properties) {
    const cityRaw = String(p.address?.city || p.city || "").trim();
    const city = cityRaw.toLowerCase();
    const loc = getLocalitySlug(p);
    if (!city || !loc) continue;

    const cityLabel = titleize(cityRaw);
    const localityLabel = titleize(loc);

    if (city === "kota") {
      const kotaPairs = [
        {
          href: `/boys-hostel-in-${loc}-${city}`,
          label: `Boys hostels in ${localityLabel}, ${cityLabel} | HelloWorld`,
        },
        {
          href: `/girls-hostel-in-${loc}-${city}`,
          label: `Girls hostels in ${localityLabel}, ${cityLabel} | HelloWorld`,
        },
        {
          href: `/pg-for-boys-in-${loc}-${city}`,
          label: `PG for Men in ${localityLabel} ${cityLabel} | Gents & Boys PG`,
        },
        {
          href: `/pg-for-girls-in-${loc}-${city}`,
          label: `PG for Women in ${localityLabel} ${cityLabel} | Ladies & Girls PG`,
        },
      ];
      for (const { href, label } of kotaPairs) {
        if (!seen.has(href)) {
          seen.add(href);
          out.push({ href: encodeURI(href), label });
        }
      }
      continue;
    }

    const menHref = `/pg-for-boys-in-${loc}-${city}`;
    const womenHref = `/pg-for-girls-in-${loc}-${city}`;

    if (!seen.has(menHref)) {
      seen.add(menHref);
      out.push({
        href: encodeURI(menHref),
        label: `PG for Men in ${localityLabel} ${cityLabel} | Gents & Boys PG`,
      });
    }
    if (!seen.has(womenHref)) {
      seen.add(womenHref);
      out.push({
        href: encodeURI(womenHref),
        label: `PG for Women in ${localityLabel} ${cityLabel} | Ladies & Girls PG`,
      });
    }
  }
  return out;
}

export function buildGenderLocalitySectionsByCity(
  properties: SitemapProperty[],
): SitemapSection[] {
  const seenHref = new Set<string>();
  const byCity = new Map<
    string,
    { cityLabel: string; items: { href: string; label: string }[] }
  >();

  for (const p of properties) {
    const cityRaw = String(p.address?.city || p.city || "").trim();
    const city = cityRaw.toLowerCase();
    const loc = getLocalitySlug(p);
    if (!city || !cityRaw || !loc) continue;

    const cityLabel = titleize(cityRaw);
    const localityLabel = titleize(loc);
    const cityKey = cityRaw.toLowerCase().replace(/\s+/g, "_");

    const pushItem = (href: string, label: string) => {
      if (seenHref.has(href)) return;
      seenHref.add(href);
      const item = { href: encodeURI(href), label };
      const bucket = byCity.get(cityKey);
      if (bucket) {
        bucket.items.push(item);
      } else {
        byCity.set(cityKey, { cityLabel, items: [item] });
      }
    };

    if (city === "kota") {
      pushItem(
        `/boys-hostel-in-${loc}-${city}`,
        `Boys hostels in ${localityLabel}, ${cityLabel} | HelloWorld`,
      );
      pushItem(
        `/girls-hostel-in-${loc}-${city}`,
        `Girls hostels in ${localityLabel}, ${cityLabel} | HelloWorld`,
      );
      pushItem(
        `/pg-for-boys-in-${loc}-${city}`,
        `PG for Men in ${localityLabel} ${cityLabel} | Gents & Boys PG`,
      );
      pushItem(
        `/pg-for-girls-in-${loc}-${city}`,
        `PG for Women in ${localityLabel} ${cityLabel} | Ladies & Girls PG`,
      );
    } else {
      pushItem(
        `/pg-for-boys-in-${loc}-${city}`,
        `PG for Men in ${localityLabel} ${cityLabel} | Gents & Boys PG`,
      );
      pushItem(
        `/pg-for-girls-in-${loc}-${city}`,
        `PG for Women in ${localityLabel} ${cityLabel} | Ladies & Girls PG`,
      );
    }
  }

  return Array.from(byCity.entries())
    .sort((a, b) =>
      a[1].cityLabel.localeCompare(b[1].cityLabel, undefined, {
        sensitivity: "base",
      }),
    )
    .map(([, { cityLabel, items }]) => ({
      title: cityLabel,
      items: items.sort((x, y) =>
        x.label.localeCompare(y.label, undefined, { sensitivity: "base" }),
      ),
    }));
}

export function buildEventLinks(events: SitemapEvent[]) {
  return events.map((e) => {
    const city = String(e.city || "").trim();
    const href = `/events/${city}/${createEventSlug(e)}`;
    const label = `Event: ${String(e.name || "").trim() || `#${e.id}`} (${titleize(city)})`;
    return { href: encodeURI(href), label };
  });
}

export function buildBlogLinks() {
  const posts = getAllBlogPostsMeta().filter((p) => !p.noindex);
  return posts.map((p) => ({
    href: p.urlPath,
    label: p.title,
  }));
}

export function buildLandmarkLinks(landmarks: NearbyPlace[]) {
  const out: { href: string; label: string }[] = [];
  const seen = new Set<string>();
  for (const landmark of landmarks) {
    const slug = normalizeSlugPart(String(landmark.slug || ""));
    if (!slug) continue;
    const hrefs = buildLandmarkUrlFamily(slug, landmark.city);
    for (const href of hrefs) {
      if (seen.has(href)) continue;
      seen.add(href);
      out.push({ href: encodeURI(href), label: formatLandmarkUrlLabel(href) });
    }
  }
  return out;
}

export function buildLandmarkCityIndexLinks(
  groupedByCity: Record<string, Record<string, NearbyPlace[]>>,
) {
  return cities.map((city) => {
    const cityKey = normalizeSlugPart(city);
    const localities = groupedByCity[city] || {};
    const localityCount = Object.keys(localities).length;
    return {
      href: `/sitemap/landmarks/${cityKey}`,
      label: `${titleize(city)} (${localityCount.toLocaleString()} localities)`,
    };
  });
}

export function buildLandmarkSectionsForCity(
  city: string,
  localities: Record<string, NearbyPlace[]>,
): SitemapSection[] {
  const cityLabel = titleize(city);
  return Object.entries(localities)
    .map(([localityLabel, places]) => {
      const seen = new Set<string>();
      const items: { href: string; label: string }[] = [];
      for (const landmark of places) {
        const slug = normalizeSlugPart(String(landmark.slug || ""));
        if (!slug) continue;
        for (const href of buildLandmarkUrlFamily(slug, city)) {
          if (seen.has(href)) continue;
          seen.add(href);
          items.push({
            href: encodeURI(href),
            label: formatLandmarkUrlLabel(href),
          });
        }
      }
      return {
        title: `${localityLabel}, ${cityLabel}`,
        items: items.sort((a, b) =>
          a.label.localeCompare(b.label, undefined, { sensitivity: "base" }),
        ),
      };
    })
    .filter((section) => section.items.length > 0)
    .sort((a, b) =>
      a.title.localeCompare(b.title, undefined, { sensitivity: "base" }),
    );
}

export function buildGeneratedAt(): { iso: string; text: string } {
  const iso = new Date().toISOString();
  return { iso, text: iso.replace("T", " ").replace("Z", " UTC") };
}
