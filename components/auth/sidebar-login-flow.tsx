"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { sendLoginOtp, verifyLoginOtp } from "@/src/apis/login";
import { refreshAfterLogin } from "@/src/lib/auth-storage";
import { cn } from "@/src/lib/cn";
import { validateField } from "@/src/lib/form-validation";

const RESEND_SECONDS = 30;

function formatPhoneInput(value: string): string {
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

export function SidebarLoginFlow({
  onSuccess,
  step: stepProp,
  onStepChange,
}: {
  onSuccess: (phone: string) => void;
  step?: "phone" | "otp";
  onStepChange?: (step: "phone" | "otp") => void;
}) {
  const inputId = useId();
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const otpInputRef = useRef<HTMLInputElement>(null);
  const [internalStep, setInternalStep] = useState<"phone" | "otp">("phone");
  const step = stepProp ?? internalStep;
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState<{ phone?: boolean; otp?: boolean }>({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resendSeconds, setResendSeconds] = useState(RESEND_SECONDS);

  function goToStep(next: "phone" | "otp") {
    if (stepProp === undefined) setInternalStep(next);
    onStepChange?.(next);
    if (next === "phone") {
      setOtp("");
      setErrors({});
      setErrorMessage(null);
    }
  }

  useEffect(() => {
    const input = step === "phone" ? phoneInputRef.current : otpInputRef.current;
    input?.focus();
  }, [step]);

  useEffect(() => {
    if (step !== "otp") return;
    setResendSeconds(RESEND_SECONDS);
  }, [step]);

  useEffect(() => {
    if (step !== "otp" || resendSeconds <= 0) return;

    const timer = window.setTimeout(() => {
      setResendSeconds((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [step, resendSeconds]);

  async function sendOtp() {
    setLoading(true);
    setErrorMessage(null);
    const response = await sendLoginOtp({ mobile: phone });
    setLoading(false);

    if (response.Status === "Success") {
      goToStep("otp");
      setResendSeconds(RESEND_SECONDS);
      return;
    }

    setErrorMessage(response.message ?? "Could not send OTP. Please try again.");
  }

  async function handlePhoneSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const phoneValid = validateField("phone", phone);
    setErrors({ phone: !phoneValid });
    if (!phoneValid) return;
    await sendOtp();
  }

  async function handleOtpSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const otpValid = validateField("otp", otp);
    setErrors({ otp: !otpValid });
    if (!otpValid) return;

    setLoading(true);
    setErrorMessage(null);
    const response = await verifyLoginOtp({
      mobile: phone,
      otp: Number.parseInt(otp, 10),
      session_id: "kyun-chahiye",
    });
    setLoading(false);

    if (response.success) {
      refreshAfterLogin();
      onSuccess(phone);
      return;
    }

    if (response.message === "OTP is Invalid") {
      setErrors({ otp: true });
      return;
    }

    setErrorMessage(response.message ?? "Something went wrong. Please try again.");
  }

  async function handleResend() {
    if (resendSeconds > 0 || loading) return;
    await sendOtp();
  }

  if (step === "otp") {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            We&apos;ve sent a verification code to
          </h2>
          <div className="flex items-center justify-center gap-2">
            <p className="text-base font-semibold text-gray-900">+91-{phone}</p>
            <button
              type="button"
              onClick={() => goToStep("phone")}
              className="inline-flex items-center gap-1 text-sm font-semibold text-hello-lime-600 hover:text-hello-lime-700"
            >
              <EditIcon className="size-4" />
              Edit
            </button>
          </div>
        </div>

        <form className="mt-10 space-y-8" onSubmit={handleOtpSubmit}>
          <div className="space-y-2">
            <input
              ref={otpInputRef}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={otp}
              disabled={loading}
              onChange={(event) =>
                setOtp(formatPhoneInput(event.target.value).slice(0, 6))
              }
              placeholder="000000"
              className={cn(
                "h-14 w-full rounded-2xl border bg-white px-4 text-center text-2xl font-semibold tracking-[0.45em] text-gray-900 shadow-xs",
                "placeholder:font-normal placeholder:tracking-normal placeholder:text-gray-300",
                "focus:border-hello-lime-300 focus:outline-none focus:ring-4 focus:ring-hello-lime-100",
                errors.otp ? "border-error-400" : "border-gray-300",
              )}
            />
          </div>

          <p className="text-center text-sm text-gray-600">
            Didn&apos;t receive the code?{" "}
            {resendSeconds > 0 ? (
              <span className="text-gray-500">
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

          <button
            type="submit"
            disabled={otp.length !== 6 || loading}
            className={cn(
              "flex h-14 w-full items-center justify-center rounded-2xl bg-hello-lime-400 text-base font-bold text-gray-900 transition-colors",
              "hover:bg-hello-lime-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-hello-lime-100",
              "disabled:cursor-not-allowed disabled:opacity-50",
            )}
          >
            {loading ? "Verifying..." : "Continue"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Let&apos;s Get You In</h2>
        <p className="text-sm text-gray-600">
          Coliving that matches your vibe- let&apos;s find yours.
        </p>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handlePhoneSubmit}>
        <div className="space-y-4">
          <label htmlFor={inputId} className="block text-xs font-medium text-gray-500">
            Please enter your phone number
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
              +91-
            </span>
            <input
              ref={phoneInputRef}
              id={inputId}
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              placeholder="9777964438"
              value={phone}
              disabled={loading}
              onChange={(event) => setPhone(formatPhoneInput(event.target.value))}
              className={cn(
                "h-12 w-full rounded-xl border bg-white pl-14 pr-4 text-base font-semibold text-gray-900 shadow-xs",
                "placeholder:font-normal placeholder:text-gray-400",
                "focus:border-hello-lime-300 focus:outline-none focus:ring-4 focus:ring-hello-lime-100",
                "disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500",
                errors.phone ? "border-error-400" : "border-gray-300",
              )}
            />
          </div>
        </div>

        {errorMessage ? (
          <p className="text-sm text-error-600">{errorMessage}</p>
        ) : null}

        <button
          type="submit"
          disabled={phone.length !== 10 || loading}
          className={cn(
            "flex h-12 w-full items-center justify-center rounded-xl bg-hello-lime-400 text-base font-bold text-gray-900 transition-colors",
            "hover:bg-hello-lime-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-hello-lime-100",
            "disabled:cursor-not-allowed disabled:opacity-50",
          )}
        >
          {loading ? "Sending OTP..." : "Login"}
        </button>
      </form>

      <p className="mt-6 text-xs leading-relaxed text-gray-600">
        By continuing you agree to{" "}
        <Link
          href="/tenant-policy"
          className="font-medium text-blue-light-600 hover:text-blue-light-700 hover:underline"
        >
          HelloWorld&apos;s Terms and conditions.
        </Link>
      </p>
    </div>
  );
}
