"use client";

import { useRef, useState } from "react";
import { HomepageTestimonials } from "@/components/marketing/homepage-testimonials";
import { LocalityContactCard } from "@/components/marketing/locality-contact-card";
import { CampaignContactBanner, CampaignProperties } from "@/components/marketing/campaign/campaign-properties";
import { CampaignHero, CampaignHeader } from "@/components/marketing/campaign/campaign-hero";
import { CampaignMoreThanRoom } from "@/components/marketing/campaign/campaign-more-than-room";
import { CampaignWeekendsCarousel } from "@/components/marketing/campaign/campaign-weekends";
import { Modal } from "@/components/ui/modal";
import type { CampaignCitySlug } from "@/src/constants/campaign-prices";
import { buildCitySrpHref } from "@/src/lib/srp/locality-srp-href";
import { getCampaignCityApiSlug } from "@/src/tokens/campaign";
import { pageLayout } from "@/src/tokens/layout";
import { cn } from "@/src/lib/cn";

const CAMPAIGN_LEAD_SUBMITTED_PARAM = "lead-submited-v1";

function resolveCampaignSrpRedirect({ city }: { city: string; location: string }) {
  const href = buildCitySrpHref(city);
  if (!href) return href;

  const [pathname, existingQuery = ""] = href.split("?");
  const params = new URLSearchParams(existingQuery);
  params.set(CAMPAIGN_LEAD_SUBMITTED_PARAM, "true");
  return `${pathname}?${params.toString()}`;
}

export function CampaignPageContent({ citySlug }: { citySlug: CampaignCitySlug }) {
  const [contactOpen, setContactOpen] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const apiCity = getCampaignCityApiSlug(citySlug);

  function openContact() {
    if (window.matchMedia("(min-width: 1024px)").matches) {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    setContactOpen(true);
  }

  function openContactModal() {
    setContactOpen(true);
  }

  return (
    <div className={cn("min-h-screen bg-white", pageLayout.mobileStickyBottomPadding)}>
      <CampaignHeader onContactClick={openContact} />

      <div className="mx-auto max-w-7xl px-4 md:px-20">
        <div className="lg:flex lg:items-stretch lg:gap-10">
          <div className="min-w-0 flex-1">
            <CampaignHero citySlug={citySlug} />
            <CampaignProperties
              citySlug={citySlug}
              titlePrefix="This could be your"
              titleHighlight="Home!"
              onTakeTour={openContactModal}
            />
            <CampaignWeekendsCarousel />
            <CampaignContactBanner />
            <HomepageTestimonials headingSize="properties" variant="community" />
            <CampaignMoreThanRoom />
          </div>

          <aside ref={formRef} className="hidden w-[411px] shrink-0 lg:block">
            <LocalityContactCard
              sticky
              city={apiCity}
              locationEditable
              hideCitySelect
              leadTracking="conversion"
              redirectOnSuccess={resolveCampaignSrpRedirect}
            />
          </aside>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white p-4 lg:hidden">
        <button
          type="button"
          onClick={openContact}
          className="h-12 w-full rounded-lg bg-hello-lime-400 text-base font-bold text-gray-900 hover:bg-hello-lime-500"
        >
          Contact Us
        </button>
      </div>

      <Modal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        maxWidthClassName="max-w-md"
        closeLabel="Close contact form"
        padding="none"
      >
        <LocalityContactCard
          city={apiCity}
          locationEditable
          hideCitySelect
          leadTracking="conversion"
          redirectOnSuccess={resolveCampaignSrpRedirect}
          className="shadow-none"
        />
      </Modal>
    </div>
  );
}
