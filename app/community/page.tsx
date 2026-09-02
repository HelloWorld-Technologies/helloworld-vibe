import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { CommunityEvents } from "@/components/marketing/community-events";
import { CommunityFeed } from "@/components/marketing/community-feed";
import { CommunityReviews } from "@/components/marketing/community-reviews";
import { CommunityHero } from "@/components/marketing/community-hero";
import { CommunityVideo } from "@/components/marketing/community-video";

export const metadata: Metadata = {
  title: "Community Events — HelloWorld",
  description:
    "Sports, mixers, parties, and workshops across HelloWorld coliving homes. See what's happening in our community.",
};

export default function CommunityPage() {
  return (
    <div className="bg-white">
      <SiteHeader variant="banner" />
      <main className="flex flex-col gap-12 pt-6 lg:gap-16 lg:pt-7">
        <CommunityHero />
        <CommunityVideo />
        <CommunityEvents />
        <CommunityReviews />
        <CommunityFeed />
      </main>
      <SiteFooter />
    </div>
  );
}
