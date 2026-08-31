import Image from "next/image";
import { aboutMissionCutout, aboutPageCopy } from "@/src/tokens/about";
import { pageLayout } from "@/src/tokens/layout";

export function AboutMission() {
  return (
    <section
      className="mt-6 bg-[linear-gradient(62deg,#3b4760_3%,#252b37_75%)] md:mt-14"
      aria-labelledby="about-mission-heading"
    >
      <div
        className={`${pageLayout.container} flex flex-col gap-5 py-6 md:flex-row md:items-center md:justify-between md:gap-12 md:py-8`}
      >
        <div className="w-full max-w-xl md:max-w-[32.5rem]">
          <h2
            id="about-mission-heading"
            className="font-satoshi text-3xl font-medium tracking-tight text-[#fcbc2b] md:text-5xl md:leading-[3.75rem] md:tracking-[-0.06rem]"
          >
            {aboutPageCopy.missionTitle}
          </h2>
          <div className="mt-4 space-y-4 text-base font-medium leading-7 text-white md:text-lg">
            {aboutPageCopy.missionParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div className="-mx-4 w-[calc(100%+2rem)] sm:-mx-6 sm:w-[calc(100%+3rem)] md:mx-0 md:w-full md:max-w-[40rem]">
          <Image
            src={aboutMissionCutout}
            alt="HelloWorld wordmark formed from community photos"
            width={1000}
            height={1000}
            sizes="(max-width: 768px) 100vw, 640px"
            className="h-auto w-full"
          />
        </div>
      </div>
    </section>
  );
}
