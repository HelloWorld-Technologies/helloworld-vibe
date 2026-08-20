import Image from "next/image";
import type { LocalityAmenity } from "@/src/tokens/locality";

export function LocalityAmenitiesSection({
  amenities,
}: {
  amenities: readonly LocalityAmenity[];
}) {
  return (
    <section aria-label="Included amenities">
      <h2 className="text-2xl font-medium tracking-tight text-gray-900 md:text-[1.875rem] md:leading-[2.375rem]">
        Included Across Our Homes
      </h2>
      <div className="mt-6 flex flex-wrap gap-x-6 gap-y-5">
        {amenities.map((amenity) => (
          <div
            key={amenity.id}
            className="flex w-[5.5rem] flex-col items-center gap-2.5 text-center"
          >
            <Image
              src={amenity.iconSrc}
              alt=""
              width={36}
              height={32}
              className="h-8 w-auto object-contain"
            />
            <p className="text-xs font-medium text-gray-800">{amenity.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
