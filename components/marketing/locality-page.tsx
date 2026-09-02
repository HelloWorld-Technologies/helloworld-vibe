"use client";

import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeaderSearch } from "@/components/layout/site-header-search";
import { LocalityContactCard } from "@/components/marketing/locality-contact-card";
import { LocalityDetailsPanel } from "@/components/marketing/locality-details-panel";
import { LocalityFaq } from "@/components/marketing/locality-faq";
import { LocalityHero } from "@/components/marketing/locality-hero";
import {
  LocalityMobileActions,
} from "@/components/marketing/locality-mobile-actions";
import {
  LocalityMobileTabs,
  type LocalityMobileTab,
} from "@/components/marketing/locality-mobile-tabs";
import { LocalityProperties } from "@/components/marketing/locality-properties";
import { localityPage } from "@/src/tokens/locality";
import { cn } from "@/src/lib/cn";
import { pageLayout } from "@/src/tokens/layout";

export function LocalityPageContent() {
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
        <LocalityHero />

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
            <LocalityProperties />
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
                <LocalityDetailsPanel />
              </div>
              <div className={pageLayout.sidebarColumn}>
                <LocalityContactCard
                  sticky
                  city={localityPage.city}
                  location={localityPage.name}
                />
              </div>
            </div>
          </div>

          <div className="mt-12 md:hidden">
            <LocalityContactCard
              city={localityPage.city}
              location={localityPage.name}
            />
          </div>

          <div className="mt-12 md:mt-16">
            <LocalityFaq />
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
