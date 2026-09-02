import type { Metadata } from "next";
import { Suspense } from "react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { BookingSuccessContent } from "@/components/booking/booking-success-content";
import { resolveHdpPage } from "@/src/lib/hdp/resolve-hdp-page";
import { staticPageMetadata } from "@/src/lib/og-metadata";
import { notFound } from "next/navigation";

export const metadata: Metadata = staticPageMetadata({
  title: "Booking Confirmed | HelloWorld",
  robots: { index: false, follow: true },
});

type PageProps = {
  params: Promise<{
    srp_slug: string;
    locality: string;
    hdp_slug: string;
  }>;
};

export default async function BookingSuccessPage({ params }: PageProps) {
  const { srp_slug, locality, hdp_slug } = await params;
  const config = await resolveHdpPage(srp_slug, locality, hdp_slug);
  if (!config) notFound();

  const propertyPath = `/${config.canonicalPath}`;

  return (
    <div className="bg-white">
      <SiteHeader />
      <Suspense>
        <BookingSuccessContent propertyPath={propertyPath} />
      </Suspense>
      <SiteFooter />
    </div>
  );
}
