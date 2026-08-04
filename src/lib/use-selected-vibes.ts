"use client";

import { useEffect, useState } from "react";
import {
  persistSelectedVibes,
  readStoredSelectedVibes,
} from "@/src/lib/vibe-storage";

const MAX_SELECTED_VIBES = 5;

export function useSelectedVibes() {
  const [selectedVibes, setSelectedVibes] = useState<Set<string>>(
    () => new Set(),
  );

  useEffect(() => {
    setSelectedVibes(readStoredSelectedVibes());
  }, []);

  function toggleVibe(id: string) {
    setSelectedVibes((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else if (next.size < MAX_SELECTED_VIBES) {
        next.add(id);
      }
      persistSelectedVibes(next);
      return next;
    });
  }

  function clearSelectedVibes() {
    const next = new Set<string>();
    persistSelectedVibes(next);
    setSelectedVibes(next);
  }

  return { selectedVibes, toggleVibe, clearSelectedVibes };
}
