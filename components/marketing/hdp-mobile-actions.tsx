"use client";

import { useState } from "react";
import {
  HdpBookingModal,
  type HdpBookingModalMode,
} from "@/components/booking/hdp-booking-modal";
import { Button } from "@/components/ui/button";
import type { HdpPageView } from "@/src/lib/hdp/hdp-page-view";
import type { CategoryProps } from "@/src/models/category";
import { cn } from "@/src/lib/cn";

export function HdpMobileActions({
  view,
  categories,
  className,
}: {
  view: HdpPageView;
  categories?: readonly CategoryProps[];
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [initialMode, setInitialMode] = useState<HdpBookingModalMode>("tour");

  function openModal(mode: HdpBookingModalMode) {
    if (mode === "book" && view.soldOut) return;
    setInitialMode(mode);
    setOpen(true);
  }

  return (
    <>
      <footer
        className={cn(
          "fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white p-4 md:hidden",
          className,
        )}
        aria-label="Mobile booking actions"
      >
        <div className="mx-auto flex max-w-lg gap-2">
          <Button
            hierarchy="secondary-gray"
            size="sm"
            className="w-1/2"
            onClick={() => openModal("tour")}
          >
            Take a tour
          </Button>
          <Button
            size="sm"
            className="w-1/2 bg-hello-lime-400 text-gray-900 hover:bg-hello-lime-500"
            disabled={view.soldOut}
            onClick={() => openModal("book")}
          >
            {view.soldOut ? "Sold out" : "Book now"}
          </Button>
        </div>
      </footer>

      <HdpBookingModal
        open={open}
        onClose={() => setOpen(false)}
        view={view}
        categories={categories}
        initialMode={initialMode}
      />
    </>
  );
}
