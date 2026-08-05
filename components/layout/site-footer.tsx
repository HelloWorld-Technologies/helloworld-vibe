import Link from "next/link";
import { pageShell } from "@/src/tokens/layout";
import { Logo } from "@/components/brand/logo";
import { cn } from "@/src/lib/cn";
import {
  footerAboutLinks,
  footerAboutLinksMobile,
  footerCityColumns,
  footerContact,
  footerProductLinks,
  socialLinks,
} from "@/src/tokens/footer";

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 22 22"
      fill="none"
      className={cn("shrink-0", className)}
    >
      <path
        d="M6.8 3.5h2.2l1.1 2.7-1.4 1.1a11.5 11.5 0 0 0 5.3 5.3l1.1-1.4 2.7 1.1v2.2c0 .6-.5 1.1-1.1 1.1C9.7 16.5 5.5 12.3 5.5 6.6c0-.6.4-1.1 1-1.1h.3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 22 22"
      fill="none"
      className={cn("shrink-0", className)}
    >
      <path
        d="M4 6.5h14v9H4v-9Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="m4.5 7 6.5 4.5L17.5 7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SocialIcon({ id }: { id: string }) {
  if (id === "facebook") {
    return (
      <svg aria-hidden viewBox="0 0 24 24" fill="currentColor" className="size-3.5">
        <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97H15.83c-1.49 0-1.955.93-1.955 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
      </svg>
    );
  }

  if (id === "instagram") {
    return (
      <svg aria-hidden viewBox="0 0 24 24" fill="currentColor" className="size-3.5">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.975.975 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.975.975-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.975-.975-1.246-2.242-1.308-3.608C2.175 15.747 2.163 15.367 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.975-.975 2.242-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.014 7.052.072 5.775.13 4.602.402 3.635 1.37 2.668 2.337 2.396 3.51 2.338 4.788 2.28 6.068 2.266 6.477 2.266 12c0 5.523.014 5.932.072 7.212.058 1.277.33 2.45 1.297 3.417.967.967 2.14 1.239 3.417 1.297 1.28.058 1.689.072 7.212.072s5.932-.014 7.212-.072c1.277-.058 2.45-.33 3.417-1.297.967-.967 1.239-2.14 1.297-3.417.058-1.28.072-1.689.072-7.212s-.014-5.932-.072-7.212c-.058-1.277-.33-2.45-1.297-3.417C21.45 2.402 20.277 2.13 19 .072 17.72.014 17.311 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    );
  }

  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="currentColor" className="size-3.5">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function FooterDivider({ className }: { className?: string }) {
  return <div aria-hidden className={cn("h-px w-full bg-[#e6e6e6]", className)} />;
}

function FooterLinkList({
  links,
  className,
}: {
  links: readonly { label: string; href: string }[];
  className?: string;
}) {
  return (
    <ul className={className}>
      {links.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            className="inline-flex min-h-8 items-center text-[0.9375rem] leading-[1.3] text-[#0a0e14]/60 transition-colors hover:text-[#0a0e14] lg:min-h-0"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function FooterContactDetails() {
  return (
    <div className="space-y-2.5 lg:space-y-3">
      <a
        href={footerContact.phoneHref}
        className="flex items-center gap-2 text-sm font-bold text-[#0a0e14] lg:text-base"
      >
        <PhoneIcon className="size-[18px] lg:size-[22px]" />
        {footerContact.phone}
      </a>
      <a
        href={footerContact.emailHref}
        className="flex items-center gap-2 text-sm font-bold text-[#0a0e14] lg:text-base"
      >
        <MailIcon className="size-[18px] lg:size-[22px]" />
        {footerContact.email}
      </a>
    </div>
  );
}

function FooterSocialLinks({ variant }: { variant: "desktop" | "mobile" }) {
  return (
    <div>
      <h3 className="text-base font-bold text-[#0a0e14]/80">Follow us</h3>
      <div className="mt-4 flex items-center gap-4 lg:mt-8">
        {socialLinks.map((link) => (
          <a
            key={link.id}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
            className={cn(
              "inline-flex items-center justify-center transition-opacity hover:opacity-80",
              variant === "mobile"
                ? "size-[22px] rounded-md bg-[#0a0e14] text-white"
                : "size-[22px] text-[#0a0e14]",
            )}
          >
            <SocialIcon id={link.id} />
          </a>
        ))}
      </div>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-[#e6e6e6] bg-gray-100 text-[#0a0e14]">
      <div className={pageShell.footer}>
        <div className="lg:flex lg:items-start lg:justify-between">
          <div className="shrink-0 lg:w-[18.5rem]">
            <Link href="/" className="inline-block">
              <Logo width={84} height={32} className="h-7 w-auto lg:h-8" />
            </Link>
            <p className="mt-4 max-w-xs text-[0.9375rem] leading-[1.3] text-[#0a0e14]/60 lg:mt-6">
              {footerContact.address}
            </p>

            <div className="mt-6 space-y-6 lg:mt-16 lg:space-y-0">
              <FooterContactDetails />
              <div className="lg:hidden">
                <FooterSocialLinks variant="mobile" />
              </div>
            </div>
          </div>

          <div
            aria-hidden
            className="mx-4 hidden w-px self-stretch bg-[#e6e6e6] lg:block"
          />

          <div className="mt-6 lg:mt-0 lg:ml-16 lg:flex lg:flex-1 lg:items-start lg:justify-between lg:gap-12 xl:gap-16">
            <FooterDivider className="mb-6 lg:hidden" />

            <div className="lg:shrink-0">
              <h3 className="text-base font-bold text-[#0a0e14]/80">
                <span className="lg:hidden">Our cozy homes in</span>
                <span className="hidden lg:inline">Our Coliving PGs in</span>
              </h3>
              <div className="mt-4 grid grid-cols-2 gap-x-4 lg:mt-10 lg:gap-x-16">
                {footerCityColumns.map((column, columnIndex) => (
                  <FooterLinkList
                    key={columnIndex}
                    links={column}
                    className="space-y-0 lg:space-y-1"
                  />
                ))}
              </div>
            </div>

            <FooterDivider className="my-6 lg:hidden" />

            <div className="grid grid-cols-2 gap-8 lg:contents">
              <div className="lg:shrink-0">
                <h3 className="text-base font-bold text-[#0a0e14]/80">Product</h3>
                <FooterLinkList
                  links={footerProductLinks}
                  className="mt-4 space-y-0 lg:mt-10 lg:space-y-1"
                />
              </div>

              <div className="lg:shrink-0">
                <h3 className="text-base font-bold text-[#0a0e14]/80">About</h3>
                <FooterLinkList
                  links={footerAboutLinksMobile}
                  className="mt-4 space-y-0 lg:hidden lg:space-y-1"
                />
                <FooterLinkList
                  links={footerAboutLinks}
                  className="mt-4 hidden space-y-0 lg:mt-10 lg:block lg:space-y-1"
                />
              </div>
            </div>

            <div className="hidden shrink-0 lg:block">
              <FooterSocialLinks variant="desktop" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
