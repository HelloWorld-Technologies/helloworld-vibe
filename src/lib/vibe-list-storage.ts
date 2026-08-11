import type { VibeApiItem } from "@/src/models/vibe";
import { vibeChips, type VibeChip } from "@/src/tokens/vibes";

const STORAGE_KEY = "helloworld-vibe-list";

const emojiByCode = Object.fromEntries(
  vibeChips.map((chip) => [chip.id, chip.emoji]),
) as Record<string, string>;

const apiIdByCode = Object.fromEntries(
  vibeChips
    .filter((chip) => typeof chip.apiId === "number")
    .map((chip) => [chip.id, chip.apiId]),
) as Record<string, number>;

function normalizeCode(code: string) {
  return code.trim().toLowerCase().replace(/_/g, "-");
}

export function mapVibeApiItemToChip(item: VibeApiItem): VibeChip | null {
  const code = normalizeCode(item.code || "");
  if (!code) return null;

  const apiId =
    typeof item.id === "number" && Number.isFinite(item.id)
      ? item.id
      : apiIdByCode[code];

  return {
    id: code,
    label: item.display_name?.trim() || code,
    emoji: emojiByCode[code] ?? "✨",
    ...(apiId !== undefined ? { apiId } : {}),
  };
}

/** Map selected chip ids (codes) to numeric vibe API ids for SRP filter.vibes. */
export function selectedVibeApiIds(
  selectedIds: ReadonlySet<string>,
  chips: readonly VibeChip[],
): number[] {
  const ids: number[] = [];
  const seen = new Set<number>();

  for (const chip of chips) {
    if (!selectedIds.has(chip.id)) continue;
    const apiId = chip.apiId ?? apiIdByCode[chip.id];
    if (typeof apiId !== "number" || !Number.isFinite(apiId) || seen.has(apiId)) {
      continue;
    }
    seen.add(apiId);
    ids.push(apiId);
  }

  return ids;
}

export function mapVibeApiItemsToChips(
  items: readonly VibeApiItem[],
): VibeChip[] {
  const seen = new Set<string>();
  const chips: VibeChip[] = [];

  for (const item of items) {
    const chip = mapVibeApiItemToChip(item);
    if (!chip || seen.has(chip.id)) continue;
    seen.add(chip.id);
    chips.push(chip);
  }

  return chips;
}

export function readStoredVibeList(): VibeChip[] | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return null;

    const chips = parsed
      .filter(
        (item): item is VibeChip =>
          !!item &&
          typeof item === "object" &&
          typeof (item as VibeChip).id === "string" &&
          typeof (item as VibeChip).label === "string" &&
          typeof (item as VibeChip).emoji === "string",
      )
      .map((chip) => {
        const code = normalizeCode(chip.id);
        const apiId =
          typeof chip.apiId === "number" && Number.isFinite(chip.apiId)
            ? chip.apiId
            : apiIdByCode[code];
        return {
          ...chip,
          id: code || chip.id,
          emoji: emojiByCode[code] ?? chip.emoji,
          ...(apiId !== undefined ? { apiId } : {}),
        };
      });

    return chips.length > 0 ? chips : null;
  } catch {
    return null;
  }
}

export function persistVibeList(chips: readonly VibeChip[]): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(chips));
}

export function getFallbackVibeChips(): readonly VibeChip[] {
  return vibeChips;
}
