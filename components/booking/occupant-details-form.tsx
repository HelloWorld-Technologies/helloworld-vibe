"use client";

import { useEffect, useId, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OtpInput } from "@/components/ui/otp-input";
import {
  getDefaultMoveInDateBounds,
  MoveInDatePickerField,
} from "@/components/ui/move-in-date-picker";
import { sendLoginOtp, verifyLoginOtp } from "@/src/apis/login";
import { getStoredMobile, isLoggedIn } from "@/src/lib/auth-storage";
import { validateField } from "@/src/lib/form-validation";
import { cn } from "@/src/lib/cn";

const GENDERS = ["Male", "Female", "Other"] as const;

type FormErrors = {
  firstName?: boolean;
  lastName?: boolean;
  email?: boolean;
  phone?: boolean;
  gender?: boolean;
  moveInDate?: boolean;
  otp?: boolean;
};

export type OccupantDetailsFormStep = "details" | "otp";

export interface OccupantDetailsFormProps {
  onBack: () => void;
  onComplete?: (details: {
    moveInDate: string;
    firstName: string;
    lastName: string;
    email: string;
    gender: string;
    phone: string;
  }) => void;
  onStepChange?: (step: OccupantDetailsFormStep) => void;
  className?: string;
  initialValues?: {
    moveInDate?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    gender?: string;
    phone?: string;
  };
}

function BackIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 20"
      fill="none"
      className={className}
    >
      <path
        d="M12.5 15L7.5 10L12.5 5"
        stroke="currentColor"
        strokeWidth="1.67"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 20"
      fill="none"
      className={className}
    >
      <path
        d="M5 7.5L10 12.5L15 7.5"
        stroke="currentColor"
        strokeWidth="1.67"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function getMoveInDateBounds() {
  return getDefaultMoveInDateBounds();
}

