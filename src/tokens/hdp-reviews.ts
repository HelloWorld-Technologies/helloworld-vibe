export type HdpReviewCategory = {
  label: string;
  score: number;
};

export type HdpResidentReview = {
  id: string;
  name: string;
  rating: number;
  quote: string;
  avatarSrc: string;
};

export const hdpReviewSummary = {
  rating: 4.8,
  label: "Exceptional",
  reviewCount: 127,
  recommendPercent: 95,
  categories: [
    { label: "Cleanliness", score: 4.8 },
    { label: "Location", score: 4.7 },
    { label: "Amenities", score: 4.8 },
    { label: "Community", score: 4.6 },
  ] satisfies HdpReviewCategory[],
};

export const hdpResidentReviews: readonly HdpResidentReview[] = [
  {
    id: "review-1",
    name: "Jim Halpert",
    rating: 5,
    quote:
      "Lorem ipsum dolor sit amet consectetur. Turpis vitae in ullamcorper tortor quis non. Porttitor leo eget semper adipiscing nam molestie. Enim et turpis nulla feugiat lorem. Tempor iaculis et nunc elementum neque dis lobortis.",
    avatarSrc: "/assets/community/feed/feed-1.webp",
  },
  {
    id: "review-2",
    name: "Pam Beesly",
    rating: 5,
    quote:
      "The community events and common areas made settling in effortless. Staff were responsive, rooms were spotless, and the location worked perfectly for my commute to Electronic City.",
    avatarSrc: "/assets/community/feed/feed-2.webp",
  },
  {
    id: "review-3",
    name: "Dwight Schrute",
    rating: 5,
    quote:
      "Clean rooms, reliable Wi‑Fi, and a well-managed property. The vibe match felt accurate and I met people with similar routines within the first week.",
    avatarSrc: "/assets/community/feed/feed-3.webp",
  },
  {
    id: "review-4",
    name: "Angela Martin",
    rating: 5,
    quote:
      "Housekeeping and security were consistently good. Booking a visit was simple, and the room options were clearly explained before I moved in.",
    avatarSrc: "/assets/community/feed/feed-4.png",
  },
];
