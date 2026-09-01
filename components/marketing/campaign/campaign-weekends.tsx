import { AdaptiveImage } from "@/components/media/adaptive-image";
import { HomepageSectionHeading } from "@/components/marketing/homepage-section-heading";
import { campaignWeekendEvents } from "@/src/tokens/campaign";

function WeekendPolaroid({
  src,
  webpSrc,
  label,
  rotate,
}: {
  src: string;
  webpSrc: string;
  label: string;
  rotate: string;
}) {
  return (
    <div className={`mx-1 shrink-0 md:mx-2 ${rotate}`}>
      <div className="bg-white p-2 shadow-[0px_16px_16px_rgba(26,35,50,0.45)]">
        <div className="relative h-[220px] w-[180px] md:h-[270px] md:w-[220px]">
          <AdaptiveImage
            src={src}
            webpSrc={webpSrc}
            alt={label}
            fill
            className="object-cover"
          />
        </div>
        <p className="mt-2 text-center font-caveat text-lg text-gray-700/80">
          {label}
        </p>
      </div>
    </div>
  );
}

export function CampaignWeekendsCarousel() {
  return (
    <section className="py-10 md:py-14">
      <HomepageSectionHeading
        prefix="No more boring"
        highlight="Weekends!"
        gradient="home"
        size="properties"
      />
      <div className="mt-8 flex gap-6 overflow-x-auto scroll-px-4 px-4 py-2 pb-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:gap-8 md:px-6">
        {campaignWeekendEvents.map((event) => (
          <WeekendPolaroid
            key={event.label}
            src={event.src}
            webpSrc={event.webpSrc}
            label={event.label}
            rotate={event.rotate}
          />
        ))}
      </div>
    </section>
  );
}
