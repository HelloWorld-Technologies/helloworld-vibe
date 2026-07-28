"use client";

import { useEffect, useState } from "react";
import { fetchVibesList } from "@/src/apis/vibes";
import {
  getFallbackVibeChips,
  mapVibeApiItemsToChips,
  persistVibeList,
  readStoredVibeList,
} from "@/src/lib/vibe-list-storage";
import type { VibeChip } from "@/src/tokens/vibes";

export function useVibeList() {
  const [vibes, setVibes] = useState<readonly VibeChip[]>(() =>
    getFallbackVibeChips(),
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadVibes() {
      const cached = readStoredVibeList();
      if (cached) {
        if (!cancelled) {
          setVibes(cached);
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);
      const response = await fetchVibesList();
      if (cancelled) return;

      if (response?.success && Array.isArray(response.data)) {
        const chips = mapVibeApiItemsToChips(response.data);
        if (chips.length > 0) {
          persistVibeList(chips);
          setVibes(chips);
          setIsLoading(false);
          return;
        }
      }

      setVibes(getFallbackVibeChips());
      setIsLoading(false);
    }

    void loadVibes();

    return () => {
      cancelled = true;
    };
  }, []);

  return { vibes, isLoading };
}
