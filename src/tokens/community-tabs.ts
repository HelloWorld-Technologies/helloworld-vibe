import { communityImage, type CommunityImage } from "@/src/tokens/community";

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
  { description: string; images: readonly CommunityImage[] }
> = {
  "sports-outdoor": {
    description: "Cricket nights, morning runs, and outdoor games with your neighbors.",
    images: [
      communityImage("rectangle-2363-3"),
      communityImage("rectangle-2364-3"),
      communityImage("rectangle-2365-3"),
      communityImage("rectangle-2366-1-3"),
      communityImage("rectangle-2366-2-3"),
      communityImage("rectangle-2366-3-3"),
      communityImage("rectangle-2366-4-3"),
      communityImage("rectangle-2366-6"),
    ],
  },
  "social-mixers": {
    description: "Casual mixers to meet roommates, make friends, and unwind together.",
    images: [
      communityImage("rectangle-2363-2"),
      communityImage("rectangle-2364-2"),
      communityImage("rectangle-2365-2"),
      communityImage("rectangle-2366-1-2"),
      communityImage("rectangle-2366-2-2"),
      communityImage("rectangle-2366-3-2"),
      communityImage("rectangle-2366-4-2"),
      communityImage("rectangle-2366-5"),
    ],
  },
  "social-events": {
    description: "Parties, celebrations, and community events all year round.",
    images: [
      communityImage("rectangle-2363"),
      communityImage("rectangle-2364"),
      communityImage("rectangle-2365"),
      communityImage("rectangle-2366"),
      communityImage("rectangle-2366-1"),
      communityImage("rectangle-2366-2"),
      communityImage("rectangle-2366-3"),
      communityImage("rectangle-2366-4"),
    ],
  },
  workshops: {
    description: "Skill-building sessions from cooking to career growth.",
    images: [
      communityImage("rectangle-2363-4"),
      communityImage("rectangle-2364-4"),
      communityImage("rectangle-2365-4"),
      communityImage("rectangle-2366-1-4"),
      communityImage("rectangle-2366-2-4"),
      communityImage("rectangle-2366-3-4"),
      communityImage("rectangle-2366-4-4"),
      communityImage("rectangle-2366-7"),
    ],
  },
};
