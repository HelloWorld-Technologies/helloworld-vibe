export type HdpTitleProperty = {
  display_name?: string;
  name?: string;
  gender?: string;
  address?: { line2?: string; city?: string };
  locality?: string | null;
};

function toTitleCase(s: string): string {
  return String(s || "")
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

function normalizeDisplayName(raw: string): string {
  const s = String(raw || "").trim();
  if (!s) return "";

  const m = s.match(/^helloworld\b(.*)$/i);
  if (m) {
    const rest = String(m[1] || "").trim();
    return rest ? `HelloWorld ${toTitleCase(rest)}` : "HelloWorld";
  }

  if (s === s.toLowerCase()) return toTitleCase(s);

  return s;
}

export function getHdpPageTitle(
  property: HdpTitleProperty,
  srpSlugValue: string,
): string {
  const displayNameRaw =
    property?.display_name?.trim() || property?.name?.trim() || "HelloWorld";
  const displayName = normalizeDisplayName(displayNameRaw) || "HelloWorld";
  const addr = property?.address;
  const cityRaw =
    addr?.city?.trim().replace(/_/g, " ").replace(/-/g, " ") || "";
  const city = cityRaw ? toTitleCase(cityRaw) : "";
  const localityRaw =
    property?.locality?.trim().replace(/_/g, " ").replace(/-/g, " ") || "";
  const locality = localityRaw ? toTitleCase(localityRaw) : "";
  const locationSuffix =
    locality && city ? `${locality}, ${city}` : city || locality || "";
  const isHostel = srpSlugValue?.toLowerCase().includes("hostels-in-");

  if (!isHostel) {
    const inPart = locationSuffix ? ` in ${locationSuffix}` : "";
    return `${displayName} – Coliving PG${inPart}`;
  }

  const g = String(property?.gender || "")
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, "_");
  if (g === "MALE" || g === "BOYS" || g === "BOYS_ONLY") {
    return locationSuffix
      ? `${displayName} – Boys hostel in ${locationSuffix}`
      : `${displayName} – Boys hostel`;
  }
  if (g === "FEMALE" || g === "GIRLS" || g === "GIRLS_ONLY") {
    return locationSuffix
      ? `${displayName} – Girls hostel in ${locationSuffix}`
      : `${displayName} – Girls hostel`;
  }
  return locationSuffix
    ? `${displayName} – Student hostel in ${locationSuffix} | Hostel for Boys & Girls`
    : `${displayName} – Student hostel | Hostel for Boys & Girls`;
}
