import { HdpSectionHeading } from "@/components/marketing/hdp-section-heading";
import type { HdpPageView } from "@/src/lib/hdp/hdp-page-view";
import { cn } from "@/src/lib/cn";

export function HdpAbout({
  view,
  className,
}: {
  view?: HdpPageView;
  className?: string;
}) {
  const displayName = view?.displayName ?? "this home";
  const about = view?.about?.trim() ?? "";
  if (!about) return null;

  return (
    <section
      id="hdp-about"
      className={cn("scroll-mt-32 space-y-4", className)}
      aria-label="About section"
    >
      <HdpSectionHeading>About {displayName}</HdpSectionHeading>
      <p className="text-base leading-7 text-gray-700">{about}</p>
    </section>
  );
}
