import Image from "next/image";
import { AdaptiveImage } from "@/components/media/adaptive-image";
import cityCampaignPrice, {
  type CampaignCitySlug,
} from "@/src/constants/campaign-prices";
import {
  campaignAmenities,
  campaignHeroImage,
  campaignVibeTags,
  getCampaignCityName,
} from "@/src/tokens/campaign";
import { formatRent } from "@/src/tokens/srp-card";

export function CampaignHero({ citySlug }: { citySlug: CampaignCitySlug }) {
  const prices = cityCampaignPrice[citySlug];
  const cityName = getCampaignCityName(citySlug);

  return (
    <section className="py-8 md:py-12">
      <h1 className="text-center font-satoshi text-xl font-bold leading-[30px] tracking-normal text-gray-900 md:text-left md:text-5xl md:leading-[4.5rem]">
        Find a PG that matches your{" "}
        <span className="inline-block overflow-visible bg-gradient-to-r from-[#7aae2f] via-[#08a4ed] to-[#8c40c1] bg-clip-text pr-[0.18em] font-bold italic text-transparent box-decoration-clone">
          Vibe
        </span>
        - in {cityName}
      </h1>

      <div className="mt-4 text-center font-satoshi text-sm font-medium leading-5 text-gray-900 md:text-left md:text-2xl">
        {prices.sharing || prices.private ? (
          <>
            Starting at{" "}
            {prices.sharing ? (
              <span>
                <span className="font-bold text-[#4c7b0c] md:text-[30px]">
                  {formatRent(Number(prices.sharing))}
                </span>{" "}
                for sharing
              </span>
            ) : null}
            {prices.sharing && prices.private ? (
              <span className="mx-1">·</span>
            ) : null}
            {prices.private ? (
              <span>
                <span className="font-bold text-[#4c7b0c] md:text-[30px]">
                  {formatRent(Number(prices.private))}
                </span>{" "}
                for private
              </span>
            ) : null}
          </>
        ) : null}
      </div>

      <div className="relative mx-auto mt-8 h-[280px] w-full max-w-[680px] md:h-[400px]">
        <AdaptiveImage
          src={campaignHeroImage.src}
          webpSrc={campaignHeroImage.webpSrc}
          alt={`Residents enjoying community life in ${cityName}`}
          fill
          fetchPriority="high"
          className="object-cover object-top"
          sizes="(max-width: 768px) 100vw, 680px"
        />
        {campaignVibeTags.map((tag) => (
          <div
            key={tag.label}
            className={`absolute flex max-w-[166.35px] items-center gap-[4.44px] rounded-[36.6px] border-[0.17px] border-gray-300 bg-white p-[4.44px] text-[10px] font-medium leading-[12px] text-gray-700 shadow-[0px_4px_7.4px_rgba(0,0,0,0.22)] md:max-w-none md:rounded-full md:border md:px-3 md:py-2 md:text-sm md:leading-normal md:gap-0 ${tag.className}`}
          >
            {tag.emoji}
            <span className="whitespace-nowrap">{tag.label}</span>
          </div>
        ))}
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 -rotate-[5.26deg] rounded-full px-[6.58px] py-[1.64px] md:bottom-8 md:left-1/2 md:top-auto md:-translate-x-1/2 md:-rotate-[5deg] md:px-4 md:py-1"
          style={{
            backgroundImage:
              "linear-gradient(-61deg, rgba(255,255,255,0) 29%, rgb(164,135,255) 92%), linear-gradient(90deg, rgb(188,227,254) 0%, rgb(188,227,254) 100%)",
          }}
        >
          <span className="font-satoshi text-sm font-bold leading-none text-gray-800 md:text-lg md:leading-normal">
            ✨93% Vibe Match
          </span>
        </div>
      </div>

      <div className="mt-8 flex gap-4 overflow-x-auto pb-2 md:mt-12 md:justify-between md:overflow-visible md:pb-0">
        {campaignAmenities.map((amenity) => (
          <div
            key={amenity.label}
            className="flex min-w-[95px] shrink-0 flex-col items-center gap-2 text-center"
          >
            <div className="relative h-10 w-10">
              <Image
                src={amenity.icon}
                alt=""
                fill
                className="object-contain"
              />
            </div>
            <span className="text-sm font-medium text-gray-700">
              {amenity.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function CampaignHeader({ onContactClick }: { onContactClick: () => void }) {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-4 md:px-20">
      <Image
        width={105}
        height={40}
        alt="Vibe"
        src="/assets/logos/gardient-black.svg"
        className="h-10 w-auto"
      />
      <button
        type="button"
        onClick={onContactClick}
        className="rounded-lg border border-gray-50 bg-[#f7fee7] px-3.5 py-2 text-sm font-semibold text-[#4c7b0c] shadow-sm"
      >
        Contact Us
      </button>
    </header>
  );
}
