"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import {
  persistSelectedVibes,
  readStoredSelectedVibes,
} from "@/src/lib/vibe-storage";

const MAX_SELECTED_VIBES = 5;

type Listener = () => void;

const listeners = new Set<Listener>();
const EMPTY_IDS: readonly string[] = [];

let hydrated = false;
/** Sorted chip ids — immutable snapshot for useSyncExternalStore. */
let selectedIds: readonly string[] = EMPTY_IDS;

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getServerSnapshot() {
  return EMPTY_IDS;
}

function getSnapshot() {
  return selectedIds;
}

function setSelectedIds(next: ReadonlySet<string>) {
  const sorted = Object.freeze([...next].sort());
  if (
    sorted.length === selectedIds.length &&
    sorted.every((id, index) => id === selectedIds[index])
  ) {
    return;
  }
  selectedIds = sorted;
  persistSelectedVibes(next);
  emit();
}

function hydrateFromStorage() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  const stored = readStoredSelectedVibes();
  selectedIds = Object.freeze([...stored].sort());
  emit();
}

export function useSelectedVibes() {
  const ids = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    hydrateFromStorage();
  }, []);

  const selectedVibes = new Set(ids);

  const toggleVibe = useCallback((id: string) => {
    hydrateFromStorage();
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else if (next.size < MAX_SELECTED_VIBES) {
      next.add(id);
    }
    setSelectedIds(next);
  }, []);

  const clearSelectedVibes = useCallback(() => {
    hydrateFromStorage();
    setSelectedIds(new Set());
  }, []);

  return { selectedVibes, toggleVibe, clearSelectedVibes };
}
