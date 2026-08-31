import Image from "next/image";
import { cn } from "@/src/lib/cn";

export type TrustStat = {
  label: string;
  icon: string;
};

type TrustStatsProps = {
  stats: readonly TrustStat[];
  className?: string;
};

export function TrustStats({ stats, className }: TrustStatsProps) {
  return (
    <div
      className={cn(
        "flex w-full flex-row items-center md:w-auto md:gap-x-6",
        className,
      )}
    >
      {stats.map((stat, index) => {
        const match = stat.label.match(/^(\d+k?\+)\s+(.+)$/);
        const value = match?.[1] ?? stat.label;
        const description = match?.[2];

        return (
          <div
            key={stat.label}
            className="flex min-w-0 flex-1 items-center justify-center gap-2 md:flex-none md:gap-3"
          >
            {index > 0 ? (
              <span
                aria-hidden
                className="mx-0.5 h-8 w-px shrink-0 bg-gray-300 md:mx-3 md:h-8"
              />
            ) : null}
            <Image
              src={stat.icon}
              alt=""
              width={32}
              height={32}
              className="size-8 shrink-0 object-contain"
            />
            <div className="flex min-w-0 flex-col items-start leading-tight md:hidden">
              <span className="text-base font-bold text-gray-700">{value}</span>
              {description ? (
                <span className="text-xs leading-snug text-gray-500">
                  {description}
                </span>
              ) : null}
            </div>
            <span className="hidden text-sm font-bold text-gray-700 md:inline md:text-lg">
              {stat.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
