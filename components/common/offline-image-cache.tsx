"use client";

import { useEffect } from "react";

/** Registers the worker that pre-caches the illustration shown while offline. */
export function OfflineImageCache() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    void navigator.serviceWorker.register("/sw.js", {
      scope: "/",
      updateViaCache: "none",
    });
  }, []);

  return null;
}
