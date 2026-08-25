import { formatRent } from "@/src/tokens/srp-card";

export interface LocalityCardData {
  id: string;
  name: string;
  startingRent: number;
  propertyCount: number;
  imageSrc: string;
}

export const localityCardSamples: readonly LocalityCardData[] = [
  {
    id: "electronic-city",
    name: "Electronic City",
    startingRent: 9000,
    propertyCount: 15,
    imageSrc: "/assets/community/hero/hero-1.webp",
  },
  {
    id: "hsr-layout",
    name: "HSR Layout",
    startingRent: 10500,
    propertyCount: 22,
    imageSrc: "/assets/community/hero/hero-2.webp",
  },
  {
    id: "indiranagar",
    name: "Indiranagar",
    startingRent: 12000,
    propertyCount: 18,
    imageSrc: "/assets/community/hero/hero-3.webp",
  },
  {
    id: "kudlu-gate",
    name: "Kudlu Gate",
    startingRent: 8500,
    propertyCount: 11,
    imageSrc: "/assets/community/hero/hero-4.webp",
  },
  {
    id: "kanakpura-road",
    name: "Kanakpura Road",
    startingRent: 9500,
    propertyCount: 9,
    imageSrc: "/assets/locality/transit-bento-desktop.png",
  },
] as const;

export function formatLocalityDetails(
  startingRent: number,
  propertyCount: number,
): string {
  if (propertyCount <= 0) return "View properties";
  const rent = formatRent(startingRent);
  const label = propertyCount === 1 ? "Property" : "Properties";
  return `Starting ${rent} | ${propertyCount} ${label}`;
}

export const localitySectionTitle = "Popular Bangalore Localities";
