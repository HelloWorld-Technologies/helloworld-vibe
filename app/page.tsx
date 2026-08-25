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

export default function Home() {
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
        <HomepageFeed />
        <HomepageAppDownload />
      </main>
      <SiteFooter />
    </div>
  );
}
