import Link from "next/link";
import { cn } from "@/src/lib/cn";

export type BreadcrumbItem = {
  name: string;
  path?: string;
};

export function Breadcrumbs({
  items,
  className,
}: {
  items: readonly BreadcrumbItem[];
  className?: string;
}) {
  if (!items.length) return null;

  return (
    <nav aria-label="Breadcrumb" className={cn("min-w-0", className)}>
      <ol className="flex flex-wrap items-center gap-x-1 text-xs text-gray-500 md:text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const href =
            item.path != null && item.path !== ""
              ? `/${item.path.replace(/^\//, "")}`
              : "/";

          return (
            <li
              key={`${item.name}-${index}`}
              className="flex min-w-0 items-center gap-x-1"
            >
              {index > 0 ? (
                <span className="select-none px-0.5 text-gray-400" aria-hidden>
                  /
                </span>
              ) : null}
              {isLast ? (
                <span
                  className="truncate font-medium text-gray-900"
                  aria-current="page"
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  href={href}
                  className="truncate transition-colors hover:text-gray-900 hover:underline"
                >
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
