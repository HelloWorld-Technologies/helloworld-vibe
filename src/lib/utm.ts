function parseQueryString(search: string): Record<string, string> {
  const normalized = search.startsWith("?") ? search.slice(1) : search;
  if (!normalized) return {};

  return Object.fromEntries(
    normalized.split("&").flatMap((pair) => {
      const [rawKey, rawValue = ""] = pair.split("=");
      if (!rawKey) return [];
      return [[decodeURIComponent(rawKey), decodeURIComponent(rawValue)]];
    }),
  );
}

export function getStoredUtmSource(): string | undefined {
  if (typeof window === "undefined") return undefined;

  const utmData = localStorage.getItem("utmInfo");
  if (!utmData?.includes("utm_source")) return undefined;

  return parseQueryString(utmData).utm_source;
}
