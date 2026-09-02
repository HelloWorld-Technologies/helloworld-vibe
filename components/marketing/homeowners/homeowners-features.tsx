import Image from "next/image";
import {
  homeownersFeatures,
  homeownersPageCopy,
} from "@/src/tokens/homeowners";
import { pageLayout } from "@/src/tokens/layout";

export function HomeownersFeatures() {
  return (
    <section className="bg-white py-12 md:py-16">
      <div className={pageLayout.container}>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-satoshi text-2xl font-bold tracking-tight text-gray-900 md:text-4xl">
            {homeownersPageCopy.differentTitleLead}
            {homeownersPageCopy.differentTitleBrand}
            {homeownersPageCopy.differentTitleTrail}
          </h2>
          <p className="mt-3 text-base font-medium text-gray-900 md:text-lg">
            {homeownersPageCopy.differentSubtitle}
          </p>
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 lg:gap-5">
          {homeownersFeatures.map((feature) => (
            <li
              key={feature.title}
              className="flex flex-col items-start gap-2 rounded-[1.25rem] bg-gradient-to-br from-[#EAF5FF] to-white p-3 shadow-[0_8px_24px_rgba(16,24,40,0.06)] ring-1 ring-black/[0.03] sm:flex-row sm:items-center sm:gap-4 sm:p-5"
            >
              <div className="relative size-14 shrink-0 sm:size-[5.25rem]">
                <Image
                  src={feature.image}
                  alt=""
                  fill
                  sizes="(max-width: 639px) 40vw, 84px"
                  className="object-contain object-center"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold leading-5 text-gray-900 sm:text-lg sm:leading-7">
                  {feature.title}
                </h3>
                <p className="mt-0.5 text-xs leading-4 text-gray-600 sm:mt-1 sm:text-sm sm:leading-6">
                  {feature.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
