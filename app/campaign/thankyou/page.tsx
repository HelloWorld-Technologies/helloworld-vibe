import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { staticPageMetadata } from "@/src/lib/og-metadata";

export const metadata: Metadata = staticPageMetadata({
  title: "Thank You | HelloWorld",
  url: "/campaign/thankyou",
  robots: { index: false, follow: true },
  alternates: {
    canonical: "/campaign/thankyou",
  },
});

export default function CampaignThankYouPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 px-4 py-4 md:px-20">
        <Image
          width={105}
          height={40}
          alt="Vibe"
          src="/assets/logos/gardient-black.svg"
          className="h-10 w-auto"
        />
      </header>
      <main className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
        <div className="text-6xl" aria-hidden>
          ✅
        </div>
        <h1 className="mt-8 font-satoshi text-3xl font-bold text-gray-900 md:text-4xl">
          Thank You
        </h1>
        <p className="mt-4 text-base leading-relaxed text-gray-600">
          Our representative will get back to you as soon as possible.
        </p>
        <Link
          href="/"
          className="mt-10 inline-flex h-12 items-center justify-center rounded-lg bg-hello-lime-400 px-8 text-base font-bold text-gray-900 hover:bg-hello-lime-500"
        >
          Back to Home
        </Link>
      </main>
    </div>
  );
}
