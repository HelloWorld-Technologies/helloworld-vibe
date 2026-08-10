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
      {links.map((link) => {
        const isExternal = /^https?:\/\//i.test(link.href);
        const classNameLink =
          "inline-flex min-h-8 items-center text-[0.9375rem] leading-[1.3] text-[#0a0e14]/60 transition-colors hover:text-[#0a0e14] lg:min-h-0";
        return (
          <li key={`${link.label}-${link.href}`}>
            {isExternal ? (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={classNameLink}
              >
                {link.label}
              </a>
            ) : (
              <Link href={link.href} className={classNameLink}>
                {link.label}
              </Link>
            )}
          </li>
        );
      })}
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

/** Matches Figma: dark rounded square + white glyph for all three. */
function SocialIcon({ id }: { id: (typeof socialLinks)[number]["id"] }) {
  if (id === "facebook") {
    return (
      <svg aria-hidden viewBox="0 0 22 22" fill="none" className="size-[22px]">
        <rect width="22" height="22" rx="5" fill="currentColor" />
        <path
          fill="#fff"
          d="M14.2 12.05h1.85l.3-2.2h-2.15V8.45c0-.7.2-1.2 1.2-1.2h1.1V5.15h-1.6c-2.2 0-3.4 1.35-3.4 3.45v1.25H9.4v2.2h2.1V19h2.7v-6.95Z"
        />
      </svg>
    );
  }

  if (id === "instagram") {
    return (
      <svg aria-hidden viewBox="0 0 22 22" fill="none" className="size-[22px]">
        <rect width="22" height="22" rx="5" fill="currentColor" />
        <rect
          x="5.25"
          y="5.25"
          width="11.5"
          height="11.5"
          rx="3.25"
          stroke="#fff"
          strokeWidth="1.5"
        />
        <circle cx="11" cy="11" r="2.85" stroke="#fff" strokeWidth="1.5" />
        <circle cx="15.15" cy="6.9" r="0.95" fill="#fff" />
      </svg>
    );
  }

  return (
    <svg aria-hidden viewBox="0 0 22 22" fill="none" className="size-[22px]">
      <rect width="22" height="22" rx="5" fill="currentColor" />
      <path
        fill="#fff"
        d="M7.5 9.05H6v6.7h1.5v-6.7Zm-.75-2.4a.9.9 0 1 0 0 1.8.9.9 0 0 0 0-1.8Zm6.55 2.25c-.95 0-1.55.48-1.82 1.02V9.05H9.98v6.7h1.5v-3.55c0-.95.42-1.55 1.22-1.55.75 0 1.1.5 1.1 1.5v3.6H15.3v-3.9c0-1.85-1-2.85-2.75-2.85Z"
      />
    </svg>
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
              "inline-flex size-[22px] items-center justify-center text-[#252B37] transition-opacity hover:opacity-80",
              variant === "mobile" ? "opacity-90" : undefined,
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
