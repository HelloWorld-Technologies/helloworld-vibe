"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { uploadContactLead } from "@/src/apis/contact";
import { postSendOtpLeads } from "@/src/apis/user";
import { LocationSuggestField } from "@/components/search/location-suggest-field";
import { validateField } from "@/src/lib/form-validation";
import { CallbackRequestSuccess } from "@/components/booking/callback-request-success";
import { Button } from "@/components/ui/button";
import { OtpInput } from "@/components/ui/otp-input";
import { readStoredCity } from "@/src/lib/city-storage";
import { cn } from "@/src/lib/cn";
import { trackContactLead, trackLeadConversion } from "@/src/lib/gtm";
import { getStoredUtmSource } from "@/src/lib/utm";
import {
  cities,
  isCitySlug,
  type CitySlug,
} from "@/src/tokens/cities";
import { localityContactIllustration } from "@/src/tokens/locality";
import { footerContact } from "@/src/tokens/footer";

type Step = "form" | "otp" | "success";

const fieldLabelClassName = "text-sm font-normal text-gray-500";
const fieldInputClassName =
  "h-12 w-full rounded-2xl border-0 bg-white px-4 text-sm text-gray-900 shadow-[0_1px_2px_rgba(16,24,40,0.06)] outline-none transition-shadow placeholder:text-gray-400 focus:shadow-[0_0_0_3px_rgba(198,255,55,0.35)]";

const locationFieldClassName =
  "rounded-2xl border-0 shadow-[0_1px_2px_rgba(16,24,40,0.06)] focus-within:border-transparent focus-within:shadow-[0_0_0_3px_rgba(198,255,55,0.35)]";

function FieldLabel({ children }: { children: ReactNode }) {
  return <span className={fieldLabelClassName}>{children}</span>;
}

function resolveSearchCity(city?: string): CitySlug {
  if (!city) return readStoredCity();
  const normalized = city.trim().toLowerCase().replace(/\s+/g, "_");
  if (isCitySlug(normalized)) return normalized;
  const byLabel = cities.find(
    (option) => option.label.toLowerCase() === city.trim().toLowerCase(),
  );
  return byLabel?.slug ?? readStoredCity();
}

