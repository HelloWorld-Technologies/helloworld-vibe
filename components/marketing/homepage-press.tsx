import Image from "next/image";
import { HomepageSectionHeading } from "@/components/marketing/homepage-section-heading";
import { homepagePressLogos } from "@/src/tokens/homepage";
import { pageShell } from "@/src/tokens/layout";

export function HomepagePress() {
  return (
    <section className="border-y border-gray-100 bg-white py-12 sm:py-16">
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
            <Image
              key={logo.id}
              src={logo.file}
              alt={logo.name}
              width={160}
              height={48}
              className="h-8 w-auto max-w-[8rem] shrink-0 object-contain opacity-100 transition-opacity hover:opacity-100 sm:h-10 sm:max-w-[10rem]"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
