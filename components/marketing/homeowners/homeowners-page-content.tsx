import { HomeownersFaq } from "@/components/marketing/homeowners/homeowners-faq";
import { HomeownersFeatures } from "@/components/marketing/homeowners/homeowners-features";
import { HomeownersHero } from "@/components/marketing/homeowners/homeowners-hero";
import { HomeownersLead } from "@/components/marketing/homeowners/homeowners-lead";
import { HomeownersPartners } from "@/components/marketing/homeowners/homeowners-partners";

export function HomeownersPageContent() {
  return (
    <>
      <HomeownersHero />
      <HomeownersFeatures />
      <HomeownersLead />
      <HomeownersPartners />
      <HomeownersFaq />
    </>
  );
}
