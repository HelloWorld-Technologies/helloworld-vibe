export interface CommunityTabItem {
  id: string;
  label: string;
}

export const communityTabs = [
  { id: "sports-outdoor", label: "Sports & Outdoor" },
  { id: "social-mixers", label: "Social Mixers" },
  { id: "social-events", label: "Social Events & Parties" },
  { id: "workshops", label: "Workshops" },
] as const;

export type CommunityTabId = (typeof communityTabs)[number]["id"];

export const communityIntroCopy =
  "Sports, events, meetups, and everything that makes this community awesome.";

export const communityTabPanels: Record<
  CommunityTabId,
  { description: string; images: readonly string[] }
> = {
  "sports-outdoor": {
    description: "Cricket nights, morning runs, and outdoor games with your neighbors.",
    images: [
      "/assets/community/sports/rectangle-2363-3.webp",
      "/assets/community/sports/rectangle-2364-3.webp",
      "/assets/community/sports/rectangle-2365-3.webp",
      "/assets/community/sports/rectangle-2366-1-3.webp",
      "/assets/community/sports/rectangle-2366-2-3.webp",
      "/assets/community/sports/rectangle-2366-3-3.webp",
      "/assets/community/sports/rectangle-2366-4-3.webp",
      "/assets/community/sports/rectangle-2366-6.webp",
    ],
  },
  "social-mixers": {
    description: "Casual mixers to meet roommates, make friends, and unwind together.",
    images: [
      "/assets/community/social-mixers/rectangle-2363-2.webp",
      "/assets/community/social-mixers/rectangle-2364-2.webp",
      "/assets/community/social-mixers/rectangle-2365-2.webp",
      "/assets/community/social-mixers/rectangle-2366-1-2.webp",
      "/assets/community/social-mixers/rectangle-2366-2-2.webp",
      "/assets/community/social-mixers/rectangle-2366-3-2.webp",
      "/assets/community/social-mixers/rectangle-2366-4-2.webp",
      "/assets/community/social-mixers/rectangle-2366-5.webp",
    ],
  },
  "social-events": {
    description: "Parties, celebrations, and community events all year round.",
    images: [
      "/assets/community/social-events-parties/rectangle-2363.webp",
      "/assets/community/social-events-parties/rectangle-2364.webp",
      "/assets/community/social-events-parties/rectangle-2365.webp",
      "/assets/community/social-events-parties/rectangle-2366.webp",
      "/assets/community/social-events-parties/rectangle-2366-1.webp",
      "/assets/community/social-events-parties/rectangle-2366-2.webp",
      "/assets/community/social-events-parties/rectangle-2366-3.webp",
      "/assets/community/social-events-parties/rectangle-2366-4.webp",
    ],
  },
  workshops: {
    description: "Skill-building sessions from cooking to career growth.",
    images: [
      "/assets/community/workshops/rectangle-2363-4.webp",
      "/assets/community/workshops/rectangle-2364-4.webp",
      "/assets/community/workshops/rectangle-2365-4.webp",
      "/assets/community/workshops/rectangle-2366-1-4.webp",
      "/assets/community/workshops/rectangle-2366-2-4.webp",
      "/assets/community/workshops/rectangle-2366-3-4.webp",
      "/assets/community/workshops/rectangle-2366-4-4.webp",
      "/assets/community/workshops/rectangle-2366-7.webp",
    ],
  },
};
