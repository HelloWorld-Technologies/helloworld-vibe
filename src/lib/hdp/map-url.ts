import type { Property } from "@/src/models/property";

export function completePropertyAddress(property: {
  address?: {
    line1?: string | null;
    line2?: string | null;
    city?: string | null;
    pincode?: string | number | null;
  } | null;
}): string {
  const address = property.address;
  return `${address?.line1 || ""}, ${address?.line2 || ""}, ${
    address?.city || ""
  } - ${address?.pincode || ""}`;
}

function toHttps(url: string): string {
  return url.startsWith("http://")
    ? url.replace(/^http:\/\//i, "https://")
    : url;
}

/** Prefer map_url; fall back to coordinates or address search. Matches next `mapUrl`. */
export function buildPropertyMapUrl(property: {
  map_url?: string | null;
  address?: {
    latitude?: number | null;
    longitude?: number | null;
    line1?: string | null;
    line2?: string | null;
    city?: string | null;
    pincode?: string | number | null;
  } | null;
}): string | undefined {
  const mapUrl = property.map_url?.trim();
  if (mapUrl) return toHttps(mapUrl);

  const latitude = Number(property.address?.latitude);
  const longitude = Number(property.address?.longitude);
  if (Number.isFinite(latitude) && Number.isFinite(longitude) && latitude && longitude) {
    return `https://www.google.com/maps/place/${latitude},${longitude}`;
  }

  const query = completePropertyAddress(property).trim();
  if (query && query !== ", ,  -") {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  }

  return undefined;
}

/**
 * Google Maps iframe src — matches next Neighbourhood:
 * `embedded_url` or lat/lng / address embed query.
 */
export function buildPropertyEmbedMapUrl(property: {
  embedded_url?: string | null;
  address?: {
    latitude?: number | null;
    longitude?: number | null;
    line1?: string | null;
    line2?: string | null;
    city?: string | null;
    pincode?: string | number | null;
  } | null;
}): string | undefined {
  const embedded = property.embedded_url?.trim();
  if (embedded) return toHttps(embedded);

  const latitude = Number(property.address?.latitude);
  const longitude = Number(property.address?.longitude);
  if (Number.isFinite(latitude) && Number.isFinite(longitude) && latitude && longitude) {
    return `https://maps.google.com/maps?q=${latitude},${longitude}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
  }

  const query = completePropertyAddress(property).trim();
  if (query && query !== ", ,  -") {
    return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
  }

  return undefined;
}

export function buildPropertyMapUrlFromView(options: {
  mapUrl?: string;
  latitude?: number;
  longitude?: number;
  addressLine?: string;
  locality?: string;
}): string | undefined {
  return buildPropertyMapUrl({
    map_url: options.mapUrl,
    address: {
      latitude: options.latitude,
      longitude: options.longitude,
      line1: options.addressLine,
      line2: options.locality,
    },
  });
}
