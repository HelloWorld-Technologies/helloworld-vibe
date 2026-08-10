import Image from "next/image";
import { aboutPageCopy, aboutPressLogos } from "@/src/tokens/about";
import { pageLayout } from "@/src/tokens/layout";

export function AboutHeadlines() {
  return (
    <section className="bg-white py-10 md:py-14" aria-labelledby="about-headlines-heading">
      <div className={pageLayout.container}>
        <h2
          id="about-headlines-heading"
          className="text-center text-2xl font-medium text-black md:text-3xl"
        >
          {aboutPageCopy.headlinesTitle}
        </h2>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-8 md:gap-10">
          {aboutPressLogos.map((logo) => (
            <a
              key={logo.name}
              href={logo.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Read ${logo.name} article`}
              className="relative h-10 w-36 grayscale opacity-80 transition-opacity hover:opacity-100 md:h-11 md:w-44"
            >
              <Image
                src={logo.src}
                alt={logo.name}
                fill
                sizes="180px"
                className="object-contain"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
