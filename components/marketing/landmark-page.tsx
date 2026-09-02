"use client";

import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeaderSearch } from "@/components/layout/site-header-search";
import { LandmarkContactCard } from "@/components/marketing/landmark-contact-card";
import { LandmarkDetailsPanel } from "@/components/marketing/landmark-details-panel";
import { LandmarkFaq } from "@/components/marketing/landmark-faq";
import { LandmarkHero } from "@/components/marketing/landmark-hero";
import { LandmarkProperties } from "@/components/marketing/landmark-properties";
import {
  LocalityMobileActions,
} from "@/components/marketing/locality-mobile-actions";
import {
  LocalityMobileTabs,
  type LocalityMobileTab,
} from "@/components/marketing/locality-mobile-tabs";
import { cn } from "@/src/lib/cn";
import { pageLayout } from "@/src/tokens/layout";

export function LandmarkPageContent() {
  const [mobileTab, setMobileTab] = useState<LocalityMobileTab>("properties");
  const propertiesRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  function showDetails() {
    flushSync(() => {
      setMobileTab("details");
    });
    detailsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function showProperties() {
    flushSync(() => {
      setMobileTab("properties");
    });
    propertiesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className={cn("bg-white", pageLayout.mobileStickyBottomPadding)}>
      <SiteHeaderSearch />

      <main className={cn(pageLayout.container, "pt-6 md:pt-8")}>
        <LandmarkHero />

        <div className="mt-8 md:mt-12">
          <LocalityMobileTabs
            value={mobileTab}
            onChange={setMobileTab}
            className="mb-6"
          />

          <div
            ref={propertiesRef}
            className={cn(
              mobileTab === "properties" ? "block" : "hidden md:block",
            )}
          >
            <LandmarkProperties />
          </div>

          <div
            ref={detailsRef}
            className={cn(
              "mt-12 md:mt-16",
              mobileTab === "details" ? "block" : "hidden md:block",
            )}
          >
            <div className={pageLayout.twoColumn}>
              <div className={pageLayout.mainColumn}>
                <LandmarkDetailsPanel />
              </div>
              <div className={pageLayout.sidebarColumn}>
                <LandmarkContactCard sticky />
              </div>
            </div>
          </div>

          <div className="mt-12 md:hidden">
            <LandmarkContactCard />
          </div>

          <div className="mt-12 md:mt-16">
            <LandmarkFaq />
          </div>
        </div>
      </main>

      <SiteFooter />
      <LocalityMobileActions
        activeTab={mobileTab}
        onShowDetails={showDetails}
        onShowProperties={showProperties}
      />
    </div>
  );
}
