import { cn } from "@/src/lib/cn";

/** Google Play mark (monochrome). */
export function PlayStoreIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("shrink-0", className)}
    >
      <path d="M3.61 1.81A1 1 0 0 0 2.99 2.73v18.54a1 1 0 0 0 1.61.92L14.2 12 3.61 1.81Zm11.18 10.89 2.3 2.3-10.93 6.34 8.63-8.64Zm3.2-3.2 2.8 1.63a1 1 0 0 1 0 1.73l-2.8 1.63L15.2 12l2.8-2.5ZM5.86 2.66l10.94 6.33-2.3 2.3-8.64-8.63Z" />
    </svg>
  );
}

/** Apple mark (monochrome). */
export function AppStoreIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("shrink-0", className)}
    >
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.79 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.22-1.98 1.09-3.13-1.05.05-2.31.7-3.06 1.58-.67.78-1.26 2.03-1.1 3.23 1.16.09 2.34-.66 3.07-1.68Z" />
    </svg>
  );
}
