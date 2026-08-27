"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Modal, ModalDescription, ModalTitle } from "@/components/ui/modal";
import { cn } from "@/src/lib/cn";

const RESEND_SECONDS = 30;

export interface WishlistAuthModalProps {
  open: boolean;
  onClose: () => void;
  loading?: boolean;
  errorMessage?: string | null;
  step: "phone" | "otp";
  phone: string;
  otp: string;
  title?: string;
  description?: string;
  onPhoneChange: (phone: string) => void;
  onOtpChange: (otp: string) => void;
  onSendOtp: () => void | Promise<void>;
  onVerifyOtp: () => void | Promise<void>;
  onEditPhone?: () => void;
}

function formatPhoneInput(value: string) {
  return value.replace(/\D/g, "").slice(0, 10);
}

function EditIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 16 16" fill="none" className={className}>
      <path
        d="M11.3 2.3a1.1 1.1 0 0 1 1.6 1.6l-7.2 7.2-2.2.6.6-2.2 7.2-7.2Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function WishlistAuthModal({
  open,
  onClose,
  loading = false,
  errorMessage,
  step,
  phone,
  otp,
  title = "Save to wishlist",
  description = "Sign in with your mobile number to save properties for later.",
  onPhoneChange,
  onOtpChange,
  onSendOtp,
  onVerifyOtp,
  onEditPhone,
}: WishlistAuthModalProps) {
  const titleId = useId();
  const descriptionId = useId();
  const phoneInputId = useId();
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const otpInputRef = useRef<HTMLInputElement>(null);
  const [resendSeconds, setResendSeconds] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (!open) return;

    const timer = window.setTimeout(() => {
      if (step === "phone") {
        phoneInputRef.current?.focus();
      } else {
        otpInputRef.current?.focus();
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, [open, step]);

  useEffect(() => {
    if (!open || step !== "otp") return;
    setResendSeconds(RESEND_SECONDS);
  }, [open, step]);

  useEffect(() => {
    if (!open || step !== "otp" || resendSeconds <= 0) return;

    const timer = window.setTimeout(() => {
      setResendSeconds((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [open, step, resendSeconds]);

  async function handlePhoneSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (phone.length !== 10 || loading) return;
    await onSendOtp();
  }

  async function handleOtpSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (otp.length !== 6 || loading) return;
    await onVerifyOtp();
  }

  async function handleResend() {
    if (resendSeconds > 0 || loading) return;
    await onSendOtp();
    setResendSeconds(RESEND_SECONDS);
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      labelledBy={titleId}
      describedBy={descriptionId}
      closeLabel="Close login dialog"
      maxWidthClassName="max-w-md"
    >
      {step === "phone" ? (
        <>
          <ModalTitle id={titleId}>{title}</ModalTitle>
          <ModalDescription id={descriptionId} className="font-medium text-gray-900">
            {description}
          </ModalDescription>

          <form className="mt-5 space-y-6" onSubmit={handlePhoneSubmit}>
            <div className="space-y-3">
              <label
                htmlFor={phoneInputId}
                className="mb-1.5 text-xs font-medium text-gray-900"
              >
                Please enter your phone number
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                  +91-
                </span>
                <input
                  ref={phoneInputRef}
                  id={phoneInputId}
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  placeholder="10-digit mobile number"
                  value={phone}
                  disabled={loading}
                  onChange={(event) =>
                    onPhoneChange(formatPhoneInput(event.target.value))
                  }
                  className={cn(
                    "h-12 w-full rounded-xl border border-gray-300 bg-white pl-14 pr-4 text-base font-semibold text-gray-900 shadow-xs",
                    "placeholder:font-normal placeholder:text-gray-400",
                    "focus:border-hello-lime-300 focus:outline-none focus:ring-4 focus:ring-hello-lime-100",
                  )}
                />
              </div>
            </div>

            {errorMessage ? (
              <p className="text-sm text-error-600">{errorMessage}</p>
            ) : null}

            <Button
              type="submit"
              size="2xl"
              className="w-full rounded-2xl"
              disabled={phone.length !== 10 || loading}
            >
              {loading ? "Sending OTP..." : "Continue"}
            </Button>
          </form>
        </>
      ) : (
        <>
          <div className="space-y-2 text-center">
            <ModalTitle id={titleId} className="text-xl font-medium text-gray-700 sm:text-2xl">
              We&apos;ve sent a verification code to
            </ModalTitle>
            <div className="flex items-center justify-center gap-2">
              <ModalDescription
                id={descriptionId}
                className="mt-0 text-base font-semibold text-gray-900"
              >
                +91-{phone}
              </ModalDescription>
              <button
                type="button"
                onClick={onEditPhone}
                className="inline-flex items-center gap-1 text-sm font-semibold text-hello-lime-600 hover:text-hello-lime-700"
              >
                <EditIcon className="size-4" />
                Edit
              </button>
            </div>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleOtpSubmit}>
            <input
              ref={otpInputRef}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={otp}
              disabled={loading}
              aria-label="One-time password"
              onChange={(event) =>
                onOtpChange(formatPhoneInput(event.target.value).slice(0, 6))
              }
              placeholder="000000"
              className={cn(
                "h-14 w-full rounded-2xl border bg-white px-4 text-center text-2xl font-semibold tracking-[0.45em] text-gray-900 shadow-xs",
                "placeholder:font-normal placeholder:tracking-normal placeholder:text-gray-300",
                "focus:border-hello-lime-300 focus:outline-none focus:ring-4 focus:ring-hello-lime-100",
                errorMessage ? "border-error-400" : "border-gray-300",
              )}
            />

            <p className="text-center text-sm text-gray-600">
              Didn&apos;t receive the code?{" "}
              {resendSeconds > 0 ? (
                <span className="text-gray-400">
                  Resend SMS in 00:{String(resendSeconds).padStart(2, "0")}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => void handleResend()}
                  disabled={loading}
                  className="font-semibold text-hello-lime-600 hover:text-hello-lime-700"
                >
                  Resend SMS
                </button>
              )}
            </p>

            {errorMessage ? (
              <p className="text-center text-sm text-error-600">{errorMessage}</p>
            ) : null}

            <Button
              type="submit"
              size="2xl"
              className="w-full rounded-2xl"
              disabled={otp.length !== 6 || loading}
            >
              {loading ? "Verifying..." : "Continue"}
            </Button>
          </form>
        </>
      )}
    </Modal>
  );
}
