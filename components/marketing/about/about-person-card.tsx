import Image from "next/image";
import {
  aboutLinkedInIcon,
  type AboutPerson,
} from "@/src/tokens/about";
import { cn } from "@/src/lib/cn";

export function AboutPersonCard({
  person,
  className,
}: {
  person: AboutPerson;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "relative flex h-full flex-col overflow-hidden rounded-2xl bg-blue-light-50",
        className,
      )}
    >
      <div className="relative aspect-[301/296] w-full overflow-hidden">
        <Image
          src={person.image}
          alt={person.name}
          fill
          sizes="(max-width: 768px) 80vw, 301px"
          className="object-cover object-top"
        />
      </div>
      <div className="relative z-10 -mt-8 mx-2 mb-4 flex items-center justify-between gap-3 rounded-lg bg-white p-4 shadow-[0_0_15px_rgba(0,0,0,0.15)] sm:mx-3 sm:mb-5 sm:p-6">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-bold text-gray-800 sm:text-xl">
            {person.name}
          </h3>
          <p className="mt-1 text-sm text-gray-500">{person.role}</p>
        </div>
        {person.linkedin ? (
          <a
            href={person.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${person.name} on LinkedIn`}
            className="relative size-8 shrink-0 overflow-hidden"
          >
            <Image
              src={aboutLinkedInIcon}
              alt=""
              width={31}
              height={31}
              className="size-full object-contain"
            />
          </a>
        ) : (
          <span className="relative size-8 shrink-0 overflow-hidden opacity-40">
            <Image
              src={aboutLinkedInIcon}
              alt=""
              width={31}
              height={31}
              aria-hidden
              className="size-full object-contain"
            />
          </span>
        )}
      </div>
    </article>
  );
}
