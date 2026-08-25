import Image from "next/image";
import { HomepageSectionHeading } from "@/components/marketing/homepage-section-heading";
import { homepagePressLogos } from "@/src/tokens/homepage";
import { pageShell } from "@/src/tokens/layout";

export function HomepagePress() {
  return (
    <section className="bg-white py-8 sm:py-10">
      <div className={pageShell.homepage}>
        <HomepageSectionHeading
          prefix="We've been making"
          highlight="Headlines!"
          gradient="home"
          className="text-center"
        />
      </div>

      <div className="mt-10 touch-pan-x overflow-x-auto overscroll-x-contain scrollbar-none">
        <div className="mx-auto flex w-max min-w-full items-center justify-start gap-10 px-4 sm:gap-12 sm:px-6 lg:justify-center lg:gap-16">
          {homepagePressLogos.map((logo) => (
            <a
              key={logo.id}
              href={logo.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Read ${logo.name} article`}
              className="relative z-10 shrink-0 cursor-pointer"
            >
              <Image
                src={logo.file}
                alt={logo.name}
                width={192}
                height={56}
                className="h-10 w-auto max-w-[10rem] object-contain opacity-100 transition-opacity hover:opacity-80 sm:h-12 sm:max-w-[12rem]"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
