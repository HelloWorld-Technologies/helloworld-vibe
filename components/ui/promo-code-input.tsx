"use client";

import { useId, useState } from "react";
import { cn } from "@/src/lib/cn";

export type PromoCodeApplyResult =
  | {
      success: true;
      discountAmount?: number;
      message?: string;
    }
  | {
      success: false;
      message: string;
    };

export interface PromoCodeInputProps {
  label: string;
  onApply: (code: string) => Promise<PromoCodeApplyResult>;
  onRemove?: () => void;
  placeholder?: string;
  className?: string;
  defaultValue?: string;
  defaultApplied?: {
    code: string;
    discountAmount?: number;
    message?: string;
  };
  successMessage?: (discountAmount?: number) => string;
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      fill="none"
      className={className}
    >
      <path
        d="M12 4L4 12M4 4L12 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 20"
      fill="none"
      className={cn("animate-spin", className)}
    >
      <circle
        cx="10"
        cy="10"
        r="7.5"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="2"
      />
      <path
        d="M10 2.5C14.1421 2.5 17.5 5.85786 17.5 10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function defaultSuccessMessage(discountAmount?: number) {
  if (discountAmount !== undefined) {
    return `Coupon code applied successfully. ₹${discountAmount.toLocaleString("en-IN")} discount has been added to your booking.`;
  }

  return "Coupon code applied successfully.";
}

export function PromoCodeInput({
  label,
  onApply,
  onRemove,
  placeholder = "Enter code",
  className,
  defaultValue = "",
  defaultApplied,
  successMessage = defaultSuccessMessage,
}: PromoCodeInputProps) {
  const inputId = useId();
  const messageId = `${inputId}-message`;

  const [value, setValue] = useState(defaultApplied?.code ?? defaultValue);
  const [appliedCode, setAppliedCode] = useState<string | null>(
    defaultApplied?.code ?? null,
  );
  const [discountAmount, setDiscountAmount] = useState<number | undefined>(
    defaultApplied?.discountAmount,
  );
  const [status, setStatus] = useState<"idle" | "loading" | "applied" | "error">(
    defaultApplied ? "applied" : "idle",
  );
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(
    defaultApplied
      ? (defaultApplied.message ??
          successMessage(defaultApplied.discountAmount))
      : null,
  );

  const isApplied = status === "applied" && appliedCode !== null;
  const isLoading = status === "loading";
  const isError = status === "error";
  const isDisabled = isLoading || isApplied;

  async function handleApply() {
    const code = value.trim();
    if (!code || isLoading || isApplied) return;

    setStatus("loading");
    setFeedbackMessage(null);

    try {
      const result = await onApply(code);

      if (result.success) {
        setAppliedCode(code);
        setDiscountAmount(result.discountAmount);
        setStatus("applied");
        setFeedbackMessage(
          result.message?.trim() || successMessage(result.discountAmount),
        );
        return;
      }

      setStatus("error");
      setFeedbackMessage(result.message);
    } catch {
      setStatus("error");
      setFeedbackMessage("Could not apply code. Please try again.");
    }
  }

  function handleRemove() {
    setValue("");
    setAppliedCode(null);
    setDiscountAmount(undefined);
    setStatus("idle");
    setFeedbackMessage(null);
    onRemove?.();
  }

  function handleChange(nextValue: string) {
    setValue(nextValue);
    if (isError) {
      setStatus("idle");
      setFeedbackMessage(null);
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" && !isDisabled) {
      event.preventDefault();
      void handleApply();
    }
  }

  return (
    <div className={cn("flex w-full min-w-0 flex-col gap-1.5", className)}>
      <label htmlFor={inputId} className="text-sm font-medium text-gray-600">
        {label}
      </label>

      <div className="relative">
        <input
          id={inputId}
          type="text"
          value={isApplied ? appliedCode : value}
          placeholder={placeholder}
          disabled={isDisabled}
          readOnly={isApplied}
          aria-invalid={isError || undefined}
          aria-describedby={feedbackMessage ? messageId : undefined}
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          onChange={(event) => handleChange(event.target.value)}
          onKeyDown={handleKeyDown}
          className={cn(
            "h-11 w-full rounded-lg border px-3.5 pr-20 text-sm shadow-xs transition-colors",
            "focus:outline-none focus:ring-4",
            isApplied
              ? "border-hello-lime-200 bg-hello-lime-50 text-gray-900 read-only:cursor-default"
              : isError
                ? "border-error-300 bg-white text-gray-900 focus:border-error-300 focus:ring-error-100"
                : "border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 hover:border-gray-400 focus:border-hello-lime-300 focus:ring-hello-lime-100",
            isLoading && "disabled:cursor-wait disabled:bg-gray-50 disabled:text-gray-500",
          )}
        />

        <div className="absolute inset-y-0 right-2 flex items-center">
          {isLoading ? (
            <span className="flex size-9 items-center justify-center text-hello-lime-600">
              <Spinner className="size-5" />
              <span className="sr-only">Applying code</span>
            </span>
          ) : isApplied ? (
            <button
              type="button"
              onClick={handleRemove}
              className="flex size-9 items-center justify-center rounded-md text-gray-700 transition-colors hover:bg-hello-lime-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-hello-lime-100"
              aria-label="Remove code"
            >
              <CloseIcon className="size-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => void handleApply()}
              disabled={!value.trim()}
              className="px-2 py-1 text-sm font-semibold text-hello-lime-600 transition-colors hover:text-hello-lime-700 disabled:cursor-not-allowed disabled:text-gray-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-hello-lime-100"
            >
              Apply
            </button>
          )}
        </div>
      </div>

      {feedbackMessage ? (
        <p
          id={messageId}
          className={cn(
            "text-sm",
            isApplied ? "text-hello-lime-700" : "text-error-600",
          )}
        >
          {feedbackMessage}
        </p>
      ) : null}
    </div>
  );
}
