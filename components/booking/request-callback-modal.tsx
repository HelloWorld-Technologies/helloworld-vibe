"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useId, useState, type FormEvent } from "react";
import { uploadContactLead } from "@/src/apis/contact";
import { postSendOtpLeads } from "@/src/apis/user";
import { validateField } from "@/src/lib/form-validation";
import { trackContactLead } from "@/src/lib/gtm";
import { CallbackRequestSuccess } from "@/components/booking/callback-request-success";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Modal,
  ModalDescription,
  ModalTitle,
} from "@/components/ui/modal";
import { OtpInput } from "@/components/ui/otp-input";

type Step = "form" | "otp" | "success";

export interface RequestCallbackModalProps {
  open: boolean;
  onClose: () => void;
  propertyName: string;
  location?: string;
  city?: string;
}

export function RequestCallbackModal({
  open,
  onClose,
  propertyName,
  location = "",
  city,
}: RequestCallbackModalProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const titleId = useId();
  const descriptionId = useId();
  const [step, setStep] = useState<Step>("form");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState<{ name?: boolean; phone?: boolean; otp?: boolean }>(
    {},
  );
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function resetState() {
    setStep("form");
    setName("");
    setPhone("");
    setOtp("");
    setErrors({});
    setLoading(false);
    setErrorMessage(null);
  }

  function handleClose() {
    resetState();
    onClose();
  }

  async function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = {
      name: !validateField("name", name),
      phone: !validateField("phone", phone),
    };
    setErrors(nextErrors);
    if (nextErrors.name || nextErrors.phone) return;

    setLoading(true);
    setErrorMessage(null);
    const response = await postSendOtpLeads({ mobile: phone });
    setLoading(false);

    if (response.Status === "Success") {
      setStep("otp");
      return;
    }

    setErrorMessage(response.message ?? "Could not send OTP. Please try again.");
  }

  async function handleOtpSubmit(event?: FormEvent) {
    event?.preventDefault();
    const otpValid = validateField("otp", otp);
    setErrors((current) => ({ ...current, otp: !otpValid }));
    if (!otpValid) return;

    setLoading(true);
    setErrorMessage(null);
    const response = await uploadContactLead({
      name,
      phone,
      location: location || propertyName,
      city,
      otp: Number.parseInt(otp, 10),
      srp: true,
      propertyName,
    });
    setLoading(false);

    if (response.success) {
      trackContactLead({ name, phone });
      const params = new URLSearchParams(searchParams.toString());
      params.set("lead-submited-v1", "true");
      const next = params.toString();
      router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
      setStep("success");
      return;
    }

    if (response.message === "OTP is Invalid") {
      setErrors((current) => ({ ...current, otp: true }));
      return;
    }

    setErrorMessage(response.message ?? "Something went wrong. Please try again.");
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      labelledBy={titleId}
      describedBy={descriptionId}
      closeLabel="Close callback request dialog"
    >
      {step === "success" ? (
        <div className="-m-1 rounded-2xl bg-gradient-contact-card px-2 py-4 sm:px-4">
          <CallbackRequestSuccess
            onDone={handleClose}
            titleId={titleId}
            descriptionId={descriptionId}
          />
        </div>
      ) : step === "otp" ? (
        <div className="space-y-6">
          <div>
            <ModalTitle id={titleId}>Verify your number</ModalTitle>
            <ModalDescription id={descriptionId}>
              Enter the 6-digit code sent to +91-{phone}
            </ModalDescription>
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
                onClick={() => setStep("form")}
                disabled={loading}
              >
                Edit phone
              </Button>
              <Button type="submit" className="flex-1" disabled={loading || otp.length !== 6}>
                {loading ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <ModalTitle id={titleId}>Request a callback</ModalTitle>
            <ModalDescription id={descriptionId}>
              Share your details for {propertyName} and we&apos;ll reach out shortly.
            </ModalDescription>
          </div>

          <form className="space-y-4" onSubmit={handleFormSubmit}>
            <Input
              label="Full name"
              name="name"
              value={name}
              error={errors.name}
              placeholder="Full name"
              onChange={(event) => setName(event.target.value)}
            />
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
            {location ? (
              <Input
                label="Location"
                name="location"
                value={location}
                readOnly
              />
            ) : null}
            {errorMessage ? (
              <p className="text-sm text-error-600">{errorMessage}</p>
            ) : null}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending OTP..." : "Continue"}
            </Button>
          </form>
        </div>
      )}
    </Modal>
  );
}
