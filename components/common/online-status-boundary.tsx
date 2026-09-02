"use client";

import type { ReactNode } from "react";
import { OfflineErrorPage } from "@/components/marketing/error-state-interactive-pages";
import { useOnline } from "@/src/lib/use-online";

export function OnlineStatusBoundary({ children }: { children: ReactNode }) {
  const isOnline = useOnline();

  if (!isOnline) {
    return <OfflineErrorPage />;
  }

  return children;
}
