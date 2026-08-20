import { cn } from "@/src/lib/cn";

/** Figma Show-on-Maps pin. */
export function ShowOnMapsIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      width="17"
      height="19"
      viewBox="0 0 17 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M9.73294 17.753C9.33538 18.1253 8.80402 18.3333 8.25103 18.3333C7.69803 18.3333 7.16667 18.1253 6.76911 17.753C3.1286 14.3238 -1.75013 10.493 0.629079 4.93136C1.9155 1.92423 5.00348 0 8.25103 0C11.4986 0 14.5866 1.92423 15.873 4.93136C18.2492 10.486 13.3824 14.3356 9.73294 17.753Z"
        fill="#65A30C"
      />
      <path
        d="M11.4577 8.24996C11.4577 10.0219 10.0213 11.4583 8.24935 11.4583C6.47744 11.4583 5.04102 10.0219 5.04102 8.24996C5.04102 6.47805 6.47744 5.04163 8.24935 5.04163C10.0213 5.04163 11.4577 6.47805 11.4577 8.24996Z"
        fill="#F7FEE7"
      />
    </svg>
  );
}

const linkClassName =
  "inline-flex items-center gap-1.5 text-sm font-bold leading-none text-hello-lime-700 transition-colors hover:text-hello-lime-800";

export function ShowOnMapsLink({
  href,
  className,
}: {
  href: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(linkClassName, className)}
    >
      <ShowOnMapsIcon className="h-[19px] w-[17px] shrink-0" />
      <span className="leading-none">Show on Maps</span>
    </a>
  );
}

export function ShowOnMapsButtonLabel() {
  return (
    <>
      <ShowOnMapsIcon className="h-[19px] w-[17px] shrink-0" />
      <span className="leading-none">Show on Maps</span>
    </>
  );
}

export { linkClassName as showOnMapsLinkClassName };
