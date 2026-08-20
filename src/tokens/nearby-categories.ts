import { srpCardComingSoonImage } from "@/src/tokens/srp-card";

export type NearbyCategoryDef = {
  id: string;
  /** API `nearBy` object keys that feed this card (first match wins). */
  apiKeys: readonly string[];
  emoji: string;
  category: string;
  linkLabel: string;
  imageSrc: string;
  /** Short label used in the map modal category strip. */
  modalLabel: string;
};

/**
 * Display order for HDP “A Day from here” cards (design flow).
 * Categories without API data still render with a coming-soon image.
 */
export const nearbyCategoryFlow = [
  {
    id: "workout",
    apiKeys: ["lifestyle_fitness", "gym", "fitness"],
    emoji: "💪",
    category: "Workout",
    linkLabel: "View Gyms Nearby",
    imageSrc: "/assets/community/sports/rectangle-2363-3.png",
    modalLabel: "Gyms",
  },
  {
    id: "commute",
    apiKeys: ["transport", "transit"],
    emoji: "🚇",
    category: "Commute",
    linkLabel: "View Transit Nearby",
    imageSrc: "/assets/locality/transit-bento-desktop.png",
    modalLabel: "Commute",
  },
  {
    id: "work",
    apiKeys: ["work_education", "work", "office", "education"],
    emoji: "🏢",
    category: "Work",
    linkLabel: "View Offices Nearby",
    imageSrc: "/assets/community/hero/hero-2.png",
    modalLabel: "Work",
  },
  {
    id: "lunch",
    apiKeys: ["food_dining", "food", "dining", "restaurant"],
    emoji: "🍔",
    category: "Lunch",
    linkLabel: "View Dining Nearby",
    imageSrc: "/assets/locality/dinning-bento-desktop.png",
    modalLabel: "Cafes & Restaurants",
  },
  {
    id: "shopping",
    apiKeys: ["daily_essentials", "store"],
    emoji: "🛒",
    category: "Shopping",
    linkLabel: "View Markets Nearby",
    imageSrc: "/assets/community/hero/hero-3.png",
    modalLabel: "Shopping & supplies",
  },
  {
    id: "entertainment",
    apiKeys: ["entertainment_shopping", "entertainment"],
    emoji: "🍿",
    category: "Entertainment",
    linkLabel: "View Entertainment Nearby",
    imageSrc: "/assets/community/hero/hero-4.png",
    modalLabel: "Entertainment",
  },
  {
    id: "night-life",
    apiKeys: ["night_life", "nightlife", "night-life"],
    emoji: "🌙",
    category: "Night Life",
    linkLabel: "View Nightlife Nearby",
    imageSrc: "/assets/locality/nightlife-bento-desktop.png",
    modalLabel: "Night Life",
  },
  {
    id: "healthcare",
    apiKeys: ["healthcare", "hospital", "health"],
    emoji: "🏥",
    category: "Healthcare",
    linkLabel: "View Healthcare Nearby",
    imageSrc: "/assets/locality/health-bento-desktop.png",
    modalLabel: "Healthcare",
  },
] as const satisfies readonly NearbyCategoryDef[];

export const nearbyComingSoonImage = srpCardComingSoonImage;
