"use client";

import { useEffect, useMemo, useState } from "react";
import { TabNav } from "@/components/ui/tab-nav";
import {
  hdpSectionNavItems,
  type HdpSectionId,
} from "@/src/tokens/hdp";
import { cn } from "@/src/lib/cn";

export function HdpSectionNav({
  className,
  hiddenIds,
}: {
  className?: string;
  hiddenIds?: readonly HdpSectionId[];
}) {
  const items = useMemo(
    () =>
      hdpSectionNavItems.filter((item) => !hiddenIds?.includes(item.id)),
    [hiddenIds],
  );
  const [active, setActive] = useState<HdpSectionId>(items[0]?.id ?? "about");

  useEffect(() => {
    if (!items.some((item) => item.id === active)) {
      setActive(items[0]?.id ?? "about");
    }
  }, [items, active]);

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(`hdp-${item.id}`))
      .filter(Boolean) as HTMLElement[];

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) {
          const id = visible.target.id.replace("hdp-", "") as HdpSectionId;
          setActive(id);
        }
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [items]);

  function scrollToSection(id: HdpSectionId) {
    document.getElementById(`hdp-${id}`)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    setActive(id);
  }

  if (items.length === 0) return null;

  return (
    <div
      className={cn(
        "sticky top-[4.5rem] z-30 bg-white/95 py-3 backdrop-blur-sm md:top-18",
        className,
      )}
    >
      <TabNav
        items={items}
        value={active}
        onChange={scrollToSection}
        heading=""
        aria-label="Property sections"
      />
    </div>
  );
}
