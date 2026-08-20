import Image from "next/image";
import {
  landmarkHeroSubtitle,
  landmarkPage,
} from "@/src/tokens/landmark";

export function LandmarkHero() {
  return (
    <section aria-label="Landmark overview">
      <div className="space-y-2">
        <h1 className="text-2xl font-medium tracking-tight text-gray-900 md:hidden">
          {landmarkPage.titleMobile}
        </h1>
        <h1 className="hidden text-2xl font-medium tracking-tight text-gray-900 md:block md:text-[1.875rem] md:leading-[2.375rem]">
          {landmarkPage.titleDesktop}
        </h1>
        <p className="text-base font-medium text-gray-600">
          {landmarkHeroSubtitle}
        </p>
      </div>

      <div className="relative mt-6 aspect-[1281/398] overflow-hidden rounded-2xl bg-gray-200">
        <Image
          src={landmarkPage.heroImageSrc}
          alt={`Coliving near ${landmarkPage.name}, ${landmarkPage.locality}`}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1280px) 100vw, 1280px"
        />
      </div>
    </section>
  );
}
