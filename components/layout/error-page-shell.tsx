"use client";

import { usePathname } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeaderSearch } from "@/components/layout/site-header-search";
import { cityFromSrpPath } from "@/src/lib/srp-slug-parse";
import { isCitySlug } from "@/src/tokens/cities";

export function ErrorPageShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const parsedCity = cityFromSrpPath(pathname);
  const city = parsedCity && isCitySlug(parsedCity) ? parsedCity : undefined;
  const srpSlug = pathname.split("/").filter(Boolean)[0];

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeaderSearch
        city={city}
        srpSlug={srpSlug}
        navigateOnCityChange
      />
      <main className="flex flex-1 flex-col">{children}</main>
      <SiteFooter />
    </div>
  );
}
