import { TrustStats } from "@/components/marketing/trust-stats";
import {
  homeownersPageCopy,
  homeownersStats,
} from "@/src/tokens/homeowners";
import { pageLayout } from "@/src/tokens/layout";

export function HomeownersHero() {
  return (
    <section className="bg-white pt-10 md:pt-14">
      <div className={pageLayout.container}>
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <h1 className="text-gray-900">
            <span className="block font-playfair text-3xl font-medium italic tracking-tight sm:text-4xl md:text-5xl md:leading-[1.15]">
              {homeownersPageCopy.heroLine1}
            </span>
            <span className="mt-2 block pb-8 font-satoshi text-[1.875rem] font-bold leading-[1.15] tracking-tight sm:mt-3 sm:pb-9 sm:text-4xl md:pb-10 md:text-5xl lg:text-[3.5rem] lg:leading-[4.25rem]">
              {homeownersPageCopy.heroLine2Before}
              <span className="relative inline-block whitespace-nowrap">
                {homeownersPageCopy.heroLine2Accent}
                <span
                  aria-hidden
                  className="absolute left-[68%] top-full mt-1 w-max -translate-x-1/2 -rotate-2 bg-blue-light-200 px-3 py-0.5 font-caveat text-sm font-medium leading-none text-[#1e4e8c] sm:mt-1.5 sm:px-4 sm:text-base md:mt-2 md:text-lg"
                >
                  {homeownersPageCopy.heroBadge}
                </span>
              </span>
            </span>
          </h1>

          <TrustStats
            stats={homeownersStats}
            className="mt-12 md:mt-14 md:justify-center"
          />

          <a
            href="#list-property"
            className="mt-8 inline-flex h-12 items-center justify-center rounded-lg bg-hello-lime-400 px-8 text-base font-bold text-gray-900 transition-colors hover:bg-hello-lime-500 md:mt-10 md:h-14 md:px-10"
          >
            {homeownersPageCopy.heroCta}
          </a>
        </div>
      </div>
    </section>
  );
}
