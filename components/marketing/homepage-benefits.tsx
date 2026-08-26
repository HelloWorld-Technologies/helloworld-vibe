import { HomepageAsset } from "@/components/marketing/homepage-asset";
import { homepageBenefits } from "@/src/tokens/homepage";
import { pageShell } from "@/src/tokens/layout";

export function HomepageBenefits() {
  return (
    <section className="bg-white pb-10 pt-2 sm:pb-12 sm:pt-12">
      <div className={pageShell.homepageBenefits}>
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:gap-x-10 lg:grid-cols-4 lg:justify-between">
          {homepageBenefits.map((benefit) => (
            <div
              key={benefit.id}
              className="flex flex-col items-center text-center lg:max-w-[12rem]"
            >
              <HomepageAsset
                asset={benefit.icon}
                width={40}
                height={40}
                className="size-10"
              />
              <h3 className="mt-3 whitespace-nowrap text-base font-bold leading-6 text-gray-900">
                {benefit.title}
              </h3>
              <p className="mt-1 text-xs leading-[18px] text-gray-600">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
