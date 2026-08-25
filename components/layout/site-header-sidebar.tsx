"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Logo } from "@/components/brand/logo";
import { useWishlist } from "@/components/wishlist/wishlist-provider";
import { cn } from "@/src/lib/cn";
import {
  getHeaderMenuItems,
  type HeaderMenuItemId,
} from "@/src/tokens/header-menu";
import { blackWordmark } from "@/src/tokens/logos";

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 6 10" fill="none" className={className}>
      <path
        d="M1 1l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UserAvatarIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 32 32" fill="none" className={className}>
      <circle cx="16" cy="11" r="5" fill="currentColor" />
      <path
        d="M7 27c1.8-5.2 6.2-8 9-8s7.2 2.8 9 8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MenuItemIcon({ id }: { id: HeaderMenuItemId }) {
  const className = "size-3 shrink-0 text-gray-900";

  switch (id) {
    case "contact":
      return (
        <svg aria-hidden viewBox="0 0 14 16" fill="none" className={className}>
          <path
            d="M7 1a4 4 0 0 0-4 4v1.5H1.5a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H11V5a4 4 0 0 0-4-4Z"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <path d="M5 8.5h4" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      );
    case "visits":
      return (
        <svg aria-hidden viewBox="0 0 12 13" fill="none" className={className}>
          <rect x="1" y="2" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
          <path d="M1 5h10M4 1v2M8 1v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );
    case "wishlist":
      return (
        <svg aria-hidden viewBox="0 0 12 11" fill="none" className={className}>
          <path
            d="M6 9.8 1.2 5.4a2.4 2.4 0 0 1 3.4-3.4L6 3.4l1.4-1.4a2.4 2.4 0 0 1 3.4 3.4L6 9.8Z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "community":
      return (
        <svg aria-hidden viewBox="0 0 12 12" fill="none" className={className}>
          <path d="M2 8V4l4-2 4 2v4l-4 2-4-2Z" stroke="currentColor" strokeWidth="1.2" />
          <path d="M6 6v4M2 4l4 2 4-2" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      );
    case "homeowners":
      return (
        <svg aria-hidden viewBox="0 0 12 10" fill="none" className={className}>
          <path d="M1 9V4l5-3 5 3v5" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="8.5" cy="3" r="1.5" stroke="currentColor" strokeWidth="1" />
        </svg>
      );
    case "living":
      return (
        <svg aria-hidden viewBox="0 0 12 12" fill="none" className={className}>
          <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2" />
          <path d="M1 6h10M6 1.5c1.5 1.7 1.5 7.3 0 9M6 1.5c-1.5 1.7-1.5 7.3 0 9" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      );
    case "about":
      return (
        <svg aria-hidden viewBox="0 0 12 12" fill="none" className={className}>
          <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2" />
          <path d="M6 5v4M6 3.5v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );
    case "privacy":
      return (
        <svg aria-hidden viewBox="0 0 12 12" fill="none" className={className}>
          <path
            d="M6 1 2 3v4c0 2.2 1.7 4.2 4 4.7 2.3-.5 4-2.5 4-4.7V3L6 1Z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "tenancy":
      return (
        <svg aria-hidden viewBox="0 0 12 12" fill="none" className={className}>
          <path d="M2 2h8v8H2V2Z" stroke="currentColor" strokeWidth="1.2" />
          <path d="M4 5h4M4 7h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );
    case "login":
    case "logout":
      return (
        <svg aria-hidden viewBox="0 0 12 12" fill="none" className={className}>
          <path d="M5 2H2v8h3" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M8 6H4M8 6 6.5 4.5M8 6l-1.5 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );
  }
}

function SidebarMenuRow({
  label,
  icon,
  href,
  onAction,
  onNavigate,
}: {
  label: string;
  icon: HeaderMenuItemId;
  href?: string;
  onAction?: () => void;
  onNavigate: () => void;
}) {
  const content = (
    <>
      <span className="flex min-w-0 items-center">
        <span className="flex w-3.5 shrink-0 items-center justify-center">
          <MenuItemIcon id={icon} />
        </span>
        <span className="ml-3.5 truncate text-sm font-medium leading-5 text-gray-900">
          {label}
        </span>
      </span>
      <ChevronRightIcon className="size-2.5 shrink-0 text-gray-400" />
    </>
  );

  const rowClassName =
    "flex min-h-10 w-full items-center justify-between py-1.5 text-left transition-colors hover:opacity-80";

  if (href) {
    return (
      <Link href={href} onClick={onNavigate} className={rowClassName}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onAction} className={rowClassName}>
      {content}
    </button>
  );
}

export function SiteHeaderSidebar({
  open,
  onClose,
  userPhone,
  onLoginSuccess,
  onLogout,
}: {
  open: boolean;
  onClose: () => void;
  userPhone?: string | null;
  onLoginSuccess?: (phone: string) => void;
  onLogout?: () => void;
}) {
  const menuItems = getHeaderMenuItems(Boolean(userPhone));
  const { openLogin } = useWishlist();

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-gray-900/40 transition-opacity duration-200 motion-reduce:transition-none",
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
        aria-hidden={!open}
      />

      <aside
        id="site-header-sidebar"
        aria-hidden={!open}
        className={cn(
          "fixed right-0 top-0 z-50 flex h-full w-full max-w-[24.375rem] flex-col bg-white shadow-xl transition-transform duration-200 ease-out motion-reduce:transition-none",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <button
          type="button"
          aria-label="Close menu"
          onClick={onClose}
          className="absolute right-5 top-7 z-20 flex size-10 items-center justify-center rounded-full text-hello-lime-600 transition-colors hover:bg-gray-50 hover:text-hello-lime-700"
        >
          <CloseIcon className="size-5" />
        </button>

        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden px-10 pb-10 pt-[5.25rem]">
          {userPhone ? (
            <div className="mb-4 flex items-center gap-3">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-light-100 to-blue-light-300 text-blue-light-700">
                <UserAvatarIcon className="size-7" />
              </div>
              <p className="text-base font-bold leading-6 text-gray-900">
                +91-{userPhone}
              </p>
            </div>
          ) : null}

          <nav className="flex flex-col gap-0.5">
            {menuItems.map((item) => (
              <SidebarMenuRow
                key={item.id}
                label={item.label}
                icon={item.id}
                href={item.href}
                onNavigate={onClose}
                onAction={
                  item.action === "logout"
                    ? () => {
                        onLogout?.();
                        onClose();
                      }
                    : item.action === "login"
                      ? () => {
                          onClose();
                          openLogin({
                            onSuccess: (phone) => onLoginSuccess?.(phone),
                          });
                        }
                      : undefined
                }
              />
            ))}
          </nav>

          <div
            aria-hidden
            className="pointer-events-none absolute bottom-0 left-14 select-none"
          >
            <Logo
              variant={blackWordmark}
              width={250}
              height={143}
              className="h-auto w-[17.5rem] max-w-none opacity-[0.12]"
            />
          </div>
        </div>
      </aside>
    </>
  );
}
