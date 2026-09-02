import type { VibeChip } from "@/src/tokens/vibes";
import { vibeChips } from "@/src/tokens/vibes";

export type HdpVibeBadgeApi = {
  vibeId?: number | string;
  vibeScore?: number | string;
};

export type HdpPropertyVibeApi = {
  vibe_id?: number | string;
  code?: string;
  display_name?: string;
  count?: number;
  percentage?: number;
};

export type HdpSelectedVibeMatch = {
  id: string;
  emoji: string;
  label: string;
  score: number;
};

export type HdpResidentInterest = {
  emoji: string;
  label: string;
};

function normalizeCode(code: string) {
  return code.trim().toLowerCase().replace(/_/g, "-");
}

function chipByApiId(
  vibeId: number,
  chips: readonly VibeChip[],
): VibeChip | undefined {
  return (
    chips.find((chip) => chip.apiId === vibeId) ??
    vibeChips.find((chip) => chip.apiId === vibeId)
  );
}

function chipByCode(
  code: string,
  chips: readonly VibeChip[],
): VibeChip | undefined {
  const normalized = normalizeCode(code);
  return (
    chips.find((chip) => chip.id === normalized) ??
    vibeChips.find((chip) => chip.id === normalized)
  );
}

export function parseVibeMatchScore(raw: unknown): number | undefined {
  const score = typeof raw === "number" ? raw : Number(raw);
  if (!Number.isFinite(score) || score <= 0) return undefined;
  return Math.round(score);
}

export function mapVibeBadgesToSelectedMatches(
  badges: readonly HdpVibeBadgeApi[] | null | undefined,
  chips: readonly VibeChip[] = vibeChips,
): HdpSelectedVibeMatch[] {
  if (!Array.isArray(badges) || badges.length === 0) return [];

  const matches: HdpSelectedVibeMatch[] = [];
  for (const badge of badges) {
    const vibeId = Number(badge.vibeId);
    if (!Number.isFinite(vibeId) || vibeId <= 0) continue;

    const score = parseVibeMatchScore(badge.vibeScore) ?? 0;
    const chip = chipByApiId(vibeId, chips);

    matches.push({
      id: String(vibeId),
      emoji: chip?.emoji ?? "✨",
      label: chip?.label ?? `Vibe ${vibeId}`,
      score,
    });
  }

  return matches;
}

export function mapPropertyVibesToInterests(
  propertyVibes: readonly HdpPropertyVibeApi[] | null | undefined,
  chips: readonly VibeChip[] = vibeChips,
): HdpResidentInterest[] {
  if (!Array.isArray(propertyVibes) || propertyVibes.length === 0) return [];

  const interests: HdpResidentInterest[] = [];
  const seen = new Set<string>();

  for (const item of propertyVibes) {
    const code = normalizeCode(String(item.code || ""));
    const label = String(item.display_name || code || "").trim();
    if (!label) continue;

    const key = code || label.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);

    const chip = code ? chipByCode(code, chips) : undefined;
    interests.push({
      emoji: chip?.emoji ?? "✨",
      label,
    });
  }

  return interests;
}
