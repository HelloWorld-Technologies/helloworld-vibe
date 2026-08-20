"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { storeReferCode } from "@/src/lib/refer-code";
import { pageLayout } from "@/src/tokens/layout";

function Spinner() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 20"
      fill="none"
      className="size-8 animate-spin text-hello-lime-600"
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

export function ReferRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) storeReferCode(code);

    const timeoutId = window.setTimeout(() => {
      router.push("/");
    }, 2000);

    return () => window.clearTimeout(timeoutId);
  }, [router, searchParams]);

  return (
    <section className={`${pageLayout.container} py-16 md:py-24`}>
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        <Spinner />
        <p className="mt-4 text-lg text-gray-700">
          You are being redirected to{" "}
          <Link
            href="/"
            className="font-semibold text-hello-lime-700 hover:underline"
          >
            Homepage
          </Link>
        </p>
      </div>
    </section>
  );
}
