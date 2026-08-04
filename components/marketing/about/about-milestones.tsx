import { aboutMilestones, aboutPageCopy } from "@/src/tokens/about";
import { pageLayout } from "@/src/tokens/layout";
import { cn } from "@/src/lib/cn";

function MilestoneCopy({
  date,
  description,
  align,
}: {
  date: string;
  description: string;
  align: "left" | "right";
}) {
  return (
    <div
      className={cn(
        "max-w-[22rem] md:max-w-[23.5rem]",
        align === "right" ? "text-right" : "text-left",
      )}
    >
      <p className="text-xl font-medium leading-8 text-[#252B37] md:text-2xl">
        {date}
      </p>
      <p className="mt-2 text-sm font-medium leading-6 text-[#252B37] md:text-base">
        {description}
      </p>
    </div>
  );
}

function TimelineStem({ side }: { side: "left" | "right" }) {
  return (
    <div
      aria-hidden
      className={cn(
        "mt-[0.85rem] flex h-5 shrink-0 items-center",
        side === "left" ? "flex-row-reverse" : "flex-row",
      )}
    >
      <span className="w-3 shrink-0" />
      <span className="h-px w-14 bg-[#252B37] md:w-16" />
      <span className="size-2.5 shrink-0 rounded-full bg-[#252B37]" />
    </div>
  );
}

export function AboutMilestones() {
  return (
    <section
      className="bg-white py-10 md:py-16"
      aria-labelledby="about-milestones-heading"
    >
      <div className={pageLayout.container}>
        <h2
          id="about-milestones-heading"
          className="text-center text-2xl font-medium text-black md:text-3xl"
        >
          {aboutPageCopy.milestonesTitle}
        </h2>

        {/* Mobile: center spine, alternating sides (no stems) */}
        <ol className="relative mx-auto mt-10 max-w-lg md:hidden">
          <span
            aria-hidden
            className="absolute bottom-4 left-1/2 top-2 w-px -translate-x-1/2 bg-[#252B37]"
          />

          {aboutMilestones.map((milestone, index) => {
            const isLeft = milestone.side === "left";
            return (
              <li
                key={`${milestone.date}-mobile-${index}`}
                className={cn(
                  "relative grid grid-cols-2 items-start gap-x-5",
                  index > 0 && "mt-10",
                )}
              >
                <span
                  aria-hidden
                  className="absolute left-1/2 top-2 z-10 size-2.5 -translate-x-1/2 rounded-full bg-[#252B37]"
                />

                {isLeft ? (
                  <div className="col-start-1 pr-1">
                    <MilestoneCopy
                      date={milestone.date}
                      description={milestone.description}
                      align="right"
                    />
                  </div>
                ) : (
                  <div className="col-start-2 pl-1">
                    <MilestoneCopy
                      date={milestone.date}
                      description={milestone.description}
                      align="left"
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ol>

        {/* Desktop: alternating sides with connector stems */}
        <ol className="relative mx-auto mt-10 hidden max-w-[58rem] md:block">
          <span
            aria-hidden
            className="absolute bottom-6 left-1/2 top-3 w-px -translate-x-1/2 bg-[#252B37]"
          />

          {aboutMilestones.map((milestone, index) => {
            const isLeft = milestone.side === "left";
            return (
              <li
                key={`${milestone.date}-desktop-${index}`}
                className={cn(
                  "relative grid grid-cols-2 items-start",
                  index > 0 && "mt-14",
                )}
              >
                <span
                  aria-hidden
                  className="absolute left-1/2 top-[0.85rem] z-10 size-6 -translate-x-1/2 rounded-full bg-[#252B37] shadow-[0_0_10px_rgba(0,0,0,0.1)]"
                />

                {isLeft ? (
                  <div className="col-start-1 flex items-start justify-end">
                    <MilestoneCopy
                      date={milestone.date}
                      description={milestone.description}
                      align="left"
                    />
                    <TimelineStem side="left" />
                  </div>
                ) : (
                  <div className="col-start-2 flex items-start justify-start">
                    <TimelineStem side="right" />
                    <MilestoneCopy
                      date={milestone.date}
                      description={milestone.description}
                      align="left"
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
