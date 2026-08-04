import Link from "next/link";
import { HomepageAsset } from "@/components/marketing/homepage-asset";
import { cn } from "@/src/lib/cn";
import { pageShell } from "@/src/tokens/layout";
import { homepageStats, homepageVideo } from "@/src/tokens/homepage";

function StatDivider() {
  return (
    <div
      aria-hidden
      className="h-9 w-px shrink-0 self-center bg-gray-200 sm:h-10 lg:mx-1"
    />
  );
}

function WeekendsHeading() {
  return (
    <div className="relative inline-block text-center lg:text-left">
      <h2 className="font-playfair text-[1.75rem] font-bold leading-[1.15] tracking-tight text-gray-900 sm:text-display-sm md:text-display-md">
        <span className="block">Weekends hit</span>
        <span className="mt-1 block leading-none sm:mt-2">
          <span
            className={cn(
              "font-satoshi text-[2.5rem] font-bold italic leading-[1.05] text-gradient-different",
              "sm:text-display-lg md:text-display-xl lg:text-display-2xl",
            )}
          >
            Different
          </span>{" "}
          <span className="relative inline-block align-baseline">
            here
            <span
              aria-hidden
              className="absolute -bottom-4 left-1/2 w-max -translate-x-1/2 rotate-[-2.4deg] bg-blue-light-300 px-3 py-0.5 font-caveat text-sm text-gray-900 sm:-bottom-5 sm:left-0 sm:translate-x-0 sm:px-5 sm:text-base lg:left-0"
            >
              ✦ ps. Good vibes only!
            </span>
          </span>
        </span>
      </h2>
    </div>
  );
}

export function HomepageWeekends() {
  return (
    <section className="bg-white py-10 sm:py-16 lg:py-20">
      <div className={pageShell.homepage}>
        <div className="grid items-center gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="overflow-hidden rounded-tl-[1.5rem] bg-gray-900 shadow-[8px_7px_0_0_#0baaec] sm:rounded-tl-[2rem] sm:shadow-[11px_9px_0_0_#0baaec]">
            <video
              className="aspect-video w-full object-cover"
              src={homepageVideo.file}
              muted
              loop
              playsInline
              autoPlay
              aria-label={homepageVideo.name}
            />
          </div>

          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <div className="pb-8 sm:pb-10">
              <WeekendsHeading />
            </div>

            <div className="flex w-full items-stretch justify-between gap-0 sm:max-w-xl sm:justify-center sm:gap-0 lg:max-w-none lg:justify-start">
              {homepageStats.map((stat, index) => (
                <div key={stat.id} className="contents">
                  {index > 0 ? <StatDivider /> : null}
                  <div className="flex min-w-0 flex-1 items-center gap-1.5 px-1 sm:min-w-[5rem] sm:flex-none sm:gap-2 sm:px-3 lg:px-4">
                    <HomepageAsset
                      asset={stat.icon}
                      width={28}
                      height={28}
                      className="size-6 shrink-0 sm:size-8"
                    />
                    <div className="min-w-0 text-left">
                      <p className="text-sm font-bold leading-5 text-gray-900 sm:text-xl sm:leading-7 md:text-2xl md:leading-8">
                        {stat.value}
                      </p>
                      <p className="text-[0.625rem] leading-[0.875rem] text-gray-600 sm:text-xs sm:leading-[18px]">
                        {stat.label}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/community"
              className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-full bg-hello-lime-400 px-8 text-base font-bold text-gray-900 transition-colors hover:bg-hello-lime-500 sm:mt-10 sm:w-auto lg:self-start"
            >
              See What&apos;s Happening!
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
