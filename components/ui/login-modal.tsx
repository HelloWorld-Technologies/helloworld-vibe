"use client";

import Link from "next/link";
import { useId, useState, type FormEvent } from "react";
import { Modal, ModalDescription, ModalTitle } from "@/components/ui/modal";
import { cn } from "@/src/lib/cn";

export interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onLogin?: (phone: string) => void | Promise<void>;
  defaultPhone?: string;
  termsHref?: string;
  loading?: boolean;
}

function formatPhoneInput(value: string): string {
  return value.replace(/\D/g, "").slice(0, 10);
}

export function LoginModal({
  open,
  onClose,
  onLogin,
  defaultPhone = "",
  termsHref = "/tenant-policy",
  loading = false,
}: LoginModalProps) {
  const titleId = useId();
  const descriptionId = useId();
  const inputId = useId();
  const [phone, setPhone] = useState(defaultPhone);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (phone.length !== 10 || loading) {
      return;
    }

    await onLogin?.(phone);
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      labelledBy={titleId}
      describedBy={descriptionId}
      closeLabel="Close login dialog"
    >
      <ModalTitle id={titleId}>Let&apos;s Get You In</ModalTitle>
      <ModalDescription id={descriptionId}>
        Coliving that matches your vibe- let&apos;s find yours.
      </ModalDescription>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label
            htmlFor={inputId}
            className="text-xs font-medium text-gray-500"
          >
            Please enter your phone number
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
              +91-
            </span>
            <input
              id={inputId}
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              placeholder="9777964438"
              value={phone}
              disabled={loading}
              onChange={(event) => setPhone(formatPhoneInput(event.target.value))}
              className={cn(
                "h-12 w-full rounded-xl border border-gray-300 bg-white pl-14 pr-4 text-base font-semibold text-gray-900 shadow-xs",
                "placeholder:font-normal placeholder:text-gray-400",
                "focus:border-hello-lime-300 focus:outline-none focus:ring-4 focus:ring-hello-lime-100",
                "disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500",
              )}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={phone.length !== 10 || loading}
          className={cn(
            "flex h-12 w-full items-center justify-center rounded-xl bg-hello-lime-300 text-base font-bold text-gray-900 transition-colors",
            "hover:bg-hello-lime-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-hello-lime-100",
            "disabled:cursor-not-allowed disabled:opacity-50",
          )}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="mt-6 text-xs leading-relaxed text-gray-600">
        By continuing you agree to{" "}
        <Link
          href={termsHref}
          className="font-medium text-blue-light-600 hover:text-blue-light-700 hover:underline"
        >
          HelloWorld&apos;s Terms and conditions.
        </Link>
      </p>
    </Modal>
  );
}
