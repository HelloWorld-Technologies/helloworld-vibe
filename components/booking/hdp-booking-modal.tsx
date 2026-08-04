"use client";

import { useEffect, useId, useState } from "react";
import { HdpBookingCard } from "@/components/marketing/hdp-booking-card";
import { Modal } from "@/components/ui/modal";
import type { HdpPageView } from "@/src/lib/hdp/hdp-page-view";
import type { CategoryProps } from "@/src/models/category";

export type HdpBookingModalMode = "tour" | "book";

export function HdpBookingModal({
  open,
  onClose,
  view,
  categories,
  initialMode = "tour",
}: {
  open: boolean;
  onClose: () => void;
  view: HdpPageView;
  categories?: readonly CategoryProps[];
  initialMode?: HdpBookingModalMode;
}) {
  const titleId = useId();
  const [sessionKey, setSessionKey] = useState(0);
  const [mode, setMode] = useState<HdpBookingModalMode>(initialMode);

  useEffect(() => {
    if (!open) return;
    setMode(initialMode);
    setSessionKey((current) => current + 1);
  }, [open, initialMode]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      labelledBy={titleId}
      closeLabel="Close booking dialog"
      maxWidthClassName="max-w-lg"
      className="p-5 sm:p-6"
    >
      <h2 id={titleId} className="sr-only">
        {mode === "tour" ? "Take a Tour" : "Book Now"}
      </h2>

      {open ? (
        <HdpBookingCard
          key={`${sessionKey}-${mode}`}
          variant="modal"
          view={view}
          categories={categories}
          initialMode={mode}
        />
      ) : null}
    </Modal>
  );
}
