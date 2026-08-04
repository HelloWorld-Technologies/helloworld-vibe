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
          <h2 className="font-satoshi text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            {homeownersPageCopy.differentTitleLead}
            {homeownersPageCopy.differentTitleBrand}
            {homeownersPageCopy.differentTitleTrail}
          </h2>
          <p className="mt-3 text-base font-medium text-gray-500 md:text-lg">
            {homeownersPageCopy.differentSubtitle}
          </p>
        </div>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {homeownersFeatures.map((feature) => (
            <li
              key={feature.title}
              className="flex items-center gap-3 rounded-[1.25rem] bg-gradient-to-br from-[#EAF5FF] to-white p-4 shadow-[0_8px_24px_rgba(16,24,40,0.06)] ring-1 ring-black/[0.03] sm:gap-4 sm:p-5"
            >
              <div className="relative size-[4.5rem] shrink-0 sm:size-[5.25rem]">
                <Image
                  src={feature.image}
                  alt=""
                  fill
                  sizes="84px"
                  className="object-contain object-center"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-bold leading-6 text-gray-900 sm:text-lg sm:leading-7">
                  {feature.title}
                </h3>
                <p className="mt-1 text-sm leading-5 text-gray-600 sm:leading-6">
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
