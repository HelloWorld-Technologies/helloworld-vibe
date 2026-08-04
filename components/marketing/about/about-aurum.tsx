import Image from "next/image";
import Link from "next/link";
import { aboutAurumLogo, aboutPageCopy } from "@/src/tokens/about";
import { pageLayout } from "@/src/tokens/layout";

export function AboutAurum() {
  return (
    <section className="bg-white py-12 md:py-16" aria-label="Aurum PropTech">
      <div className={`${pageLayout.container} flex flex-col items-center text-center`}>
        <Link
          href="https://www.aurumproptech.in/"
          target="_blank"
          rel="noopener noreferrer"
          className="relative h-12 w-[16rem] md:h-[3.125rem] md:w-[26rem]"
        >
          <Image
            src={aboutAurumLogo}
            alt="Aurum PropTech"
            fill
            sizes="416px"
            className="object-contain"
          />
        </Link>
        <p className="mt-4 max-w-5xl text-base font-medium leading-7 text-gray-800 md:text-lg">
          {aboutPageCopy.aurumBody}
        </p>
      </div>
    </section>
  );
}
