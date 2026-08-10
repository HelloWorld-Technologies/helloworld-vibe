"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/src/lib/cn";

const MODAL_TRANSITION_MS = 300;

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  maxWidthClassName?: string;
  labelledBy?: string;
  describedBy?: string;
  closeLabel?: string;
  /** Overlay stacking class. Use higher than `z-50` for nested modals (e.g. date picker). */
  overlayClassName?: string;
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 20"
      fill="none"
      className={className}
    >
      <path
        d="M15 5 5 15M5 5l10 10"
        stroke="currentColor"
        strokeWidth="1.67"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Modal({
  open,
  onClose,
  children,
  className,
  maxWidthClassName,
  labelledBy,
  describedBy,
  closeLabel = "Close dialog",
  overlayClassName = "z-50",
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
      return () => cancelAnimationFrame(frame);
    }

    setVisible(false);
    const timer = window.setTimeout(() => setMounted(false), MODAL_TRANSITION_MS);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mounted, onClose]);

  useEffect(() => {
    if (visible) {
      panelRef.current?.focus();
    }
  }, [visible]);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 flex justify-center",
        overlayClassName,
        // Mobile: bottom sheet. Desktop: centered dialog.
        "items-end p-0 md:items-center md:p-6",
        !visible && "pointer-events-none",
      )}
    >
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-gray-900/60 backdrop-blur-[2px]",
          "transition-opacity duration-300 ease-out motion-reduce:transition-none",
          visible ? "opacity-100" : "opacity-0",
        )}
      />

      <div
        className={cn(
          "relative w-full",
          // Full-bleed sheet on mobile; caller/default max-width from md up.
          "max-md:!max-w-none",
          maxWidthClassName ?? "md:max-w-[400px]",
          "transition-all duration-300 ease-out motion-reduce:transition-none",
          visible
            ? "translate-y-0 opacity-100 md:scale-100"
            : "translate-y-full opacity-100 md:translate-y-4 md:scale-95 md:opacity-0",
        )}
      >
        <button
          type="button"
          aria-label={closeLabel}
          onClick={onClose}
          className={cn(
            "absolute z-10 flex size-10 items-center justify-center rounded-full bg-gray-900 text-white shadow-lg transition-colors hover:bg-gray-800",
            // Mobile: sits above the sheet on the right. Desktop: outside top-right.
            "right-4 -top-12 md:-right-4 md:-top-12",
          )}
        >
          <CloseIcon className="size-5" />
        </button>

        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={labelledBy}
          aria-describedby={describedBy}
          tabIndex={-1}
          className={cn(
            "relative overflow-y-auto bg-white shadow-xl outline-none",
            // Bottom sheet on mobile; rounded dialog on desktop.
            "max-h-[min(92dvh,calc(100dvh-3.5rem))] rounded-t-3xl rounded-b-none p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:p-6",
            "md:max-h-[calc(100dvh-2rem)] md:rounded-3xl md:p-10 md:pb-10",
            className,
          )}
        >
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}

export function ModalTitle({
  id,
  children,
  className,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      id={id}
      className={cn("text-2xl font-bold tracking-tight text-gray-900", className)}
    >
      {children}
    </h2>
  );
}

export function ModalDescription({
  id,
  children,
  className,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <p id={id} className={cn("mt-2 text-sm text-gray-600", className)}>
      {children}
    </p>
  );
}
