import { AboutAurum } from "@/components/marketing/about/about-aurum";
import { AboutHeadlines } from "@/components/marketing/about/about-headlines";
import { AboutHero } from "@/components/marketing/about/about-hero";
import { AboutMission } from "@/components/marketing/about/about-mission";
import { AboutPrinciples } from "@/components/marketing/about/about-principles";
import {
  AboutCoreTeam,
  AboutLeadership,
} from "@/components/marketing/about/about-team";

export function AboutPageContent() {
  return (
    <>
      <AboutHero />
      <AboutMission />
      <AboutAurum />
      <AboutLeadership />
      <AboutCoreTeam />
      <AboutHeadlines />
      <AboutPrinciples />
    </>
  );
}
