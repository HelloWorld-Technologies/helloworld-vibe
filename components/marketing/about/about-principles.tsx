"use client";

import { useEffect, useRef } from "react";
import { aboutPageCopy, aboutPrinciples } from "@/src/tokens/about";
import { pageLayout } from "@/src/tokens/layout";

const AUTO_SCROLL_MS = 3000;

export function AboutPrinciples() {
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const indexRef = useRef(0);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    const scrollToIndex = (index: number) => {
      const item = itemRefs.current[index];
      if (!item || !list) return;

      list.scrollTo({
        top: item.offsetTop,
        behavior: "smooth",
      });
    };

    const id = window.setInterval(() => {
      if (document.hidden) return;
      if (list.matches(":hover") || list.contains(document.activeElement)) {
        return;
      }

      const next = (indexRef.current + 1) % aboutPrinciples.length;
      indexRef.current = next;
      scrollToIndex(next);
    }, AUTO_SCROLL_MS);

    return () => window.clearInterval(id);
  }, []);

  return (
    <section
      className="bg-[linear-gradient(58deg,#3b4760_3%,#252b37_75%)] py-12 md:py-16"
      aria-labelledby="about-principles-heading"
    >
      <div
        className={`${pageLayout.container} flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-20`}
      >
        <div className="max-w-md shrink-0">
          <h2
            id="about-principles-heading"
            className="font-satoshi text-3xl font-bold tracking-tight text-[#fcbc2b] md:text-5xl md:leading-[3.75rem] md:tracking-[-0.06rem]"
          >
            {aboutPageCopy.principlesTitle}
          </h2>
          <p className="mt-4 text-base font-medium leading-7 text-white md:text-lg">
            {aboutPageCopy.principlesSubtitle}
          </p>
        </div>

        <ul
          ref={listRef}
          className="relative max-h-[24rem] w-full max-w-lg space-y-8 overflow-y-auto pr-2 [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)] [scrollbar-width:thin]"
          aria-live="polite"
        >
          {aboutPrinciples.map((principle, index) => (
            <li
              key={principle.number}
              ref={(node) => {
                itemRefs.current[index] = node;
              }}
              className="flex items-start gap-4"
            >
              <span className="font-satoshi text-5xl font-bold tracking-tight text-white md:text-7xl md:leading-[5.625rem]">
                {principle.number}
              </span>
              <div className="pt-2">
                <h3 className="text-2xl font-medium text-white md:text-3xl">
                  {principle.title}
                </h3>
                <p className="mt-2 text-sm font-medium leading-6 text-white md:text-base">
                  {principle.body}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
