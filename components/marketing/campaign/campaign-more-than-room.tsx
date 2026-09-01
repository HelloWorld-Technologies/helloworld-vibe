import { AdaptiveImage } from "@/components/media/adaptive-image";
import { campaignMoreThanRoom } from "@/src/tokens/campaign";
import { HomepageSectionHeading } from "@/components/marketing/homepage-section-heading";

export function CampaignMoreThanRoom() {
  return (
    <section className="py-10 md:py-14">
      <HomepageSectionHeading
        prefix="More than just a"
        highlight="Room!"
        gradient="home"
        size="properties"
      />
      <div className="mt-10 flex flex-col gap-10">
        {campaignMoreThanRoom.map((feature) => (
          <div
            key={feature.title}
            className={`flex flex-col items-center gap-8 md:gap-11 ${
              feature.imageLeft ? "md:flex-row" : "md:flex-row-reverse"
            }`}
          >
            <div className="relative h-[250px] w-full overflow-hidden rounded-[10px] md:h-[280px] md:w-1/2">
              <AdaptiveImage
                src={feature.src}
                webpSrc={feature.webpSrc}
                alt={feature.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="w-full md:w-1/2">
              <h3 className="font-satoshi text-lg font-bold leading-7 text-center text-gray-900 md:text-2xl md:leading-8 md:text-left">
                {feature.title}
              </h3>
              <p className="mt-4 font-satoshi text-sm font-medium leading-5 text-center text-gray-500 md:text-base md:leading-6 md:text-left">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
