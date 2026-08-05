import {
  homepageFeaturedProperties,
  type HomepageFeaturedProperty,
} from "@/src/tokens/homepage";
import { srpCardSampleImages } from "@/src/tokens/srp-card";

export type HdpOccupancy = "private" | "double" | "triple" | "quadruple";

export type HdpRoomType = {
  id: string;
  name: string;
  rent: number;
  features: readonly string[];
  occupancy: HdpOccupancy;
};

export type HdpVibeMatch = {
  emoji: string;
  label: string;
  score: number;
};

export const hdpProperty = {
  name: "Helloworld Park Square",
  propertyId: 156,
  badge: "Women Only",
  locality: "Neeladri Road, Electronic City Phase 1, Bangalore",
  trendingLabel: "Trending",
  topChoiceCopy: "is the top choice in Electronic City.",
  rating: 4.8,
  visitsToday: 7,
  reviewCount: 127,
  googleRatingLabel: "4.8 on Google reviews",
  startingRent: 7999,
  securityDepositLabel: "1 months rent",
  minStayMonths: 3,
  trophySrc: "/assets/hdp/top-choice-trophy.png",
} as const;

export const hdpAbout =
  '"Amazing hospitality and super friendly staff. The rooms are spacious, well-maintained, and the common areas are perfect for both work and relaxation. Electronic City commute is easy from here."';

export const hdpAmenities = [
  "🧹 Housekeeping",
  "📶 Internet",
  "💧 Water",
  "🫙 Washing machine",
  "🚰 RO Drinking Water",
  "🛗 Lift",
  "🪑 Sofa",
  "🛋️ Soft furnishing",
  "📺 65\" LED TV",
  "🏓 Table tennis",
  "🥘 Microwave",
] as const;

export const hdpVibeOverallScore = 80;

export const hdpSelectedVibes: readonly HdpVibeMatch[] = [
  { emoji: "😎", label: "Chill", score: 87 },
  { emoji: "🌙", label: "Night Owl", score: 97 },
  { emoji: "🎮", label: "Gamers", score: 78 },
  { emoji: "🎵", label: "Music people", score: 82 },
];

export const hdpResidentInterests = [
  { emoji: "💻", label: "Coder" },
  { emoji: "🎮", label: "Gamer" },
  { emoji: "🎵", label: "Music" },
  { emoji: "🏋️", label: "Fitness Freak" },
  { emoji: "🏏", label: "Cricket" },
  { emoji: "⚽️", label: "Football" },
  { emoji: "🏸", label: "Badminton" },
  { emoji: "🏃", label: "Runner" },
  { emoji: "🎲", label: "Board Games" },
  { emoji: "📸", label: "Creator" },
  { emoji: "📚", label: "Bookworm" },
] as const;

export const hdpResidentWorkplaces = {
  preview: ["Google", "Microsoft", "Amazon", "Swiggy"] as const,
  extraCount: 31,
} as const;

export const hdpResidentColleges = {
  preview: ["IIT Bombay", "BITS Pilani", "NIT Trichy"] as const,
  extraCount: 31,
} as const;

export const hdpSectionNavItems = [
  { id: "about", label: "About" },
  { id: "amenities", label: "Amenities" },
  { id: "nearby", label: "Nearby Places" },
  { id: "moments", label: "Moments" },
  { id: "reviews", label: "Reviews" },
] as const;

export type HdpSectionId = (typeof hdpSectionNavItems)[number]["id"];

export const hdpOccupancies: { id: HdpOccupancy; label: string }[] = [
  { id: "private", label: "Private" },
  { id: "double", label: "Double" },
  { id: "triple", label: "Triple" },
  { id: "quadruple", label: "Quadruple" },
];

export const hdpRoomTypes: readonly HdpRoomType[] = [
  {
    id: "room-1",
    name: "Room Type 1",
    rent: 12500,
    features: ["Attached washroom", "Work desk", "Wardrobe"],
    occupancy: "private",
  },
  {
    id: "room-2",
    name: "Room Type 2",
    rent: 10999,
    features: ["Shared washroom", "Work desk", "Balcony access"],
    occupancy: "double",
  },
  {
    id: "room-3",
    name: "Room Type 3",
    rent: 9999,
    features: ["Shared washroom", "Compact layout", "AC ready"],
    occupancy: "triple",
  },
];

export const hdpSimilarProperties: HomepageFeaturedProperty[] =
  homepageFeaturedProperties.slice(0, 3);

export const hdpGalleryImages = srpCardSampleImages;
