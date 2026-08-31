import Image from "next/image";
import { TrustStats } from "@/components/marketing/trust-stats";
import {
  aboutHeroIllustration,
  aboutPageCopy,
  aboutStats,
} from "@/src/tokens/about";
import { pageLayout } from "@/src/tokens/layout";

export function AboutHero() {
  return (
    <section className="bg-white pt-8 md:pt-10">
      <div className={pageLayout.container}>
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
          <div className="w-full max-w-3xl text-center lg:max-w-[46rem] lg:text-left">
            <h1 className="font-satoshi text-4xl font-bold tracking-tight text-gray-900 md:text-5xl md:leading-[1.15] lg:text-[3.75rem] lg:leading-[4.5rem] lg:tracking-[-0.075rem]">
              {aboutPageCopy.heroHeadlineLead}{" "}
              <span className="font-black italic text-gradient-coliving-hero">
                {aboutPageCopy.heroHeadlineAccent}
              </span>{" "}
              {aboutPageCopy.heroHeadlineTrail}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg font-medium leading-7 text-gray-900 md:text-xl md:leading-8 lg:mx-0">
              {aboutPageCopy.heroSubtitle}
            </p>

            <TrustStats
              stats={aboutStats}
              className="mt-8 justify-center lg:justify-start"
            />
          </div>

          <div className="relative h-[18rem] w-full max-w-[22rem] shrink-0 sm:h-[22rem] lg:h-[27.75rem] lg:w-[25.7rem] lg:max-w-none">
            <Image
              src={aboutHeroIllustration}
              alt="HelloWorld residents with luggage at the doorway"
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 411px"
              className="object-contain object-center"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
