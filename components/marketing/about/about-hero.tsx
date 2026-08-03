import Image from "next/image";
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
          <div className="w-full max-w-3xl lg:max-w-[46rem]">
            <h1 className="font-satoshi text-4xl font-bold tracking-tight text-gray-900 md:text-5xl md:leading-[1.15] lg:text-[3.75rem] lg:leading-[4.5rem] lg:tracking-[-0.075rem]">
              {aboutPageCopy.heroHeadlineLead}{" "}
              <span className="font-black italic text-gradient-coliving">
                {aboutPageCopy.heroHeadlineAccent}
              </span>{" "}
              {aboutPageCopy.heroHeadlineTrail}
            </h1>
            <p className="mt-4 max-w-2xl text-lg font-medium leading-7 text-gray-900 md:text-xl md:leading-8">
              {aboutPageCopy.heroSubtitle}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3 md:gap-x-6">
              {aboutStats.map((stat, index) => (
                <div key={stat.label} className="flex items-center gap-2 md:gap-3">
                  {index > 0 ? (
                    <span
                      aria-hidden
                      className="mr-2 hidden h-8 w-px bg-gray-300 sm:block md:mr-3"
                    />
                  ) : null}
                  <Image
                    src={stat.icon}
                    alt=""
                    width={32}
                    height={32}
                    className="size-7 object-contain md:size-8"
                  />
                  <span className="text-base font-bold text-black md:text-xl">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
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
