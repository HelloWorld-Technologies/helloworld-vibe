"use client";

import {
  useEffect,
  useId,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { VisitScheduler } from "@/components/booking/visit-scheduler";
import { VisitScheduledSuccess } from "@/components/booking/visit-scheduled-success";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OtpInput } from "@/components/ui/otp-input";
import { getPropertyVisitSlots, postCreateVisit } from "@/src/apis/visit";
import { postSendOtp, postVerifyOtp } from "@/src/apis/user";
import { isLoggedIn } from "@/src/lib/auth-storage";
import { validateField } from "@/src/lib/form-validation";
import { cn } from "@/src/lib/cn";
import {
  formatVisitDate,
  formatScheduledVisitLabel,
  mapVisitSlots,
  type MappedTimeSlot,
} from "@/src/lib/visit-slots";
import type { VisitFormError } from "@/src/models/visit";
import type { VisitDate, VisitTimeSlot } from "@/src/tokens/visit-scheduler";

type FlowStep = "schedule" | "details" | "otp" | "success";

export type ScheduleVisitFlowStep = FlowStep;

export interface ScheduleVisitFlowProps {
  propertyId: number;
  propertyName: string;
  propertyUrl?: string;
  layout?: "modal" | "embedded";
  onSuccess?: () => void;
  onClose?: () => void;
  onStepChange?: (step: FlowStep) => void;
}

