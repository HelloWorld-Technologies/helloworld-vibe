import { PolicyCard } from "@/components/marketing/tenant-policy/tenant-policy-primitives";
import { privacyPolicySections } from "@/src/constants/privacy-policy";
import { cn } from "@/src/lib/cn";

function PolicyNumberedParagraphs({
  sectionNumber,
  paragraphs,
}: {
  sectionNumber: number;
  paragraphs: readonly string[];
}) {
  return (
    <div className="flex flex-col gap-4">
      {paragraphs.map((paragraph, index) => (
        <p
          key={paragraph}
          className="text-sm font-medium leading-5 text-gray-900"
        >
          {sectionNumber}.{index + 1}. {paragraph}
        </p>
      ))}
    </div>
  );
}

function SectionHeading({
  id,
  number,
  title,
}: {
  id: string;
  number: number;
  title: string;
}) {
  return (
    <h2
      id={id}
      className={cn(
        "scroll-mt-36 font-satoshi text-[1.875rem] font-medium leading-9 text-gray-900 lg:scroll-mt-28",
      )}
    >
      {number}. {title}
    </h2>
  );
}

export function PrivacyPolicySections() {
  return (
    <div className="flex flex-col gap-12 md:gap-16">
      {privacyPolicySections.map((section, index) => (
        <section
          key={section.id}
          aria-labelledby={`privacy-policy-${section.id}`}
          className="space-y-4"
        >
          <SectionHeading
            id={`privacy-policy-${section.id}`}
            number={index + 1}
            title={section.title}
          />
          <PolicyCard>
            <PolicyNumberedParagraphs
              sectionNumber={section.number}
              paragraphs={section.paragraphs}
            />
          </PolicyCard>
        </section>
      ))}
    </div>
  );
}
