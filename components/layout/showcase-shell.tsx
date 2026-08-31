import Link from "next/link";
import { cn } from "@/src/lib/cn";
import { pageShell } from "@/src/tokens/layout";

export type ShowcaseNavItem = {
  label: string;
  id?: string;
  href?: string;
};

type ShowcaseShellProps = {
  eyebrow: string;
  title: string;
  navItems: ShowcaseNavItem[];
  children: React.ReactNode;
  homeHref?: string;
  secondaryLink?: { href: string; label: string };
};

function NavLink({
  item,
  className,
}: {
  item: ShowcaseNavItem;
  className?: string;
}) {
  const shared = cn(
    "block rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900",
    className,
  );

  if (item.href) {
    return (
      <Link href={item.href} className={shared}>
        {item.label}
      </Link>
    );
  }

  return (
    <a href={`#${item.id}`} className={shared}>
      {item.label}
    </a>
  );
}

export function ShowcaseShell({
  eyebrow,
  title,
  navItems,
  children,
  homeHref = "/",
  secondaryLink,
}: ShowcaseShellProps) {
  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-20 border-b border-[#E4E4E4] bg-white/90 backdrop-blur">
        <div
          className={cn(
            pageShell.showcase,
            "flex items-center justify-between gap-4 py-4",
          )}
        >
          <div className="min-w-0">
            <p className="text-sm font-medium text-hello-lime-700">{eyebrow}</p>
            <h1 className="truncate text-lg font-bold text-gray-900 sm:text-xl">
              {title}
            </h1>
          </div>
          <div className="flex shrink-0 items-center gap-4 text-sm font-medium">
            {secondaryLink ? (
              <Link
                href={secondaryLink.href}
                className="hidden text-gray-600 hover:text-gray-900 sm:inline"
              >
                {secondaryLink.label}
              </Link>
            ) : null}
            <Link href={homeHref} className="text-gray-600 hover:text-gray-900">
              Home
            </Link>
          </div>
        </div>
      </header>

      <div className={cn(pageShell.showcase, "flex gap-8 lg:gap-12")}>
        <aside className="hidden w-52 shrink-0 lg:block">
          <nav
            aria-label={`${title} sections`}
            className="sticky top-[4.5rem] max-h-[calc(100vh-5.5rem)] overflow-y-auto py-8 pr-2"
          >
            <ul className="flex flex-col gap-0.5">
              {navItems.map((item) => (
                <li key={item.id ?? item.href ?? item.label}>
                  <NavLink item={item} />
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <div className="min-w-0 flex-1 pb-24">
          <nav
            aria-label={`${title} sections`}
            className="border-b border-gray-200 py-6 lg:hidden"
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
              On this page
            </p>
            <ul className="grid grid-cols-2 gap-1 sm:grid-cols-3">
              {navItems.map((item) => (
                <li key={item.id ?? item.href ?? item.label}>
                  <NavLink item={item} className="px-2 py-1.5 text-xs sm:text-sm" />
                </li>
              ))}
            </ul>
          </nav>

          {children}
        </div>
      </div>
    </div>
  );
}
