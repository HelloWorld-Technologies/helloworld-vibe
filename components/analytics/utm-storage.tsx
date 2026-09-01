"use client";

import { useEffect } from "react";

export function UtmStorage() {
  useEffect(() => {
    const search = document.location.search;
    if (search.includes("utm_source")) {
      localStorage.setItem("utmInfo", search);
    }
  }, []);

  return null;
}