export function ScheduleVisitFlow({
  propertyId,
  propertyName,
  propertyUrl = "",
  layout = "modal",
  onSuccess,
  onClose,
  onStepChange,
}: ScheduleVisitFlowProps) {
  const embedded = layout === "embedded";
  const formId = useId();
  const [step, setStep] = useState<FlowStep>("schedule");
  const [dates, setDates] = useState<VisitDate[]>([]);
  const [timeSlots, setTimeSlots] = useState<VisitTimeSlot[]>([]);
  const [rawDateBySlotId, setRawDateBySlotId] = useState<Record<string, string>>(
    {},
  );
  const [slotsByDateId, setSlotsByDateId] = useState<
    Record<string, MappedTimeSlot[]>
  >({});
  const [selectedDateId, setSelectedDateId] = useState("");
  const [selectedTimeSlotId, setSelectedTimeSlotId] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [noSlots, setNoSlots] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState<VisitFormError & { otp?: boolean }>({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [scheduledAt, setScheduledAt] = useState("");

  useEffect(() => {
    onStepChange?.(step);
  }, [onStepChange, step]);

  useEffect(() => {
    setLoggedIn(isLoggedIn());
  }, []);

  function buildScheduledAtLabel() {
    const slot = getSelectedSlot();
    const rawDate = rawDateBySlotId[selectedDateId];
    if (!slot || !rawDate) return "your selected slot";
    return formatScheduledVisitLabel(rawDate, slot.label);
  }

  useEffect(() => {
    let cancelled = false;

    async function loadSlots() {
      if (!propertyId) return;
      setLoadingSlots(true);
      setNoSlots(false);
      const response = await getPropertyVisitSlots(propertyId);

      if (cancelled) return;

      if (response.success && Array.isArray(response.data) && response.data.length) {
        const mapped = mapVisitSlots(response.data);
        const firstDate = mapped.dates[0];
        const firstSlots = firstDate
          ? mapped.timeSlotsByDateId[firstDate.id] ?? []
          : [];

        setDates(mapped.dates);
        setRawDateBySlotId(mapped.rawDateBySlotId);
        setSlotsByDateId(mapped.timeSlotsByDateId);
        setSelectedDateId(firstDate?.id ?? "");
        setSelectedTimeSlotId(firstSlots[0]?.id ?? "");
        setTimeSlots(firstSlots);
        setNoSlots(mapped.dates.length === 0);
      } else {
        setDates([]);
        setTimeSlots([]);
        setNoSlots(true);
      }

      setLoadingSlots(false);
    }

    void loadSlots();
    return () => {
      cancelled = true;
    };
  }, [propertyId]);

  useEffect(() => {
    if (!selectedDateId) return;
    const nextSlots = slotsByDateId[selectedDateId] ?? [];
    setTimeSlots(nextSlots);
    setSelectedTimeSlotId(nextSlots[0]?.id ?? "");
  }, [selectedDateId, slotsByDateId]);

  function validateScheduleStep() {
    const nextErrors: VisitFormError = {
      date: !selectedDateId,
      time: !selectedTimeSlotId,
    };
    setErrors(nextErrors);
    return !nextErrors.date && !nextErrors.time;
  }

  function validateDetailsStep() {
    const nextErrors: VisitFormError = {
      name: !validateField("name", name),
      email: !validateField("email", email),
      phone: loggedIn ? false : !validateField("phone", phone),
    };
    setErrors(nextErrors);
    return !nextErrors.name && !nextErrors.email && !nextErrors.phone;
  }

  function getSelectedSlot(): MappedTimeSlot | undefined {
    return (slotsByDateId[selectedDateId] ?? []).find(
      (slot) => slot.id === selectedTimeSlotId,
    );
  }

  async function createVisit() {
    const slot = getSelectedSlot();
    const rawDate = rawDateBySlotId[selectedDateId];
    if (!slot || !rawDate) return;

    setLoading(true);
    setErrorMessage(null);

    const response = await postCreateVisit({
      date: formatVisitDate(rawDate),
      savType: "physical",
      time: slot.timeValue,
      name,
      email,
      slotId: selectedDateId,
      propertyId,
      source: "website",
      url:
        propertyUrl ||
        (typeof window !== "undefined" ? window.location.href : ""),
    });

    setLoading(false);

    if (response.success) {
      setScheduledAt(buildScheduledAtLabel());
      setStep("success");
      onSuccess?.();
      return;
    }

    setErrorMessage(
      response.message ?? response.error ?? "Could not schedule visit. Try again.",
    );
  }

  async function handleScheduleContinue(event: FormEvent) {
    event.preventDefault();
    if (!validateScheduleStep() || noSlots) return;
    setStep("details");
  }

  async function handleDetailsSubmit(event: FormEvent) {
    event.preventDefault();
    if (!validateDetailsStep()) return;

    if (loggedIn) {
      await createVisit();
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    const response = await postSendOtp({ mobile: phone });
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
    const response = await postVerifyOtp({
      mobile: phone,
      otp: Number.parseInt(otp, 10),
      session_id: "kyun-chahiye",
    });
    setLoading(false);

    if (response.success) {
      setLoggedIn(true);
      await createVisit();
      return;
    }

    setErrors((current) => ({ ...current, otp: true }));
  }

  let content: ReactNode;

  if (step === "success") {
    content = (
      <VisitScheduledSuccess
        scheduledAt={scheduledAt}
        onGotIt={() => {
          if (onClose) {
            onClose();
            return;
          }
          setStep("schedule");
        }}
        className={embedded ? "py-2" : undefined}
      />
    );
  } else if (step === "otp") {
    content = (
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Verify your number</h3>
          <p className="mt-1 text-sm text-gray-600">
            Enter the code sent to +91-{phone}
          </p>
        </div>
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
          <div className="flex gap-3">
            <Button
              type="button"
              hierarchy="secondary-gray"
              className="flex-1"
              onClick={() => setStep("details")}
              disabled={loading}
            >
              Back
            </Button>
            <Button type="submit" className="flex-1" disabled={loading || otp.length !== 6}>
              {loading ? "Verifying..." : "Confirm visit"}
            </Button>
          </div>
        </form>
      </div>
    );
  } else if (step === "details") {
    content = (
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Your details</h3>
          <p className="mt-1 text-sm text-gray-600">
            Almost there — tell us how to reach you for {propertyName}.
          </p>
        </div>
        <form id={formId} className="space-y-4" onSubmit={handleDetailsSubmit}>
          <Input
            label="Full name"
            name="name"
            value={name}
            error={errors.name}
            placeholder="Full name"
            onChange={(event) => setName(event.target.value)}
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value={email}
            error={errors.email}
            placeholder="you@example.com"
            onChange={(event) => setEmail(event.target.value)}
          />
          {!loggedIn ? (
            <Input
              label="Mobile number"
              name="phone"
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={phone}
              error={errors.phone}
              placeholder="10-digit mobile number"
              onChange={(event) =>
                setPhone(event.target.value.replace(/\D/g, "").slice(0, 10))
              }
            />
          ) : null}
          {errorMessage ? (
            <p className="text-sm text-error-600">{errorMessage}</p>
          ) : null}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              hierarchy="secondary-gray"
              className="flex-1"
              onClick={() => setStep("schedule")}
              disabled={loading}
            >
              Back
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading
                ? loggedIn
                  ? "Scheduling..."
                  : "Sending OTP..."
                : loggedIn
                  ? "Schedule visit"
                  : "Send OTP"}
            </Button>
          </div>
        </form>
      </div>
    );
  } else {
    content = (
      <form className="space-y-6" onSubmit={handleScheduleContinue}>
        {loadingSlots ? (
          <p className="text-sm text-gray-500">Loading available slots...</p>
        ) : noSlots ? (
          <p className="rounded-xl bg-error-50 px-4 py-3 text-sm text-error-700">
            No visit slots are available right now. Please try again later.
          </p>
        ) : (
          <VisitScheduler
            layout={embedded ? "embedded" : "default"}
            animate={!embedded}
            dates={dates}
            timeSlots={timeSlots}
            selectedDateId={selectedDateId}
            selectedTimeSlotId={selectedTimeSlotId}
            onDateChange={setSelectedDateId}
            onTimeSlotChange={setSelectedTimeSlotId}
          />
        )}

        <Button
          type="submit"
          className="w-full bg-hello-lime-400 text-gray-800 hover:bg-hello-lime-500"
          size="lg"
          disabled={loadingSlots || noSlots}
        >
          {embedded ? "Take a Tour" : "Continue"}
        </Button>
      </form>
    );
  }

  return content;
}
