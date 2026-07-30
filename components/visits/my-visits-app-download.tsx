import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { AppStoreIcon, PlayStoreIcon } from "@/components/brand/store-icons";
import { cn } from "@/src/lib/cn";
import { pageLayout } from "@/src/tokens/layout";

function StoreBadge({
  href,
  topLabel,
  bottomLabel,
  icon,
}: {
  href: string;
  topLabel: string;
  bottomLabel: string;
  icon: ReactNode;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-11 min-w-0 flex-1 items-center gap-2 rounded-lg bg-hello-lime-400 px-3 text-black transition-colors hover:bg-hello-lime-500 sm:h-[3.375rem] sm:px-4"
    >
      {icon}
      <span className="min-w-0 text-left">
        <span className="block text-[10px] font-medium leading-[18px] sm:text-xs">
          {topLabel}
        </span>
        <span className="block text-sm font-bold leading-5 sm:text-lg sm:leading-7">
          {bottomLabel}
        </span>
      </span>
    </Link>
  );
}

export function MyVisitsAppDownload() {
  return (
    <section className="flex flex-1 flex-col bg-white">
      <div
        className={cn(
          pageLayout.container,
          "flex flex-1 flex-col items-center justify-center py-10 sm:py-14",
        )}
      >
        <div className="mx-auto flex w-full max-w-xl flex-col items-center text-center">
          <div className="relative w-full max-w-[22rem] sm:max-w-[26rem]">
            <Image
              src="/assets/my-visits/phones.png"
              alt="HelloWorld app showing My Visits screens"
              width={339}
              height={393}
              priority
              className="h-auto w-full object-contain"
            />
          </div>

          <h1 className="mt-8 text-3xl font-bold tracking-tight text-gray-900 sm:mt-10 sm:text-4xl">
            Your Next Home is Just a Tap Away
          </h1>

          <p className="mt-4 max-w-md text-base leading-7 text-gray-600 sm:text-lg">
            From finding the perfect room to moving in, manage everything from
            the Helloworld app.
          </p>

          <div className="mt-8 flex w-full max-w-md gap-3">
            <StoreBadge
              href="https://play.google.com/store/apps/details?id=com.thehelloworld"
              topLabel="Get it on"
              bottomLabel="Google Play"
              icon={<PlayStoreIcon className="size-5 shrink-0 sm:size-7" />}
            />
            <StoreBadge
              href="https://itunes.apple.com/in/app/hello-world-homes/id1481207096"
              topLabel="Get it on"
              bottomLabel="App Store"
              icon={<AppStoreIcon className="size-5 shrink-0 sm:size-7" />}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
