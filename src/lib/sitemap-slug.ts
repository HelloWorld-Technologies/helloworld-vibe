import type { SitemapEvent, SitemapProperty } from "@/src/models/sitemap-types";

const createSlug = (str: string) => str.toLowerCase().split(" ").join("-");

export const srpSlug = (city: string) => {
  const hostels = ["kota"];
  if (hostels.includes(city?.toLowerCase())) {
    return `hostels-in-${city?.toLowerCase()}`;
  }
  return `coliving-in-${city?.toLowerCase()}`;
};

export const createHdpSlug = (property: {
  name?: string;
  display_name?: string;
}) => {
  const raw = (property?.name ?? property?.display_name ?? "").trim();
  const safe = raw || "listing";
  return createSlug(safe);
};

function getLocalityFromAddress(property: {
  address?: { line2?: string };
}): string {
  const line2 = property.address?.line2;
  if (!line2) return "";
  const params = line2.split(",");
  return params[params.length - 1]
    .trim()
    .toLowerCase()
    .split("-")
    .join("_")
    .split(" ")
    .join("_");
}

export const getLocalitySlug = (property: {
  locality?: string | null;
  address?: { line2?: string };
}): string => {
  if (property?.locality) {
    return property.locality
      .replace(/ /g, "-")
      .replace(/_/g, "-")
      .toLowerCase()
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
  if (property?.address?.line2) {
    const raw = getLocalityFromAddress(property);
    return raw
      ? raw
          .replace(/_/g, "-")
          .toLowerCase()
          .replace(/-+/g, "-")
          .replace(/^-+|-+$/g, "")
      : "";
  }
  return "";
};

export const createEventSlug = (event: SitemapEvent) => {
  return `${event.name.split(" ").join("-")}-${event.id}`;
};

export function isKotaCity(city: string): boolean {
  return (
    String(city ?? "")
      .replace(/_/g, " ")
      .trim()
      .toLowerCase() === "kota"
  );
}

export function colivingFlatLocalityPath(
  cityKey: string,
  localitySlug: string,
): string {
  const city = String(cityKey || "")
    .trim()
    .toLowerCase()
    .replace(/^-+|-+$/g, "");
  const loc = String(localitySlug || "")
    .trim()
    .toLowerCase()
    .replace(/^-+|-+$/g, "");
  if (!city || !loc) return "";
  return `/coliving-in-${loc}-${city}`;
}

export function roomForRentFlatLocalityPath(
  cityKey: string,
  localitySlug: string,
): string {
  const city = String(cityKey || "")
    .trim()
    .toLowerCase()
    .replace(/^-+|-+$/g, "");
  const loc = String(localitySlug || "")
    .trim()
    .toLowerCase()
    .replace(/^-+|-+$/g, "");
  if (!city || !loc) return "";
  return `/room-for-rent-in-${loc}-${city}`;
}

export function kotaHostelsFlatLocalityPath(localitySlug: string): string {
  const loc = String(localitySlug || "")
    .trim()
    .toLowerCase()
    .replace(/^-+|-+$/g, "");
  if (!loc) return "";
  return `/hostels-in-${loc}-kota`;
}

export function kotaPgFlatLocalityPath(localitySlug: string): string {
  const loc = String(localitySlug || "")
    .trim()
    .toLowerCase()
    .replace(/^-+|-+$/g, "");
  if (!loc) return "";
  return `/pg-in-${loc}-kota`;
}

export function getPropertyCityForUrl(property: {
  address?: { city?: string };
  city?: string;
}): string {
  return String(property.address?.city ?? property.city ?? "").trim();
}

/** Gender-specific hostel SRP path (e.g. boys-hostels-in-kota). */
export function genderedHostelsSrpSlug(
  city: string,
  gender: "boys" | "girls",
): string {
  const normalizedCity = String(city ?? "")
    .trim()
    .toLowerCase();
  return `${gender}-hostels-in-${normalizedCity}`;
}

export function marketingSrpSlugFromProperty(property: {
  address?: { city?: string };
  city?: string;
  gender?: string;
}): string {
  const city = getPropertyCityForUrl(property);
  if (!isKotaCity(city)) {
    return srpSlug(city);
  }
  const gender = String(property.gender || "").toUpperCase();
  if (gender === "MALE") return genderedHostelsSrpSlug(city, "boys");
  if (gender === "FEMALE") return genderedHostelsSrpSlug(city, "girls");
  return srpSlug(city);
}

/** Canonical nested HDP path from an SRP listing (e.g. /coliving-in-bangalore/hsr-layout/helloworld-arden). */
export function getPropertyHref(property: {
  name?: string;
  display_name?: string;
  locality?: string | null;
  address?: { line2?: string; city?: string };
  city?: string;
  gender?: string;
}): string {
  const srp = marketingSrpSlugFromProperty(property);
  const locality = getLocalitySlug(property);
  const hdp = createHdpSlug(property);
  return locality ? `/${srp}/${locality}/${hdp}` : `/${srp}/${hdp}`;
}

/** Nested HDP path from city, locality slug, and property display name. */
export function buildNestedHdpHref(
  city: string,
  localitySlug: string,
  propertyName: string,
): string {
  const srp = marketingSrpSlugFromProperty({
    city,
    address: { city },
  });
  const locality = localitySlug
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/_/g, "-");
  const hdp = createHdpSlug({ name: propertyName });
  return locality ? `/${srp}/${locality}/${hdp}` : `/${srp}/${hdp}`;
}
