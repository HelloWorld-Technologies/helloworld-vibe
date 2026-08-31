"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/brand/logo";
import { SiteHeaderSidebar } from "@/components/layout/site-header-sidebar";
import { LocationSearch } from "@/components/search/location-search";
import { getStoredMobile, logout } from "@/src/lib/auth-storage";
import { cn } from "@/src/lib/cn";
import type { CitySlug } from "@/src/tokens/cities";

/** Always show mobile search row when within this distance from page top. */
const MOBILE_SEARCH_TOP_THRESHOLD_PX = 8;

/** Minimum scroll delta before toggling visibility (avoids jitter). */
const MOBILE_SEARCH_SCROLL_DELTA_PX = 5;

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SiteHeaderSearch({
  userPhone: userPhoneProp = null,
  onLogout: onLogoutProp,
  city,
  defaultLocality,
  srpSlug,
  navigateOnCityChange = false,
}: {
  userPhone?: string | null;
  onLogout?: () => void;
  city?: CitySlug;
  defaultLocality?: string;
  srpSlug?: string;
  navigateOnCityChange?: boolean;
} = {}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userPhone, setUserPhone] = useState<string | null>(userPhoneProp);
  const [mobileSearchRevealed, setMobileSearchRevealed] = useState(true);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    setUserPhone(userPhoneProp ?? getStoredMobile());
  }, [userPhoneProp]);

  useEffect(() => {
    lastScrollYRef.current = window.scrollY;

    function updateMobileSearchVisibility() {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= MOBILE_SEARCH_TOP_THRESHOLD_PX) {
        setMobileSearchRevealed(true);
      } else {
        const delta = currentScrollY - lastScrollYRef.current;
        if (delta >= MOBILE_SEARCH_SCROLL_DELTA_PX) {
          setMobileSearchRevealed(false);
        } else if (delta <= -MOBILE_SEARCH_SCROLL_DELTA_PX) {
          setMobileSearchRevealed(true);
        }
      }

      lastScrollYRef.current = currentScrollY;
    }

    updateMobileSearchVisibility();
    window.addEventListener("scroll", updateMobileSearchVisibility, {
      passive: true,
    });
    return () =>
      window.removeEventListener("scroll", updateMobileSearchVisibility);
  }, []);

  function handleLoginSuccess(phone: string) {
    setUserPhone(phone);
  }

  function handleLogout() {
    setUserPhone(null);
    onLogoutProp?.();
    logout();
  }

  const locationSearchProps = {
    localityPlaceholder: "Search for Localities" as const,
    variant: "header" as const,
    city,
    defaultLocality,
    srpSlug,
    navigateOnCityChange,
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-[#E4E4E4] bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-[5.5rem] max-w-7xl items-center gap-4 px-4 sm:px-6 lg:gap-6">
          <Link href="/" className="shrink-0">
            <Logo width={84} height={32} priority className="h-8 w-auto" />
          </Link>

          <div className="hidden min-w-0 flex-1 lg:block max-w-lg mx-auto">
            <LocationSearch {...locationSearchProps} />
          </div>

          <div className="ml-auto flex items-center gap-3 sm:gap-4">
            <Link
              href="/contact"
              className="hidden h-9 items-center justify-center rounded-full bg-hello-lime-100 px-5 text-[0.6875rem] font-bold text-gray-900 transition-colors hover:bg-hello-lime-200 sm:inline-flex"
            >
              Contact Us
            </Link>
            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="site-header-sidebar"
              onClick={() => setMenuOpen(true)}
              className="flex size-9 items-center justify-center rounded-lg text-gray-900 transition-colors hover:bg-gray-50"
            >
              <MenuIcon className="size-6" />
            </button>
          </div>
        </div>

        <div
          className={cn(
            "grid transition-[grid-template-rows] duration-300 ease-out lg:hidden",
            mobileSearchRevealed ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
          )}
        >
          <div
            className={cn(
              "overflow-hidden transition-opacity duration-300",
              mobileSearchRevealed
                ? "border-t border-gray-100 px-4 pb-3 pt-2 opacity-100"
                : "pointer-events-none border-t-0 px-4 pb-0 pt-0 opacity-0",
            )}
            aria-hidden={!mobileSearchRevealed}
          >
            <LocationSearch {...locationSearchProps} />
          </div>
        </div>
      </header>

      <SiteHeaderSidebar
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        userPhone={userPhone}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
      />
    </>
  );
}
