import Link from "next/link";
import { HomepageAsset } from "@/components/marketing/homepage-asset";
import { pageShell } from "@/src/tokens/layout";
import { homepageStats, homepageVideo, homepageVideoWebm } from "@/src/tokens/homepage";

function StatDivider() {
  return (
    <div
      aria-hidden
      className="w-px shrink-0 self-stretch bg-gray-200 sm:h-12 sm:self-center lg:mx-1"
    />
  );
}

function WeekendsHeading() {
  return (
    <div className="relative inline-block text-center lg:text-left">
      <h2 className="font-playfair text-display-lg font-bold leading-[1.08] tracking-tight text-gray-900 sm:text-display-lg lg:text-display-2xl lg:leading-[1.05]">
        <span className="block">Weekends hit</span>
        <span className="mt-1 block leading-none sm:mt-2">
          <span className="italic text-gradient-different">Different</span>{" "}
          <span className="relative inline-block align-baseline">
            <span className="relative z-0">here</span>
            <span
              aria-hidden
              className="absolute -bottom-4 left-1/2 z-10 w-max -translate-x-1/3 rotate-[-4deg] bg-blue-light-300 px-2 py-0.5 font-caveat text-base font-normal leading-none text-gray-900 sm:left-0 sm:translate-x-0 sm:px-5 sm:text-lg lg:left-0 lg:text-xl"
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
    <section className="bg-white py-8 sm:py-12 lg:py-14">
      <div className={pageShell.homepage}>
        <div className="grid items-center gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="overflow-hidden rounded-tl-[1.5rem] bg-gray-900 shadow-[8px_7px_0_0_#0baaec] sm:rounded-tl-[2rem] sm:shadow-[11px_9px_0_0_#0baaec]">
            <video
              className="aspect-video w-full object-cover"
              muted
              loop
              playsInline
              autoPlay
              aria-label={homepageVideo.name}
            >
              <source src={homepageVideoWebm.file} type="video/webm" />
              <source src={homepageVideo.file} type="video/mp4" />
            </video>
          </div>

          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <div className="pb-10 sm:pb-12">
              <WeekendsHeading />
            </div>

            <div className="flex w-full flex-col items-center lg:w-auto">
              <div className="flex w-full items-stretch justify-between gap-0 sm:w-auto sm:justify-center">
                {homepageStats.map((stat, index) => (
                  <div key={stat.id} className="contents">
                    {index > 0 ? <StatDivider /> : null}
                    <div className="flex min-w-0 flex-1 flex-col items-center gap-1 px-1 text-center sm:min-w-[5rem] sm:flex-none sm:flex-row sm:items-center sm:gap-2 sm:px-3 lg:px-4">
                      <HomepageAsset
                        asset={stat.icon}
                        width={40}
                        height={40}
                        className="size-8 shrink-0 sm:size-10 opacity-80"
                      />
                      <div className="min-w-0 w-full text-center sm:w-auto">
                        <p className="text-lg font-bold leading-6 text-gray-900 sm:text-xl sm:leading-7 lg:text-2xl lg:leading-8">
                          {stat.value}
                        </p>
                        <p className="text-[10px] leading-tight text-gray-600 sm:text-sm sm:leading-5">
                          {stat.label}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/community"
                className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-lg bg-hello-lime-400 px-8 text-base font-bold text-gray-900 transition-colors hover:bg-hello-lime-500 sm:mt-10 sm:h-14 sm:w-auto sm:text-lg lg:h-12"
              >
                See What&apos;s Happening!
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
