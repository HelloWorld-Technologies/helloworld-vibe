import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { AppStoreIcon, PlayStoreIcon } from "@/components/brand/store-icons";
import { cn } from "@/src/lib/cn";
import { pageShell } from "@/src/tokens/layout";
import {
  homepageAppScreenshot1,
  homepageAppScreenshot2,
} from "@/src/tokens/homepage";
import { whiteWordmark } from "@/src/tokens/logos";

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
      className="inline-flex h-10 min-w-0 flex-1 items-center gap-1.5 rounded-lg bg-hello-lime-400 px-2 text-black transition-colors hover:bg-hello-lime-500 sm:h-[3.375rem] sm:gap-2 sm:px-4 lg:flex-none"
    >
      {icon}
      <span className="min-w-0 text-left">
        <span className="block text-[8px] font-medium leading-3 sm:text-xs sm:leading-[18px]">
          {topLabel}
        </span>
        <span className="block whitespace-nowrap text-[11px] font-bold leading-4 sm:text-lg sm:leading-7">
          {bottomLabel}
        </span>
      </span>
    </Link>
  );
}

function AppDownloadHeading({ className }: { className?: string }) {
  return (
    <h2
      className={cn(
        "font-bold tracking-tight text-gray-900",
        className,
      )}
    >
      From Booking to{" "}
      <span className="font-satoshi font-bold italic text-gradient-belonging">
        Belonging.
      </span>
    </h2>
  );
}

function StoreBadges({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={cn(
        "flex w-full items-center",
        compact ? "gap-2" : "gap-4",
      )}
    >
      <StoreBadge
        href="https://play.google.com/store/apps/details?id=com.thehelloworld"
        topLabel="Get it on"
        bottomLabel="Google Play"
        icon={
          <PlayStoreIcon
            className={cn("text-black", compact ? "size-4" : "size-7")}
          />
        }
      />
      <StoreBadge
        href="https://itunes.apple.com/in/app/hello-world-homes/id1481207096"
        topLabel="Get it on"
        bottomLabel="App Store"
        icon={
          <AppStoreIcon
            className={cn("text-black", compact ? "size-4" : "size-7")}
          />
        }
      />
    </div>
  );
}

export function HomepageAppDownload() {
  return (
    <section
      className={cn(
        "relative overflow-hidden lg:min-h-[25.375rem]",
        "bg-[linear-gradient(to_left,#d5ecf9_11.5%,#ffffff_100%)]",
        "lg:bg-[linear-gradient(122deg,#d5ecf9_11.5%,#ffffff_100%)]",
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <Logo
          variant={whiteWordmark}
          width={250}
          height={143}
          className={cn(
            "absolute bottom-0 right-0 h-auto w-[14rem] max-w-none opacity-[0.35]",
            "sm:w-[18rem] sm:opacity-[0.25]",
            "lg:bottom-8 lg:left-2 lg:right-auto lg:w-[28rem] lg:opacity-[0.4]",
            "xl:w-[32rem]",
          )}
        />
      </div>

      <div className={cn("relative", pageShell.homepage)}>
        <div className="flex items-start gap-3 py-8 lg:hidden">
          <div className="relative h-[13.75rem] w-[6.5rem] shrink-0 overflow-hidden">
            <Image
              src={homepageAppScreenshot2.file}
              alt="HelloWorld app screens"
              width={262}
              height={497}
              className="absolute bottom-0 left-1/2 z-0 h-[125%] w-auto max-w-none -translate-x-1/2 object-contain object-bottom drop-shadow-[0_8px_24px_rgba(16,24,40,0.12)]"
            />
          </div>

          <div className="relative z-10 flex min-w-0 flex-1 flex-col gap-2 pt-0">
            <AppDownloadHeading className="text-[1.125rem] leading-6" />
            <p className="text-xs leading-4 text-gray-600">
              Find homes, manage stays, and stay connected.
            </p>
            <div className="mt-1">
              <StoreBadges compact />
            </div>
          </div>
        </div>

        <div className="hidden lg:grid lg:min-h-[25.375rem] lg:grid-cols-[minmax(0,31.75rem)_minmax(0,1fr)] lg:items-center lg:gap-6">
          <div className="relative z-10 h-[25.375rem] w-full max-w-[31.75rem]">
            <Image
              src={homepageAppScreenshot1.file}
              alt=""
              width={250}
              height={497}
              className="absolute bottom-12 left-[2%] z-10 w-[49%] object-contain drop-shadow-[0_8px_24px_rgba(16,24,40,0.12)]"
            />
            <Image
              src={homepageAppScreenshot2.file}
              alt="HelloWorld app screens"
              width={262}
              height={497}
              className="absolute left-[47%] top-16 z-0 w-[51%] object-contain drop-shadow-[0_8px_24px_rgba(16,24,40,0.12)]"
            />
          </div>

          <div className="relative z-10 flex min-w-0 flex-col gap-3 text-left lg:max-w-2xl">
            <AppDownloadHeading className="text-[2.25rem] leading-11 tracking-[-0.02em] whitespace-nowrap" />
            <p className="text-lg leading-7 text-gray-600">
              Find homes, manage stays, and stay connected.
            </p>
            <div className="mt-2">
              <StoreBadges />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
