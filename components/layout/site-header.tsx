"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/logo";
import { SiteHeaderSidebar } from "@/components/layout/site-header-sidebar";
import { getStoredMobile, logout } from "@/src/lib/auth-storage";
import { cn } from "@/src/lib/cn";
import { pageShell } from "@/src/tokens/layout";

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

export function SiteHeader({
  variant = "default",
  userPhone: userPhoneProp = null,
  onLogout: onLogoutProp,
}: {
  variant?: "default" | "banner";
  userPhone?: string | null;
  onLogout?: () => void;
} = {}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userPhone, setUserPhone] = useState<string | null>(userPhoneProp);
  const isBanner = variant === "banner";

  useEffect(() => {
    setUserPhone(userPhoneProp ?? getStoredMobile());
  }, [userPhoneProp]);

  function handleLoginSuccess(phone: string) {
    setUserPhone(phone);
  }

  function handleLogout() {
    setUserPhone(null);
    onLogoutProp?.();
    logout();
  }

  return (
    <>
      <header
        className={cn(
          "z-50 bg-white",
          isBanner
            ? "relative"
            : "sticky top-0 border-b border-gray-100 bg-white/95 backdrop-blur-sm",
        )}
      >
        <div
          className={cn(
            pageShell.chrome,
            "flex h-[4.5rem] items-center justify-between",
          )}
        >
          <Link href="/" className="shrink-0">
            <Logo
              width={105}
              height={40}
              priority
              className="h-10 w-auto"
            />
          </Link>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/contact"
              className="hidden h-9 items-center justify-center rounded-full bg-hello-lime-100 px-5 text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-gray-900 transition-colors hover:bg-hello-lime-200 sm:inline-flex"
            >
              Contact Us
            </Link>
            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="site-header-sidebar"
              onClick={() => setMenuOpen(true)}
              className={cn(
                "flex size-9 items-center justify-center text-gray-900 transition-colors",
                isBanner
                  ? "rounded-full bg-gray-100 hover:bg-gray-200"
                  : "rounded-lg hover:bg-gray-50",
              )}
            >
              <MenuIcon className="size-6" />
            </button>
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
