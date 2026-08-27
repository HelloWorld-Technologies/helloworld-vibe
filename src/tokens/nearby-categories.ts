import { srpCardComingSoonImage } from "@/src/tokens/srp-card";

export type NearbyCategoryDef = {
  id: string;
  /** API `nearBy` object keys that feed this card (first match wins). */
  apiKeys: readonly string[];
  emoji: string;
  category: string;
  linkLabel: string;
  /** Short label used in the map modal category strip. */
  modalLabel: string;
};

/**
 * Display order for HDP “A Day from here” cards (design flow).
 * Place photos come from the API only; missing photos use {@link nearbyComingSoonImage}.
 */
export const nearbyCategoryFlow = [
  {
    id: "workout",
    apiKeys: ["lifestyle_fitness", "gym", "fitness"],
    emoji: "💪",
    category: "Workout",
    linkLabel: "View Gyms Nearby",
    modalLabel: "Gyms",
  },
  {
    id: "commute",
    apiKeys: ["transport", "transit"],
    emoji: "🚇",
    category: "Commute",
    linkLabel: "View Transit Nearby",
    modalLabel: "Commute",
  },
  {
    id: "work",
    apiKeys: ["work_education", "work", "office", "education"],
    emoji: "🏢",
    category: "Work",
    linkLabel: "View Offices Nearby",
    modalLabel: "Work",
  },
  {
    id: "lunch",
    apiKeys: ["food_dining", "food", "dining", "restaurant"],
    emoji: "🍔",
    category: "Lunch",
    linkLabel: "View Dining Nearby",
    modalLabel: "Cafes & Restaurants",
  },
  {
    id: "shopping",
    apiKeys: ["daily_essentials", "store"],
    emoji: "🛒",
    category: "Shopping",
    linkLabel: "View Markets Nearby",
    modalLabel: "Shopping & supplies",
  },
  {
    id: "entertainment",
    apiKeys: ["entertainment_shopping", "entertainment"],
    emoji: "🍿",
    category: "Entertainment",
    linkLabel: "View Entertainment Nearby",
    modalLabel: "Entertainment",
  },
  {
    id: "night-life",
    apiKeys: ["night_life", "nightlife", "night-life"],
    emoji: "🌙",
    category: "Night Life",
    linkLabel: "View Nightlife Nearby",
    modalLabel: "Night Life",
  },
  {
    id: "healthcare",
    apiKeys: ["healthcare", "hospital", "health"],
    emoji: "🏥",
    category: "Healthcare",
    linkLabel: "View Healthcare Nearby",
    modalLabel: "Healthcare",
  },
] as const satisfies readonly NearbyCategoryDef[];

/** New coming-soon illustration for A Day from here when the API has no place photo. */
export const nearbyComingSoonImage = srpCardComingSoonImage;
