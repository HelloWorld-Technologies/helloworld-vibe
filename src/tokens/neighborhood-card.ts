export interface NeighborhoodPlaceOption {
  id: string;
  placeName: string;
  walkTime: string;
  imageSrc?: string;
  imageAlt?: string;
  latitude?: number;
  longitude?: number;
}

export interface NeighborhoodCardData {
  id: string;
  emoji: string;
  category: string;
  placeName: string;
  imageSrc: string;
  imageAlt?: string;
  walkTime: string;
  linkLabel: string;
  href?: string;
  /** True when this category has no API places yet. */
  comingSoon?: boolean;
  /** Short label for map modal category chips. */
  modalLabel?: string;
  options?: readonly NeighborhoodPlaceOption[];
}

/** Sample daily-routine cards from the neighborhood timeline (HSR Layout). */
export const neighborhoodRoutineSamples: readonly NeighborhoodCardData[] = [
  {
    id: "morning",
    emoji: "☀️",
    category: "Morning",
    placeName: "Blue Tokai Coffee",
    imageSrc: "/assets/community/hero/hero-1.png",
    walkTime: "3 min walk",
    linkLabel: "View Cafes Nearby",
    options: [
      {
        id: "morning-0",
        placeName: "Blue Tokai Coffee",
        walkTime: "3 min walk",
        imageSrc: "/assets/community/hero/hero-1.png",
      },
      {
        id: "morning-1",
        placeName: "Third Wave Coffee",
        walkTime: "5 min walk",
        imageSrc: "/assets/community/hero/hero-2.png",
      },
      {
        id: "morning-2",
        placeName: "Starbucks HSR",
        walkTime: "7 min walk",
        imageSrc: "/assets/community/hero/hero-3.png",
      },
    ],
  },
  {
    id: "workout",
    emoji: "💪",
    category: "Workout",
    placeName: "Cult.fit HSR",
    imageSrc: "/assets/community/sports/rectangle-2363-3.png",
    walkTime: "6 min walk",
    linkLabel: "View Gyms Nearby",
    options: [
      {
        id: "workout-0",
        placeName: "Cult.fit HSR",
        walkTime: "6 min walk",
        imageSrc: "/assets/community/sports/rectangle-2363-3.png",
      },
      {
        id: "workout-1",
        placeName: "Gold's Gym",
        walkTime: "8 min walk",
        imageSrc: "/assets/community/hero/hero-4.png",
      },
    ],
  },
  {
    id: "commute",
    emoji: "🚇",
    category: "Commute",
    placeName: "Silk Board Metro",
    imageSrc: "/assets/locality/transit-bento-desktop.png",
    walkTime: "5 min walk",
    linkLabel: "View Transit Nearby",
    href: "#",
  },
  {
    id: "work",
    emoji: "🧑‍💻",
    category: "Work",
    placeName: "Prestige Tech Park",
    imageSrc: "/assets/community/hero/hero-2.png",
    walkTime: "5 min walk",
    linkLabel: "View Offices Nearby",
    href: "#",
  },
  {
    id: "lunch",
    emoji: "🍔",
    category: "Lunch",
    placeName: "Social, HSR",
    imageSrc: "/assets/locality/dinning-bento-desktop.png",
    walkTime: "8 min walk",
    linkLabel: "View Dining Nearby",
    href: "#",
  },
] as const;

export const neighborhoodSectionTitle = "A Day from here";
export const neighborhoodSectionSubtitle =
  "See nearby utilities, facilities, transport, hospitals and more.";