function SelectField({
  label,
  value,
  error,
  hint,
  onChange,
  children,
  id,
}: {
  label: string;
  value: string;
  error?: boolean;
  hint?: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
  id: string;
}) {
  return (
    <div className="flex w-full flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={error || undefined}
          className={cn(
            "h-10 w-full appearance-none rounded-lg border bg-white px-3.5 pr-10 text-sm shadow-xs transition-colors",
            "text-gray-900 focus:outline-none focus:ring-4",
            error
              ? "border-error-300 hover:border-error-400 focus:border-error-300 focus:ring-error-100"
              : "border-gray-300 hover:border-gray-400 focus:border-hello-lime-300 focus:ring-hello-lime-100",
          )}
        >
          {children}
        </select>
        <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500">
          <ChevronDownIcon className="size-4" />
        </span>
      </div>
      {hint ? (
        <p className={cn("text-sm", error ? "text-error-600" : "text-gray-600")}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function OccupantDetailsForm({
  onBack,
  onComplete,
  onStepChange,
  className,
  initialValues,
}: OccupantDetailsFormProps) {
  const formId = useId();
  const genderId = useId();
  const moveInDateId = useId();
  const dateBounds = getMoveInDateBounds();

  const [step, setStep] = useState<OccupantDetailsFormStep>("details");
  const [loggedIn, setLoggedIn] = useState(false);
  const [firstName, setFirstName] = useState(initialValues?.firstName ?? "");
  const [lastName, setLastName] = useState(initialValues?.lastName ?? "");
  const [email, setEmail] = useState(initialValues?.email ?? "");
  const [phone, setPhone] = useState(initialValues?.phone ?? "");
  const [gender, setGender] = useState(initialValues?.gender ?? "");
  const [moveInDate, setMoveInDate] = useState(initialValues?.moveInDate ?? "");
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setLoggedIn(isLoggedIn());
    if (initialValues?.phone) {
      setPhone(initialValues.phone.replace(/\D/g, "").slice(-10));
      return;
    }
    const storedMobile = getStoredMobile();
    if (storedMobile) {
      setPhone(storedMobile.replace(/\D/g, "").slice(-10));
    }
  }, [initialValues?.phone]);

  useEffect(() => {
    onStepChange?.(step);
  }, [onStepChange, step]);

  function validateDetails() {
    const nextErrors: FormErrors = {
      firstName: !validateField("name", firstName),
      lastName: !validateField("name", lastName),
      email: !validateField("email", email),
      phone: loggedIn ? false : !validateField("phone", phone),
      gender: !gender,
      moveInDate: !moveInDate,
    };
    setErrors(nextErrors);
    return Object.values(nextErrors).every((value) => !value);
  }

  async function handleDetailsSubmit(event: FormEvent) {
    event.preventDefault();
    if (!validateDetails()) return;

    const occupantDetails = {
      moveInDate,
      firstName,
      lastName,
      email,
      gender,
      phone,
    };

    if (loggedIn) {
      onComplete?.(occupantDetails);
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    const response = await sendLoginOtp({ mobile: phone });
    setLoading(false);

    if (response.Status === "Success") {
      setStep("otp");
      return;
    }

    setErrorMessage(response.message ?? "Could not send OTP. Please try again.");
  }

  async function handleOtpSubmit(event: FormEvent) {
    event.preventDefault();
    const otpValid = validateField("otp", otp);
    setErrors((current) => ({ ...current, otp: !otpValid }));
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
      setLoggedIn(true);
      onComplete?.({
        moveInDate,
        firstName,
        lastName,
        email,
        gender,
        phone,
      });
      return;
    }

    if (response.message === "OTP is Invalid") {
      setErrors((current) => ({ ...current, otp: true }));
      return;
    }

    setErrorMessage(response.message ?? "Something went wrong. Please try again.");
  }

  if (step === "otp") {
    return (
      <div className={cn("space-y-6", className)}>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setStep("details")}
            className="inline-flex size-8 items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100"
            aria-label="Back to occupant details"
          >
            <BackIcon className="size-5" />
          </button>
          <h3 className="text-lg font-bold text-gray-900">Verify Phone Number</h3>
        </div>

        <p className="text-sm text-gray-600">
          Enter the code sent to +91-{phone}
        </p>

        <form className="space-y-6" onSubmit={handleOtpSubmit}>
          <OtpInput
            value={otp}
            onChange={setOtp}
            error={errors.otp}
            disabled={loading}
          />
          {errors.otp ? (
            <p className="text-sm text-error-600">Invalid OTP. Please try again.</p>
          ) : null}
          {errorMessage ? (
            <p className="text-sm text-error-600">{errorMessage}</p>
          ) : null}
          <Button
            type="submit"
            className="w-full bg-hello-lime-400 text-gray-900 hover:bg-hello-lime-500"
            size="lg"
            disabled={loading || otp.length !== 6}
          >
            {loading ? "Verifying..." : "Continue"}
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex size-8 items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100"
          aria-label="Back to room selection"
        >
          <BackIcon className="size-5" />
        </button>
        <h3 className="text-lg font-bold text-gray-900">Occupant&apos;s Details</h3>
      </div>

      <form id={formId} className="space-y-4" onSubmit={handleDetailsSubmit}>
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="First Name"
            name="firstName"
            value={firstName}
            error={errors.firstName}
            placeholder="First name"
            onChange={(event) => setFirstName(event.target.value)}
          />
          <Input
            label="Last Name"
            name="lastName"
            value={lastName}
            error={errors.lastName}
            placeholder="Last name"
            onChange={(event) => setLastName(event.target.value)}
          />
        </div>

        <Input
          label="Email"
          name="email"
          type="email"
          value={email}
          error={errors.email}
          placeholder="Email address"
          onChange={(event) => setEmail(event.target.value)}
        />

        {!loggedIn ? (
          <div className="flex w-full flex-col gap-1.5">
            <label htmlFor={`${formId}-phone`} className="text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                +91-
              </span>
              <input
                id={`${formId}-phone`}
                name="phone"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                value={phone}
                aria-invalid={errors.phone || undefined}
                placeholder="10-digit number"
                onChange={(event) =>
                  setPhone(event.target.value.replace(/\D/g, "").slice(0, 10))
                }
                className={cn(
                  "h-10 w-full rounded-lg border bg-white pl-12 pr-10 text-sm shadow-xs transition-colors",
                  "text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-4",
                  errors.phone
                    ? "border-error-300 hover:border-error-400 focus:border-error-300 focus:ring-error-100"
                    : "border-gray-300 hover:border-gray-400 focus:border-hello-lime-300 focus:ring-hello-lime-100",
                )}
              />
              {errors.phone ? (
                <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-error-500">
                  <svg aria-hidden viewBox="0 0 16 16" fill="none" className="size-4">
                    <path
                      d="M8 14.6667C11.6819 14.6667 14.6667 11.6819 14.6667 8C14.6667 4.3181 11.6819 1.33333 8 1.33333C4.3181 1.33333 1.33333 4.3181 1.33333 8C1.33333 11.6819 4.3181 14.6667 8 14.6667Z"
                      stroke="currentColor"
                      strokeWidth="1.33333"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8 5.33333V8M8 10.6667H8.00667"
                      stroke="currentColor"
                      strokeWidth="1.33333"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              ) : null}
            </div>
            {errors.phone ? (
              <p className="text-sm text-error-600">Enter a valid Phone Number</p>
            ) : null}
          </div>
        ) : null}

        <div className="grid grid-cols-2 gap-3">
          <SelectField
            id={genderId}
            label="Gender"
            value={gender}
            error={errors.gender}
            hint={errors.gender ? "Select a gender" : undefined}
            onChange={setGender}
          >
            <option value="" disabled>
              Select
            </option>
            {GENDERS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </SelectField>

          <div className="flex w-full flex-col gap-1.5">
            <MoveInDatePickerField
              id={moveInDateId}
              label="Move in Date"
              value={moveInDate}
              min={dateBounds.min}
              max={dateBounds.max}
              error={errors.moveInDate}
              onChange={setMoveInDate}
            />
            {errors.moveInDate ? (
              <p className="text-sm text-error-600">Select a move-in date</p>
            ) : null}
          </div>
        </div>

        {errorMessage ? (
          <p className="text-sm text-error-600">{errorMessage}</p>
        ) : null}

        <Button
          type="submit"
          className="w-full bg-hello-lime-400 text-gray-900 hover:bg-hello-lime-500"
          size="lg"
          disabled={loading}
        >
          {loading
            ? loggedIn
              ? "Continuing..."
              : "Sending OTP..."
            : loggedIn
              ? "Continue"
              : "Verify Phone Number"}
        </Button>
      </form>
    </div>
  );
}
