/** Case-insensitive amenity dedupe preserving first-seen order. */
export function dedupeAmenityLabels(labels: readonly string[] = []): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const label of labels) {
    const normalized = String(label || "")
      .replace(/_/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
    if (!normalized || normalized === "none" || seen.has(normalized)) continue;
    seen.add(normalized);
    result.push(String(label).trim());
  }
  return result;
}
