import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingPageContent } from "@/components/booking/booking-page-content";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getPublicSiteUrl } from "@/src/lib/schema";
import { pageLayout } from "@/src/tokens/layout";
import { cn } from "@/src/lib/cn";

type PageProps = {
  params: Promise<{
    srp_slug: string;
    locality: string;
    hdp_slug: string;
  }>;
};

function BookingPageFallback() {
  return (
    <div className="bg-white">
      <SiteHeader />
      <main className={cn(pageLayout.containerWithTopPadding, "pb-12 md:pb-16")}>
        <div className="mx-auto max-w-md animate-pulse space-y-4">
          <div className="h-8 rounded bg-gray-200" />
          <div className="h-40 rounded-3xl bg-gray-100" />
          <div className="h-64 rounded-3xl bg-gray-100" />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { srp_slug, locality, hdp_slug } = await params;
  const canonicalPath = `${srp_slug}/${locality}/${hdp_slug}/booking`;
  const title = "Booking | HelloWorld";
  const description =
    "Complete your HelloWorld booking. Choose payment options and reserve your room.";

  return {
    title,
    description,
    alternates: {
      canonical: `${getPublicSiteUrl()}/${canonicalPath}`,
    },
    openGraph: {
      title,
      description,
      url: `${getPublicSiteUrl()}/${canonicalPath}`,
      type: "website",
    },
  };
}

/** Booking loads property/category data on the client only (no SSR API). */
export default async function BookingPage({ params }: PageProps) {
  const { srp_slug, locality, hdp_slug } = await params;

  return (
    <Suspense fallback={<BookingPageFallback />}>
      <BookingPageContent
        srpSlug={srp_slug}
        localitySlug={locality}
        hdpSlug={hdp_slug}
      />
    </Suspense>
  );
}
