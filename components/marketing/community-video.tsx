import Link from "next/link";
import { CommunityBoringWeekendsHeading } from "@/components/marketing/community-headings";
import { cn } from "@/src/lib/cn";
import {
  communityExplorePropertiesHref,
  communityPageVideo,
} from "@/src/tokens/community";
import { pageShell } from "@/src/tokens/layout";

export function CommunityVideo() {
  return (
    <section className="bg-white">
      <div className={pageShell.community}>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-14">
          <div className="overflow-hidden rounded-tl-[1.685rem] bg-gray-900 shadow-[9px_8px_0_0_#0baaec,5px_5px_23px_rgba(0,0,0,0.15)] lg:w-[48.5%] lg:max-w-[38.8125rem]">
            <video
              className="aspect-[621/369] w-full object-cover"
              src={communityPageVideo.file}
              muted
              loop
              playsInline
              autoPlay
              aria-label={communityPageVideo.name}
            />
          </div>

          <div className="flex flex-col items-center text-center lg:w-[47.3%] lg:max-w-[37.8125rem]">
            <div className="relative inline-flex flex-col items-end lg:pb-10">
              <CommunityBoringWeekendsHeading size="desktop" />
              <span
                aria-hidden
                className={cn(
                  "relative mt-2 block w-fit rotate-[-3.88deg] bg-blue-light-300 px-2 py-0.5",
                  "font-caveat text-xs leading-none text-gray-900 lg:px-3 lg:py-1 lg:text-base",
                  "lg:absolute bottom-4 lg:bottom-6 lg:right-0 lg:mt-0",
                )}
              >
                ✦ ps. monday is also a vibe
              </span>
            </div>

            <Link
              href={communityExplorePropertiesHref}
              className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-hello-lime-400 px-5 text-base font-semibold text-gray-800 shadow-xs transition-colors hover:bg-hello-lime-300 sm:w-auto sm:min-w-[11.4375rem]"
            >
              Explore Properties
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
