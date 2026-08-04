"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent, type ReactNode } from "react";
import { uploadOwnerLead } from "@/src/apis/owner";
import { CallbackRequestSuccess } from "@/components/booking/callback-request-success";
import { HomeownersBeforeAfter } from "@/components/marketing/homeowners/homeowners-before-after";
import { validateField } from "@/src/lib/form-validation";
import { cn } from "@/src/lib/cn";
import { cities, defaultCitySlug, isCitySlug, type CitySlug } from "@/src/tokens/cities";
import { footerContact } from "@/src/tokens/footer";
import {
  homeownersFormIllustration,
  homeownersPageCopy,
} from "@/src/tokens/homeowners";
import { pageLayout } from "@/src/tokens/layout";

const fieldLabelClassName = "text-sm font-medium text-gray-500";
const fieldInputClassName =
  "h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition-shadow placeholder:text-gray-400 focus:border-hello-lime-300 focus:shadow-[0_0_0_3px_rgba(198,255,55,0.35)]";

function FieldLabel({ children }: { children: ReactNode }) {
  return <span className={fieldLabelClassName}>{children}</span>;
}

function resolveCitySlug(location: string): CitySlug | null {
  const normalized = location.trim().toLowerCase().replace(/\s+/g, "_");
  if (isCitySlug(normalized)) return normalized;
  const byLabel = cities.find(
    (city) => city.label.toLowerCase() === location.trim().toLowerCase(),
  );
  return byLabel?.slug ?? null;
}

export function HomeownersLead() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<{
    name?: boolean;
    phone?: boolean;
    location?: boolean;
  }>({});

  function resetForm() {
    setName("");
    setPhone("");
    setLocation("");
    setSubmitted(false);
    setLoading(false);
    setErrorMessage(null);
    setErrors({});
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const city = resolveCitySlug(location);
    const nextErrors = {
      name: !validateField("name", name),
      phone: !validateField("phone", phone),
      location: !city,
    };
    setErrors(nextErrors);
    if (nextErrors.name || nextErrors.phone || nextErrors.location) {
      if (!city && location.trim()) {
        setErrorMessage("Please select a city from the suggestions.");
      }
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    const response = await uploadOwnerLead({
      name: name.trim(),
      phone,
      email: "",
      city: city ?? defaultCitySlug,
    });
    setLoading(false);

    if (response.success === true) {
      setSubmitted(true);
      return;
    }

    setErrorMessage(
      response.message ?? "Something went wrong. Please try again.",
    );
  }

  return (
    <section
      id="list-property"
      className="scroll-mt-28 bg-[#F7F8FA] py-12 md:scroll-mt-32 md:py-16"
    >
      <div className={pageLayout.container}>
        <div className="grid items-stretch gap-6 lg:grid-cols-2 lg:gap-10">
          <HomeownersBeforeAfter className="h-full min-h-[22rem] rounded-[2rem] lg:min-h-[32rem] lg:aspect-auto" />

          <aside
            className="flex flex-col overflow-hidden rounded-[2rem] bg-white shadow-[0_12px_40px_rgba(16,24,40,0.08)]"
            aria-label="List your property"
          >
            <div className="flex flex-1 flex-col px-6 pb-8 pt-6 md:px-8 md:pb-9 md:pt-7">
              {submitted ? (
                <CallbackRequestSuccess onDone={resetForm} />
              ) : (
                <>
                  <Image
                    src={homeownersFormIllustration}
                    alt=""
                    width={280}
                    height={196}
                    className="mx-auto h-auto w-full max-w-[11.5rem] object-contain"
                    priority
                  />

                  <h2 className="mt-4 text-center font-satoshi text-xl font-bold text-gray-900 md:text-[1.75rem] md:leading-9">
                    {homeownersPageCopy.formTitle}
                  </h2>

                  <form className="mt-6 flex flex-1 flex-col space-y-4" onSubmit={handleSubmit}>
                    <label className="block space-y-1.5">
                      <FieldLabel>Full Name</FieldLabel>
                      <input
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Sheldon Cooper"
                        autoComplete="name"
                        className={cn(
                          fieldInputClassName,
                          errors.name && "border-error-300 ring-2 ring-error-100",
                        )}
                      />
                    </label>

                    <label className="block space-y-1.5">
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
                            setPhone(
                              event.target.value.replace(/\D/g, "").slice(0, 10),
                            )
                          }
                          placeholder="9777964438"
                          autoComplete="tel-national"
                          className={cn(
                            fieldInputClassName,
                            "pl-[3.25rem]",
                            errors.phone &&
                              "border-error-300 ring-2 ring-error-100",
                          )}
                        />
                      </div>
                    </label>

                    <label className="block space-y-1.5">
                      <FieldLabel>Location</FieldLabel>
                      <input
                        type="text"
                        list="homeowners-city-options"
                        value={location}
                        onChange={(event) => {
                          setLocation(event.target.value);
                          setErrorMessage(null);
                        }}
                        placeholder="Search your location here"
                        autoComplete="address-level2"
                        className={cn(
                          fieldInputClassName,
                          errors.location &&
                            "border-error-300 ring-2 ring-error-100",
                        )}
                      />
                      <datalist id="homeowners-city-options">
                        {cities.map((option) => (
                          <option key={option.slug} value={option.label} />
                        ))}
                      </datalist>
                    </label>

                    {errorMessage ? (
                      <p className="text-sm text-error-600">{errorMessage}</p>
                    ) : null}

                    <button
                      type="submit"
                      disabled={loading}
                      className="mt-auto h-14 w-full rounded-xl bg-hello-lime-400 text-base font-bold text-gray-900 transition-colors hover:bg-hello-lime-500 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {loading
                        ? "Submitting..."
                        : homeownersPageCopy.formCta}
                    </button>
                  </form>

                  <div className="mt-5 border-t border-gray-200 pt-5 text-center">
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
                </>
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