export function LocalityContactCard({
  className,
  sticky = false,
  city,
  location: locationDefault = "",
  locationEditable = true,
  locationPlaceholder = "Search your location here",
  showCallFallback = true,
  leadTracking = "srp",
}: {
  className?: string;
  sticky?: boolean;
  city?: string;
  location?: string;
  locationEditable?: boolean;
  locationPlaceholder?: string;
  showCallFallback?: boolean;
  /** `conversion` fires generate_lead_* events (contact page); `srp` fires name/phone only. */
  leadTracking?: "srp" | "conversion";
}) {
  const [step, setStep] = useState<Step>("form");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState(locationDefault);
  const [searchCity, setSearchCity] = useState<CitySlug>(() =>
    resolveSearchCity(city),
  );
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState<{
    name?: boolean;
    phone?: boolean;
    location?: boolean;
    otp?: boolean;
  }>({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setLocation(locationDefault);
  }, [locationDefault]);

  useEffect(() => {
    setSearchCity(resolveSearchCity(city));
  }, [city]);

  function resetForm() {
    setStep("form");
    setName("");
    setPhone("");
    setLocation(locationDefault);
    setOtp("");
    setErrors({});
    setLoading(false);
    setErrorMessage(null);
  }

  async function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = {
      name: !validateField("name", name),
      phone: !validateField("phone", phone),
      location: !validateField("location", location),
    };
    setErrors(nextErrors);
    if (nextErrors.name || nextErrors.phone || nextErrors.location) return;

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
      location: location.trim(),
      city: searchCity,
      otp: Number.parseInt(otp, 10),
      srp: true,
    });
    setLoading(false);

    if (response.success) {
      if (leadTracking === "conversion") {
        trackLeadConversion({
          name,
          phone,
          city: searchCity,
          utmSource: getStoredUtmSource(),
        });
      } else {
        trackContactLead({ name, phone });
      }
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
    <aside
      className={cn(
        "overflow-visible rounded-[2rem] bg-gradient-contact-card shadow-[0_8px_32px_rgba(16,24,40,0.08)]",
        sticky && "md:sticky md:top-24 md:self-start",
        className,
      )}
      aria-label="Contact us"
    >
      <div className="px-6 pb-8 pt-5">
        {step === "success" ? (
          <CallbackRequestSuccess onDone={resetForm} />
        ) : (
          <>
            <Image
              src={localityContactIllustration}
              alt=""
              width={280}
              height={200}
              className="mx-auto h-auto w-full max-w-[15.5rem] object-contain"
              priority
            />

            {step === "otp" ? (
              <div className="mt-6 space-y-5">
                <div className="space-y-1 text-center">
                  <h2 className="text-xl font-bold text-gray-900">Verify your number</h2>
                  <p className="text-sm text-gray-600">
                    Enter the 6-digit code sent to +91-{phone}
                  </p>
                </div>
                <form className="space-y-4" onSubmit={handleOtpSubmit}>
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
                      size="xl"
                      className="min-w-0 flex-1 rounded-2xl bg-white"
                      onClick={() => setStep("form")}
                      disabled={loading}
                    >
                      Edit phone
                    </Button>
                    <Button
                      type="submit"
                      size="xl"
                      className="min-w-0 flex-1 rounded-2xl bg-hello-lime-400 font-bold text-gray-900 hover:bg-hello-lime-500"
                      disabled={loading || otp.length !== 6}
                    >
                      {loading ? "Submitting..." : "Submit"}
                    </Button>
                  </div>
                </form>
              </div>
            ) : (
              <>
                <h2 className="mt-4 text-center text-xl font-bold text-gray-900">
                  Let us help you!
                </h2>

                <form className="mt-6 space-y-4" onSubmit={handleFormSubmit}>
                  <label className="block space-y-2">
                    <FieldLabel>Full Name</FieldLabel>
                    <input
                      type="text"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Enter your name"
                      className={cn(
                        fieldInputClassName,
                        errors.name && "ring-2 ring-error-300",
                      )}
                    />
                  </label>

                  <label className="block space-y-2">
                    <FieldLabel>Phone Number</FieldLabel>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-900">
                        +91-
                      </span>
                      <input
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        value={phone}
                        onChange={(event) =>
                          setPhone(event.target.value.replace(/\D/g, "").slice(0, 10))
                        }
                        placeholder="Enter your phone number"
                        className={cn(
                          fieldInputClassName,
                          "pl-[3.25rem]",
                          errors.phone && "ring-2 ring-error-300",
                        )}
                      />
                    </div>
                  </label>

                  <div className="block space-y-2">
                    <label htmlFor="contact-location">
                      <FieldLabel>Location</FieldLabel>
                    </label>
                    <LocationSuggestField
                      id="contact-location"
                      name="location"
                      value={location}
                      city={searchCity}
                      onCityChange={setSearchCity}
                      onChange={(next) => {
                        setLocation(next);
                        setErrorMessage(null);
                        if (errors.location) {
                          setErrors((current) => ({
                            ...current,
                            location: false,
                          }));
                        }
                      }}
                      placeholder={locationPlaceholder}
                      showCitySelect={locationEditable}
                      readOnly={!locationEditable}
                      invalid={Boolean(errors.location)}
                      fieldClassName={cn(
                        locationFieldClassName,
                        errors.location && "ring-2 ring-error-300",
                      )}
                    />
                  </div>

                  {errorMessage ? (
                    <p className="text-sm text-error-600">{errorMessage}</p>
                  ) : null}

                  <button
                    type="submit"
                    disabled={loading}
                    className="h-14 w-full rounded-2xl bg-hello-lime-400 text-base font-bold text-gray-900 transition-colors hover:bg-hello-lime-500 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loading ? "Sending OTP..." : "Request Callback"}
                  </button>
                </form>

                {showCallFallback ? (
                  <div className="mt-6 border-t border-gray-200/80 pt-5 text-center">
                    <p className="text-sm text-gray-600">
                      or call{" "}
                      <Link
                        href={footerContact.phoneHref}
                        className="text-base font-bold text-gray-900 hover:underline"
                      >
                        {footerContact.phone}
                      </Link>
                    </p>
                  </div>
                ) : null}
              </>
            )}
          </>
        )}
      </div>
    </aside>
  );
}
