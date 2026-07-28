import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { HomepageAppDownload } from "@/components/marketing/homepage-app-download";
import { HomepageBenefits } from "@/components/marketing/homepage-benefits";
import { HomepageFeed } from "@/components/marketing/homepage-feed";
import { HomepageHero } from "@/components/marketing/homepage-hero";
import { HomepagePress } from "@/components/marketing/homepage-press";
import { HomepageProperties } from "@/components/marketing/homepage-properties";
import { HomepageTestimonials } from "@/components/marketing/homepage-testimonials";
import { HomepageWeekends } from "@/components/marketing/homepage-weekends";
import { fetchFeedMoments } from "@/src/apis/moments";
import { mapMomentsToGalleryItems } from "@/src/lib/hdp/map-gallery-media";
import type { PropertyMomentItem } from "@/src/models/property-media";

export default async function Home() {
  const feedResponse = await fetchFeedMoments({
    mediaType: "video",
    page: 1,
    pageSize: 20,
  });
  const feedMoments = mapMomentsToGalleryItems(
    (feedResponse.data ?? []) as PropertyMomentItem[],
  );

  return (
    <div className="bg-white">
      <SiteHeader variant="banner" />
      <HomepageHero />
      <HomepageBenefits />
      <main>
        <HomepageWeekends />
        <HomepageProperties />
        <HomepageTestimonials />
        <HomepagePress />
        <HomepageFeed moments={feedMoments} />
        <HomepageAppDownload />
      </main>
      <SiteFooter />
    </div>
  );
}
