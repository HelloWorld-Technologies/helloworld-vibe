import Image from "next/image";
import {
  contactEmails,
  contactLinkedIn,
  contactMailing,
  contactQueries,
  contactStackedLogo,
} from "@/src/tokens/contact";
import { aboutLinkedInIcon } from "@/src/tokens/about";
import { cn } from "@/src/lib/cn";

function HeadsetIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M4 12a8 8 0 0 1 16 0v5a2 2 0 0 1-2 2h-1.5a1.5 1.5 0 0 1-1.5-1.5V14a1.5 1.5 0 0 1 1.5-1.5H20M4 12.5h1.5A1.5 1.5 0 0 1 7 14v3.5A1.5 1.5 0 0 1 5.5 19H4a2 2 0 0 1-2-2v-5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 19v1a2 2 0 0 0 2 2h1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ContactInfoCards({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "grid gap-4 md:grid-cols-2 md:gap-5",
        className,
      )}
    >
      <article className="order-1 h-full rounded-3xl bg-gradient-mint/80 p-5 text-center sm:p-6 md:text-left">
        <h2 className="text-base font-bold text-gray-900 sm:text-lg">
          {contactMailing.title}
        </h2>
        <p className="mt-3 text-sm font-semibold leading-6 text-gray-800">
          {contactMailing.company}
        </p>
        <p className="mt-1 text-sm leading-6 text-gray-700">
          {contactMailing.address}
        </p>
      </article>

      <article className="order-3 h-full rounded-3xl bg-gradient-lavender/80 p-5 text-center sm:p-6 md:order-2 md:text-left">
        <h2 className="text-base font-bold text-gray-900 underline decoration-blue-light-500 decoration-2 underline-offset-4 sm:text-lg">
          {contactQueries.title}
        </h2>
        <div className="mt-4 flex items-center justify-center gap-3 md:items-start md:justify-start">
          <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center text-gray-800">
            <HeadsetIcon className="size-6" />
          </span>
          <div className="min-w-0">
            <p className="text-base font-bold text-gray-900">
              <span>{contactQueries.label}</span>{" "}
              <span aria-hidden className="text-gray-400">
                •
              </span>{" "}
              <a
                href={contactQueries.phoneHref}
                aria-label={`Call help desk ${contactQueries.phone}`}
                className="hover:underline"
              >
                {contactQueries.phone}
              </a>
            </p>
            <p className="mt-1 text-sm text-gray-500">{contactQueries.hours}</p>
          </div>
        </div>
      </article>

      <div className="order-2 hidden self-stretch md:order-3 md:flex md:min-h-[10rem] md:items-end md:justify-start">
        <Image
          src={contactStackedLogo}
          alt=""
          width={377}
          height={215}
          aria-hidden
          className="h-full w-full select-none object-contain object-left-bottom invert mix-blend-multiply opacity-35"
        />
      </div>

      <article className="order-4 h-full rounded-3xl bg-gradient-sky/90 p-5 text-center sm:p-6 md:text-left">
        <h2 className="text-base font-bold text-gray-900 sm:text-lg">
          {contactEmails.title}
        </h2>
        <ul className="mt-4 space-y-4">
          {contactEmails.items.map((item) => (
            <li key={item.email} className="min-w-0">
              <a
                href={item.href}
                aria-label={`${item.note}: ${item.email}`}
                className="break-all text-sm font-semibold text-blue-light-600 hover:underline"
              >
                {item.email}
              </a>
              <p className="mt-0.5 text-xs text-gray-500">{item.note}</p>
            </li>
          ))}
        </ul>
        <div className="mt-6 border-t border-white/40 pt-4">
          <h3 className="text-sm font-bold text-gray-900">
            {contactLinkedIn.title}
          </h3>
          <a
            href={contactLinkedIn.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="HelloWorld on LinkedIn"
            className="mx-auto mt-3 flex w-fit items-center gap-2 text-sm font-semibold text-blue-light-600 hover:underline md:mx-0"
          >
            <Image
              src={aboutLinkedInIcon}
              alt=""
              width={20}
              height={20}
              aria-hidden
              className="size-5"
            />
            {contactLinkedIn.label}
          </a>
        </div>
      </article>
    </div>
  );
}
