"use client";

import { useId, useState } from "react";
import { cn } from "@/src/lib/cn";

export type FaqAccordionItem = {
  id: string;
  question: string;
  answer: string;
};

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M5 7.5L10 12.5L15 7.5"
        stroke="currentColor"
        strokeWidth="1.67"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FaqAccordion({
  items,
  className,
}: {
  items: readonly FaqAccordionItem[];
  className?: string;
  /** @deprecated All items open by default; kept for call-site compatibility. */
  defaultOpenId?: string;
}) {
  const baseId = useId();
  const [openIds, setOpenIds] = useState<ReadonlySet<string>>(
    () => new Set(items.map((item) => item.id)),
  );

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {items.map((item) => {
        const isOpen = openIds.has(item.id);
        const panelId = `${baseId}-${item.id}-panel`;
        const buttonId = `${baseId}-${item.id}-button`;

        return (
          <article
            key={item.id}
            className={cn(
              "rounded-[10px] border border-black/[0.08] bg-white px-6 py-4",
              "shadow-[0_1px_5.5px_rgba(0,0,0,0.04)]",
            )}
          >
            <button
              id={buttonId}
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() =>
                setOpenIds((current) => {
                  const next = new Set(current);
                  if (next.has(item.id)) {
                    next.delete(item.id);
                  } else {
                    next.add(item.id);
                  }
                  return next;
                })
              }
              className="flex w-full items-start justify-between gap-6 text-left"
            >
              <span className="text-lg font-medium leading-7 text-black">
                {item.question}
              </span>
              <ChevronIcon
                className={cn(
                  "mt-1 size-5 shrink-0 text-gray-700 transition-transform duration-200",
                  isOpen && "rotate-180",
                )}
              />
            </button>

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={cn(
                "grid transition-[grid-template-rows,opacity] duration-200 ease-out",
                isOpen
                  ? "mt-4 grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <p className="text-sm font-medium leading-5 text-[#323232]">
                  {item.answer}
                </p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
