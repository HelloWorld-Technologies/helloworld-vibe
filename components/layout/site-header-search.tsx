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

/** Accumulated scroll distance before toggling visibility (avoids jitter). */
const MOBILE_SEARCH_SCROLL_DELTA_PX = 24;

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
  const [mobileSearchPanelOpen, setMobileSearchPanelOpen] = useState(false);
  const lastScrollYRef = useRef(0);
  const scrollAccumulatorRef = useRef(0);
  const mobileSearchRevealedRef = useRef(true);
  const mobileSearchPanelOpenRef = useRef(false);
  const scrollRafRef = useRef<number | null>(null);

  useEffect(() => {
    setUserPhone(userPhoneProp ?? getStoredMobile());
  }, [userPhoneProp]);

  useEffect(() => {
    mobileSearchRevealedRef.current = mobileSearchRevealed;
  }, [mobileSearchRevealed]);

  useEffect(() => {
    mobileSearchPanelOpenRef.current = mobileSearchPanelOpen;
  }, [mobileSearchPanelOpen]);

  useEffect(() => {
    lastScrollYRef.current = window.scrollY;

    function applyMobileSearchReveal(next: boolean) {
      if (mobileSearchRevealedRef.current === next) return;
      mobileSearchRevealedRef.current = next;
      setMobileSearchRevealed(next);
    }

    function updateMobileSearchVisibility() {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= MOBILE_SEARCH_TOP_THRESHOLD_PX) {
        applyMobileSearchReveal(true);
        scrollAccumulatorRef.current = 0;
      } else if (mobileSearchPanelOpenRef.current) {
        applyMobileSearchReveal(true);
      } else {
        const delta = currentScrollY - lastScrollYRef.current;

        if (Math.abs(delta) >= 1) {
          if (
            (delta > 0 && scrollAccumulatorRef.current < 0) ||
            (delta < 0 && scrollAccumulatorRef.current > 0)
          ) {
            scrollAccumulatorRef.current = 0;
          }

          scrollAccumulatorRef.current += delta;

          if (scrollAccumulatorRef.current >= MOBILE_SEARCH_SCROLL_DELTA_PX) {
            applyMobileSearchReveal(false);
            scrollAccumulatorRef.current = 0;
          } else if (
            scrollAccumulatorRef.current <= -MOBILE_SEARCH_SCROLL_DELTA_PX
          ) {
            applyMobileSearchReveal(true);
            scrollAccumulatorRef.current = 0;
          }
        }
      }

      lastScrollYRef.current = currentScrollY;
    }

    function onScroll() {
      if (scrollRafRef.current !== null) return;
      scrollRafRef.current = requestAnimationFrame(() => {
        scrollRafRef.current = null;
        updateMobileSearchVisibility();
      });
    }

    updateMobileSearchVisibility();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (scrollRafRef.current !== null) {
        cancelAnimationFrame(scrollRafRef.current);
      }
    };
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
      <header className="sticky top-0 z-50 isolate w-full border-b border-[#E4E4E4] bg-white/95 backdrop-blur-sm">
        <div className="relative z-10 mx-auto flex h-[5.5rem] max-w-7xl shrink-0 items-center gap-4 bg-white px-4 sm:px-6 lg:gap-6">
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
            "overflow-hidden transition-[max-height,opacity] duration-300 ease-out motion-reduce:transition-none lg:hidden",
            mobileSearchRevealed ? "max-h-24 opacity-100" : "max-h-0 opacity-0",
          )}
        >
          <div
            className={cn(
              mobileSearchRevealed && mobileSearchPanelOpen
                ? "overflow-visible"
                : "overflow-hidden",
              mobileSearchRevealed
                ? "border-t border-gray-100 px-4 pb-3 pt-2"
                : "pointer-events-none invisible border-t-0 px-4 pb-0 pt-0",
            )}
            aria-hidden={!mobileSearchRevealed}
          >
            <LocationSearch
              {...locationSearchProps}
              onActivePanelChange={(panel) =>
                setMobileSearchPanelOpen(panel !== null)
              }
            />
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
