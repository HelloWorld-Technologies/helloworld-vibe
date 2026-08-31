"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { CommunityFeedHeading } from "@/components/marketing/community-headings";
import { HomepageCarouselNav } from "@/components/marketing/homepage-carousel-nav";
import { LocalityPaginationDots } from "@/components/marketing/locality-card";
import { MomentCard } from "@/components/marketing/moment-card";
import { cn } from "@/src/lib/cn";
import { communityInstagramUrl } from "@/src/tokens/community";
import { homepageFeedMoments } from "@/src/tokens/homepage";
import { pageShell } from "@/src/tokens/layout";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 16 16" fill="none" className={className}>
      <rect
        x="1.5"
        y="1.5"
        width="13"
        height="13"
        rx="3.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="11.75" cy="4.25" r="0.75" fill="currentColor" />
    </svg>
  );
}

function FollowButton({ className }: { className?: string }) {
  return (
    <Link
      href={communityInstagramUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex h-9 shrink-0 items-center gap-1 rounded-lg bg-gray-800 px-3.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-gray-900",
        className,
      )}
    >
      Follow
      <InstagramIcon className="size-4" />
    </Link>
  );
}

export function CommunityFeed() {
  const [desktopIndex, setDesktopIndex] = useState(0);
  const [mobileIndex, setMobileIndex] = useState(0);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const moments = homepageFeedMoments;
  const count = moments.length;
  const visibleCount = 4;

  function goToMobileIndex(index: number) {
    setMobileIndex(index);
    const container = scrollRef.current;
    const card = container?.children[index] as HTMLElement | undefined;
    card?.scrollIntoView({
      behavior: "smooth",
      inline: "start",
      block: "nearest",
    });
  }

  function handleMobileScroll() {
    const container = scrollRef.current;
    if (!container) return;

    const cards = Array.from(container.children) as HTMLElement[];
    const scrollLeft = container.scrollLeft;
    const nextIndex = cards.findIndex((card, index) => {
      const nextCard = cards[index + 1];
      if (!nextCard) return index === cards.length - 1;
      return scrollLeft < nextCard.offsetLeft - container.offsetLeft - 16;
    });

    setMobileIndex(nextIndex === -1 ? 0 : nextIndex);
  }

  const desktopItems = moments.slice(desktopIndex, desktopIndex + visibleCount);

  return (
    <section className="bg-white pb-12 sm:pb-16 lg:pb-20">
      <div className={pageShell.community}>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-8">
          <CommunityFeedHeading />
          <FollowButton />
        </div>

        <div className="mt-8 hidden gap-6 lg:flex">
          {desktopItems.map((item) => (
            <MomentCard
              key={item.id}
              item={item}
              playWithAudio
              isActivePlaying={playingId === item.id}
              onPlayingChange={(playing) =>
                setPlayingId(playing ? item.id : null)
              }
            />
          ))}
        </div>

        <HomepageCarouselNav
          className="mt-8 hidden lg:flex"
          pageCount={Math.max(1, count - visibleCount + 1)}
          activeIndex={desktopIndex}
          prevDisabled={desktopIndex === 0}
          nextDisabled={desktopIndex >= count - visibleCount}
          onPrev={() => setDesktopIndex((index) => Math.max(0, index - 1))}
          onNext={() =>
            setDesktopIndex((index) =>
              Math.min(count - visibleCount, index + 1),
            )
          }
          onSelectPage={(index) =>
            setDesktopIndex(
              Math.max(0, Math.min(index, Math.max(0, count - visibleCount))),
            )
          }
        />

        <div className="mt-8 lg:hidden">
          <div
            ref={scrollRef}
            onScroll={handleMobileScroll}
            className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-none"
          >
            {moments.map((item) => (
              <MomentCard
                key={item.id}
                item={item}
                playWithAudio
                isActivePlaying={playingId === item.id}
                onPlayingChange={(playing) =>
                  setPlayingId(playing ? item.id : null)
                }
              />
            ))}
          </div>
          <div className="mt-6">
            <LocalityPaginationDots
              count={count}
              activeIndex={mobileIndex}
              onSelect={goToMobileIndex}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
