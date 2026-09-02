import { cn } from "@/src/lib/cn";

export type TenantReviewCardProps = {
  name: string;
  quote: string;
  className?: string;
};

export function TenantReviewCard({
  name,
  quote,
  className,
}: TenantReviewCardProps) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";

  return (
    <article
      className={cn(
        "flex h-[16.375rem] w-full shrink-0 flex-col gap-4 rounded-[10px] border border-[#eee] bg-white p-4 shadow-[0_1px_5.5px_rgba(0,0,0,0.04)]",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <div
          aria-hidden
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-700"
        >
          {initial}
        </div>
        <p className="min-w-0 flex-1 truncate text-base font-bold text-gray-900">
          {name}
        </p>
      </div>
      <p className="line-clamp-6 text-sm leading-5 text-[#343434]">{quote}</p>
    </article>
  );
}
